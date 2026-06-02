import { TimerDisplay } from './TimerDisplay';

type ExamHeaderProps = {
  examTitle?: string;
  remainingSeconds: number;
  isTimeUp: boolean;
  onSubmit: () => void;
};

export function ExamHeader({
  examTitle,
  remainingSeconds,
  isTimeUp,
  onSubmit,
}: ExamHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <h1 className="min-w-0 truncate text-lg font-semibold text-slate-950 sm:text-xl">
          {examTitle ?? 'ManMath'}
        </h1>
        <div className="flex shrink-0 items-center gap-3">
          <TimerDisplay remainingSeconds={remainingSeconds} />
          <button
            onClick={onSubmit}
            disabled={isTimeUp}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Nộp bài
          </button>
        </div>
      </div>
    </header>
  );
}
