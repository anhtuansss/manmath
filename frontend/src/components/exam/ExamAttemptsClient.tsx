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

  return (
    <main className="min-h-[100dvh] bg-[#F8FAFC] px-4 py-6 text-[#0F172A] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-[#E2E8F0] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-sm font-semibold">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3882F6] text-base font-bold text-white">
                M
              </span>
              ManMath
            </Link>

            <p className="mt-6 text-sm font-semibold text-[#3882F6]">
              Lịch sử làm bài
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Các lần làm đề
            </h1>
            <p className="mt-2 text-sm text-[#64748B]">Mã đề: {examId}</p>
          </div>

          <Link
            href={`/exam/${examId}`}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-semibold hover:bg-[#F8FAFC]"
          >
            Quay lại đề
          </Link>
        </header>

        {loading && (
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-6">
            <p className="text-sm text-[#64748B]">Đang tải lịch sử làm bài...</p>
          </section>
        )}

        {error && (
          <section className="rounded-xl border border-red-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-red-700">Không tải được dữ liệu</h2>
            <p className="mt-2 text-sm text-[#64748B]">{error}</p>
            <button
              type="button"
              onClick={fetchAttempts}
              className="mt-4 rounded-lg bg-[#3882F6] px-4 py-2 text-sm font-semibold text-white"
            >
              Thử lại
            </button>
          </section>
        )}

        {!loading && !error && attempts.length === 0 && (
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-6">
            <h2 className="text-lg font-semibold">Chưa có lần làm bài nào</h2>
            <p className="mt-2 text-sm text-[#64748B]">
              Sau khi bạn nộp bài, lịch sử làm bài của đề này sẽ xuất hiện ở đây.
            </p>
          </section>
        )}

        {!loading && !error && attempts.length > 0 && (
          <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
            <div className="border-b border-[#E2E8F0] px-4 py-4">
              <h2 className="text-lg font-semibold">Danh sách lần làm</h2>
            </div>

            <div className="divide-y divide-[#E2E8F0]">
              {attempts.map((attempt, index) => {
                const accuracy = Math.round(
                  (attempt.correctCount / attempt.totalQuestions) * 100,
                );

                return (
                  <article
                    key={attempt.id}
                    className="grid gap-4 px-4 py-4 md:grid-cols-[1fr_auto] md:items-center"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        Lần làm #{attempts.length - index}
                      </p>
                      <p className="mt-1 text-sm text-[#64748B]">
                        {formatSubmittedAt(attempt.submittedAt)}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                        <span className="rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1 text-[#64748B]">
                          Thời gian: {formatDurationSeconds(attempt.durationSeconds)}
                        </span>
                        <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-blue-700">
                          {attempt.score}/10 điểm
                        </span>
                        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">
                          {attempt.correctCount}/{attempt.totalQuestions} câu đúng
                        </span>
                        <span className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-[#64748B]">
                          {accuracy}% chính xác
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/attempts/${attempt.id}`}
                      className="inline-flex h-10 items-center justify-center rounded-lg bg-[#3882F6] px-4 text-sm font-semibold text-white hover:bg-blue-600"
                    >
                      Xem chi tiết
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
