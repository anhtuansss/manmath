'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../../config/api';
import type { ExamAttemptSummaryDto } from './types';

type ExamAttemptsClientProps = {
  examId: string;
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

export function ExamAttemptsClient({ examId }: ExamAttemptsClientProps) {
  const [attempts, setAttempts] = useState<ExamAttemptSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttempts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/exams/${examId}/attempts`);

      if (!response.ok) {
        throw new Error('Không tải được lịch sử làm bài');
      }

      const data: ExamAttemptSummaryDto[] = await response.json();
      setAttempts(data);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Lỗi không xác định khi tải lịch sử làm bài',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAttempts();
  }, [examId]);

  const latestAttempt = attempts[0] ?? null;

  const bestAttempt = attempts.reduce<ExamAttemptSummaryDto | null>(
    (best, attempt) => {
      if (!best) return attempt;

      if (attempt.score > best.score) {
        return attempt;
      }

      if (
        attempt.score === best.score &&
        new Date(attempt.submittedAt).getTime() >
          new Date(best.submittedAt).getTime()
      ) {
        return attempt;
      }

      return best;
    },
    null,
  );

  const averageScore =
    attempts.length > 0
      ? attempts.reduce((total, attempt) => total + attempt.score, 0) /
        attempts.length
      : 0;

  return (
    <main className="min-h-[100dvh] bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-sm font-bold">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white shadow-sm ring-1 ring-primary/20">
                M
              </span>
              ManMath
            </Link>

            <p className="mt-8 text-sm font-bold text-primary">
              Lịch sử làm bài
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Các lần làm đề
            </h1>
            <p className="mt-2 text-base text-slate-600">Mã đề: {examId}</p>
          </div>

          <Link
            href={`/exam/${examId}`}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Quay lại đề
          </Link>
        </header>

        {loading && (
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Đang tải lịch sử làm bài...</p>
          </section>
        )}

        {error && (
          <section className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-bold text-red-700">Không tải được dữ liệu</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
            <button
              type="button"
              onClick={fetchAttempts}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Thử lại
            </button>
          </section>
        )}

        {!loading && !error && attempts.length === 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Chưa có lần làm bài nào</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Sau khi bạn nộp bài, lịch sử làm bài của đề này sẽ xuất hiện ở đây.
            </p>
          </section>
        )}
        


        {!loading && !error && attempts.length > 0 && (
          <>
              <section className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Lần làm gần nhất
                </p>
                <p className="mt-3 text-3xl font-bold text-slate-900">
                  {latestAttempt?.score}/10
                </p>
                <p className="mt-1.5 text-sm font-medium text-slate-500">
                  {latestAttempt ? formatSubmittedAt(latestAttempt.submittedAt) : 'Chưa có dữ liệu'}
                </p>
                {latestAttempt && (
                  <Link
                    href={`/attempts/${latestAttempt.id}`}
                    className="mt-5 inline-flex text-sm font-bold text-primary transition-colors hover:text-primary-hover"
                  >
                    Xem chi tiết →
                  </Link>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Điểm cao nhất
                </p>
                <p className="mt-3 text-3xl font-bold text-emerald-600">
                  {bestAttempt?.score}/10
                </p>
                <p className="mt-1.5 text-sm font-medium text-slate-500">
                  {bestAttempt
                    ? `${bestAttempt.correctCount}/${bestAttempt.totalQuestions} câu đúng`
                    : 'Chưa có dữ liệu'}
                </p>
                {bestAttempt && (
                  <Link
                    href={`/attempts/${bestAttempt.id}`}
                    className="mt-5 inline-flex text-sm font-bold text-primary transition-colors hover:text-primary-hover"
                  >
                    Xem bài tốt nhất →
                  </Link>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Số lần làm
                </p>
                <p className="mt-3 text-3xl font-bold text-slate-900">
                  {attempts.length}
                </p>
                <p className="mt-1.5 text-sm font-medium text-slate-500">
                  Điểm trung bình {averageScore.toFixed(1)}/10
                </p>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-bold text-slate-900">Danh sách lần làm</h2>
              </div>

              <div className="divide-y divide-slate-100">
                {attempts.map((attempt, index) => {
                  const accuracy = Math.round(
                    (attempt.correctCount / attempt.totalQuestions) * 100,
                  );

                  return (
                    <article
                      key={attempt.id}
                      className="grid gap-6 px-6 py-6 md:grid-cols-[1fr_auto] md:items-center"
                    >
                      <div>
                        <p className="text-base font-bold text-slate-900">
                          Lần làm #{attempts.length - index}
                        </p>
                        <p className="mt-1.5 text-sm font-medium text-slate-500">
                          {formatSubmittedAt(attempt.submittedAt)}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold tracking-wider">
                          <span className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 uppercase text-slate-600">
                            Thời gian: {formatDurationSeconds(attempt.durationSeconds)}
                          </span>
                          <span className="inline-flex rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 uppercase text-blue-700">
                            {attempt.score}/10 điểm
                          </span>
                          <span className="inline-flex rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 uppercase text-emerald-700">
                            {attempt.correctCount}/{attempt.totalQuestions} câu đúng
                          </span>
                          <span className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 uppercase text-slate-600">
                            {accuracy}% chính xác
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/attempts/${attempt.id}`}
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        Xem chi tiết
                      </Link>
                    </article>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
