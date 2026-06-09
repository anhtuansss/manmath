'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../../config/api';
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
      <main className="min-h-[100dvh] bg-[#F8FAFC] px-4 py-6 text-[#0F172A]">
        <div className="mx-auto max-w-5xl rounded-xl border border-[#E2E8F0] bg-white p-6">
          <p className="text-sm text-[#64748B]">Đang tải chi tiết lần làm bài...</p>
        </div>
      </main>
    );
  }

  if (error || !attemptDetail) {
    return (
      <main className="min-h-[100dvh] bg-[#F8FAFC] px-4 py-6 text-[#0F172A]">
        <div className="mx-auto max-w-5xl rounded-xl border border-red-200 bg-white p-6">
          <h1 className="text-xl font-semibold text-red-700">
            Không xem được lần làm bài
          </h1>
          <p className="mt-2 text-sm text-[#64748B]">{error}</p>
          <Link
            href="/"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-[#3882F6] px-4 text-sm font-semibold text-white"
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
    <main className="min-h-[100dvh] bg-[#F8FAFC] px-4 py-6 text-[#0F172A] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-[#E2E8F0] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-sm font-semibold">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3882F6] text-base font-bold text-white">
                M
              </span>
              ManMath
            </Link>

            <p className="mt-6 text-sm font-semibold text-[#3882F6]">
              Chi tiết lần làm bài
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {exam.title}
            </h1>
            <p className="mt-2 text-sm text-[#64748B]">
              Thời gian làm bài: {durationLabel}
            </p>
            <p className="mt-2 text-sm text-[#64748B]">
              Nộp lúc {formatSubmittedAt(attempt.submittedAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/exam/${exam.id}/attempts`}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-semibold hover:bg-[#F8FAFC]"
            >
              Về lịch sử đề
            </Link>
            <Link
              href={`/exam/${exam.id}`}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[#3882F6] px-4 text-sm font-semibold text-white hover:bg-blue-600"
            >
              Làm lại đề
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
            <p className="text-xs font-semibold text-[#64748B]">Thời gian</p>
            <p className="mt-2 text-2xl font-semibold text-[#0F172A]">
              {durationLabel}
            </p>
          </div>
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
            <p className="text-xs font-semibold text-[#64748B]">Điểm</p>
            <p className="mt-2 text-3xl font-semibold text-[#3882F6]">
              {attempt.score}/10
            </p>
          </div>
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
            <p className="text-xs font-semibold text-[#64748B]">Đúng</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-600">
              {attempt.correctCount}/{attempt.totalQuestions}
            </p>
          </div>
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
            <p className="text-xs font-semibold text-[#64748B]">Sai</p>
            <p className="mt-2 text-3xl font-semibold text-red-600">
              {incorrectCount}
            </p>
          </div>
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
            <p className="text-xs font-semibold text-[#64748B]">Tỷ lệ đúng</p>
            <p className="mt-2 text-3xl font-semibold text-[#0F172A]">
              {accuracy}%
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-xl font-semibold">Review đáp án</h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Xem lại đáp án đã chọn và đáp án đúng của từng câu.
            </p>
          </div>

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
                className="rounded-xl border border-[#E2E8F0] bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Câu {index + 1}</p>
                  <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
                    {statusLabel}
                  </span>
                </div>

                <p className="mt-4 text-base leading-7">{answer.question}</p>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <p className="text-xs font-semibold text-[#64748B]">
                      Đáp án của bạn
                    </p>
                    <p className="mt-2 text-sm font-medium">{selectedAnswer}</p>
                  </div>

                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-xs font-semibold text-emerald-700">
                      Đáp án đúng
                    </p>
                    <p className="mt-2 text-sm font-medium">{correctAnswer}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
