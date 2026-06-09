import Link from 'next/link';
import { TimerDisplay } from './TimerDisplay';

type ExamHeaderProps = {
  examTitle?: string;
  questionCount: number;
  remainingSeconds: number;
  isTimeUp: boolean;
  onSubmit: () => void;
};

export function ExamHeader({
  examTitle,
  remainingSeconds,
  isTimeUp,
  onSubmit,
  questionCount,
}: ExamHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/"
            aria-label="Về trang chủ ManMath"
            className="flex shrink-0 items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-base font-bold text-white shadow-sm ring-1 ring-primary/20">
              M
            </span>
            <span className="hidden text-sm font-bold text-slate-900 sm:inline">
              ManMath
            </span>
          </Link>

          <div className="min-w-0 border-l border-slate-200 pl-4">
            <p className="text-xs font-medium text-slate-500">
              {questionCount} câu hỏi
            </p>
            <h1 className="mt-0.5 truncate text-sm font-bold text-slate-900 sm:text-base">
              {examTitle ?? 'Đề luyện thi'}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <TimerDisplay remainingSeconds={remainingSeconds} />
          <button
            type="button"
            onClick={onSubmit}
            disabled={isTimeUp}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none"
          >
            Nộp bài
          </button>
        </div>
      </div>
    </header>
  );
}
