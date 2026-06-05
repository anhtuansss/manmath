import { ResultSummary } from './ResultSummary';
import type { Answers, Question, SubmitResult } from './types';

type ExamSidebarProps = {
  questions?: Question[];
  answers: Answers;
  isTimeUp: boolean;
  submitResult: SubmitResult | null;
  onQuestionClick: (questionId: number) => void;
  currentQuestionId: number | null;
};

export function ExamSidebar({
  questions,
  answers,
  isTimeUp,
  submitResult,
  onQuestionClick,
  currentQuestionId,
}: ExamSidebarProps) {
  const answeredCount =
    questions?.filter((question) => answers[question.id] !== undefined).length ?? 0;

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-950">
            Danh sách câu hỏi
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {questions?.length ?? 0} câu trong đề
          </p>
        </div>

        <div className="mb-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
          Đã làm:{' '}
          <span className="font-semibold text-slate-950">
            {answeredCount} / {questions?.length ?? 0}
          </span>
        </div>

        <div className="overflow-x-auto">
          <div className="grid w-max grid-cols-[repeat(5,2.25rem)] gap-2">
            {questions?.map((question, index) => {
              const isAnswered = answers[question.id] !== undefined;
              const isCurrent = question.id === currentQuestionId;

              return (
                <button
                  aria-current={isCurrent ? 'true' : undefined}
                  key={question.id}
                  type="button"
                  onClick={() => onQuestionClick(question.id)}
                  className={`
                    flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-sm font-semibold transition-colors
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50
                    ${
                      isCurrent
                        ? 'border-blue-600 bg-blue-600 text-white ring-2 ring-blue-100'
                        : isAnswered
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300'
                          : 'border-slate-300 bg-white text-slate-600 hover:border-blue-200'
                    }
                  `}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 grid gap-2 border-t border-slate-200 pt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm border border-blue-600 bg-blue-600 ring-2 ring-blue-100" />
            <span className="font-medium text-slate-600">Câu hiện tại</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm border border-emerald-200 bg-emerald-50" />
            <span className="font-medium text-slate-600">Đã trả lời</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm border border-slate-300 bg-white" />
            <span className="font-medium text-slate-600">Chưa trả lời</span>
          </div>
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
