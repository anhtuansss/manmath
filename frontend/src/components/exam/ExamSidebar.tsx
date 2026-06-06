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
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div>
          <h3 className="text-sm font-semibold text-[#0F172A]">Câu hỏi</h3>
          <p className="mt-1 text-xs font-medium text-[#64748B]">
            Điều hướng nhanh trong đề
          </p>
        </div>

        <div className="mt-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[#64748B]">Đã làm</span>
            <span className="font-semibold text-[#0F172A]">
              {answeredCount}/{totalQuestions}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-[#3882F6] transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto pb-1">
          <div className="grid w-max grid-cols-[repeat(5,2rem)] gap-1.5">
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
                    flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-xs font-semibold transition-colors
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3882F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC]
                    ${
                      isCurrent
                        ? 'border-[#3882F6] bg-[#3882F6] text-white shadow-[0_0_0_2px_rgba(56,130,246,0.18)]'
                        : isAnswered
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300'
                          : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-blue-200 hover:text-[#3882F6]'
                    }
                  `}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 grid gap-2 border-t border-[#E2E8F0] pt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm border border-[#3882F6] bg-[#3882F6]" />
            <span className="font-medium text-[#64748B]">Câu hiện tại</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm border border-emerald-200 bg-emerald-50" />
            <span className="font-medium text-[#64748B]">Đã trả lời</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm border border-[#E2E8F0] bg-white" />
            <span className="font-medium text-[#64748B]">Chưa trả lời</span>
          </div>
        </div>

        {isTimeUp && (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm font-semibold text-red-700">
            Đã hết giờ
          </p>
        )}
      </div>
    </aside>
  );
}
