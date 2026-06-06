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
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="border-b border-[#E2E8F0] pb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-blue-100" />
                <div>
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-32 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
              <div className="mt-7 h-4 w-36 animate-pulse rounded bg-blue-100" />
              <div className="mt-3 h-9 w-72 max-w-full animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-slate-100" />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[360px]">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-[74px] animate-pulse rounded-xl border border-[#E2E8F0] bg-white"
                />
              ))}
            </div>
          </div>
        </header>

        <div className="grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-7">
            <section>
              <div className="mb-4">
                <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-slate-100" />
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="min-h-[220px] animate-pulse rounded-xl border border-[#E2E8F0] bg-white p-5"
                  >
                    <div className="h-4 w-24 rounded bg-slate-100" />
                    <div className="mt-4 h-6 w-4/5 rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-full rounded bg-slate-100" />
                    <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
                    <div className="mt-8 grid grid-cols-2 gap-3 border-t border-[#E2E8F0] pt-4">
                      <div className="h-10 rounded bg-slate-100" />
                      <div className="h-10 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-[#E2E8F0] bg-white">
              <div className="border-b border-[#E2E8F0] px-4 py-4">
                <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-slate-100" />
              </div>
              <div className="divide-y divide-[#E2E8F0]">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="animate-pulse px-4 py-4">
                    <div className="h-4 w-24 rounded bg-slate-100" />
                    <div className="mt-3 h-5 w-2/3 rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-48 rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            {[0, 1].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-xl border border-[#E2E8F0] bg-white p-5"
              >
                <div className="h-5 w-36 rounded bg-slate-200" />
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
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-10 text-[#0F172A]">
      <section className="w-full max-w-xl rounded-xl border border-red-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-sm font-bold text-red-700">
            !
          </div>
          <div>
            <p className="text-base font-semibold text-[#0F172A]">ManMath</p>
            <p className="text-xs font-medium text-[#64748B]">
              Không tải được danh sách đề
            </p>
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-[#0F172A]">
          Kiểm tra backend rồi thử lại
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#64748B]">
          {message}. Hãy đảm bảo backend đang chạy và cấu hình API base URL của
          frontend đang trỏ đúng môi trường hiện tại.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-[#3882F6] px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3882F6] focus-visible:ring-offset-2"
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
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-10 text-[#0F172A]">
      <section className="w-full max-w-xl rounded-xl border border-[#E2E8F0] bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3882F6] text-lg font-bold text-white">
            M
          </div>
          <div>
            <p className="text-base font-semibold text-[#0F172A]">ManMath</p>
            <p className="text-xs font-medium text-[#64748B]">
              Kho đề đang trống
            </p>
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-[#0F172A]">
          Chưa có đề luyện nào
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#64748B]">
          API đã trả về danh sách rỗng. Khi backend có dữ liệu đề, màn này sẽ
          hiển thị khu đề đề xuất, danh sách đề và tổng quan kho đề.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#0F172A] transition-colors hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3882F6] focus-visible:ring-offset-2"
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
