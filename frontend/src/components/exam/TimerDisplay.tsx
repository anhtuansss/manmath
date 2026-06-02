type TimerDisplayProps = {
  remainingSeconds: number;
};

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export function TimerDisplay({ remainingSeconds }: TimerDisplayProps) {
  const isTimeWarning = remainingSeconds > 0 && remainingSeconds < 300;

  return (
    <div
      className={`rounded-lg px-3 py-1.5 ${
        isTimeWarning
          ? 'bg-red-50 text-red-700'
          : 'bg-slate-100 text-slate-950'
      }`}
    >
      <span className="font-mono text-lg font-semibold">
        {formatTime(remainingSeconds)}
      </span>
    </div>
  );
}
