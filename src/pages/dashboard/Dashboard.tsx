import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { user, signOut, isLoggingOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('You have been signed out successfully');
      navigate('/signin');
    } catch (error) {
      console.error('Sign out failed:', error);
      toast.error('Sign out failed. Please try again.');
    }
  };

  if (!user) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">
              Welcome, {user.first_name || (user.email ?? '').split('@')[0] || 'User'}!
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">What would you like to do today?</p>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Account Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Account Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.email_verified ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Verification Pending
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm hover:shadow transition">
                <h3 className="text-md font-medium text-blue-800">Car Rentals</h3>
                <p className="mt-2 text-sm text-blue-600">
                  Browse and rent cars for your next trip
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg shadow-sm hover:shadow transition">
                <h3 className="text-md font-medium text-green-800">My Reservations</h3>
                <p className="mt-2 text-sm text-green-600">
                  View your current and upcoming bookings
                </p>
              </div>

              <button
                className="bg-purple-50 p-4 rounded-lg shadow-sm hover:shadow transition w-full text-left"
                onClick={() => navigate('/settings')}
              >
                <h3 className="text-md font-medium text-purple-800">Account Settings</h3>
                <p className="mt-2 text-sm text-purple-600">Update your profile and preferences</p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
