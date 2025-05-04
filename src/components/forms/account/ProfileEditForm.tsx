import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAccount } from '@/features/account/hooks';
import { User } from '@/types/auth';

const profileEditSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters').optional().or(z.literal('')),
  last_name: z.string().min(2, 'Last name must be at least 2 characters').optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
});

type ProfileEditFormData = z.infer<typeof profileEditSchema>;

interface ProfileEditFormProps {
  user: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ 
  user, 
  onSuccess, 
  onCancel 
}) => {
  const { updateProfile, isUpdatingProfile } = useAccount();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isDirty }, 
    reset 
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      country: user.country || '',
    }
  });

  const onSubmit = (data: ProfileEditFormData) => {
    if (!isDirty) {
      onCancel?.();
      return;
    }

    const changedData: Partial<ProfileEditFormData> = {};
    
    if (data.first_name !== user.first_name) changedData.first_name = data.first_name;
    if (data.last_name !== user.last_name) changedData.last_name = data.last_name;
    if (data.country !== user.country) changedData.country = data.country;
    
    if (Object.keys(changedData).length === 0) {
      onCancel?.();
      return;
    }
    
    updateProfile(changedData, {
      onSuccess: () => {
        reset({ ...data });
        if (onSuccess) onSuccess();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-300 mb-1">
            First Name
          </label>
          <input
            id="first_name"
            type="text"
            className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('first_name')}
          />
          {errors.first_name && (
            <p className="mt-1 text-sm text-red-400" role="alert">
              {errors.first_name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-300 mb-1">
            Last Name
          </label>
          <input
            id="last_name"
            type="text"
            className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('last_name')}
          />
          {errors.last_name && (
            <p className="mt-1 text-sm text-red-400" role="alert">
              {errors.last_name.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">
          Country
        </label>
        <input
          id="country"
          type="text"
          className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('country')}
        />
        {errors.country && (
          <p className="mt-1 text-sm text-red-400" role="alert">
            {errors.country.message}
          </p>
        )}
      </div>

      <div className="flex space-x-3 pt-3">
        <button
          type="submit"
          disabled={isUpdatingProfile || !isDirty}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
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
      
      {!isDirty && (
        <p className="text-xs text-gray-400">
          Make changes to update your profile.
        </p>
      )}
    </form>
  );
};

export default ProfileEditForm;