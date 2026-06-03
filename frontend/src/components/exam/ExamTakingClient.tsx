'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExamHeader } from './ExamHeader';
import { ExamSidebar } from './ExamSidebar';
import { QuestionList } from './QuestionList';
import type {
  Answers,
  ExamResponse,
  SubmitRequest,
  SubmitResult,
} from './types';

type ExamTakingClientProps = {
  examId: string;
};

const API_BASE_URL = 'http://localhost:5000';

export function ExamTakingClient({ examId }: ExamTakingClientProps) {
  const [answers, setAnswers] = useState<Answers>({});
  const [exam, setExam] = useState<ExamResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const isTimeUp = remainingSeconds === 0;
  const answerStorageKey = `exam-answers-${examId}`;

  useEffect(() => {
    const savedData = localStorage.getItem(answerStorageKey);

    if (savedData) {
      setAnswers(JSON.parse(savedData));
      return;
    }

    setAnswers({});
  }, [answerStorageKey]);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        setError(null);
        setExam(null);
        setSubmitResult(null);
        setRemainingSeconds(0);
        setCurrentQuestionId(null);

        const response = await fetch(`${API_BASE_URL}/api/exams/${examId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Không tìm thấy đề thi');
          }

          throw new Error('Không tải được đề thi');
        }

        const data: ExamResponse = await response.json();
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
    localStorage.setItem(answerStorageKey, JSON.stringify(newAnswers));
  };

  const handleSubmit = async () => {
    if (!exam) return;

    try {
      const payload: SubmitRequest = { examId: exam.id, answers };
      const response = await fetch(`${API_BASE_URL}/api/exam/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit exam');
      }

      const result: SubmitResult = await response.json();
      setSubmitResult(result);
      console.log('Submit result:', result);
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
            submitResult={submitResult}
            onQuestionClick={handleQuestionNavigate}
            currentQuestionId={currentQuestionId}
          />
        </div>
      </main>
    </div>
  );
}
