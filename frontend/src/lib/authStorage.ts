const AUTH_TOKEN_STORAGE_KEY = 'manmath-auth-token';

const canUseLocalStorage = (): boolean => {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
};

export const getAuthToken = (): string | null => {
  if (!canUseLocalStorage()) {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
};

export const setAuthToken = (token: string): void => {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
};

export const clearAuthToken = (): void => {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
};
