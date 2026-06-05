'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ExamResponse, ExamResultSession, Question } from './types';

type ExamResultClientProps = {
  examId: string;
};

type ReviewStatus = 'correct' | 'incorrect' | 'unanswered';

const API_BASE_URL = 'http://localhost:5000';

const parseResultSession = (
  rawData: string | null,
  examId: string,
): ExamResultSession | null => {
  if (!rawData) return null;

  try {
    const parsed = JSON.parse(rawData) as Partial<ExamResultSession>;

    if (
      parsed.examId !== examId ||
      !parsed.examTitle ||
      !parsed.submittedAt ||
      !parsed.answers ||
      !parsed.submitResult
    ) {
      return null;
    }

    return {
      examId: parsed.examId,
      examTitle: parsed.examTitle,
      submittedAt: parsed.submittedAt,
      answers: parsed.answers,
      submitResult: parsed.submitResult,
      exam: parsed.exam,
    };
  } catch {
    return null;
  }
};

const getResultStorageKey = (examId: string) => `exam-result-${examId}`;
const getAnswerStorageKey = (examId: string) => `exam-answers-${examId}`;

const getReviewStatus = (
  question: Question,
  selectedOptionIndex: number | undefined,
): ReviewStatus => {
  if (selectedOptionIndex === undefined) return 'unanswered';

  const correctOptionIndex = question.options.indexOf(question.correctAnswer);
  return selectedOptionIndex === correctOptionIndex ? 'correct' : 'incorrect';
};

const reviewBadgeClass: Record<ReviewStatus, string> = {
  correct: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  incorrect: 'border-red-200 bg-red-50 text-red-700',
  unanswered: 'border-amber-200 bg-amber-50 text-amber-700',
};

const reviewLabel: Record<ReviewStatus, string> = {
  correct: 'Đúng',
  incorrect: 'Sai',
  unanswered: 'Chưa làm',
};

function ResultEmptyState({ examId }: ExamResultClientProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950">
      <section className="mx-auto w-full max-w-3xl rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm font-semibold text-blue-700">ManMath</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">
          Chưa có kết quả bài làm
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Trang này chỉ hiển thị kết quả sau khi bạn nộp bài. Nếu bạn mở trực
          tiếp URL kết quả, hãy quay lại danh sách đề hoặc làm lại đề hiện tại.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Về danh sách đề
          </Link>
          <Link
            href={`/exam/${examId}`}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Làm đề này
          </Link>
        </div>
      </section>
    </main>
  );
}

export function ExamResultClient({ examId }: ExamResultClientProps) {
  const router = useRouter();
  const [resultSession, setResultSession] = useState<ExamResultSession | null>(null);
  const [exam, setExam] = useState<ExamResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadResult = async () => {
      setLoading(true);
      setReviewError(null);

      const storedResult = parseResultSession(
        sessionStorage.getItem(getResultStorageKey(examId)),
        examId,
      );

      if (!storedResult) {
        if (!isActive) return;
        setResultSession(null);
        setExam(null);
        setLoading(false);
        return;
      }

      if (!isActive) return;
      setResultSession(storedResult);

      if (storedResult.exam) {
        setExam(storedResult.exam);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/exams/${examId}`);

        if (!response.ok) {
          throw new Error('Không tải được chi tiết đề để review đáp án');
        }

        const examData: ExamResponse = await response.json();

        if (!isActive) return;
        setExam(examData);
      } catch (error) {
        if (!isActive) return;
        setReviewError(
          error instanceof Error
            ? error.message
            : 'Không tải được chi tiết đề để review đáp án',
        );
      } finally {
        if (isActive) setLoading(false);
      }
    };

    void loadResult();

    return () => {
      isActive = false;
    };
  }, [examId]);

  const handleRetakeExam = () => {
    sessionStorage.removeItem(getResultStorageKey(examId));
    localStorage.removeItem(getAnswerStorageKey(examId));
    router.push(`/exam/${examId}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950">
        <div className="mx-auto w-full max-w-4xl rounded-lg border border-slate-200 bg-white p-6">
          <div className="h-4 w-24 rounded bg-blue-100" />
          <div className="mt-4 h-8 w-64 rounded bg-slate-200" />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="h-24 rounded-lg bg-slate-100" />
            <div className="h-24 rounded-lg bg-slate-100" />
            <div className="h-24 rounded-lg bg-slate-100" />
          </div>
        </div>
      </main>
    );
  }

  if (!resultSession) {
    return <ResultEmptyState examId={examId} />;
  }

  const { submitResult } = resultSession;
  const incorrectCount = submitResult.totalQuestions - submitResult.correctCount;
  const accuracy =
    submitResult.totalQuestions > 0
      ? Math.round((submitResult.correctCount / submitResult.totalQuestions) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">ManMath</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
              Kết quả bài làm
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {resultSession.examTitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRetakeExam}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Làm lại đề
            </button>
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Về danh sách đề
            </Link>
          </div>
        </header>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="grid gap-6 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
            <div className="flex h-40 w-40 items-center justify-center rounded-lg border-4 border-blue-600 bg-blue-50">
              <div className="text-center">
                <p className="text-5xl font-semibold text-blue-700">
                  {submitResult.score.toFixed(1)}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">/ 10</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <div className="py-3 sm:py-0 sm:pr-4">
                  <p className="text-2xl font-semibold text-slate-950">
                    {submitResult.correctCount}
                    <span className="text-base font-medium text-slate-500">
                      /{submitResult.totalQuestions}
                    </span>
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Số câu đúng
                  </p>
                </div>
                <div className="py-3 sm:px-4 sm:py-0">
                  <p className="text-2xl font-semibold text-slate-950">
                    {accuracy}%
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Tỷ lệ đúng
                  </p>
                </div>
                <div className="py-3 sm:py-0 sm:pl-4">
                  <p className="text-2xl font-semibold text-slate-950">
                    {incorrectCount}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Sai hoặc chưa làm
                  </p>
                </div>
              </div>

              <div className="rounded-lg border-l-4 border-blue-600 bg-blue-50 px-4 py-3">
                <p className="text-sm leading-6 text-slate-700">
                  {submitResult.score >= 8
                    ? 'Kết quả tốt. Bạn có thể chuyển sang đề khó hơn hoặc review nhanh các câu sai.'
                    : submitResult.score >= 5
                      ? 'Bạn đã qua mốc cơ bản. Hãy xem lại các câu sai trước khi làm đề tiếp theo.'
                      : 'Nên làm lại đề này sau khi xem kỹ đáp án đúng và các câu chưa làm.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              Review đáp án
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              So sánh đáp án bạn chọn với đáp án đúng của từng câu.
            </p>
          </div>

          {reviewError && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {reviewError}. Điểm số vẫn được giữ lại, nhưng phần review cần dữ
              liệu chi tiết của đề.
            </div>
          )}

          {exam?.questions.map((question, index) => {
            const selectedOptionIndex = resultSession.answers[question.id];
            const selectedAnswer =
              selectedOptionIndex !== undefined
                ? question.options[selectedOptionIndex] ?? 'Đáp án không hợp lệ'
                : 'Chưa chọn đáp án';
            const status = getReviewStatus(question, selectedOptionIndex);

            return (
              <article
                key={question.id}
                className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <p className="text-sm font-semibold text-slate-600">
                    Câu {index + 1}
                  </p>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${reviewBadgeClass[status]}`}
                  >
                    {reviewLabel[status]}
                  </span>
                </div>

                <p className="mt-5 text-base leading-7 text-slate-950">
                  {question.question}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div
                    className={`rounded-lg border p-4 ${
                      status === 'correct'
                        ? 'border-emerald-200 bg-emerald-50'
                        : status === 'incorrect'
                          ? 'border-red-200 bg-red-50'
                          : 'border-amber-200 bg-amber-50'
                    }`}
                  >
                    <p className="text-xs font-semibold text-slate-500">
                      Đáp án của bạn
                    </p>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-950">
                      {selectedAnswer}
                    </p>
                  </div>

                  {status !== 'correct' && (
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        Đáp án đúng
                      </p>
                      <p className="mt-2 text-sm font-medium leading-6 text-slate-950">
                        {question.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
