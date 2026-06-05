import Link from 'next/link';
import type { ExamListItem } from './types';

type ExamCardProps = {
  exam: ExamListItem;
  variant?: 'featured' | 'compact';
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

export function ExamCard({ exam, variant = 'featured' }: ExamCardProps) {
  if (variant === 'compact') {
    return (
      <article className="group rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold leading-6 text-slate-950 transition-colors group-hover:text-blue-700">
              {exam.title}
            </h3>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">
              <span>{exam.totalQuestions} câu</span>
              <span aria-hidden="true">•</span>
              <span>{exam.durationMinutes} phút</span>
              <span aria-hidden="true">•</span>
              <span>{difficultyLabels[exam.difficulty]}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {exam.statusLabel}
            </span>
            <Link
              href={exam.href}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-3 text-sm font-semibold text-blue-700 transition-colors hover:border-blue-600 hover:bg-blue-100"
            >
              Vào đề
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex min-h-[230px] flex-col rounded-lg border border-slate-200 bg-white p-6 transition-colors hover:border-blue-300">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-semibold leading-7 text-slate-950 transition-colors group-hover:text-blue-700">
          {exam.title}
        </h3>
        <span
          className={`shrink-0 rounded-md border px-2.5 py-1 text-xs font-semibold ${difficultyStyles[exam.difficulty]}`}
        >
          {difficultyLabels[exam.difficulty]}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
        {exam.description}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4 text-sm">
        <div>
          <p className="text-slate-500">Số câu</p>
          <p className="mt-1 font-semibold text-slate-950">
            {exam.totalQuestions} câu
          </p>
        </div>
        <div>
          <p className="text-slate-500">Thời lượng</p>
          <p className="mt-1 font-semibold text-slate-950">
            {exam.durationMinutes} phút
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {exam.statusLabel}
        </span>
        <Link
          href={exam.href}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Bắt đầu làm bài
        </Link>
      </div>
    </article>
  );
}
