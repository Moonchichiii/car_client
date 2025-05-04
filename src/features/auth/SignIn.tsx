import { useState, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { LoginCredentials } from '@/types/auth';

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

interface ApiErrorResponse {
  detail?: string;
  [key: string]: unknown;
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoggingIn, isAuthenticated } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleErrorResponse = useCallback((error: unknown): string => {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      
      // Handle specific status codes
      if (status === 401) {
        return 'Invalid email or password';
      }
      
      // Handle detailed error messages
      if (error.response?.data) {
        const errorData = error.response.data as ApiErrorResponse;
        
        if (typeof errorData === 'string') {
          return errorData;
        }
        
        if (errorData.detail) {
          return errorData.detail;
        }
        
        // Handle multiple field errors
        if (typeof errorData === 'object') {
          return Object.entries(errorData)
            .filter(([key]) => key !== 'detail')
            .map(([key, value]) => 
              `${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`
            )
            .join('; ') || 'An error occurred during sign in';
        }
      }
    }
    
    return 'An unexpected error occurred';
  }, []);

  const onSubmit: SubmitHandler<SignInFormValues> = useCallback(async (data) => {
    try {
      setApiError(null);
      
      const credentials: LoginCredentials = {
        email: data.email,
        password: data.password,
      };

      login(credentials, {
        onSuccess: () => {
          toast.success('Successfully signed in!');
          navigate('/dashboard', { replace: true });
        },
        onError: (error) => {
          const errorMsg = handleErrorResponse(error);
          setApiError(errorMsg);
          toast.error(errorMsg);
        }
      });
    } catch (error) {
      const errorMsg = handleErrorResponse(error);
      setApiError(errorMsg);
      toast.error(errorMsg);
    }
  }, [login, navigate, handleErrorResponse]);

  const isLoading = isLoggingIn;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
        </header>

        {apiError && (
          <div 
            className="rounded-md bg-red-50 p-4" 
            role="alert" 
            aria-live="polite"
          >
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{apiError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="mt-8 space-y-6" 
          noValidate
        >
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  spellCheck="false"
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.email 
                      ? 'border-red-300 text-red-900 placeholder-red-300' 
                      : 'border-gray-300 placeholder-gray-400'
                  }`}
                  {...register('email')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p 
                  id="email-error" 
                  className="mt-2 text-sm text-red-600" 
                  role="alert"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.password 
                      ? 'border-red-300 text-red-900 placeholder-red-300' 
                      : 'border-gray-300 placeholder-gray-400'
                  }`}
                  {...register('password')}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
              </div>
              {errors.password && (
                <p 
                  id="password-error" 
                  className="mt-2 text-sm text-red-600" 
                  role="alert"
                >
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignIn;