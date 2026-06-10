import { API_BASE_URL } from '../config/api';
import { getAuthToken } from './authStorage';

export type AuthUser = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
};

export type GoogleLoginResponse = {
  token: string;
  user: AuthUser;
};

export type CurrentUserResponse = {
  user: AuthUser;
};

const readErrorMessage = async (
  response: Response,
  fallback: string,
): Promise<string> => {
  try {
    const data = (await response.json()) as { message?: unknown };

    return typeof data.message === 'string' ? data.message : fallback;
  } catch {
    return fallback;
  }
};

export const loginWithGoogleCredential = async (
  credential: string,
): Promise<GoogleLoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ credential }),
  });

  if (!response.ok) {
    const message = await readErrorMessage(response, 'Google login failed');
    throw new Error(message);
  }

  return response.json() as Promise<GoogleLoginResponse>;
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await readErrorMessage(response, 'Failed to load current user');
    throw new Error(message);
  }

  const data = (await response.json()) as CurrentUserResponse;

  return data.user;
};
