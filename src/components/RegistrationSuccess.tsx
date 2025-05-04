import React from 'react';
import { useNavigate } from 'react-router-dom';

interface RegistrationSuccessProps {
  isVerificationEnabled: boolean;
  email: string;
}

const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({ 
  isVerificationEnabled, 
  email 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 text-green-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            Registration Successful!
          </h2>
        </div>
        
        {isVerificationEnabled ? (
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              Thank you for registering! We've sent a verification email to:
            </p>
            <p className="text-center font-medium">{email}</p>
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-blue-800 text-sm">
                Please check your inbox and click the verification link to activate your account. 
                If you don't see the email, check your spam folder.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 mb-6">
            Your account has been created successfully. You can now start using our services!
          </p>
        )}
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigate('/signin')}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Login
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;