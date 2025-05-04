import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAccount } from '@/features/account/hooks';

const emailChangeSchema = z.object({
  email: z.string().email('Invalid email address'),
  current_password: z.string().min(1, 'Password is required to change email'),
});

type EmailChangeFormData = z.infer<typeof emailChangeSchema>;

interface EmailChangeFormProps {
  currentEmail: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EmailChangeForm: React.FC<EmailChangeFormProps> = ({ 
  currentEmail, 
  onSuccess, 
  onCancel 
}) => {
  const { changeEmail, isChangingEmail } = useAccount();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch 
  } = useForm<EmailChangeFormData>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      email: currentEmail,
    }
  });

  const newEmail = watch('email');
  const emailChanged = newEmail !== currentEmail;

  const onSubmit = (data: EmailChangeFormData) => {
    if (!emailChanged) return;
    
    changeEmail(data, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          New Email Address
        </label>
        <input
          id="email"
          type="email"
          className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('email')}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="current_password" className="block text-sm font-medium text-gray-300 mb-1">
          Current Password
        </label>
        <input
          id="current_password"
          type="password"
          className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('current_password')}
        />
        {errors.current_password && (
          <p className="mt-1 text-sm text-red-400" role="alert">
            {errors.current_password.message}
          </p>
        )}
      </div>

      <div className="flex space-x-3 pt-3">
        <button
          type="submit"
          disabled={isChangingEmail || !emailChanged}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isChangingEmail ? 'Changing...' : 'Change Email'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        )}
      </div>
      
      {!emailChanged && (
        <p className="text-xs text-gray-400">
          Enter a different email address to make changes.
        </p>
      )}
    </form>
  );
};

export default EmailChangeForm;