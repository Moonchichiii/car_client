import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { Nullable, User, LoginCredentials, RegisterFormData } from '@/types/auth';
import apiClient from '@/api/client';
import { AxiosError } from 'axios';

export const USER_QUERY_KEY = ['auth', 'user'];

function hasAuthToken(): boolean {
  return /(?:^|;\s*)(auth|refresh)=/.test(document.cookie);
}

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

async function loginUser(creds: LoginCredentials): Promise<void> {
  await apiClient.post('/auth/login/', creds);
}

async function registerUser(data: RegisterFormData): Promise<void> {
  await apiClient.post('/auth/registration/', data);
}

async function logoutUser(): Promise<void> {
  await apiClient.post('/auth/logout/');
}

export function useAuth() {
  const qc = useQueryClient();

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

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      refetch();
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      refetch();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      qc.setQueryData(USER_QUERY_KEY, null);
    },
  });

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
    user,
    isAuthenticated: Boolean(user),
    isLoading: isUserLoading || loginMutation.isPending || registerMutation.isPending,
    fetchError,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    signOut: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    signOutError: logoutMutation.error,
    refreshUser: refetch,
  };
}
