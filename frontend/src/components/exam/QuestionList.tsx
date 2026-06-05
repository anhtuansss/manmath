import { AnswerOptions } from './AnswerOptions';
import type { Answers, Question } from './types';

type QuestionListProps = {
  questions?: Question[];
  answers: Answers;
  isTimeUp: boolean;
  onSelectAnswer: (questionId: number, optionIndex: number) => void;
};

export function QuestionList({
  questions,
  answers,
  isTimeUp,
  onSelectAnswer,
}: QuestionListProps) {
  const totalQuestions = questions?.length ?? 0;
  const answeredCount =
    questions?.filter((question) => answers[question.id] !== undefined).length ?? 0;
  const progressPercentage =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-500">Tiến độ</span>
          <span className="font-semibold text-slate-950">
            {answeredCount}/{totalQuestions} câu
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      {questions?.map((question, index) => (
        <div
          id={`question-${question.id}`}
          key={question.id}
          className="scroll-mt-28 rounded-lg border border-slate-200 bg-white p-6 sm:p-8"
        >
          <div className="mb-6 flex items-center border-b border-slate-200 pb-4">
            <span className="text-sm font-semibold text-blue-700">
              Câu {index + 1}/{totalQuestions}
            </span>
          </div>
          <p className="mb-8 text-lg leading-8 text-slate-950">
            {question.question}
          </p>
          <AnswerOptions
            question={question}
            answers={answers}
            isTimeUp={isTimeUp}
            onSelectAnswer={onSelectAnswer}
          />
        </div>
      ))}
    </div>
  );
}
