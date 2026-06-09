import { MathText } from './MathText';
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
              group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500
              ${
                isSelected
                  ? 'border-primary bg-blue-50/50 text-slate-900 ring-1 ring-primary'
                  : 'border-slate-200 bg-white text-slate-900 hover:border-blue-300 hover:bg-slate-50/50'
              }
            `}
          >
            <span
              className={`
                flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-bold transition-colors
                ${
                  isSelected
                    ? 'border-primary bg-primary text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-500 group-hover:border-blue-300 group-hover:bg-white group-hover:text-primary'
                }
              `}
              aria-hidden="true"
            >
              {optionLabel}
            </span>

            <MathText
              text={choice}
              className="min-w-0 flex-1 pt-0.5 text-base leading-7"
            />
          </button>
        );
      })}
    </div>
  );
}
