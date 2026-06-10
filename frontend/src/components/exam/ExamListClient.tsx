'use client';

/**
 * Mục đích:
 * Component chạy phía trình duyệt cho trang danh sách đề. Chịu trách nhiệm
 * tải danh sách, xử lý trạng thái tải/lỗi/rỗng và đưa dữ liệu cho ExamList hiển thị.
 *
 * Luồng dữ liệu:
 * GET /api/exams -> ExamSummaryDto[] -> thêm href cho UI -> ExamListItem[].
 *
 * File liên quan:
 * frontend/src/components/exam/ExamList.tsx
 * frontend/src/components/exam/types.ts
 * backend/server.ts
 */
import { useEffect, useState } from 'react';
import { ExamList } from './ExamList';
import type { ExamListApiItem, ExamListItem } from './types';
import { API_BASE_URL } from '../../config/api';
import { getUserStats, type UserStats } from '../../lib/userStats';

const toExamListItem = (exam: ExamListApiItem): ExamListItem => ({
  ...exam,
  href: `/exam/${exam.id}`,
});

function ExamListSkeleton() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ── Hero Skeleton ── */}
        <header className="pb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-primary-light" />
                <div>
                  <div className="h-4 w-24 animate-pulse rounded-md bg-slate-200" />
                  <div className="mt-2 h-3 w-32 animate-pulse rounded-md bg-slate-100" />
                </div>
              </div>
              {/* Breadcrumb + Heading */}
              <div className="mt-7 h-4 w-36 animate-pulse rounded-md bg-primary-light" />
              <div className="mt-3 h-10 w-80 max-w-full animate-pulse rounded-md bg-slate-200" />
              <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-md bg-slate-100" />
            </div>

            {/* Stat Cards Skeleton */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[380px]">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-lg border border-border bg-surface px-4 py-3 shadow-card"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-slate-200" />
                    <div className="h-3 w-12 rounded bg-slate-100" />
                  </div>
                  <div className="mt-3 h-6 w-12 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ── Main Content Skeleton ── */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-8">
            {/* Featured Section Skeleton */}
            <section>
              <div className="mb-5">
                <div className="h-6 w-48 animate-pulse rounded-md bg-slate-200" />
                <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded-md bg-slate-100" />
              </div>
              <div className="grid gap-5 lg:grid-cols-3">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="min-h-[240px] animate-pulse rounded-xl border border-border border-t-[3px] border-t-slate-200 bg-surface p-5 shadow-card"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="h-3 w-20 rounded bg-slate-100" />
                        <div className="mt-3 h-5 w-4/5 rounded bg-slate-200" />
                      </div>
                      <div className="h-5 w-14 rounded-full bg-slate-100" />
                    </div>
                    <div className="mt-4 h-4 w-full rounded bg-slate-100" />
                    <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
                    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-4">
                      <div className="h-10 rounded bg-slate-100" />
                      <div className="h-10 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* List Section Skeleton */}
            <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
              <div className="border-b border-border px-5 py-4">
                <div className="h-6 w-40 animate-pulse rounded-md bg-slate-200" />
                <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded-md bg-slate-100" />
              </div>
              <div className="divide-y divide-border">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="animate-pulse px-5 py-4">
                    <div className="h-3 w-20 rounded bg-slate-100" />
                    <div className="mt-2 h-5 w-2/3 rounded bg-slate-200" />
                    <div className="mt-3 flex gap-4">
                      <div className="h-3 w-16 rounded bg-slate-100" />
                      <div className="h-3 w-16 rounded bg-slate-100" />
                      <div className="h-3 w-16 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Skeleton */}
          <aside className="space-y-4">
            {[0, 1].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-xl border border-border bg-surface p-5 shadow-card"
              >
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-slate-200" />
                  <div className="h-5 w-36 rounded bg-slate-200" />
                </div>
                <div className="mt-5 space-y-3">
                  <div className="h-4 rounded bg-slate-100" />
                  <div className="h-4 rounded bg-slate-100" />
                  <div className="h-4 w-2/3 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </main>
  );
}

type ExamListErrorProps = {
  message: string;
  onRetry: () => void;
};

function ExamListError({ message, onRetry }: ExamListErrorProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-text-primary">
      <section className="w-full max-w-xl animate-fade-in rounded-xl border border-error-border bg-surface p-8 shadow-card">
        {/* Error Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error-light">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-error">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="0.75" fill="currentColor"/>
          </svg>
        </div>

        <h1 className="mt-5 text-center font-[family-name:var(--font-outfit)] text-2xl font-bold tracking-tight text-text-primary">
          Kiểm tra backend rồi thử lại
        </h1>
        <p className="mt-3 text-center text-sm leading-6 text-text-secondary">
          {message}. Hãy đảm bảo backend đang chạy và cấu hình API base URL của
          frontend đang trỏ đúng môi trường hiện tại.
        </p>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {/* Retry icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
              <path d="M2.5 8a5.5 5.5 0 0 1 9.37-3.9L13.5 2.5v4h-4l1.6-1.6A3.5 3.5 0 1 0 11.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Thử lại
          </button>
        </div>
      </section>
    </main>
  );
}

type ExamListEmptyProps = {
  onRetry: () => void;
};

function ExamListEmpty({ onRetry }: ExamListEmptyProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-text-primary">
      <section className="w-full max-w-xl animate-fade-in rounded-xl border border-border bg-surface p-8 shadow-card">
        {/* Logo Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-card">
          <span className="text-2xl font-bold text-white">M</span>
        </div>

        <h1 className="mt-5 text-center font-[family-name:var(--font-outfit)] text-2xl font-bold tracking-tight text-text-primary">
          Chưa có đề luyện nào
        </h1>
        <p className="mt-3 text-center text-sm leading-6 text-text-secondary">
          API đã trả về danh sách rỗng. Khi backend có dữ liệu đề, màn này sẽ
          hiển thị khu đề đề xuất, danh sách đề và tổng quan kho đề.
        </p>

        {/* Illustration area */}
        <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full bg-background-alt">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-text-muted">
            <path d="M9 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9 7h6M9 11h6M9 15h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {/* Refresh icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
              <path d="M2.5 8a5.5 5.5 0 0 1 9.37-3.9L13.5 2.5v4h-4l1.6-1.6A3.5 3.5 0 1 0 11.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tải lại danh sách
          </button>
        </div>
      </section>
    </main>
  );
}

export function ExamListClient() {
  const [exams, setExams] = useState<ExamListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [draftExamId, setDraftExamId] = useState<string | null>(null);

  /**
   * Tải danh sách đề từ backend và chuyển sang dữ liệu UI có href.
   * Hàm này được gọi khi component mount và khi người dùng bấm thử lại.
   */
  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/exams`);

      if (!response.ok) {
        throw new Error('Không tải được danh sách đề thi');
      }

      const data: ExamListApiItem[] = await response.json();
      setExams(data.map(toExamListItem));
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Lỗi không xác định khi tải danh sách đề thi',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchExams();
    setStats(getUserStats());
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('manmath:exam-draft:')) {
          setDraftExamId(key.split(':')[2]);
          break;
        }
      }
    } catch (e) {
      // safe localstorage access
    }
  }, []);

  if (loading) {
    return <ExamListSkeleton />;
  }

  if (error) {
    return <ExamListError message={error} onRetry={fetchExams} />;
  }

  if (exams.length === 0) {
    return <ExamListEmpty onRetry={fetchExams} />;
  }

  return <ExamList exams={exams} stats={stats} draftExamId={draftExamId} />;
}
