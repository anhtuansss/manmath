'use client';

/**
 * Mục đích:
 * Component chạy phía trình duyệt cho trang kết quả. Đọc kết quả tạm sau khi nộp bài,
 * hiển thị tổng kết điểm và phần xem lại từng câu, đồng thời xử lý luồng làm lại đề.
 *
 * Luồng dữ liệu:
 * sessionStorage -> ExamResultSession -> hiển thị điểm và phần xem lại đáp án.
 * Nếu session không có bản chụp dữ liệu đề, gọi dự phòng GET /api/exams/:id
 * để lấy câu hỏi.
 *
 * File liên quan:
 * frontend/src/components/exam/ExamTakingClient.tsx
 * frontend/src/lib/storage.ts
 * backend/server.ts
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MathText } from './MathText';
import type { ExamDetailDto, ExamResultSession, QuestionDto } from './types';
import { API_BASE_URL } from '../../config/api';
import {
  getExamAnswersKey,
  getExamResultKey,
  readResultStorage,
  removeStorageItem,
} from '../../lib/storage';

type ExamResultClientProps = {
  examId: string;
};

type ReviewStatus = 'correct' | 'incorrect' | 'unanswered';

const getReviewStatus = (
  question: QuestionDto,
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

const reviewAccentClass: Record<ReviewStatus, string> = {
  correct: 'border-l-emerald-400',
  incorrect: 'border-l-red-400',
  unanswered: 'border-l-amber-400',
};

const reviewAnswerClass: Record<ReviewStatus, string> = {
  correct: 'border-emerald-200 bg-emerald-50',
  incorrect: 'border-red-200 bg-red-50',
  unanswered: 'border-amber-200 bg-amber-50',
};

const reviewLabel: Record<ReviewStatus, string> = {
  correct: 'Đúng',
  incorrect: 'Sai',
  unanswered: 'Chưa làm',
};

const getScoreLabel = (score: number) => {
  if (score >= 8) return 'Kết quả tốt';
  if (score >= 5) return 'Đạt mức cơ bản';
  return 'Chưa đạt mục tiêu';
};

const getNextActionText = (score: number) => {
  if (score >= 8) {
    return 'Bạn có thể chuyển sang đề khó hơn hoặc review nhanh các câu sai.';
  }

  if (score >= 5) {
    return 'Hãy xem lại các câu sai trước khi bắt đầu một đề mới.';
  }

  return 'Chưa đạt mục tiêu — hãy củng cố lại nền tảng trước khi làm lại.';
};

function ResultEmptyState({ examId }: ExamResultClientProps) {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-slate-50 px-4 py-10 text-slate-900">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white shadow-sm ring-1 ring-primary/20">
            M
          </div>
          <div>
            <p className="text-base font-bold text-slate-900">ManMath</p>
            <p className="text-xs font-medium text-slate-500">
              Trang kết quả bài làm
            </p>
          </div>
        </div>

        <h1 className="mt-8 text-2xl font-bold tracking-tight text-slate-900">
          Chưa có kết quả bài làm
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Trang này chỉ hiển thị sau khi bạn nộp bài. Nếu bạn mở trực tiếp URL
          kết quả, hãy quay lại danh sách đề hoặc làm đề hiện tại trước.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/exam/${examId}`}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Làm đề này
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Về danh sách đề
          </Link>
        </div>
      </section>
    </main>
  );
}

export function ExamResultClient({ examId }: ExamResultClientProps) {
  const router = useRouter();
  const [resultSession, setResultSession] = useState<ExamResultSession | null>(null);
  const [exam, setExam] = useState<ExamDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewError, setReviewError] = useState<string | null>(null);

  /**
   * Tải kết quả nộp bài từ sessionStorage. Ở MVP, trang kết quả cố ý dựa vào
   * storage tạm, nên nếu mở URL trực tiếp khi chưa nộp bài thì hiển thị trạng thái rỗng.
   */
  useEffect(() => {
    let isActive = true;

    const loadResult = async () => {
      setLoading(true);
      setReviewError(null);

      const storedResult = readResultStorage(sessionStorage, examId);

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

      // Session cũ có thể chưa có bản chụp dữ liệu đề, nên tải chi tiết để vẫn xem lại được.
      try {
        const response = await fetch(`${API_BASE_URL}/api/exams/${examId}`);

        if (!response.ok) {
          throw new Error('Không tải được chi tiết đề để review đáp án');
        }

        const examData: ExamDetailDto = await response.json();

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
    // Làm lại đề cần bắt đầu sạch: xóa cả kết quả tạm và đáp án đã lưu nháp.
    removeStorageItem(sessionStorage, getExamResultKey(examId));
    removeStorageItem(localStorage, getExamAnswersKey(examId));
    router.push(`/exam/${examId}`);
  };

  if (loading) {
    return (
      <main className="min-h-[100dvh] bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-5">
            <div>
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-8 w-64 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="hidden h-10 w-32 animate-pulse rounded-lg bg-slate-200 sm:block" />
          </div>
          <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
            <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
          </div>
        </div>
      </main>
    );
  }

  if (!resultSession) {
    return <ResultEmptyState examId={examId} />;
  }

  const { submitResult } = resultSession;
  const answeredCount =
    exam?.questions.filter((question) => resultSession.answers[question.id] !== undefined)
      .length ?? Object.keys(resultSession.answers).length;
  const unansweredCount = Math.max(submitResult.totalQuestions - answeredCount, 0);
  const incorrectCount = Math.max(
    submitResult.totalQuestions - submitResult.correctCount - unansweredCount,
    0,
  );
  const accuracy =
    submitResult.totalQuestions > 0
      ? Math.round((submitResult.correctCount / submitResult.totalQuestions) * 100)
      : 0;
  const scoreRingBackground = `conic-gradient(var(--color-primary) ${accuracy * 3.6}deg, #e2e8f0 0deg)`;

  const needsImprovementQuestions = exam?.questions
    .map((q, index) => {
      const status = getReviewStatus(q, resultSession.answers[q.id]);
      if (status === 'incorrect' || status === 'unanswered') {
        return index + 1;
      }
      return null;
    })
    .filter((num) => num !== null) as number[];

  const scrollToReview = () => {
    document.getElementById('review-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-[100dvh] bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white shadow-sm ring-1 ring-primary/20">
                M
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">ManMath</p>
                <p className="text-xs font-medium text-slate-500">
                  Kết quả bài thi
                </p>
              </div>
            </div>

            <h1 className="mt-8 text-3xl font-bold tracking-tight text-slate-900">
              Tổng kết bài làm
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
              {resultSession.examTitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={scrollToReview}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Xem lại chi tiết
            </button>
            <button
              type="button"
              onClick={handleRetakeExam}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Làm lại đề
            </button>
            <Link
              href={`/exam/${examId}/attempts`}
              className="inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Xem lịch sử
            </Link>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Về danh sách đề
            </Link>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-bold text-slate-500">Điểm số</p>
              <div className="mt-8 flex items-center justify-center">
              <div
                className="flex h-48 w-48 items-center justify-center rounded-full p-2.5 shadow-sm"
                style={{ background: scoreRingBackground }}
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white shadow-sm">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-primary">
                      {submitResult.score.toFixed(1)}
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      / 10 điểm
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
              <p className="text-sm font-bold text-slate-900">
                {getScoreLabel(submitResult.score)}
              </p>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">
                {getNextActionText(submitResult.score)}
              </p>
            </div>
          </div>

          {needsImprovementQuestions && needsImprovementQuestions.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Cần cải thiện</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Bạn cần xem lại các câu:{' '}
                <span className="font-semibold text-slate-900">
                  {needsImprovementQuestions.join(', ')}
                </span>.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Hãy đối chiếu lời giải hoặc kiến thức trên lớp để tìm ra dạng bài còn yếu.
              </p>
            </div>
          )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-2 border-b border-slate-100 pb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Thống kê bài làm
              </h2>
              <p className="text-sm text-slate-500">
                Tổng quan nhanh để biết phần nào cần xem lại trước.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Đúng</p>
                <p className="mt-3 text-3xl font-bold text-emerald-700">
                  {submitResult.correctCount}
                </p>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-red-700">Sai</p>
                <p className="mt-3 text-3xl font-bold text-red-700">
                  {incorrectCount}
                </p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Bỏ trống</p>
                <p className="mt-3 text-3xl font-bold text-amber-700">
                  {unansweredCount}
                </p>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Tỷ lệ đúng</p>
                <p className="mt-3 text-3xl font-bold text-blue-700">
                  {accuracy}%
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-500">Hoàn thành</span>
                <span className="font-bold text-slate-900">
                  {answeredCount}/{submitResult.totalQuestions} câu
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${
                      submitResult.totalQuestions > 0
                        ? (answeredCount / submitResult.totalQuestions) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="review-section" className="space-y-6 pt-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-slate-900">Review đáp án</h2>
            <p className="text-base text-slate-600">
              So sánh đáp án bạn chọn với đáp án đúng của từng câu.
            </p>
          </div>

          {reviewError && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-800 shadow-sm">
              {reviewError}. Điểm số vẫn được giữ lại, nhưng phần review cần dữ liệu
              chi tiết của đề.
            </div>
          )}

          {!exam && !reviewError && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
              Chưa có dữ liệu chi tiết để hiển thị review từng câu.
            </div>
          )}

          <div className="space-y-4">
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
                  className={`rounded-2xl border border-l-4 border-slate-200 bg-white p-6 shadow-sm ${reviewAccentClass[status]}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Câu {index + 1}
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        ID câu hỏi: {question.id}
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-md border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${reviewBadgeClass[status]}`}
                    >
                      {reviewLabel[status]}
                    </span>
                  </div>

                  <MathText
                    as="p"
                    text={question.question}
                    className="mt-5 max-w-none text-base leading-relaxed text-slate-900"
                  />

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div
                      className={`rounded-xl border p-5 ${reviewAnswerClass[status]}`}
                    >
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Đáp án của bạn
                      </p>
                      <MathText
                        as="p"
                        text={selectedAnswer}
                        className="mt-3 text-base leading-relaxed text-slate-900"
                      />
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Đáp án đúng
                      </p>
                      <MathText
                        as="p"
                        text={question.correctAnswer}
                        className="mt-3 text-base leading-relaxed text-slate-900"
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
