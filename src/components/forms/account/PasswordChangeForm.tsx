import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAccount } from '@/features/account/hooks';

const passwordSchema = z
  .object({
    old_password: z.string().min(1, 'Current password is required'),
    new_password1: z.string().min(8, 'Password must be at least 8 characters'),
    new_password2: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.new_password1 === data.new_password2, {
    message: 'Passwords do not match',
    path: ['new_password2'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

interface PasswordChangeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ onSuccess, onCancel }) => {
  const { changePassword, isChangingPassword } = useAccount();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data: PasswordFormData) => {
    changePassword(data, {
      onSuccess: () => {
        reset();
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="old_password" className="block text-sm font-medium text-gray-300 mb-1">
          Current Password
        </label>
        <input
          id="old_password"
          type="password"
          className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('old_password')}
        />
        {errors.old_password && (
          <p className="mt-1 text-sm text-red-400" role="alert">
            {errors.old_password.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="new_password1" className="block text-sm font-medium text-gray-300 mb-1">
          New Password
        </label>
        <input
          id="new_password1"
          type="password"
          className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('new_password1')}
        />
        {errors.new_password1 && (
          <p className="mt-1 text-sm text-red-400" role="alert">
            {errors.new_password1.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="new_password2" className="block text-sm font-medium text-gray-300 mb-1">
          Confirm New Password
        </label>
        <input
          id="new_password2"
          type="password"
          className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('new_password2')}
        />
        {errors.new_password2 && (
          <p className="mt-1 text-sm text-red-400" role="alert">
            {errors.new_password2.message}
          </p>
        )}
      </div>

      <div className="flex space-x-3 pt-3">
        <button
          type="submit"
          disabled={isChangingPassword}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isChangingPassword ? 'Changing...' : 'Change Password'}
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
    </form>
  );
};

export default PasswordChangeForm;
