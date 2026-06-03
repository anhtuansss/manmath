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
            disabled={isTimeUp}
            onClick={() => onSelectAnswer(question.id, choiceIndex)}
            className={`
              flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60
              ${isSelected
                ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-100'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }
            `}
          >
            <span
              className={`
                flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold
                ${isSelected
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-300 bg-white text-slate-700'
                }
              `}
            >
              {optionLabel}
            </span>
            <span className="min-w-0 flex-1 leading-relaxed text-slate-800">
              {choice}
            </span>
          </button>
        );
      })}
    </div>
  );
}
