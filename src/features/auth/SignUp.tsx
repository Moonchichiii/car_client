import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { RegisterFormData } from '@/types/auth';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import RegistrationSuccess from '@/components/RegistrationSuccess';

const isAtLeast18YearsOld = (dateString: string): boolean => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 18;
};

const signUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password1: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  password2: z.string().min(1, { message: 'Please confirm your password' }),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  date_of_birth: z.string()
    .refine(val => val.length > 0, { message: 'Date of birth is required' })
    .refine(isAtLeast18YearsOld, { message: 'You must be at least 18 years old to register' }),
  drivers_license_number: z.string().optional(),
  drivers_license_expiry: z.string().optional(),
  accepted_terms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
  accepted_privacy_policy: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the privacy policy' }),
  }),
  marketing_emails: z.boolean().optional(),
}).refine((data) => data.password1 === data.password2, {
  message: 'Passwords do not match',
  path: ['password2'],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isRegistering, isAuthenticated, registerError } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const dateConstraints = useMemo(() => {
    const today = new Date();
    const maxBirthDate = new Date(today);
    maxBirthDate.setFullYear(today.getFullYear() - 18);
    
    const minLicenseExpiryDate = new Date();
    minLicenseExpiryDate.setDate(minLicenseExpiryDate.getDate() + 1);
    
    return {
      maxBirthDate: maxBirthDate.toISOString().split('T')[0],
      minLicenseExpiryDate: minLicenseExpiryDate.toISOString().split('T')[0],
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (registerError) {
      if (registerError instanceof AxiosError && registerError.response?.data) {
        const backendErrors = registerError.response.data;
        if (typeof backendErrors === 'object') {
          const errorMessage = Object.entries(backendErrors)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`)
            .join('; ');
          setApiError(errorMessage);
          toast.error(errorMessage);
        } else {
          const errorMsg = 'Registration failed. Please try again.';
          setApiError(errorMsg);
          toast.error(errorMsg);
        }
      } else {
        const errorMsg = 'An unexpected error occurred';
        setApiError(errorMsg);
        toast.error(errorMsg);
      }
    }
  }, [registerError]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      marketing_emails: false,
    },
  });
 
  
  const onSubmit: SubmitHandler<SignUpFormValues> = useCallback((data) => {
    setApiError(null);

    const formData: RegisterFormData = {
      email: data.email,
      password1: data.password1,
      password2: data.password2,
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      address_line1: data.address_line1,
      address_line2: data.address_line2 || null,
      city: data.city,
      postal_code: data.postal_code,
      country: data.country,
      date_of_birth: data.date_of_birth,
      drivers_license_number: data.drivers_license_number,
      drivers_license_expiry: data.drivers_license_expiry,
      accepted_terms: data.accepted_terms,
      accepted_privacy_policy: data.accepted_privacy_policy,
      marketing_emails: data.marketing_emails,
    };

    registerUser(formData, {
      onSuccess: () => {
        toast.success('Account created successfully!');
        setRegisteredEmail(data.email);
        setRegistrationComplete(true);
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          if (error.response?.data) {
            const backendErrors = error.response.data;
            if (typeof backendErrors === 'object') {
              const errorMessage = Object.entries(backendErrors)
                .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`)
                .join('; ');
              toast.error(errorMessage);
            } else {
              toast.error(String(backendErrors) || 'Registration failed');
            }
          } else {
            toast.error('Registration failed. Please try again.');
          }
        } else {
          toast.error('An unexpected error occurred');
        }
      }
    });
  }, [registerUser]);

  if (registrationComplete) {
    return (
      <RegistrationSuccess
        isVerificationEnabled={false}
        email={registeredEmail}
      />
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <section className="max-w-2xl w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded" role="alert" aria-live="polite">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <fieldset className="border-b border-gray-200 pb-4 mb-4">
            <legend className="text-lg font-medium mb-3">Account Information</legend>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span aria-hidden="true">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('email')}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="password1" className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span aria-hidden="true">*</span>
                </label>
                <input
                  id="password1"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password1 ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('password1')}
                  aria-invalid={errors.password1 ? 'true' : 'false'}
                  aria-describedby={errors.password1 ? 'password1-error' : undefined}
                />
                {errors.password1 && (
                  <p id="password1-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.password1.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password2" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password <span aria-hidden="true">*</span>
                </label>
                <input
                  id="password2"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password2 ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('password2')}
                  aria-invalid={errors.password2 ? 'true' : 'false'}
                  aria-describedby={errors.password2 ? 'password2-error' : undefined}
                />
                {errors.password2 && (
                  <p id="password2-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.password2.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="border-b border-gray-200 pb-4 mb-4">
            <legend className="text-lg font-medium mb-3">Personal Information</legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="first_name"
                  type="text"
                  autoComplete="given-name"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.first_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('first_name')}
                  aria-invalid={errors.first_name ? 'true' : 'false'}
                  aria-describedby={errors.first_name ? 'first_name-error' : undefined}
                />
                {errors.first_name && (
                  <p id="first_name-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="last_name"
                  type="text"
                  autoComplete="family-name"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.last_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('last_name')}
                  aria-invalid={errors.last_name ? 'true' : 'false'}
                  aria-describedby={errors.last_name ? 'last_name-error' : undefined}
                />
                {errors.last_name && (
                  <p id="last_name-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth <span aria-hidden="true">*</span>
              </label>
              <p id="date_of_birth-description" className="mt-1 text-xs text-gray-500">
                You must be at least 18 years old to register
              </p>
              <input
                id="date_of_birth"
                type="date"
                max={dateConstraints.maxBirthDate}
                required
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('date_of_birth')}
                aria-invalid={errors.date_of_birth ? 'true' : 'false'}
                aria-describedby={errors.date_of_birth ? 'date_of_birth-error date_of_birth-description' : 'date_of_birth-description'}
              />
              {errors.date_of_birth && (
                <p id="date_of_birth-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.date_of_birth.message}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone_number"
                type="tel"
                autoComplete="tel"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone_number ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('phone_number')}
                placeholder="+123456789"
                aria-invalid={errors.phone_number ? 'true' : 'false'}
                aria-describedby={errors.phone_number ? 'phone_number-error phone_number-description' : 'phone_number-description'}
              />
              <p id="phone_number-description" className="mt-1 text-xs text-gray-500">
                International format: +123456789
              </p>
              {errors.phone_number && (
                <p id="phone_number-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.phone_number.message}
                </p>
              )}
            </div>
          </fieldset>

          <fieldset className="border-b border-gray-200 pb-4 mb-4">
            <legend className="text-lg font-medium mb-3">Address Information</legend>

            <div>
              <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1
              </label>
              <input
                id="address_line1"
                type="text"
                autoComplete="address-line1"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address_line1 ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('address_line1')}
                aria-invalid={errors.address_line1 ? 'true' : 'false'}
                aria-describedby={errors.address_line1 ? 'address_line1-error' : undefined}
              />
              {errors.address_line1 && (
                <p id="address_line1-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.address_line1.message}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2
              </label>
              <input
                id="address_line2"
                type="text"
                autoComplete="address-line2"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address_line2 ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('address_line2')}
                aria-invalid={errors.address_line2 ? 'true' : 'false'}
                aria-describedby={errors.address_line2 ? 'address_line2-error' : undefined}
              />
              {errors.address_line2 && (
                <p id="address_line2-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.address_line2.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  autoComplete="address-level2"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('city')}
                  aria-invalid={errors.city ? 'true' : 'false'}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                />
                {errors.city && (
                  <p id="city-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  id="postal_code"
                  type="text"
                  autoComplete="postal-code"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.postal_code ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('postal_code')}
                  aria-invalid={errors.postal_code ? 'true' : 'false'}
                  aria-describedby={errors.postal_code ? 'postal_code-error' : undefined}
                />
                {errors.postal_code && (
                  <p id="postal_code-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.postal_code.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  autoComplete="country-name"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.country ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('country')}
                  aria-invalid={errors.country ? 'true' : 'false'}
                  aria-describedby={errors.country ? 'country-error' : undefined}
                />
                {errors.country && (
                  <p id="country-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="border-b border-gray-200 pb-4 mb-4">
            <legend className="text-lg font-medium mb-3">Driver's License Information</legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="drivers_license_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Driver's License Number
                </label>
                <input
                  id="drivers_license_number"
                  type="text"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.drivers_license_number ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('drivers_license_number')}
                  aria-invalid={errors.drivers_license_number ? 'true' : 'false'}
                  aria-describedby={errors.drivers_license_number ? 'drivers_license_number-error' : undefined}
                />
                {errors.drivers_license_number && (
                  <p id="drivers_license_number-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.drivers_license_number.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="drivers_license_expiry" className="block text-sm font-medium text-gray-700 mb-1">
                  License Expiry Date
                </label>
                <input
                  id="drivers_license_expiry"
                  type="date"
                  min={dateConstraints.minLicenseExpiryDate}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.drivers_license_expiry ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('drivers_license_expiry')}
                  aria-invalid={errors.drivers_license_expiry ? 'true' : 'false'}
                  aria-describedby={errors.drivers_license_expiry ? 'drivers_license_expiry-error drivers_license_expiry-description' : 'drivers_license_expiry-description'}
                />
                <p id="drivers_license_expiry-description" className="mt-1 text-xs text-gray-500">
                  Your license must not be expired
                </p>
                {errors.drivers_license_expiry && (
                  <p id="drivers_license_expiry-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.drivers_license_expiry.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="accepted_terms"
                   type="checkbox"
                   className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                   {...register('accepted_terms')}
                   aria-invalid={errors.accepted_terms ? 'true' : 'false'}
                   aria-describedby={errors.accepted_terms ? 'accepted_terms-error' : undefined}
                 />
               </div>
              <div className="ml-3">
                <label htmlFor="accepted_terms" className="text-sm text-gray-700">
                  I accept the <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Terms and Conditions</a> <span aria-hidden="true">*</span>
                </label>
                {errors.accepted_terms && (
                  <p id="accepted_terms-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.accepted_terms.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="accepted_privacy_policy"
                   type="checkbox"
                   className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                   {...register('accepted_privacy_policy')}
                   aria-invalid={errors.accepted_privacy_policy ? 'true' : 'false'}
                   aria-describedby={errors.accepted_privacy_policy ? 'accepted_privacy_policy-error' : undefined}
                 />
               </div>
              <div className="ml-3">
                <label htmlFor="accepted_privacy_policy" className="text-sm text-gray-700">
                  I accept the <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Privacy Policy</a> <span aria-hidden="true">*</span>
                </label>
                {errors.accepted_privacy_policy && (
                  <p id="accepted_privacy_policy-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.accepted_privacy_policy.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="marketing_emails"
                   type="checkbox"
                   className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                   {...register('marketing_emails')}
                   aria-invalid={errors.marketing_emails ? 'true' : 'false'}
                   aria-describedby={errors.marketing_emails ? 'marketing_emails-error' : undefined}
                 />
               </div>
              <div className="ml-3">
                <label htmlFor="marketing_emails" className="text-sm text-gray-700">
                  I would like to receive marketing emails
                </label>
                {errors.marketing_emails && (
                  <p id="marketing_emails-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.marketing_emails.message}
                  </p>
                )}
              </div>
            </div>
          </div>

           <button
             type="submit"
             disabled={isRegistering}
             aria-busy={isRegistering}
             className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
           >
             {isRegistering ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <nav aria-label="Authentication navigation" className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/signin" className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm">
              Sign in
            </a>
          </p>
        </nav>
      </section>
    </main>
  );
};

export default SignUp;