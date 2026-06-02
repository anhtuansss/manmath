'use client';

import { useEffect, useState } from 'react';
import { ExamList } from './ExamList';
import type { ExamListApiItem, ExamListItem } from './types';

const API_BASE_URL = 'http://localhost:5000';

const toExamListItem = (exam: ExamListApiItem): ExamListItem => ({
  ...exam,
  href: `/exam/${exam.id}`,
});

export function ExamListClient() {
  const [exams, setExams] = useState<ExamListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchExams();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Đang tải danh sách đề thi...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
          {error}. Hãy kiểm tra backend đang chạy ở cổng 5000.
        </div>
      </main>
    );
  }

  return <ExamList exams={exams} />;
}
