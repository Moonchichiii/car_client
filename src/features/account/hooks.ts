import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { accountApi } from './api';
import { USER_QUERY_KEY } from '@/hooks/useAuth';

export const useAccount = () => {
  const queryClient = useQueryClient();

  // Change password mutation
  const passwordChangeMutation = useMutation({
    mutationFn: accountApi.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      if (error.response?.data) {
        const backendErrors = error.response.data;
        if (typeof backendErrors === 'object') {
          Object.entries(backendErrors).forEach(([key, value]) => {
            const message = Array.isArray(value) ? value.join(', ') : String(value);
            toast.error(`${key}: ${message}`);
          });
        } else {
          toast.error(backendErrors.toString());
        }
      } else {
        toast.error('Password change failed');
      }
    },
  });

  // Email change mutation
  const emailChangeMutation = useMutation({
    mutationFn: accountApi.changeEmail,
    onSuccess: (_data) => {
      toast.success('Email changed successfully');
      // Update the user data in the cache
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
    onError: (error: any) => {
      if (error.response?.data) {
        const backendErrors = error.response.data;
        if (typeof backendErrors === 'object') {
          Object.entries(backendErrors).forEach(([key, value]) => {
            const message = Array.isArray(value) ? value.join(', ') : String(value);
            toast.error(`${key}: ${message}`);
          });
        } else {
          toast.error(backendErrors.toString());
        }
      } else {
        toast.error('Email change failed');
      }
    },
  });

  // Profile update mutation
  const profileUpdateMutation = useMutation({
    mutationFn: accountApi.updateProfile,
    onSuccess: (_data) => {
      toast.success('Profile updated successfully');
      // Update the user data in the cache
      queryClient.setQueryData(USER_QUERY_KEY, _data);
    },
    onError: (error: any) => {
      if (error.response?.data) {
        const backendErrors = error.response.data;
        if (typeof backendErrors === 'object') {
          Object.entries(backendErrors).forEach(([key, value]) => {
            const message = Array.isArray(value) ? value.join(', ') : String(value);
            toast.error(`${key}: ${message}`);
          });
        } else {
          toast.error(backendErrors.toString());
        }
      } else {
        toast.error('Profile update failed');
      }
    },
  });

  // Account deletion mutation
  const deleteAccountMutation = useMutation({
    mutationFn: accountApi.deleteAccount,
    onSuccess: () => {
      toast.success('Account deleted successfully');
      // Clear user data from cache
      queryClient.setQueryData(USER_QUERY_KEY, null);
      // Redirect to home
      window.location.href = '/';
    },
    onError: (error: any) => {
      if (error.response?.data) {
        const backendErrors = error.response.data;
        if (typeof backendErrors === 'object') {
          Object.entries(backendErrors).forEach(([key, value]) => {
            const message = Array.isArray(value) ? value.join(', ') : String(value);
            toast.error(`${key}: ${message}`);
          });
        } else {
          toast.error(backendErrors.toString());
        }
      } else {
        toast.error('Account deletion failed');
      }
    },
  });

  // Email verification mutation
  const sendVerificationEmailMutation = useMutation({
    mutationFn: accountApi.sendEmailVerification,
    onSuccess: () => {
      toast.success('Verification email sent. Please check your inbox.');
    },
    onError: () => {
      toast.error('Failed to send verification email. Please try again later.');
    },
  });

  // Phone verification mutation
  const sendPhoneVerificationMutation = useMutation({
    mutationFn: accountApi.sendPhoneVerification,
    onSuccess: () => {
      toast.success('Verification code sent to your phone.');
    },
    onError: () => {
      toast.error('Failed to send verification code. Please try again later.');
    },
  });

  // Marketing preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: accountApi.updatePreferences,
    onSuccess: () => {
      toast.success('Preferences updated successfully');
      // Invalidate user query to refetch with updated preferences
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
    onError: () => {
      toast.error('Failed to update preferences');
    },
  });

  return {
    // Mutations
    changePassword: passwordChangeMutation.mutate,
    isChangingPassword: passwordChangeMutation.isPending,

    changeEmail: emailChangeMutation.mutate,
    isChangingEmail: emailChangeMutation.isPending,

    updateProfile: profileUpdateMutation.mutate,
    isUpdatingProfile: profileUpdateMutation.isPending,

    deleteAccount: deleteAccountMutation.mutate,
    isDeletingAccount: deleteAccountMutation.isPending,

    sendVerificationEmail: sendVerificationEmailMutation.mutate,
    isSendingVerificationEmail: sendVerificationEmailMutation.isPending,

    sendPhoneVerification: sendPhoneVerificationMutation.mutate,
    isSendingPhoneVerification: sendPhoneVerificationMutation.isPending,

    updatePreferences: updatePreferencesMutation.mutate,
    isUpdatingPreferences: updatePreferencesMutation.isPending,
  };
};
