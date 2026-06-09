'use client';

/**
 * Mục đích:
 * Component chạy phía trình duyệt chính của màn làm bài. Quản lý tải chi tiết đề,
 * đồng hồ, đáp án người dùng, lưu nháp, điều hướng câu hỏi trong thanh bên và nộp bài.
 *
 * Luồng dữ liệu:
 * GET /api/exams/:id -> hiển thị câu hỏi.
 * localStorage -> khôi phục/lưu nháp đáp án theo từng đề.
 * POST /api/exam/submit -> sessionStorage -> chuyển sang /exam/[id]/result.
 *
 * File liên quan:
 * frontend/src/components/exam/ExamHeader.tsx
 * frontend/src/components/exam/QuestionList.tsx
 * frontend/src/components/exam/ExamSidebar.tsx
 * frontend/src/lib/storage.ts
 * backend/server.ts
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExamHeader } from './ExamHeader';
import { ExamSidebar } from './ExamSidebar';
import { QuestionList } from './QuestionList';
import { API_BASE_URL } from '../../config/api';
import {
  getExamAnswersKey,
  getExamResultKey,
  readAnswersStorage,
  writeJsonStorage,
} from '../../lib/storage';

import type {
  Answers,
  ExamDetailDto,
  ExamResultSession,
  SubmitExamRequestDto,
  SubmitExamResultDto,
} from './types';

type ExamTakingClientProps = {
  examId: string;
};

export function ExamTakingClient({ examId }: ExamTakingClientProps) {
  const [answers, setAnswers] = useState<Answers>({});
  const [exam, setExam] = useState<ExamDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const isTimeUp = remainingSeconds === 0;
  const router = useRouter();

  // Khôi phục đáp án đã lưu nháp để người dùng có thể làm tiếp sau khi reload.
  useEffect(() => {
    const savedAnswers = readAnswersStorage(localStorage, examId);
    setAnswers(savedAnswers ?? {});
  }, [examId]);

  /**
   * Tải chi tiết đề từ backend và reset state của màn làm bài theo examId hiện tại.
   */
  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        setError(null);
        setExam(null);
        setRemainingSeconds(0);
        setCurrentQuestionId(null);

        const response = await fetch(`${API_BASE_URL}/api/exams/${examId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Không tìm thấy đề thi');
          }

          throw new Error('Không tải được đề thi');
        }

        const data: ExamDetailDto = await response.json();
        setExam(data);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Lỗi không xác định khi tải đề thi',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  useEffect(() => {
    if (!exam) return;

    setRemainingSeconds(exam.durationMinutes * 60);
  }, [exam]);

  // Đồng hồ chạy ở client; khi về 0, các nút đáp án sẽ bị khóa.
  useEffect(() => {
    if (!exam) return;

    const timerId = window.setInterval(() => {
      setRemainingSeconds((previousSeconds) => {
        if (previousSeconds <= 1) {
          window.clearInterval(timerId);
          return 0;
        }

        return previousSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [exam]);

  /**
   * Đồng bộ currentQuestionId với vị trí cuộn để thanh bên làm nổi bật
   * câu hỏi đang nằm gần sticky header.
   */
  useEffect(() => {
    if (!exam?.questions.length) return;

    const syncCurrentQuestion = () => {
      const stickyHeaderOffset = 120;
      let nextQuestionId = exam.questions[0].id;

      for (const question of exam.questions) {
        const element = document.getElementById(`question-${question.id}`);

        if (!element) continue;

        const rect = element.getBoundingClientRect();

        if (rect.top <= stickyHeaderOffset) {
          nextQuestionId = question.id;
          continue;
        }

        break;
      }

      setCurrentQuestionId(nextQuestionId);
    };

    let frameId = 0;

    const onScroll = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(syncCurrentQuestion);
    };

    syncCurrentQuestion();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [exam]);

  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    const newAnswers = {
      ...answers,
      [questionId]: optionIndex,
    };

    setAnswers(newAnswers);
    // Lưu ngay mỗi lần chọn đáp án để reload không làm mất tiến độ.
    writeJsonStorage(localStorage, getExamAnswersKey(examId), newAnswers);
  };

  /**
   * Nộp đáp án lên backend, lưu kết quả tạm vào sessionStorage,
   * rồi chuyển người dùng sang trang kết quả riêng.
   */
  const handleSubmit = async () => {
    if (!exam) return;

    try {
      const totalDurationSeconds = exam.durationMinutes * 60;
      const durationSeconds = Math.max(totalDurationSeconds - remainingSeconds, 0);

      const payload: SubmitExamRequestDto = {
        examId: exam.id,
        answers,
        durationSeconds,
      };
      const response = await fetch(`${API_BASE_URL}/api/exam/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit exam');
      }

      const result: SubmitExamResultDto = await response.json();

      const resultSession: ExamResultSession = {
        examId: exam.id,
        examTitle: exam.examTitle,
        submittedAt: new Date().toISOString(),
        answers,
        submitResult: result,
        exam,
      };

      writeJsonStorage(sessionStorage, getExamResultKey(examId), resultSession);
      router.push(`/exam/${examId}/result`);
    } catch (submitError) {
      console.error('Submit error:', submitError);
    }
  };

  const handleQuestionNavigate = (questionId: number) => {
    setCurrentQuestionId(questionId);
    document
      .getElementById(`question-${questionId}`)
      ?.scrollIntoView({ behavior: 'auto', block: 'start' });
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-slate-50 text-slate-900">
        <div className="border-b border-slate-200 bg-white shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />
              <div>
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-3 w-40 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
            <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-200" />
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-8">
              <div className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm lg:hidden" />
              <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
              <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
            </div>
            <div className="hidden h-[500px] animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm lg:block" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-slate-50 px-4 text-slate-900">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl font-bold text-red-600">
            !
          </div>
          <h1 className="mt-6 text-xl font-bold text-slate-900">
            Không thể mở đề thi
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">{error}</p>
          <Link
            href="/"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Quay về danh sách đề
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-50 text-slate-900">
      <ExamHeader
        examTitle={exam?.examTitle}
        questionCount={exam?.questions.length ?? 0}
        remainingSeconds={remainingSeconds}
        isTimeUp={isTimeUp}
        onSubmit={handleSubmit}
      />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <QuestionList
            questions={exam?.questions}
            answers={answers}
            isTimeUp={isTimeUp}
            onSelectAnswer={handleSelectAnswer}
          />
          <ExamSidebar
            questions={exam?.questions}
            answers={answers}
            isTimeUp={isTimeUp}
            onQuestionClick={handleQuestionNavigate}
            currentQuestionId={currentQuestionId}
          />
        </div>
      </main>
    </div>
  );
}
