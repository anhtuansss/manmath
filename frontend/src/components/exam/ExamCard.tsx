import Link from 'next/link';
import type { ExamListItem } from './types';

type ExamCardProps = {
  exam: ExamListItem;
};

const difficultyStyles: Record<ExamListItem['difficulty'], string> = {
  easy: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  medium: 'border-blue-200 bg-blue-50 text-blue-700',
  hard: 'border-red-200 bg-red-50 text-red-700',
};

const difficultyLabels: Record<ExamListItem['difficulty'], string> = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó',
};

export function ExamCard({ exam }: ExamCardProps) {
  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300">
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${difficultyStyles[exam.difficulty]}`}
        >
          {difficultyLabels[exam.difficulty]}
        </span>
        {exam.year && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
            {exam.year}
          </span>
        )}
      </div>

      <div className="flex-1">
        <h2 className="text-lg font-semibold leading-snug text-slate-950 transition-colors group-hover:text-blue-700">
          {exam.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {exam.description}
        </p>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between text-slate-600">
            <span>Thời lượng</span>
            <span className="font-medium text-slate-950">
              {exam.durationMinutes} phút
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Số câu</span>
            <span className="font-semibold text-slate-950">
              {exam.totalQuestions} câu
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Môn</span>
            <span className="font-semibold text-slate-950">{exam.subject}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
          {exam.statusLabel}
        </span>
        <Link
          href={exam.href}
          className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Bắt đầu làm bài
        </Link>
      </div>
    </article>
  );
}
