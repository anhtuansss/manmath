'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Logo } from '../exam/Logo';
import { UserTopicStatsCard } from '../exam/UserTopicStatsCard';
import {
  getCurrentUser,
  isUnauthorizedError,
  type AuthUser,
} from '../../lib/authApi';
import { clearAuthToken, subscribeAuthTokenChange } from '../../lib/authStorage';

type ProfileStatus = 'loading' | 'unauthorized' | 'ready' | 'error';

export function ProfileClient() {
  const [status, setStatus] = useState<ProfileStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setStatus('loading');
        setErrorMessage(null);

        const currentUser = await getCurrentUser();

        if (!isMounted) {
          return;
        }

        if (!currentUser) {
          setUser(null);
          setStatus('unauthorized');
          return;
        }

        setUser(currentUser);
        setStatus('ready');
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        if (isUnauthorizedError(error)) {
          setUser(null);
          setStatus('unauthorized');
          setErrorMessage(null);
          return;
        }

        setErrorMessage('Không tải được hồ sơ. Hãy thử lại sau.');
        setStatus('error');
      }
    };

    void loadProfile();
    const unsubscribeAuthTokenChange = subscribeAuthTokenChange(() => {
      void loadProfile();
    });

    return () => {
      isMounted = false;
      unsubscribeAuthTokenChange();
    };
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    setUser(null);
    setStatus('unauthorized');
    setErrorMessage(null);
  };

  return (
    <main className="min-h-[100dvh] bg-background px-4 py-6 text-text-primary sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl animate-fade-in flex-col gap-6">
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

            <p className="mt-6 text-sm font-semibold text-primary">Tài khoản</p>
            <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-bold tracking-tight text-text-primary">
              Hồ sơ người dùng
            </h1>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Xem thông tin đăng nhập hiện tại của bạn trên ManMath.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-background-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Quay về danh sách đề
          </Link>
        </header>

        {status === 'loading' && (
          <section className="rounded-xl border border-border bg-surface p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 animate-pulse rounded-full bg-background-alt" />
              <div className="min-w-0 flex-1">
                <div className="h-5 w-40 animate-pulse rounded bg-background-alt" />
                <div className="mt-3 h-4 w-64 max-w-full animate-pulse rounded bg-background-alt" />
              </div>
            </div>
          </section>
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
              Bạn cần đăng nhập để xem hồ sơ.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
              Hãy đăng nhập bằng Google ở trang danh sách đề để xem thông tin tài khoản.
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
              Không tải được hồ sơ
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {errorMessage}
            </p>
          </section>
        )}

        {status === 'ready' && user && (
          <>
            <section className="rounded-xl border border-border bg-surface p-6 shadow-card">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="h-20 w-20 rounded-full border border-border object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-2xl font-bold text-primary">
                    {(user.fullName ?? user.email).charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Đang đăng nhập
                  </p>
                  <h2 className="mt-1 truncate font-[family-name:var(--font-outfit)] text-2xl font-bold text-text-primary">
                    {user.fullName ?? 'Người dùng ManMath'}
                  </h2>
                  <p className="mt-2 truncate text-sm text-text-secondary">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-border bg-background p-4">
                <p className="text-sm font-semibold text-text-primary">
                  Trạng thái đăng nhập
                </p>
                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Tài khoản này đang dùng Google Login và JWT Access Token của ManMath.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Quay về danh sách đề
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface px-5 text-sm font-semibold text-text-primary transition-colors duration-200 hover:bg-background-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Đăng xuất
                </button>
              </div>
            </section>

            <UserTopicStatsCard />
          </>
        )}
      </div>
    </main>
  );
}
