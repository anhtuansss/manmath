import type { Answers, Question } from './types';

type ExamSidebarProps = {
  questions?: Question[];
  answers: Answers;
  isTimeUp: boolean;
  onQuestionClick: (questionId: number) => void;
  currentQuestionId: number | null;
};

export function ExamSidebar({
  questions,
  answers,
  isTimeUp,
  onQuestionClick,
  currentQuestionId,
}: ExamSidebarProps) {
  const totalQuestions = questions?.length ?? 0;
  const answeredCount =
    questions?.filter((question) => answers[question.id] !== undefined).length ?? 0;
  const progressPercentage =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Câu hỏi</h3>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Điều hướng nhanh trong đề
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-500">Đã làm</span>
            <span className="font-bold text-slate-900">
              {answeredCount}/{totalQuestions}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="mt-5 overflow-x-auto pb-2">
          <div className="grid w-max grid-cols-[repeat(5,2.25rem)] gap-2 lg:grid-cols-[repeat(6,2.25rem)] xl:grid-cols-[repeat(5,2.25rem)]">
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
                    flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition-colors
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                    ${
                      isCurrent
                        ? 'border-primary bg-primary text-white shadow-sm ring-1 ring-primary/30'
                        : isAnswered
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-primary'
                    }
                  `}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid gap-2.5 border-t border-slate-100 pt-5 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-[4px] border border-primary bg-primary" />
            <span className="font-medium text-slate-600">Câu hiện tại</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-[4px] border border-emerald-300 bg-emerald-50" />
            <span className="font-medium text-slate-600">Đã trả lời</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-[4px] border border-slate-200 bg-white" />
            <span className="font-medium text-slate-600">Chưa trả lời</span>
          </div>
        </div>

        {isTimeUp && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-center text-sm font-bold text-red-700 shadow-sm">
            Đã hết giờ
          </p>
        )}
      </div>
    </aside>
  );
}
