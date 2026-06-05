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
import { ExamHeader } from './ExamHeader';
import { ExamSidebar } from './ExamSidebar';
import { QuestionList } from './QuestionList';
import { useRouter } from 'next/navigation';
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
      const payload: SubmitExamRequestDto = { examId: exam.id, answers };
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-950">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Đang tải đề thi...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-950">
        <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-slate-950">
            Không thể mở đề thi
          </h1>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Quay về danh sách đề
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <ExamHeader
        examTitle={exam?.examTitle}
        questionCount={exam?.questions.length ?? 0}
        remainingSeconds={remainingSeconds}
        isTimeUp={isTimeUp}
        onSubmit={handleSubmit}
      />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col-reverse gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_280px]">
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
