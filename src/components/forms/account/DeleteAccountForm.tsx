import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAccount } from '@/features/account/hooks';

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required to delete your account'),
  confirmation: z.literal('delete my account', {
    errorMap: () => ({ message: 'Please type "delete my account" to confirm' }),
  }),
});

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;

interface DeleteAccountFormProps {
  onCancel?: () => void;
}

const DeleteAccountForm: React.FC<DeleteAccountFormProps> = ({ onCancel }) => {
  const { deleteAccount, isDeletingAccount } = useAccount();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
  });

  const onSubmit = (data: DeleteAccountFormData) => {
    deleteAccount(data.password);
  };

  return (
    <div className="p-4 bg-red-900 bg-opacity-20 rounded-lg border border-red-500">
      <h3 className="text-lg font-medium text-red-400 mb-4">Delete Account</h3>
      <p className="text-gray-300 mb-4">
        This action cannot be undone. All your personal data will be permanently removed.
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Enter your password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-400" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirmation" className="block text-sm font-medium text-gray-300 mb-1">
            Type "delete my account" to confirm
          </label>
          <input
            id="confirmation"
            type="text"
            className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            {...register('confirmation')}
          />
          {errors.confirmation && (
            <p className="mt-1 text-sm text-red-400" role="alert">
              {errors.confirmation.message}
            </p>
          )}
        </div>

        <div className="flex space-x-3 pt-3">
          <button
            type="submit"
            disabled={isDeletingAccount}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isDeletingAccount ? 'Deleting...' : 'Delete My Account'}
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
    </div>
  );
};

export default DeleteAccountForm;