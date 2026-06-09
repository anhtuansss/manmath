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
    <div className="space-y-6">
      <div className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
          <span className="font-medium text-[#64748B]">Tiến độ làm bài</span>
          <span className="font-semibold text-[#0F172A]">
            {answeredCount}/{totalQuestions} câu
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#3882F6] transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {questions?.map((question, index) => (
        <article
          id={`question-${question.id}`}
          key={question.id}
          className="scroll-mt-28 rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] px-5 py-4 sm:px-7">
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">
                Câu {index + 1}
              </p>
              <p className="mt-0.5 text-xs font-medium text-[#64748B]">
                {index + 1}/{totalQuestions}
              </p>
            </div>

            {answers[question.id] !== undefined && (
              <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                Đã chọn đáp án
              </span>
            )}
          </div>

          <div className="px-5 py-6 sm:px-7 sm:py-7">
            <MathText
              as="p"
              text={question.question}
              className="max-w-3xl text-base leading-8 text-[#0F172A] sm:text-lg"
            />

            <div className="mt-7">
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
