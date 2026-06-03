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
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Tiến độ</span>
          <span className="font-medium text-slate-900">
            {answeredCount}/{totalQuestions} câu
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
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
          className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-7"
        >
          <div className="mb-6">
            <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              Câu {index + 1}/{totalQuestions}
            </span>
          </div>
          <p className="mb-8 text-[17px] leading-8 text-slate-900">
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
