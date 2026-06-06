import type { Answers, Question } from './types';

type AnswerOptionsProps = {
  question: Question;
  answers: Answers;
  isTimeUp: boolean;
  onSelectAnswer: (questionId: number, optionIndex: number) => void;
};

export function AnswerOptions({
  question,
  answers,
  isTimeUp,
  onSelectAnswer,
}: AnswerOptionsProps) {
  return (
    <div className="space-y-3">
      {question.options.map((choice, choiceIndex) => {
        const isSelected = answers[question.id] === choiceIndex;
        const optionLabel = String.fromCharCode(65 + choiceIndex);

        return (
          <button
            key={choiceIndex}
            type="button"
            aria-pressed={isSelected}
            disabled={isTimeUp}
            onClick={() => onSelectAnswer(question.id, choiceIndex)}
            className={`
              group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3882F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC]
              disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500
              ${
                isSelected
                  ? 'border-[#3882F6] bg-blue-50 text-[#0F172A] shadow-[0_0_0_1px_rgba(56,130,246,0.28)]'
                  : 'border-[#E2E8F0] bg-white text-[#0F172A] hover:border-blue-200 hover:bg-[#F8FAFC]'
              }
            `}
          >
            <span
              className={`
                flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold transition-colors
                ${
                  isSelected
                    ? 'border-[#3882F6] bg-[#3882F6] text-white'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] group-hover:border-blue-200 group-hover:text-[#3882F6]'
                }
              `}
              aria-hidden="true"
            >
              {optionLabel}
            </span>

            <span className="min-w-0 flex-1 pt-1 text-base leading-7">
              {choice}
            </span>
          </button>
        );
      })}
    </div>
  );
}
