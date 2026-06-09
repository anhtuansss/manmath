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

const toExamListItem = (exam: ExamListApiItem): ExamListItem => ({
  ...exam,
  href: `/exam/${exam.id}`,
});

function ExamListSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 pb-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />
                <div>
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-32 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
              <div className="mt-10 h-6 w-36 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-5 h-12 w-3/4 max-w-3xl animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-6 w-full max-w-2xl animate-pulse rounded bg-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:w-[400px]">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-[88px] animate-pulse rounded-2xl border border-slate-200 bg-white"
                />
              ))}
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-10">
            <section>
              <div className="mb-6">
                <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-slate-200" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="min-h-[240px] animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
                  >
                    <div className="h-4 w-24 rounded bg-slate-200" />
                    <div className="mt-4 h-6 w-4/5 rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-full rounded bg-slate-200" />
                    <div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />
                    <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                      <div className="h-10 rounded bg-slate-200" />
                      <div className="h-10 rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-6 py-5">
                <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-slate-200" />
              </div>
              <div className="divide-y divide-slate-100">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="animate-pulse px-6 py-5">
                    <div className="h-4 w-24 rounded bg-slate-200" />
                    <div className="mt-3 h-5 w-2/3 rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-48 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            {[0, 1].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-5 w-36 rounded bg-slate-200" />
                <div className="mt-6 space-y-4">
                  <div className="h-4 rounded bg-slate-200" />
                  <div className="h-4 rounded bg-slate-200" />
                  <div className="h-4 w-2/3 rounded bg-slate-200" />
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
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900">
      <section className="w-full max-w-xl rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl font-bold text-red-600">
            !
          </div>
          <div>
            <p className="text-base font-bold text-slate-900">ManMath</p>
            <p className="text-xs font-medium text-slate-500">
              Không tải được danh sách đề
            </p>
          </div>
        </div>

        <h1 className="mt-8 text-2xl font-bold tracking-tight text-slate-900">
          Kiểm tra kết nối và thử lại
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          {message}. Hãy đảm bảo hệ thống backend đang chạy và API hoạt động bình thường.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Tải lại trang
        </button>
      </section>
    </main>
  );
}

type ExamListEmptyProps = {
  onRetry: () => void;
};

function ExamListEmpty({ onRetry }: ExamListEmptyProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white shadow-sm ring-1 ring-primary/20">
            M
          </div>
          <div>
            <p className="text-base font-bold text-slate-900">ManMath</p>
            <p className="text-xs font-medium text-slate-500">
              Kho đề đang trống
            </p>
          </div>
        </div>

        <h1 className="mt-8 text-2xl font-bold tracking-tight text-slate-900">
          Chưa có đề luyện nào
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Hệ thống hiện tại chưa có đề thi nào khả dụng. Xin vui lòng quay lại sau.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-8 inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Tải lại danh sách
        </button>
      </section>
    </main>
  );
}

export function ExamListClient() {
  const [exams, setExams] = useState<ExamListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return <ExamList exams={exams} />;
}
