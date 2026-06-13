'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Logo } from '../exam/Logo';
import {
  fetchProtectedJson,
  getCurrentUser,
  isUnauthorizedError,
  type AuthUser,
} from '../../lib/authApi';
import { clearAuthToken, subscribeAuthTokenChange } from '../../lib/authStorage';
import type { TopicStatDto } from '../exam/types';

type RecommendationWeakTopic = {
  topicId: string | null;
  topicName: string;
  topicSlug: string | null;
  correct: number;
  total: number;
  accuracy: number;
  reason: string;
};

type RecommendedExam = {
  examId: string;
  title: string;
  durationMinutes: number;
  matchedWeakTopicCount: number;
  matchedWeakQuestionCount: number;
  reason: string;
};

type TopicStatsResponse = {
  topicStats: TopicStatDto[];
};

type RecommendationsResponse = {
  weakTopics: RecommendationWeakTopic[];
  recommendedExams: RecommendedExam[];
};

type AnalyticsStatus = 'loading' | 'unauthorized' | 'ready' | 'error';

const MAX_VISIBLE_TOPICS = 5;

const clampAccuracy = (accuracy: number): number => {
  return Math.min(Math.max(accuracy, 0), 100);
};

const sortWeakTopics = (topicStats: TopicStatDto[]): TopicStatDto[] => {
  return [...topicStats]
    .filter((topic) => topic.total > 0)
    .sort((a, b) => {
      if (a.accuracy !== b.accuracy) {
        return a.accuracy - b.accuracy;
      }

      if (a.total !== b.total) {
        return b.total - a.total;
      }

      return a.topicName.localeCompare(b.topicName, 'vi');
    })
    .slice(0, MAX_VISIBLE_TOPICS);
};

const sortStrongTopics = (topicStats: TopicStatDto[]): TopicStatDto[] => {
  return [...topicStats]
    .filter((topic) => topic.total > 0)
    .sort((a, b) => {
      if (a.accuracy !== b.accuracy) {
        return b.accuracy - a.accuracy;
      }

      if (a.total !== b.total) {
        return b.total - a.total;
      }

      return a.topicName.localeCompare(b.topicName, 'vi');
    })
    .slice(0, MAX_VISIBLE_TOPICS);
};

export function AnalyticsClient() {
  const [status, setStatus] = useState<AnalyticsStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [topicStats, setTopicStats] = useState<TopicStatDto[]>([]);
  const [recommendedExams, setRecommendedExams] = useState<RecommendedExam[]>([]);
  const [recommendationWeakTopics, setRecommendationWeakTopics] = useState<
    RecommendationWeakTopic[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAnalytics = async () => {
      try {
        setStatus('loading');
        setErrorMessage(null);

        const currentUser = await getCurrentUser();

        if (!isMounted) {
          return;
        }

        if (!currentUser) {
          setUser(null);
          setTopicStats([]);
          setRecommendedExams([]);
          setRecommendationWeakTopics([]);
          setStatus('unauthorized');
          return;
        }

        setUser(currentUser);

        const topicStatsPromise =
          fetchProtectedJson<TopicStatsResponse>('/api/me/topic-stats');
        const recommendationPromise =
          fetchProtectedJson<RecommendationsResponse>('/api/me/recommendations');

        const [topicStatsResult, recommendationResult] = await Promise.allSettled([
          topicStatsPromise,
          recommendationPromise,
        ]);

        if (!isMounted) {
          return;
        }

        if (
          topicStatsResult.status === 'rejected' &&
          isUnauthorizedError(topicStatsResult.reason)
        ) {
          setUser(null);
          setTopicStats([]);
          setRecommendedExams([]);
          setRecommendationWeakTopics([]);
          setStatus('unauthorized');
          return;
        }

        if (topicStatsResult.status === 'rejected') {
          throw topicStatsResult.reason;
        }

        const nextTopicStats = Array.isArray(topicStatsResult.value.topicStats)
          ? topicStatsResult.value.topicStats
          : [];

        setTopicStats(nextTopicStats);

        if (recommendationResult.status === 'fulfilled') {
          setRecommendedExams(
            Array.isArray(recommendationResult.value.recommendedExams)
              ? recommendationResult.value.recommendedExams
              : [],
          );
          setRecommendationWeakTopics(
            Array.isArray(recommendationResult.value.weakTopics)
              ? recommendationResult.value.weakTopics
              : [],
          );
        } else if (
          isUnauthorizedError(recommendationResult.reason)
        ) {
          setUser(null);
          setTopicStats([]);
          setRecommendedExams([]);
          setRecommendationWeakTopics([]);
          setStatus('unauthorized');
          return;
        } else {
          setRecommendedExams([]);
          setRecommendationWeakTopics([]);
        }

        setStatus('ready');
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        if (isUnauthorizedError(error)) {
          setUser(null);
          setTopicStats([]);
          setRecommendedExams([]);
          setRecommendationWeakTopics([]);
          setStatus('unauthorized');
          setErrorMessage(null);
          return;
        }

        setErrorMessage('Không tải được phân tích học tập. Hãy thử lại sau.');
        setStatus('error');
      }
    };

    void loadAnalytics();
    const unsubscribeAuthTokenChange = subscribeAuthTokenChange(() => {
      void loadAnalytics();
    });

    return () => {
      isMounted = false;
      unsubscribeAuthTokenChange();
    };
  }, []);

  const practicedTopicCount = topicStats.filter((topic) => topic.total > 0).length;
  const totalCorrect = topicStats.reduce((sum, topic) => sum + topic.correct, 0);
  const totalAnswered = topicStats.reduce((sum, topic) => sum + topic.total, 0);
  const averageAccuracy =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const weakTopics = useMemo(() => {
    if (recommendationWeakTopics.length > 0) {
      return recommendationWeakTopics.slice(0, MAX_VISIBLE_TOPICS);
    }

    return sortWeakTopics(topicStats).map((topic) => ({
      ...topic,
      reason: 'Đây là một trong những chuyên đề có tỷ lệ đúng thấp hơn của bạn.',
    }));
  }, [recommendationWeakTopics, topicStats]);

  const strongTopics = useMemo(() => sortStrongTopics(topicStats), [topicStats]);

  const hasAnalyticsData =
    topicStats.some((topic) => topic.total > 0) || recommendedExams.length > 0;

  const handleLogout = () => {
    clearAuthToken();
    setUser(null);
    setTopicStats([]);
    setRecommendedExams([]);
    setRecommendationWeakTopics([]);
    setStatus('unauthorized');
    setErrorMessage(null);
  };

  return (
    <main className="min-h-[100dvh] bg-background px-4 py-6 text-text-primary sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl animate-fade-in flex-col gap-6">
        <header className="flex flex-col gap-5 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              aria-label="Về trang chủ"
              className="group inline-flex cursor-pointer items-center gap-3 rounded-lg text-sm font-semibold text-text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Logo className="h-9 w-9 transition-transform group-hover:scale-105" />
              <span className="transition-colors group-hover:text-primary">
                ManMath
              </span>
            </Link>

            <p className="mt-6 text-sm font-semibold text-primary">Analytics</p>
            <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-bold tracking-tight text-text-primary">
              Phân tích học tập
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              Theo dõi các chuyên đề bạn đang mạnh, đang yếu và chọn đề tiếp theo
              phù hợp hơn với tiến độ hiện tại.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-background-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Quay về danh sách đề
            </Link>

            {status === 'ready' && user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-background-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Đăng xuất
              </button>
            ) : null}
          </div>
        </header>

        {status === 'loading' && (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-border bg-surface p-5 shadow-card"
                >
                  <div className="h-4 w-24 animate-pulse rounded bg-background-alt" />
                  <div className="mt-3 h-8 w-20 animate-pulse rounded bg-background-alt" />
                </div>
              ))}
            </section>
            <div className="grid gap-6 lg:grid-cols-2">
              {[0, 1].map((item) => (
                <section
                  key={item}
                  className="rounded-xl border border-border bg-surface p-5 shadow-card"
                >
                  <div className="h-5 w-40 animate-pulse rounded bg-background-alt" />
                  <div className="mt-4 space-y-3">
                    {[0, 1, 2].map((line) => (
                      <div key={line} className="rounded-lg bg-background p-3">
                        <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
                        <div className="mt-2 h-2 animate-pulse rounded-full bg-slate-100" />
                        <div className="mt-2 h-3 w-full animate-pulse rounded bg-slate-100" />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}

        {status === 'unauthorized' && (
          <section className="rounded-xl border border-border bg-surface p-8 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7 10V7a5 5 0 0 1 10 0v3M6.5 10h11A1.5 1.5 0 0 1 19 11.5v7A1.5 1.5 0 0 1 17.5 20h-11A1.5 1.5 0 0 1 5 18.5v-7A1.5 1.5 0 0 1 6.5 10Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="mt-5 font-[family-name:var(--font-outfit)] text-xl font-bold text-text-primary">
              Bạn cần đăng nhập để xem phân tích học tập.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
              Hãy đăng nhập bằng Google ở trang danh sách đề để xem chuyên đề mạnh,
              chuyên đề yếu và các đề phù hợp tiếp theo.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Quay về danh sách đề
            </Link>
          </section>
        )}

        {status === 'error' && (
          <section className="rounded-xl border border-error-border bg-surface p-6 shadow-card">
            <h2 className="font-[family-name:var(--font-outfit)] text-lg font-bold text-error">
              Không tải được analytics
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {errorMessage}
            </p>
          </section>
        )}

        {status === 'ready' && (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border border-t-[3px] border-t-primary bg-surface p-5 shadow-card">
                <p className="text-xs font-semibold text-text-secondary">
                  Tài khoản
                </p>
                <p className="mt-2 truncate text-lg font-bold text-text-primary">
                  {user?.fullName ?? user?.email ?? 'Người dùng'}
                </p>
              </div>
              <div className="rounded-xl border border-border border-t-[3px] border-t-primary bg-surface p-5 shadow-card">
                <p className="text-xs font-semibold text-text-secondary">
                  Chuyên đề đã làm
                </p>
                <p className="mt-2 text-3xl font-bold text-primary">
                  {practicedTopicCount}
                </p>
              </div>
              <div className="rounded-xl border border-border border-t-[3px] border-t-success bg-surface p-5 shadow-card">
                <p className="text-xs font-semibold text-text-secondary">
                  Accuracy trung bình
                </p>
                <p className="mt-2 text-3xl font-bold text-success">
                  {averageAccuracy}%
                </p>
              </div>
              <div className="rounded-xl border border-border border-t-[3px] border-t-accent bg-surface p-5 shadow-card">
                <p className="text-xs font-semibold text-text-secondary">
                  Đề gợi ý
                </p>
                <p className="mt-2 text-3xl font-bold text-accent">
                  {recommendedExams.length}
                </p>
              </div>
            </section>

            {!hasAnalyticsData && (
              <section className="rounded-xl border border-border bg-surface p-8 text-center shadow-card">
                <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-text-primary">
                  Chưa có đủ dữ liệu
                </h2>
                <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                  Hãy làm một đề để bắt đầu phân tích. Khi đã có dữ liệu, ManMath sẽ
                  hiển thị chuyên đề mạnh, chuyên đề yếu và gợi ý đề nên làm tiếp.
                </p>
              </section>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-xl border border-border bg-surface p-5 shadow-card">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-text-primary">
                      Chuyên đề yếu
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary">
                      Những chuyên đề nên ưu tiên ôn lại trước.
                    </p>
                  </div>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-text-secondary">
                    Top {weakTopics.length}
                  </span>
                </div>

                {weakTopics.length === 0 ? (
                  <p className="mt-4 text-sm leading-6 text-text-secondary">
                    Chưa có chuyên đề yếu rõ ràng để hiển thị.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {weakTopics.map((topic) => {
                      const accuracy = clampAccuracy(topic.accuracy);

                      return (
                        <div
                          key={topic.topicId ?? topic.topicName}
                          className="rounded-lg border border-border bg-background p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-text-primary">
                                {topic.topicName}
                              </p>
                              <p className="mt-1 text-xs text-text-secondary">
                                {topic.correct}/{topic.total} câu đúng
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-text-secondary">
                              {accuracy}%
                            </span>
                          </div>

                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-background-alt">
                            <div
                              className="h-full rounded-full bg-warning"
                              style={{ width: `${accuracy}%` }}
                            />
                          </div>

                          {'reason' in topic ? (
                            <p className="mt-3 text-xs leading-5 text-text-secondary">
                              {topic.reason}
                            </p>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="rounded-xl border border-border bg-surface p-5 shadow-card">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-text-primary">
                      Chuyên đề mạnh
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary">
                      Các nhóm kiến thức bạn đang làm tốt hơn.
                    </p>
                  </div>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-text-secondary">
                    Top {strongTopics.length}
                  </span>
                </div>

                {strongTopics.length === 0 ? (
                  <p className="mt-4 text-sm leading-6 text-text-secondary">
                    Chưa có đủ dữ liệu để xác định chuyên đề mạnh.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {strongTopics.map((topic) => {
                      const accuracy = clampAccuracy(topic.accuracy);

                      return (
                        <div
                          key={topic.topicId ?? topic.topicName}
                          className="rounded-lg border border-border bg-background p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-text-primary">
                                {topic.topicName}
                              </p>
                              <p className="mt-1 text-xs text-text-secondary">
                                {topic.correct}/{topic.total} câu đúng
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-text-secondary">
                              {accuracy}%
                            </span>
                          </div>

                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-background-alt">
                            <div
                              className="h-full rounded-full bg-success"
                              style={{ width: `${accuracy}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            <section className="rounded-xl border border-border bg-surface p-5 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-text-primary">
                    Đề nên làm tiếp
                  </h2>
                  <p className="mt-1 text-sm text-text-secondary">
                    Chọn nhanh một đề phù hợp với các chuyên đề bạn cần cải thiện.
                  </p>
                </div>
                <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-text-secondary">
                  {recommendedExams.length} đề
                </span>
              </div>

              {recommendedExams.length === 0 ? (
                <p className="mt-4 text-sm leading-6 text-text-secondary">
                  Chưa có đề gợi ý riêng cho bạn. Hãy tiếp tục làm bài để hệ thống có
                  thêm dữ liệu.
                </p>
              ) : (
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {recommendedExams.map((exam) => (
                    <Link
                      key={exam.examId}
                      href={`/exam/${exam.examId}`}
                      className="rounded-lg border border-border bg-background p-4 transition-colors duration-200 hover:border-primary/30 hover:bg-primary-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <p className="line-clamp-2 text-sm font-semibold leading-5 text-text-primary">
                        {exam.title}
                      </p>
                      <p className="mt-2 text-xs text-text-secondary">
                        {exam.durationMinutes} phút
                        {exam.matchedWeakQuestionCount > 0
                          ? ` · ${exam.matchedWeakQuestionCount} câu bám topic yếu`
                          : ''}
                      </p>
                      <p className="mt-3 text-xs leading-5 text-text-secondary">
                        {exam.reason}
                      </p>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-background-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Quay về danh sách đề
                </Link>
                {recommendedExams[0] ? (
                  <Link
                    href={`/exam/${recommendedExams[0].examId}`}
                    className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Làm đề được gợi ý
                  </Link>
                ) : null}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
