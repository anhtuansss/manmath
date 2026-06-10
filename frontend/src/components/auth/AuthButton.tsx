'use client';

import { useEffect, useState } from 'react';
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
        }
      } catch {
        if (isMounted) {
          clearAuthToken();
          setErrorMessage('Phiên đăng nhập đã hết hạn.');
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
      setErrorMessage('Google không trả về mã đăng nhập.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const loginResult = await loginWithGoogleCredential(credential);
      setAuthToken(loginResult.token);
      setUser(loginResult.user);
    } catch (loginError) {
      setErrorMessage(
        loginError instanceof Error
          ? loginError.message
          : 'Không đăng nhập được bằng Google.',
      );
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
      <div className="flex flex-col items-start gap-2 sm:items-end">
        <div className="inline-flex max-w-full items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 shadow-card">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="h-7 w-7 rounded-full border border-border"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
              {(user.fullName ?? user.email).charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">
              {user.fullName ?? user.email}
            </p>
            <p className="truncate text-xs text-text-secondary">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="ml-1 shrink-0 cursor-pointer rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      {IS_GOOGLE_AUTH_CONFIGURED ? (
        <div style={{ colorScheme: 'light' }}>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => setErrorMessage('Không đăng nhập được bằng Google.')}
            shape="rectangular"
            size="medium"
            text="signin_with"
            width="220"
          />
        </div>
      ) : (
        <button
          type="button"
          disabled
          className="inline-flex h-10 cursor-not-allowed items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-text-muted"
          title="Thiếu NEXT_PUBLIC_GOOGLE_CLIENT_ID"
        >
          Chưa cấu hình Google Login
        </button>
      )}

      {isLoading && (
        <p className="text-xs font-medium text-text-secondary">Đang kiểm tra đăng nhập...</p>
      )}

      {errorMessage && (
        <p className="max-w-[220px] text-xs font-medium text-error">{errorMessage}</p>
      )}
    </div>
  );
}
