import { ExamCard } from './ExamCard';
import type { ExamListItem } from './types';

type ExamListProps = {
  exams: ExamListItem[];
};

export function ExamList({ exams }: ExamListProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            ManMath
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
            Danh sách đề thi
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Chọn một đề để luyện tập flow làm bài, tính giờ và chấm điểm.
          </p>
        </div>
        <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
          {exams.length} đề khả dụng
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </main>
  );
}
