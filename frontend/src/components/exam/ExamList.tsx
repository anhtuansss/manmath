import { ExamCard } from './ExamCard';
import type { ExamListItem } from './types';

type ExamListProps = {
  exams: ExamListItem[];
};

export function ExamList({ exams }: ExamListProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <div className="mb-6 flex items-end justify-between border-b border-slate-200 pb-5">
        <div>
          <p className="text-sm font-medium text-slate-500">Chọn đề thi</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">
            Danh sách đề luyện
          </h1>
        </div>
        <div className="text-sm text-slate-500">
          {exams.length} đề khả dụng
        </div>
      </div>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </main>
  );
}
