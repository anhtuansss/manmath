import type { SubmitResult } from './types';

type ResultSummaryProps = {
  result: SubmitResult;
};

const getScoreColorClass = (score: number) => {
  if (score >= 8) return 'text-emerald-600';
  if (score >= 6.5) return 'text-blue-600';
  if (score >= 5) return 'text-amber-600';
  return 'text-red-600';
};

const getScoreBadgeClass = (score: number) => {
  if (score >= 8) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (score >= 6.5) return 'bg-blue-50 text-blue-700 border-blue-200';
  if (score >= 5) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-red-50 text-red-700 border-red-200';
};

const getScoreLabel = (score: number) => {
  if (score >= 8) return 'Xuất sắc';
  if (score >= 6.5) return 'Khá';
  if (score >= 5) return 'Trung bình';
  return 'Cần cố gắng';
};

export function ResultSummary({ result }: ResultSummaryProps) {
  const incorrectCount = result.totalQuestions - result.correctCount;
  const correctPercentage =
    result.totalQuestions > 0
      ? (result.correctCount / result.totalQuestions) * 100
      : 0;

  return (
    <div className="mt-4 border-t border-slate-200 pt-4">
      <div className="rounded-lg bg-slate-50 p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Kết quả
            </p>
            <p className={`text-3xl font-semibold ${getScoreColorClass(result.score)}`}>
              {result.score.toFixed(1)}
            </p>
          </div>

          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getScoreBadgeClass(result.score)}`}
          >
            {getScoreLabel(result.score)}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-sm font-bold text-emerald-700">
              ✓
            </div>
            <div>
              <p className="text-xs text-slate-500">Số câu đúng</p>
              <p className="text-lg font-semibold text-slate-950">
                {result.correctCount}/{result.totalQuestions}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-sm font-bold text-red-700">
              ×
            </div>
            <div>
              <p className="text-xs text-slate-500">Số câu sai</p>
              <p className="text-lg font-semibold text-slate-950">
                {incorrectCount} câu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">
              %
            </div>
            <div>
              <p className="text-xs text-slate-500">Tỷ lệ đúng</p>
              <p className="text-lg font-semibold text-slate-950">
                {correctPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">Tiến độ hoàn thành</span>
            <span className="font-medium text-slate-900">
              {result.correctCount}/{result.totalQuestions} câu đúng
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${correctPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
