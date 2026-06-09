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
      <article className="group bg-white px-4 py-3 transition-colors hover:bg-[#F8FAFC]">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#64748B]">{getExamMeta(exam)}</p>
            <h3 className="mt-1 text-sm font-semibold leading-5 text-[#0F172A] transition-colors group-hover:text-[#3882F6]">
              {exam.title}
            </h3>
            <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs font-medium text-[#64748B]">
              <span>{exam.totalQuestions} câu</span>
              <span aria-hidden="true">·</span>
              <span>{exam.durationMinutes} phút</span>
              <span aria-hidden="true">·</span>
              <span>{difficultyLabels[exam.difficulty]}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <span className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-semibold text-[#64748B]">
              {exam.statusLabel}
            </span>
            <Link
              href={exam.href}
              aria-label={`Vào đề ${exam.title}`}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-[#3882F6] bg-white px-3 text-sm font-semibold text-[#3882F6] transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3882F6] focus-visible:ring-offset-2"
            >
              Vào đề
            </Link>
            <Link
              href={`/exam/${exam.id}/attempts`}
              aria-label={`Xem lịch sử làm bài ${exam.title}`}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-semibold text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3882F6] focus-visible:ring-offset-2"
            >
              Lịch sử
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex min-h-[220px] flex-col rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-[#3882F6]/70">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#64748B]">{getExamMeta(exam)}</p>
          <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-6 text-[#0F172A] transition-colors group-hover:text-[#3882F6]">
            {exam.title}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-md border px-2.5 py-1 text-xs font-semibold ${difficultyStyles[exam.difficulty]}`}
        >
          {difficultyLabels[exam.difficulty]}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#64748B]">
        {exam.description}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#E2E8F0] pt-4 text-sm">
        <div>
          <p className="text-xs font-medium text-[#64748B]">Số câu</p>
          <p className="mt-1 font-semibold text-[#0F172A]">
            {exam.totalQuestions} câu
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-[#64748B]">Thời lượng</p>
          <p className="mt-1 font-semibold text-[#0F172A]">
            {exam.durationMinutes} phút
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-semibold text-[#64748B]">
          {exam.statusLabel}
        </span>
        <Link
          href={exam.href}
          aria-label={`Bắt đầu làm bài ${exam.title}`}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#3882F6] px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3882F6] focus-visible:ring-offset-2"
        >
          Bắt đầu
        </Link>
      </div>
    </article>
  );
}
