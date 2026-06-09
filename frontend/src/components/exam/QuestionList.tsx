import { AnswerOptions } from './AnswerOptions';
import { MathText } from './MathText';
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
    <div className="space-y-6 lg:space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm lg:hidden">
        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
          <span className="font-medium text-slate-500">Tiến độ làm bài</span>
          <span className="font-semibold text-slate-900">
            {answeredCount}/{totalQuestions} câu
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {questions?.map((question, index) => (
        <article
          id={`question-${question.id}`}
          key={question.id}
          className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100/50 text-sm font-bold text-primary">
                {index + 1}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Câu hỏi
                </p>
                <p className="mt-0.5 text-xs font-medium text-slate-500">
                  {index + 1} trên {totalQuestions}
                </p>
              </div>
            </div>

            {answers[question.id] !== undefined && (
              <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                Đã chọn đáp án
              </span>
            )}
          </div>

          <div className="px-5 py-6 sm:px-7 sm:py-8">
            <MathText
              as="p"
              text={question.question}
              className="max-w-none text-base leading-relaxed text-slate-900 sm:text-lg sm:leading-8"
            />

            <div className="mt-8">
              <AnswerOptions
                question={question}
                answers={answers}
                isTimeUp={isTimeUp}
                onSelectAnswer={onSelectAnswer}
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
