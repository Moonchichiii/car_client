// src/features/account/api.ts
import apiClient from '@/api/client';

// Define proper types for API calls
export interface UserProfileData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  date_of_birth?: string;
  country?: string;
  address_line1?: string;
  address_line2?: string | null;
  city?: string;
  postal_code?: string;
  drivers_license_number?: string;
  drivers_license_expiry?: string;
  marketing_emails?: boolean;
}

export interface PasswordChangeData {
  old_password: string;
  new_password1: string;
  new_password2: string;
}

export interface EmailChangeData {
  email: string;
  current_password: string;
}

export interface MarketingPreferences {
  marketing_emails: boolean;
}

export const accountApi = {
  // Profile functions - Fix path to include /api prefix
  updateProfile: (data: Partial<UserProfileData>) =>
    apiClient.patch('/auth/profile/', data),
 
  // Password management
  changePassword: (data: PasswordChangeData) =>
    apiClient.post('/auth/password/change/', data),
 
  resetPassword: (email: string) =>
    apiClient.post('/api/auth/password/reset/', { email }),
 
  // Email management - Fix path to include /api prefix
  changeEmail: (data: EmailChangeData) =>
    apiClient.patch('/auth/profile/', data),
 
  // Account management
  deleteAccount: (password: string) =>
    apiClient.post('/auth/delete-account/', { password }),
 
  // Verification
  sendEmailVerification: () =>
    apiClient.post('/auth/registration/resend-email/'),
 
  verifyEmail: (key: string) =>
    apiClient.post('/auth/registration/verify-email/', { key }),
 
  // For a custom implementation, you could add phone verification
  sendPhoneVerification: (phone: string) =>
    apiClient.post('/auth/phone/send-verification/', { phone }),
 
  verifyPhone: (code: string) =>
    apiClient.post('/auth/phone/verify/', { code }),
 
  // Update marketing preferences - Fix path to include /api prefix
  updatePreferences: (preferences: MarketingPreferences) =>
    apiClient.patch('/auth/profile/', preferences),
};