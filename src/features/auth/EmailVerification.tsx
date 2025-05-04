import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { accountApi } from '@/features/account/api';

import LoadingSpinner from '@/components/LoadingSpinner';

const EmailVerification: React.FC = () => {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const verifyEmail = async () => {      
      const searchParams = new URLSearchParams(location.search);
      const key = searchParams.get('key');
      
      if (!key) {
        toast.error('Verification key is missing');
        return;
      }
      
      setVerifying(true);
      try {
        await accountApi.verifyEmail(key);
        setVerified(true);
        toast.success('Email verified successfully!');
      } catch (error) {
        console.error('Verification error:', error);
        toast.error('Email verification failed. The link may be expired or invalid.');
      } finally {
        setVerifying(false);
      }
    };
    
    verifyEmail();
  }, [location.search]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Email Verification</h2>
          
          {verifying && (
            <div className="my-4">
              <p>Verifying your email...</p>
              <LoadingSpinner size="large" className="mx-auto mt-4" />
            </div>
          )}
          
          {verified && (
            <div className="my-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">Your email has been successfully verified!</p>
              <button
                onClick={() => navigate('/signin')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go to Sign In
              </button>
            </div>
          )}
          
          {!verifying && !verified && (
            <div className="my-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">Email verification failed. The link may be expired or invalid.</p>
              <button
                onClick={() => navigate('/signin')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
              >
                Go to Sign In
              </button>
              <button
                onClick={() => accountApi.sendEmailVerification().then(() => 
                  toast.success('Verification email sent. Please check your inbox.')
                )}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Resend Verification
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;