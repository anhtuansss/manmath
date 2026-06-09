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

const getExamMeta = (exam: ExamListItem) => {
  const parts = [exam.subject];

  if (exam.year) {
    parts.push(String(exam.year));
  }

  return parts.join(' · ');
};

export function ExamCard({ exam, variant = 'featured' }: ExamCardProps) {
  if (variant === 'compact') {
    return (
      <article className="group relative bg-white px-6 py-5 transition-colors hover:bg-slate-50/50">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{getExamMeta(exam)}</p>
            <h3 className="mt-2 text-base font-bold leading-6 text-slate-900 transition-colors group-hover:text-primary">
              <Link href={exam.href} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm before:absolute before:inset-0">
                {exam.title}
              </Link>
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                {exam.totalQuestions} câu
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {exam.durationMinutes} phút
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className={difficultyStyles[exam.difficulty].split(' ')[2]}>{difficultyLabels[exam.difficulty]}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {exam.statusLabel}
            </span>
            <Link
              href={`/exam/${exam.id}/attempts`}
              aria-label={`Xem lịch sử làm bài ${exam.title}`}
              className="relative z-10 inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Lịch sử
            </Link>
            <div
              aria-hidden="true"
              className="relative z-10 inline-flex h-9 items-center justify-center rounded-lg border border-primary bg-white px-4 text-sm font-semibold text-primary shadow-sm transition-colors group-hover:bg-blue-50"
            >
              Vào đề
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex min-h-[240px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all hover:border-blue-300 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{getExamMeta(exam)}</p>
          <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-6 text-slate-900 transition-colors group-hover:text-primary">
            {exam.title}
          </h3>
        </div>
        <span
          className={`shrink-0 inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${difficultyStyles[exam.difficulty]}`}
        >
          {difficultyLabels[exam.difficulty]}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
        {exam.description}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 text-sm">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">Số câu</span>
          <span className="flex items-center gap-1.5 font-bold text-slate-900">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
            {exam.totalQuestions}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">Thời lượng</span>
          <span className="flex items-center gap-1.5 font-bold text-slate-900">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {exam.durationMinutes} phút
          </span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 pt-6">
        <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {exam.statusLabel}
        </span>
        <Link
          href={exam.href}
          aria-label={`Bắt đầu làm bài ${exam.title}`}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Bắt đầu
        </Link>
      </div>
    </article>
  );
}
