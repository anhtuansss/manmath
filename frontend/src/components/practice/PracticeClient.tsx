'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../../config/api';
import { ExamHeader } from '../exam/ExamHeader';
import { ExamSidebar } from '../exam/ExamSidebar';
import { Logo } from '../exam/Logo';
import { OptionImage } from '../exam/OptionImage';
import { QuestionImage } from '../exam/QuestionImage';
import { QuestionList } from '../exam/QuestionList';
import { MathText } from '../exam/MathText';
import type {
  Answers,
  PracticeTopicDto,
  QuestionDto,
} from '../exam/types';

type PracticeClientProps = {
  topicSlug: string;
};

type PracticeResult = {
  correctCount: number;
  totalQuestions: number;
  answeredCount: number;
  score: number;
};

const calculatePracticeResult = (
  questions: QuestionDto[],
  answers: Answers,
): PracticeResult => {
  let correctCount = 0;
  let answeredCount = 0;

  for (const question of questions) {
    const selectedOptionIndex = answers[question.id];

    if (selectedOptionIndex === undefined) {
      continue;
    }

    answeredCount += 1;

    if (question.options[selectedOptionIndex] === question.correctAnswer) {
      correctCount += 1;
    }
  }

  const totalQuestions = questions.length;
  const score =
    totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 10)
      : 0;

  return {
    correctCount,
    totalQuestions,
    answeredCount,
    score,
  };
};

const formatTopicTitle = (practice: PracticeTopicDto | null): string => {
  if (!practice) {
    return 'Luyen theo chuyen de';
  }

  return practice.title;
};

export function PracticeClient({ topicSlug }: PracticeClientProps) {
  const [practice, setPractice] = useState<PracticeTopicDto | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [result, setResult] = useState<PracticeResult | null>(null);

  const isSubmitted = result !== null;
  const isTimeUp = remainingSeconds === 0;

  useEffect(() => {
    const fetchPractice = async () => {
      try {
        setLoading(true);
        setError(null);
        setPractice(null);
        setAnswers({});
        setResult(null);
        setShowSubmitConfirm(false);

        const response = await fetch(
          `${API_BASE_URL}/api/practice/topic/${topicSlug}?limit=10`,
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Khong tim thay chuyen de de luyen tap');
          }

          throw new Error('Khong tai duoc bo luyen tap theo chuyen de');
        }

        const data: PracticeTopicDto = await response.json();
        setPractice(data);
        setRemainingSeconds(data.durationMinutes * 60);
        setCurrentQuestionId(data.questions[0]?.id ?? null);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Loi khong xac dinh khi tai bo luyen tap',
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchPractice();
  }, [topicSlug]);

  useEffect(() => {
    if (!practice || isSubmitted) {
      return;
    }

    const timerId = window.setInterval(() => {
      setRemainingSeconds((previousSeconds) => {
        if (previousSeconds <= 1) {
          window.clearInterval(timerId);
          return 0;
        }

        return previousSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [practice, isSubmitted]);

  useEffect(() => {
    if (!practice || isSubmitted || remainingSeconds > 0) {
      return;
    }

    setResult(calculatePracticeResult(practice.questions, answers));
    setShowSubmitConfirm(false);
  }, [answers, isSubmitted, practice, remainingSeconds]);

  useEffect(() => {
    if (!practice?.questions.length || isSubmitted) {
      return;
    }

    const syncCurrentQuestion = () => {
      const stickyHeaderOffset = 120;
      let nextQuestionId = practice.questions[0].id;

      for (const question of practice.questions) {
        const element = document.getElementById(`question-${question.id}`);

        if (!element) {
          continue;
        }

        const rect = element.getBoundingClientRect();

        if (rect.top <= stickyHeaderOffset) {
          nextQuestionId = question.id;
          continue;
        }

        break;
      }

      setCurrentQuestionId(nextQuestionId);
    };

    let frameId = 0;

    const onScroll = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(syncCurrentQuestion);
    };

    syncCurrentQuestion();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isSubmitted, practice]);

  useEffect(() => {
    if (!practice || isSubmitted || showSubmitConfirm) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const currentIndex = practice.questions.findIndex(
        (question) => question.id === currentQuestionId,
      );

      if (event.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          event.preventDefault();
          handleQuestionNavigate(practice.questions[currentIndex - 1].id);
        }
      } else if (event.key === 'ArrowRight') {
        if (currentIndex < practice.questions.length - 1 && currentIndex !== -1) {
          event.preventDefault();
          handleQuestionNavigate(practice.questions[currentIndex + 1].id);
        }
      } else if (['1', '2', '3', '4'].includes(event.key) && currentQuestionId !== null) {
        event.preventDefault();
        handleSelectAnswer(currentQuestionId, Number(event.key) - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionId, isSubmitted, practice, showSubmitConfirm]);

  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: optionIndex,
    }));
  };

  const handleQuestionNavigate = (questionId: number) => {
    setCurrentQuestionId(questionId);
    document
      .getElementById(`question-${questionId}`)
      ?.scrollIntoView({ behavior: 'auto', block: 'start' });
  };

  const handleSubmit = () => {
    if (!practice) {
      return;
    }

    setResult(calculatePracticeResult(practice.questions, answers));
    setShowSubmitConfirm(false);
  };

  const handleRestart = () => {
    if (!practice) {
      return;
    }

    setAnswers({});
    setResult(null);
    setShowSubmitConfirm(false);
    setRemainingSeconds(practice.durationMinutes * 60);
    setCurrentQuestionId(practice.questions[0]?.id ?? null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const reviewItems = useMemo(() => {
    if (!practice || !result) {
      return [];
    }

    return practice.questions.map((question, index) => {
      const selectedOptionIndex = answers[question.id];
      const correctOptionIndex = question.options.indexOf(question.correctAnswer);

      return {
        index,
        question,
        selectedOptionIndex,
        correctOptionIndex,
        isCorrect:
          selectedOptionIndex !== undefined &&
          selectedOptionIndex === correctOptionIndex,
      };
    });
  }, [answers, practice, result]);

  if (loading) {
    return (
      <main className="min-h-[100dvh] bg-background px-4 py-10 text-text-primary sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-16 rounded-xl border border-border bg-surface shadow-card" />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-6">
              <div className="h-16 rounded-xl border border-border bg-surface shadow-card" />
              <div className="h-[420px] rounded-xl border border-border bg-surface shadow-card" />
            </div>
            <div className="h-[280px] rounded-xl border border-border bg-surface shadow-card" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !practice) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-10 text-text-primary">
        <section className="w-full max-w-xl rounded-xl border border-border bg-surface p-8 text-center shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error-light text-error">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M12 8v4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="12" cy="16" r="0.75" fill="currentColor" />
            </svg>
          </div>
          <h1 className="mt-5 font-[family-name:var(--font-outfit)] text-2xl font-bold text-text-primary">
            Khong mo duoc bo luyen tap
          </h1>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            {error ?? 'Khong tim thay bo luyen tap theo chuyen de nay.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/analytics"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-hover"
            >
              Quay ve analytics
            </Link>
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-5 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-background-alt"
            >
              Ve danh sach de
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (isSubmitted && result) {
    return (
      <main className="min-h-[100dvh] bg-background px-4 py-6 text-text-primary sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Link
                href="/"
                aria-label="Ve trang chu"
                className="group inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Logo className="h-10 w-10 transition-transform group-hover:scale-105" />
                <span className="text-sm font-semibold text-text-primary group-hover:text-primary">
                  ManMath
                </span>
              </Link>
              <p className="mt-6 text-sm font-semibold text-primary">
                Luyen theo chuyen de
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-bold tracking-tight text-text-primary">
                {formatTopicTitle(practice)}
              </h1>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Bai luyen nay duoc cham diem local tren frontend va khong luu vao lich su lam bai.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-hover"
              >
                Luyen lai chuyen de
              </button>
              <Link
                href="/analytics"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-background-alt"
              >
                Quay ve analytics
              </Link>
            </div>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border border-t-[3px] border-t-primary bg-surface p-5 shadow-card">
              <p className="text-xs font-semibold text-text-secondary">Diem</p>
              <p className="mt-2 text-3xl font-bold text-primary">{result.score}</p>
            </div>
            <div className="rounded-xl border border-border border-t-[3px] border-t-success bg-surface p-5 shadow-card">
              <p className="text-xs font-semibold text-text-secondary">So cau dung</p>
              <p className="mt-2 text-3xl font-bold text-success">
                {result.correctCount}/{result.totalQuestions}
              </p>
            </div>
            <div className="rounded-xl border border-border border-t-[3px] border-t-accent bg-surface p-5 shadow-card">
              <p className="text-xs font-semibold text-text-secondary">Da tra loi</p>
              <p className="mt-2 text-3xl font-bold text-accent">
                {result.answeredCount}/{result.totalQuestions}
              </p>
            </div>
            <div className="rounded-xl border border-border border-t-[3px] border-t-warning bg-surface p-5 shadow-card">
              <p className="text-xs font-semibold text-text-secondary">Chuyen de</p>
              <p className="mt-2 text-lg font-bold text-warning">
                {practice.topic.name}
              </p>
            </div>
          </section>

          <section className="space-y-6">
            {reviewItems.map((item) => (
              <article
                key={item.question.id}
                className="rounded-xl border border-border bg-surface shadow-card"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary">
                      {item.index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        Cau {item.index + 1}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-text-secondary">
                        {item.question.subtopic?.name ?? practice.topic.name}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      item.isCorrect
                        ? 'border border-success-border bg-success-light text-success'
                        : 'border border-error-border bg-error-light text-error'
                    }`}
                  >
                    {item.isCorrect ? 'Dung' : 'Can xem lai'}
                  </span>
                </div>

                <div className="px-5 py-6 sm:px-7 sm:py-7">
                  <MathText
                    as="p"
                    text={item.question.question}
                    className="max-w-3xl text-base leading-8 text-text-primary sm:text-lg sm:leading-9"
                  />

                  <QuestionImage
                    imageUrl={item.question.imageUrl}
                    alt={`Hinh minh hoa cau ${item.index + 1}`}
                    className="mt-5"
                  />

                  <div className="mt-6 space-y-3">
                    {item.question.options.map((choice, optionIndex) => {
                      const optionLabel = String.fromCharCode(65 + optionIndex);
                      const isSelected = item.selectedOptionIndex === optionIndex;
                      const isCorrectOption = item.correctOptionIndex === optionIndex;
                      const optionImageUrl =
                        item.question.optionImageUrls?.[optionIndex] ?? null;

                      let optionClass =
                        'border-border bg-background text-text-primary';

                      if (isCorrectOption) {
                        optionClass =
                          'border-success-border bg-success-light text-text-primary';
                      } else if (isSelected && !item.isCorrect) {
                        optionClass =
                          'border-error-border bg-error-light text-text-primary';
                      }

                      return (
                        <div
                          key={`${item.question.id}-${optionIndex}`}
                          className={`rounded-xl border p-4 ${optionClass}`}
                        >
                          <div className="flex items-start gap-4">
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold ${
                                isCorrectOption
                                  ? 'border-success bg-success text-white'
                                  : isSelected && !item.isCorrect
                                    ? 'border-error bg-error text-white'
                                    : 'border-border bg-surface text-text-secondary'
                              }`}
                            >
                              {optionLabel}
                            </span>

                            <div className="min-w-0 flex-1">
                              <MathText text={choice} className="pt-1 text-base leading-7" />
                              <OptionImage
                                imageUrl={optionImageUrl}
                                alt={`Hinh minh hoa dap an ${optionLabel}`}
                                className="mt-2"
                              />

                              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                                {isSelected ? (
                                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-primary">
                                    Ban da chon
                                  </span>
                                ) : null}
                                {isCorrectOption ? (
                                  <span className="rounded-full border border-success-border bg-success-light px-2.5 py-1 text-success">
                                    Dap an dung
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background text-text-primary">
      {showSubmitConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-card">
            <h2 className="font-[family-name:var(--font-outfit)] text-lg font-bold text-text-primary">
              Xac nhan nop bai luyen
            </h2>
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              Ban da hoan thanh{' '}
              <span className="font-semibold text-text-primary">
                {Object.keys(answers).length}/{practice.questions.length}
              </span>{' '}
              cau. Nop bai ngay bay gio de xem ket qua local?
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse sm:justify-start">
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-hover"
              >
                Nop bai
              </button>
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-5 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-background-alt"
              >
                Tiep tuc lam
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ExamHeader
        examTitle={formatTopicTitle(practice)}
        questionCount={practice.questions.length}
        remainingSeconds={remainingSeconds}
        isTimeUp={isTimeUp}
        onSubmit={() => setShowSubmitConfirm(true)}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-xl border border-border bg-surface px-5 py-4 shadow-card">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Luyen theo chuyen de</p>
              <h2 className="mt-1 font-[family-name:var(--font-outfit)] text-xl font-bold text-text-primary">
                {practice.topic.name}
              </h2>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Bai luyen nay duoc cham diem local va khong luu vao lich su lam bai.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/analytics"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-background-alt"
              >
                Quay ve analytics
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <QuestionList
            questions={practice.questions}
            answers={answers}
            isTimeUp={isTimeUp}
            onSelectAnswer={handleSelectAnswer}
          />
          <ExamSidebar
            questions={practice.questions}
            answers={answers}
            isTimeUp={isTimeUp}
            onQuestionClick={handleQuestionNavigate}
            currentQuestionId={currentQuestionId}
          />
        </div>
      </main>
    </div>
  );
}
