type TimerDisplayProps = {
  remainingSeconds: number;
};

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export function TimerDisplay({ remainingSeconds }: TimerDisplayProps) {
  const isTimeDanger = remainingSeconds <= 60;
  const isTimeWarning = remainingSeconds > 60 && remainingSeconds < 300;

  return (
    <div
      aria-live="polite"
      className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 transition-colors ${
        isTimeDanger
          ? 'border-red-200 bg-red-50 text-red-700'
          : isTimeWarning
            ? 'border-amber-200 bg-amber-50 text-amber-700'
            : 'border-slate-200 bg-slate-50 text-slate-900'
      }`}
    >
      <span className="hidden text-xs font-semibold sm:inline">Thời gian</span>
      <span className="font-mono text-base font-semibold tabular-nums">
        {formatTime(remainingSeconds)}
      </span>
    </div>
  );
}
