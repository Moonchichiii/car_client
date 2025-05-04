import React from 'react';
import { Link } from 'react-router-dom';
import CookieConsent from '@/components/utils/CookieConsent';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Car Rental</h1>
        <p className="text-gray-600 mb-6">
          Your journey begins with a simple click. Rent a car today and experience freedom on the
          road.
        </p>
        <div className="space-x-4">
          <Link
            to="/signin"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition duration-200"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition duration-200"
          >
            Create account
          </Link>
        </div>
        <CookieConsent></CookieConsent>
      </div>
    </div>
  );
};

export default Home;
