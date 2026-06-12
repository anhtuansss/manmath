'use client';

import { useEffect, useState } from 'react';
import {
  fetchProtectedJson,
  isUnauthorizedError,
} from '../../lib/authApi';
import { subscribeAuthTokenChange } from '../../lib/authStorage';
import type { TopicStatDto } from './types';

type TopicStatsResponse = {
  topicStats: TopicStatDto[];
};

type TopicStatsStatus =
  | 'loading'
  | 'unauthenticated'
  | 'empty'
  | 'ready'
  | 'error';

const MAX_VISIBLE_TOPICS = 5;

const clampAccuracy = (accuracy: number): number => {
  return Math.min(Math.max(accuracy, 0), 100);
};

export function UserTopicStatsCard() {
  const [status, setStatus] = useState<TopicStatsStatus>('loading');
  const [topicStats, setTopicStats] = useState<TopicStatDto[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchTopicStats = async () => {
      try {
        setStatus('loading');

        const data = await fetchProtectedJson<TopicStatsResponse>(
          '/api/me/topic-stats',
        );
        const nextTopicStats = Array.isArray(data.topicStats)
          ? data.topicStats
          : [];

        if (!isMounted) {
          return;
        }

        setTopicStats(nextTopicStats);
        setStatus(nextTopicStats.length > 0 ? 'ready' : 'empty');
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        if (isUnauthorizedError(error)) {
          setStatus('unauthenticated');
          setTopicStats([]);
          return;
        }

        setStatus('error');
        setTopicStats([]);
      }
    };

    void fetchTopicStats();
    const unsubscribeAuthTokenChange = subscribeAuthTokenChange(() => {
      void fetchTopicStats();
    });

    return () => {
      isMounted = false;
      unsubscribeAuthTokenChange();
    };
  }, []);

  const visibleTopicStats = topicStats.slice(0, MAX_VISIBLE_TOPICS);

  return (
    <section className="rounded-xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center gap-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-primary"
          aria-hidden="true"
        >
          <path
            d="M3 12.5h10M4 10l2.5-2.5 2 1.5L12 4.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.5 4.5H12v.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h2 className="font-[family-name:var(--font-outfit)] text-base font-semibold text-text-primary">
          Chuyên đề cần ôn lại
        </h2>
      </div>

      {status === 'loading' && (
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="animate-pulse rounded-lg bg-background p-3">
              <div className="h-3 w-28 rounded bg-slate-200" />
              <div className="mt-2 h-2 rounded-full bg-slate-100" />
              <div className="mt-2 h-3 w-20 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {status === 'unauthenticated' && (
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          Đăng nhập để xem phân tích chuyên đề.
        </p>
      )}

      {status === 'empty' && (
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          Chưa có dữ liệu chuyên đề. Hãy làm một đề để bắt đầu.
        </p>
      )}

      {status === 'error' && (
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          Chưa tải được phân tích chuyên đề. Hãy thử lại sau.
        </p>
      )}

      {status === 'ready' && (
        <div className="mt-4 space-y-3">
          {visibleTopicStats.map((topicStat) => {
            const accuracy = clampAccuracy(topicStat.accuracy);

            return (
              <div
                key={topicStat.topicId ?? topicStat.topicName}
                className="rounded-lg border border-border bg-background p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text-primary">
                      {topicStat.topicName}
                    </p>
                    <p className="mt-1 text-xs text-text-secondary">
                      {topicStat.correct}/{topicStat.total} câu đúng
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-text-secondary">
                    {accuracy}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-background-alt">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
