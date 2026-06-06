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
  return 'Cần ôn lại';
};

const getNextActionText = (score: number) => {
  if (score >= 8) {
    return 'Bạn có thể chuyển sang đề khó hơn hoặc review nhanh các câu sai.';
  }

  if (score >= 5) {
    return 'Hãy xem lại các câu sai trước khi bắt đầu một đề mới.';
  }

  return 'Nên làm lại đề này sau khi xem kỹ đáp án đúng và các câu chưa làm.';
};

function ResultEmptyState({ examId }: ExamResultClientProps) {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#F8FAFC] px-4 py-10 text-[#0F172A]">
      <section className="w-full max-w-xl rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3882F6] text-lg font-bold text-white">
            M
          </div>
          <div>
            <p className="text-base font-semibold text-[#0F172A]">ManMath</p>
            <p className="text-xs font-medium text-[#64748B]">
              Trang kết quả bài làm
            </p>
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-[#0F172A]">
          Chưa có kết quả bài làm
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#64748B]">
          Trang này chỉ hiển thị sau khi bạn nộp bài. Nếu bạn mở trực tiếp URL
          kết quả, hãy quay lại danh sách đề hoặc làm đề hiện tại trước.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#3882F6] px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3882F6] focus-visible:ring-offset-2"
          >
            Về danh sách đề
          </Link>
          <Link
            href={`/exam/${examId}`}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#0F172A] transition-colors hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3882F6] focus-visible:ring-offset-2"
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
      <main className="min-h-[100dvh] bg-[#F8FAFC] px-4 py-8 text-[#0F172A] sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6 flex items-center justify-between border-b border-[#E2E8F0] pb-5">
            <div>
              <div className="h-4 w-24 animate-pulse rounded bg-blue-100" />
              <div className="mt-3 h-8 w-64 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="hidden h-10 w-32 animate-pulse rounded-lg bg-slate-100 sm:block" />
          </div>
          <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div className="h-80 animate-pulse rounded-xl border border-[#E2E8F0] bg-white" />
            <div className="h-80 animate-pulse rounded-xl border border-[#E2E8F0] bg-white" />
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
  const scoreRingBackground = `conic-gradient(#3882F6 ${accuracy * 3.6}deg, #E2E8F0 0deg)`;

  return (
    <main className="min-h-[100dvh] bg-[#F8FAFC] px-4 py-6 text-[#0F172A] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-[#E2E8F0] pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3882F6] text-lg font-bold text-white shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
                M
              </div>
              <div>
                <p className="text-base font-semibold text-[#0F172A]">ManMath</p>
                <p className="text-xs font-medium text-[#64748B]">
                  Kết quả bài thi
                </p>
              </div>
            </div>

            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-[#0F172A]">
              Tổng kết bài làm
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
              {resultSession.examTitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRetakeExam}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#0F172A] transition-colors hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3882F6] focus-visible:ring-offset-2"
            >
              Làm lại đề
            </button>
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[#3882F6] px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3882F6] focus-visible:ring-offset-2"
            >
              Về danh sách đề
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-sm font-semibold text-[#64748B]">Điểm số</p>
            <div className="mt-5 flex items-center justify-center">
              <div
                className="flex h-44 w-44 items-center justify-center rounded-full p-2"
                style={{ background: scoreRingBackground }}
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                  <div className="text-center">
                    <p className="text-5xl font-semibold text-[#3882F6]">
                      {submitResult.score.toFixed(1)}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#64748B]">
                      / 10 điểm
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
              <p className="text-sm font-semibold text-[#0F172A]">
                {getScoreLabel(submitResult.score)}
              </p>
              <p className="mt-1 text-sm leading-6 text-[#64748B]">
                {getNextActionText(submitResult.score)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-1 border-b border-[#E2E8F0] pb-4">
              <h2 className="text-lg font-semibold text-[#0F172A]">
                Thống kê bài làm
              </h2>
              <p className="text-sm text-[#64748B]">
                Tổng quan nhanh để biết phần nào cần xem lại trước.
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <p className="text-xs font-semibold text-[#64748B]">Số câu đúng</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-600">
                  {submitResult.correctCount}
                </p>
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <p className="text-xs font-semibold text-[#64748B]">Số câu sai</p>
                <p className="mt-2 text-2xl font-semibold text-red-600">
                  {incorrectCount}
                </p>
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <p className="text-xs font-semibold text-[#64748B]">Chưa làm</p>
                <p className="mt-2 text-2xl font-semibold text-amber-600">
                  {unansweredCount}
                </p>
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <p className="text-xs font-semibold text-[#64748B]">Tỷ lệ đúng</p>
                <p className="mt-2 text-2xl font-semibold text-[#3882F6]">
                  {accuracy}%
                </p>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-[#64748B]">Hoàn thành</span>
                <span className="font-semibold text-[#0F172A]">
                  {answeredCount}/{submitResult.totalQuestions} câu
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#3882F6]"
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

        <section className="space-y-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-[#0F172A]">Review đáp án</h2>
            <p className="text-sm text-[#64748B]">
              So sánh đáp án bạn chọn với đáp án đúng của từng câu.
            </p>
          </div>

          {reviewError && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
              {reviewError}. Điểm số vẫn được giữ lại, nhưng phần review cần dữ liệu
              chi tiết của đề.
            </div>
          )}

          {!exam && !reviewError && (
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 text-sm text-[#64748B]">
              Chưa có dữ liệu chi tiết để hiển thị review từng câu.
            </div>
          )}

          <div className="space-y-3">
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
                  className={`rounded-xl border border-l-4 border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${reviewAccentClass[status]}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">
                        Câu {index + 1}
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#64748B]">
                        ID câu hỏi: {question.id}
                      </p>
                    </div>
                    <span
                      className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${reviewBadgeClass[status]}`}
                    >
                      {reviewLabel[status]}
                    </span>
                  </div>

                  <p className="mt-4 text-base leading-7 text-[#0F172A]">
                    {question.question}
                  </p>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div
                      className={`rounded-lg border p-4 ${reviewAnswerClass[status]}`}
                    >
                      <p className="text-xs font-semibold text-[#64748B]">
                        Đáp án của bạn
                      </p>
                      <p className="mt-2 text-sm font-medium leading-6 text-[#0F172A]">
                        {selectedAnswer}
                      </p>
                    </div>

                    <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                      <p className="text-xs font-semibold text-[#64748B]">
                        Đáp án đúng
                      </p>
                      <p className="mt-2 text-sm font-medium leading-6 text-[#0F172A]">
                        {question.correctAnswer}
                      </p>
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
