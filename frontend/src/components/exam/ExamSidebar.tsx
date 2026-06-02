import { ResultSummary } from './ResultSummary';
import type { Answers, Question, SubmitResult } from './types';

type ExamSidebarProps = {
  questions?: Question[];
  answers: Answers;
  isTimeUp: boolean;
  submitResult: SubmitResult | null;
};

export function ExamSidebar({
  questions,
  answers,
  isTimeUp,
  submitResult,
}: ExamSidebarProps) {
  const answeredCount =
    questions?.filter((question) => answers[question.id] !== undefined).length ?? 0;

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-4 font-semibold text-slate-950">Danh sách câu hỏi</h3>
        <div className="grid grid-cols-5 gap-2">
          {questions?.map((question, index) => {
            const isAnswered = answers[question.id] !== undefined;

            return (
              <div
                key={question.id}
                className={`
                  flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors
                  ${isAnswered
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-transparent bg-slate-100 text-slate-500'
                  }
                `}
              >
                {index + 1}
              </div>
            );
          })}
        </div>
        <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded border border-emerald-200 bg-emerald-50" />
            <span className="text-slate-500">Đã trả lời</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-slate-100" />
            <span className="text-slate-500">Chưa trả lời</span>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
          Số câu đã làm:{' '}
          <span className="font-semibold text-slate-950">
            {answeredCount} / {questions?.length ?? 0}
          </span>
        </div>
        {isTimeUp && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-center text-sm font-semibold text-red-700">
            Đã hết giờ
          </p>
        )}
        {submitResult && <ResultSummary result={submitResult} />}
      </div>
    </aside>
  );
}
