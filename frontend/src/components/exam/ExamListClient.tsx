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
    <main className="mx-auto w-full max-w-7xl px-4 py-6 text-slate-950 sm:px-6 sm:py-8">
      <div className="mb-8 border-b border-slate-200 pb-5">
        <div className="h-4 w-20 rounded bg-blue-100" />
        <div className="mt-3 h-8 w-64 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-full max-w-xl rounded bg-slate-100" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <section>
            <div className="mb-4 h-6 w-40 rounded bg-slate-200" />
            <div className="grid gap-4 md:grid-cols-2">
              {[0, 1].map((item) => (
                <div
                  key={item}
                  className="min-h-[230px] animate-pulse rounded-lg border border-slate-200 bg-white p-6"
                >
                  <div className="h-6 w-3/4 rounded bg-slate-200" />
                  <div className="mt-4 h-4 w-full rounded bg-slate-100" />
                  <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
                  <div className="mt-8 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4">
                    <div className="h-10 rounded bg-slate-100" />
                    <div className="h-10 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 h-6 w-32 rounded bg-slate-200" />
            <div className="space-y-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-lg border border-slate-200 bg-white p-4"
                >
                  <div className="h-5 w-2/3 rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="animate-pulse rounded-lg border border-slate-200 bg-white p-5">
            <div className="h-6 w-40 rounded bg-slate-200" />
            <div className="mt-5 space-y-4">
              <div className="h-5 rounded bg-slate-100" />
              <div className="h-5 rounded bg-slate-100" />
              <div className="h-5 rounded bg-slate-100" />
            </div>
          </div>
        </aside>
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
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-10">
      <section className="w-full rounded-lg border border-red-200 bg-white p-6">
        <p className="text-sm font-semibold text-red-700">
          Không tải được danh sách đề
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">
          Kiểm tra backend rồi thử lại
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {message}. Backend cần chạy ở cổng 5000 để frontend đọc được API
          danh sách đề.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          Thử lại
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
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-10">
      <section className="w-full rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm font-semibold text-blue-700">ManMath</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">
          Chưa có đề luyện nào
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          API đã trả về danh sách rỗng. Khi backend có mock exam, màn này sẽ
          hiển thị đề nổi bật và thư viện đề như dashboard.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
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
