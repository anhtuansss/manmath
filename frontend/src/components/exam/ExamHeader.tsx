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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-0">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-slate-950 sm:text-xl">
            {examTitle ?? 'ManMath'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {questionCount} câu hỏi
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
