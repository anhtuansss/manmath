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
      <article className="group cursor-pointer bg-surface px-5 py-4 transition-colors duration-200 hover:bg-background-alt">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0">
            <p className="text-xs font-medium text-accent">{getExamMeta(exam)}</p>
            <h3 className="mt-1 text-sm font-semibold leading-5 text-text-primary transition-colors duration-200 group-hover:text-primary">
              {exam.title}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
              <span className="inline-flex items-center gap-1">
                {/* Questions icon */}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-text-muted">
                  <path d="M4.5 2h7a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 12.5v-9A1.5 1.5 0 0 1 4.5 2Z" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {exam.totalQuestions} câu
              </span>
              <span className="inline-flex items-center gap-1">
                {/* Clock icon */}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-text-muted">
                  <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {exam.durationMinutes} phút
              </span>
              <span className="inline-flex items-center gap-1">
                {difficultyLabels[exam.difficulty]}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-text-secondary">
              {exam.statusLabel}
            </span>
            <Link
              href={exam.href}
              aria-label={`Vào đề ${exam.title}`}
              className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Vào đề
            </Link>
            <Link
              href={`/exam/${exam.id}/attempts`}
              aria-label={`Xem lịch sử làm bài ${exam.title}`}
              className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface px-3 text-sm font-semibold text-text-secondary transition-colors duration-200 hover:bg-background-alt hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Lịch sử
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex min-h-[240px] cursor-pointer flex-col rounded-xl border border-border border-t-[3px] border-t-primary bg-surface p-5 shadow-card transition-all duration-200 hover:border-primary/30 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-accent">{getExamMeta(exam)}</p>
          <h3 className="mt-2 line-clamp-2 font-[family-name:var(--font-outfit)] text-lg font-semibold leading-6 text-text-primary transition-colors duration-200 group-hover:text-primary">
            {exam.title}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${difficultyStyles[exam.difficulty]}`}
        >
          {difficultyLabels[exam.difficulty]}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-text-secondary">
        {exam.description}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
        <div className="flex items-center gap-2">
          {/* Questions icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-text-muted">
            <path d="M4.5 2h7a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 12.5v-9A1.5 1.5 0 0 1 4.5 2Z" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <div>
            <p className="text-xs font-medium text-text-secondary">Số câu</p>
            <p className="mt-0.5 font-semibold text-text-primary">
              {exam.totalQuestions} câu
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Clock icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-text-muted">
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <p className="text-xs font-medium text-text-secondary">Thời lượng</p>
            <p className="mt-0.5 font-semibold text-text-primary">
              {exam.durationMinutes} phút
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-text-secondary">
          {exam.statusLabel}
        </span>
        <Link
          href={exam.href}
          aria-label={`Bắt đầu làm bài ${exam.title}`}
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Bắt đầu
        </Link>
      </div>
    </article>
  );
}
