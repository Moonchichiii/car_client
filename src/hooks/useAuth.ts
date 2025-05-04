// src/hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { Nullable, User, LoginCredentials, RegisterFormData } from '@/types/auth';
import apiClient from '@/api/client';
import { AxiosError } from 'axios';

export const USER_QUERY_KEY = ['auth', 'user'];

/** Returns true if we have an "auth" or "refresh" JWT cookie */
function hasAuthToken(): boolean {
  return /(?:^|;\s*)(auth|refresh)=/.test(document.cookie);
}

// GET /auth/user/ → User or null on 401/403
async function fetchCurrentUser(): Promise<Nullable<User>> {
  try {
    const { data } = await apiClient.get<User>('/auth/user/');
    return data;
  } catch (err) {
    if (
      err instanceof AxiosError &&
      (err.response?.status === 401 || err.response?.status === 403)
    ) {
      return null;
    }
    throw err;
  }
}

// POST /auth/login/
async function loginUser(creds: LoginCredentials): Promise<void> {
  await apiClient.post('/auth/login/', creds);
}

// POST /auth/registration/
async function registerUser(data: RegisterFormData): Promise<void> {
  await apiClient.post('/auth/registration/', data);
}

// POST /auth/logout/
async function logoutUser(): Promise<void> {
  await apiClient.post('/auth/logout/');
}

export function useAuth() {
  const qc = useQueryClient();

  // 1) initial fetch (only if token present)
  const {
    data: user,
    isLoading: isUserLoading,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: fetchCurrentUser,
    enabled: hasAuthToken(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // 2) login → refetch
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      refetch();
    },
  });

  // 3) register → refetch
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      refetch();
    },
  });

  // 4) logout → clear cache
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      qc.setQueryData(USER_QUERY_KEY, null);
    },
  });

  // 5) idle‐timer: auto sign out after 10m inactivity
  useEffect(() => {
    if (!user) return;
    const TIMEOUT = 10 * 60 * 1000;
    let timer: ReturnType<typeof setTimeout>;

    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        logoutMutation.mutate();
      }, TIMEOUT);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((e) => window.addEventListener(e, reset));
    reset();

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [user, logoutMutation]);

  return {
    // current user
    user,
    isAuthenticated: Boolean(user),
    isLoading: isUserLoading || loginMutation.isPending || registerMutation.isPending,

    // any fetch error
    fetchError,

    // sign in
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    // sign up
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    // sign out single method
    signOut: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    signOutError: logoutMutation.error,

    // manual refetch (for idle handler or on‐demand)
    refreshUser: refetch,
  };
}
