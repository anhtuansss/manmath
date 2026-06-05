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
              group flex w-full items-start gap-4 rounded-lg border-2 p-4 text-left transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50
              disabled:cursor-not-allowed disabled:opacity-80
              ${isSelected
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'
              }
            `}
          >
            <span
              className={`
                mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors
                ${isSelected
                  ? 'border-blue-600 bg-white'
                  : 'border-slate-300 bg-white group-hover:border-blue-300'
                }
              `}
              aria-hidden="true"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  isSelected ? 'bg-blue-600' : 'bg-transparent'
                }`}
              />
            </span>
            <span
              className={`w-6 shrink-0 text-base font-semibold leading-6 ${
                isSelected ? 'text-blue-700' : 'text-slate-700'
              }`}
            >
              {optionLabel}
            </span>
            <span className="min-w-0 flex-1 text-base leading-6 text-slate-900">
              {choice}
            </span>
          </button>
        );
      })}
    </div>
  );
}
