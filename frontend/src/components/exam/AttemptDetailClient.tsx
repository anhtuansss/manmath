'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../../config/api';
import { MathText } from './MathText';
import type { ExamAttemptDetailDto } from './types';

type AttemptDetailClientProps = {
  attemptId: string;
};

const formatSubmittedAt = (submittedAt: string) => {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(submittedAt));
};

const formatDurationSeconds = (durationSeconds: number | null) => {
  if (durationSeconds === null) {
    return 'Chưa ghi nhận';
  }

  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = durationSeconds % 60;

  if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  }

  if (minutes > 0) {
    return `${minutes} phút ${seconds} giây`;
  }

  return `${seconds} giây`;
};

export function AttemptDetailClient({ attemptId }: AttemptDetailClientProps) {
  const [attemptDetail, setAttemptDetail] = useState<ExamAttemptDetailDto | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttemptDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/attempts/${attemptId}`);

      if (response.status === 404) {
        throw new Error('Không tìm thấy lần làm bài');
      }

      if (!response.ok) {
        throw new Error('Không tải được chi tiết lần làm bài');
      }

      const data: ExamAttemptDetailDto = await response.json();
      setAttemptDetail(data);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Lỗi không xác định khi tải chi tiết lần làm bài',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAttemptDetail();
  }, [attemptId]);

  if (loading) {
    return (
      <main className="min-h-[100dvh] bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Đang tải chi tiết lần làm bài...</p>
        </div>
      </main>
    );
  }

  if (error || !attemptDetail) {
    return (
      <main className="min-h-[100dvh] bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold text-red-700">
            Không xem được lần làm bài
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
          <Link
            href="/"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Về danh sách đề
          </Link>
        </div>
      </main>
    );
  }

  const { attempt, exam, answers } = attemptDetail;
  const accuracy = Math.round((attempt.correctCount / attempt.totalQuestions) * 100);
  const incorrectCount =
    attempt.totalQuestions - attempt.correctCount - attempt.unansweredCount;
  const durationLabel = formatDurationSeconds(attempt.durationSeconds);

  return (
    <main className="min-h-[100dvh] bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-sm font-bold">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white shadow-sm ring-1 ring-primary/20">
                M
              </span>
              ManMath
            </Link>

            <p className="mt-8 text-sm font-bold text-primary">
              Chi tiết lần làm bài
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {exam.title}
            </h1>
            <p className="mt-2 text-base text-slate-600">
              Thời gian làm bài: {durationLabel}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Nộp lúc {formatSubmittedAt(attempt.submittedAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/exam/${exam.id}/attempts`}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Về lịch sử đề
            </Link>
            <Link
              href={`/exam/${exam.id}`}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Làm lại đề
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Thời gian</p>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {durationLabel}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Điểm</p>
            <p className="mt-3 text-3xl font-bold text-primary">
              {attempt.score}/10
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Đúng</p>
            <p className="mt-3 text-3xl font-bold text-emerald-600">
              {attempt.correctCount}/{attempt.totalQuestions}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Sai</p>
            <p className="mt-3 text-3xl font-bold text-red-600">
              {incorrectCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Tỷ lệ đúng</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {accuracy}%
            </p>
          </div>
        </section>

        <section className="space-y-6 pt-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-slate-900">Review đáp án</h2>
            <p className="text-base text-slate-600">
              Xem lại đáp án đã chọn và đáp án đúng của từng câu.
            </p>
          </div>

          <div className="space-y-4">
            {answers.map((answer, index) => {
              const selectedAnswer =
                answer.selectedOptionIndex === null
                  ? 'Chưa chọn đáp án'
                  : answer.options[answer.selectedOptionIndex];

              const correctAnswer = answer.options[answer.correctOptionIndex];

              const statusClass =
                answer.selectedOptionIndex === null
                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                  : answer.isCorrect
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-red-200 bg-red-50 text-red-700';

              const statusLabel =
                answer.selectedOptionIndex === null
                  ? 'Chưa làm'
                  : answer.isCorrect
                    ? 'Đúng'
                    : 'Sai';

              return (
                <article
                  key={answer.questionId}
                  className={`rounded-2xl border border-slate-200 border-l-4 bg-white p-6 shadow-sm ${
                    answer.selectedOptionIndex === null
                      ? 'border-l-amber-400'
                      : answer.isCorrect
                        ? 'border-l-emerald-400'
                        : 'border-l-red-400'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-bold text-slate-900">Câu {index + 1}</p>
                    <span className={`inline-flex rounded-md border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </div>

                  <MathText
                    as="p"
                    text={answer.question}
                    className="mt-5 max-w-none text-base leading-relaxed text-slate-900"
                  />

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className={`rounded-xl border p-5 ${
                      answer.selectedOptionIndex === null
                        ? 'border-amber-200 bg-amber-50'
                        : answer.isCorrect
                          ? 'border-emerald-200 bg-emerald-50'
                          : 'border-red-200 bg-red-50'
                    }`}>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Đáp án của bạn
                      </p>
                      <MathText
                        as="p"
                        text={selectedAnswer}
                        className="mt-3 text-base leading-relaxed text-slate-900"
                      />
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Đáp án đúng
                      </p>
                      <MathText
                        as="p"
                        text={correctAnswer}
                        className="mt-3 text-base leading-relaxed text-slate-900"
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
