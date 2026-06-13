'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { IS_GOOGLE_AUTH_CONFIGURED } from '../../config/auth';
import {
  getCurrentUser,
  loginWithGoogleCredential,
  type AuthUser,
} from '../../lib/authApi';
import { clearAuthToken, getAuthToken, setAuthToken } from '../../lib/authStorage';

export function AuthButton() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      return;
    }

    let isMounted = true;

    const loadCurrentUser = async () => {
      try {
        setIsLoading(true);
        const currentUser = await getCurrentUser();

        if (isMounted) {
          setUser(currentUser);
          setErrorMessage(null);
        }
      } catch {
        if (isMounted) {
          clearAuthToken();
          setUser(null);
          setErrorMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    const credential = credentialResponse.credential;

    if (!credential) {
      setErrorMessage('Đăng nhập thất bại. Vui lòng thử lại.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const loginResult = await loginWithGoogleCredential(credential);
      setAuthToken(loginResult.token);
      setUser(loginResult.user);
    } catch {
      setErrorMessage('Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    setUser(null);
    setErrorMessage(null);
  };

  if (user) {
    return (
      <div className="w-full rounded-xl border border-border bg-surface p-4 shadow-card">
        <div className="flex items-center gap-3">
          <Link href="/profile" className="shrink-0 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="h-10 w-10 rounded-full border border-border object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
                {(user.fullName ?? user.email).charAt(0).toUpperCase()}
              </span>
            )}
          </Link>

          <div className="min-w-0 flex-1">
            <Link href="/profile" className="block truncate text-sm font-semibold text-text-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
              {user.fullName ?? user.email}
            </Link>
            <p className="truncate text-xs text-text-secondary">{user.email}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Đăng xuất"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-error-light hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-border bg-surface p-5 shadow-card text-center flex flex-col items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-text-primary">Đăng nhập để đồng bộ</p>
      
      <div className="w-full mt-1">
        {IS_GOOGLE_AUTH_CONFIGURED ? (
          isLoading ? (
            <button
              type="button"
              disabled
              className="inline-flex w-full h-10 cursor-wait items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-semibold text-text-secondary"
            >
              Đang tải...
            </button>
          ) : (
            <div style={{ colorScheme: 'light' }} className="flex justify-center">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => setErrorMessage('Đăng nhập thất bại. Vui lòng thử lại.')}
                shape="rectangular"
                size="large"
                text="signin_with"
                width="240"
              />
            </div>
          )
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex w-full h-10 cursor-not-allowed items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-semibold text-text-muted"
          >
            Chưa cấu hình Google Auth
          </button>
        )}
      </div>

      {errorMessage && (
        <p className="max-w-[240px] text-xs font-medium text-error mt-2">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
