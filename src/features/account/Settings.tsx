import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/LoadingSpinner';
import PasswordChangeForm from '@/components/forms/account/PasswordChangeForm';
import EmailChangeForm from '@/components/forms/account/EmailChangeForm';
import DeleteAccountForm from '@/components/forms/account/DeleteAccountForm';
import ProfileEditForm from '@/components/forms/account/ProfileEditForm';
import { useAccount } from '@/features/account/hooks';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { sendVerificationEmail, sendPhoneVerification, updatePreferences } = useAccount();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [formStates, setFormStates] = useState({
    editingPassword: false,
    editingEmail: false,
    editingProfile: false,
    deletingAccount: false,
  });

  const showForm = (form: keyof typeof formStates) => {
    setFormStates({
      ...Object.keys(formStates).reduce(
        (acc, key) => {
          acc[key as keyof typeof formStates] = false;
          return acc;
        },
        {} as typeof formStates,
      ),
      [form]: true,
    });
  };

  const hideAllForms = () => {
    setFormStates({
      editingPassword: false,
      editingEmail: false,
      editingProfile: false,
      deletingAccount: false,
    });
  };

  const handleSendVerificationEmail = () => {
    sendVerificationEmail();
  };

  const handleSendPhoneVerification = () => {
    if (!user?.phone_number) {
      toast.error('Please add a phone number first.');
      return;
    }
    sendPhoneVerification(user.phone_number);
  };

  const handleUpdateMarketingPreferences = (value: boolean) => {
    updatePreferences({ marketing_emails: value });
  };

  if (!user) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">Account Settings</h1>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex">
            <button
              type="button"
              className={`${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              onClick={() => {
                setActiveTab('profile');
                hideAllForms();
              }}
            >
              Profile
            </button>
            <button
              type="button"
              className={`${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              onClick={() => {
                setActiveTab('security');
                hideAllForms(); // Hide forms when switching to security tab as well
              }}
            >
              Security
            </button>
            <button
              type="button"
              className={`${
                activeTab === 'advanced'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              onClick={() => {
                setActiveTab('advanced');
                hideAllForms();
              }}
            >
              Advanced
            </button>
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="p-6">
            <h2 className="text-lg font-medium text-white mb-4">Personal Information</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              {/* Full name */}
              <dt className="text-sm font-medium text-gray-400">Full name</dt>
              <dd className="mt-1 text-sm text-white flex justify-between">
                <span>
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : 'Not provided'}
                </span>
                {formStates.editingProfile ? (
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-300 text-xs"
                    onClick={hideAllForms}
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    className="text-blue-400 hover:text-blue-300 text-xs"
                    onClick={() => showForm('editingProfile')}
                  >
                    Edit
                  </button>
                )}
              </dd>

              {/* Email address */}
              <dt className="text-sm font-medium text-gray-400">Email address</dt>
              <dd className="mt-1 text-sm text-white flex justify-between">
                <span>{user.email}</span>
                {formStates.editingEmail ? (
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-300 text-xs"
                    onClick={hideAllForms}
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    className="text-blue-400 hover:text-blue-300 text-xs"
                    onClick={() => showForm('editingEmail')}
                  >
                    Change
                  </button>
                )}
              </dd>
              {/* Conditionally rendered form now outside the dd for layout, but associated */}
              {formStates.editingEmail && (
                <dd className="mt-4 p-4 bg-gray-700 rounded sm:col-span-2">
                  <EmailChangeForm
                    currentEmail={user.email}
                    onSuccess={hideAllForms}
                    onCancel={hideAllForms}
                  />
                </dd>
              )}

              {/* Phone number */}
              <dt className="text-sm font-medium text-gray-400">Phone number</dt>
              <dd className="mt-1 text-sm text-white flex justify-between">
                <span>{user.phone_number ? '••••••••••' : 'Not provided'}</span>
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300 text-xs"
                  onClick={() => toast.info('Phone update feature is coming soon!')}
                >
                  Edit
                </button>
              </dd>

              {/* Date of birth */}
              <dt className="text-sm font-medium text-gray-400">Date of birth</dt>
              <dd className="mt-1 text-sm text-white flex justify-between">
                <span>{user.date_of_birth ? '••/••/••••' : 'Not provided'}</span>
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300 text-xs"
                  onClick={() => toast.info('Date of birth update feature is coming soon!')}
                >
                  Edit
                </button>
              </dd>
            </dl>

            {/* ProfileEditForm section - Placed outside the dl for correct structure */}
            {formStates.editingProfile && (
              <div className="mt-4 p-4 bg-gray-700 rounded">
                <h3 className="text-sm font-medium text-gray-300 mb-4">Edit Profile</h3>
                <ProfileEditForm user={user} onSuccess={hideAllForms} onCancel={hideAllForms} />
              </div>
            )}

            <h2 className="text-lg font-medium text-white mt-8 mb-4">Address Information</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              {/* Address */}
              <dt className="text-sm font-medium text-gray-400 sm:col-span-2">Address</dt>
              <dd className="mt-1 text-sm text-white flex justify-between sm:col-span-2">
                <span>{user.country ? <>••••••••••, {user.country}</> : 'Not provided'}</span>
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300 text-xs"
                  onClick={() => toast.info('Address update feature is coming soon!')}
                >
                  Edit
                </button>
              </dd>
            </dl>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="p-6">
            <h2 className="text-lg font-medium text-white mb-4">Account Security</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              {/* Password */}
              <dt className="text-sm font-medium text-gray-400 sm:col-span-2">Password</dt>
              <dd className="mt-1 text-sm text-white flex justify-between sm:col-span-2">
                <span>••••••••</span>
                {formStates.editingPassword ? (
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-300 text-xs"
                    onClick={hideAllForms}
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    className="text-blue-400 hover:text-blue-300 text-xs"
                    onClick={() => showForm('editingPassword')}
                  >
                    Change password
                  </button>
                )}
              </dd>
              {/* Conditionally rendered form now outside the dd for layout, but associated */}
              {formStates.editingPassword && (
                <dd className="mt-4 p-4 bg-gray-700 rounded sm:col-span-2">
                  <PasswordChangeForm onSuccess={hideAllForms} onCancel={hideAllForms} />
                </dd>
              )}

              {/* Email verification */}
              <dt className="text-sm font-medium text-gray-400">Email verification</dt>
              <dd className="mt-1 text-sm text-white">
                {user.email_verified ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                    Verified
                  </span>
                ) : (
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200 mr-2">
                      Not verified
                    </span>
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300 text-xs"
                      onClick={handleSendVerificationEmail}
                    >
                      Verify now
                    </button>
                  </div>
                )}
              </dd>

              {/* Phone verification */}
              <dt className="text-sm font-medium text-gray-400">Phone verification</dt>
              <dd className="mt-1 text-sm text-white">
                {user.phone_verified ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                    Verified
                  </span>
                ) : (
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200 mr-2">
                      Not verified
                    </span>
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300 text-xs"
                      onClick={handleSendPhoneVerification}
                    >
                      Verify now
                    </button>
                  </div>
                )}
              </dd>

              {/* Driver's License */}
              <dt className="text-sm font-medium text-gray-400">Driver's License</dt>
              <dd className="mt-1 text-sm text-white flex justify-between">
                <span>
                  {user.masked_license ? (
                    <>
                      {user.masked_license}
                      {user.drivers_license_expiry && (
                        <div className="mt-1 text-xs text-gray-400">
                          Expires: {new Date(user.drivers_license_expiry).toLocaleDateString()}
                        </div>
                      )}
                    </>
                  ) : (
                    'Not provided'
                  )}
                </span>
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300 text-xs"
                  onClick={() => toast.info('License update feature is coming soon!')}
                >
                  Update
                </button>
              </dd>

              {/* Last login */}
              <dt className="text-sm font-medium text-gray-400 sm:col-span-2 mt-2">Last login</dt>
              <dd className="mt-1 text-sm text-white sm:col-span-2">
                {user.last_login ? new Date(user.last_login).toLocaleString() : 'Unknown'}
                {user.last_login_ip && (
                  <span className="ml-2 text-xs text-gray-400">from IP: {user.last_login_ip}</span>
                )}
              </dd>
            </dl>
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && (
          <div className="p-6">
            <h2 className="text-lg font-medium text-white mb-4">Account Settings</h2>
            {/* Note: Using grid-cols-1 here, so no spanning needed */}
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
              {/* Marketing preferences */}
              <dt className="text-sm font-medium text-gray-400">Marketing preferences</dt>
              <dd className="mt-1 text-sm text-white">
                <div className="flex items-center">
                  <input
                    id="marketing-emails"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
                    checked={user.marketing_emails || false}
                    onChange={(e) => handleUpdateMarketingPreferences(e.target.checked)}
                  />
                  <label htmlFor="marketing-emails" className="ml-2 block text-sm text-white">
                    Receive marketing emails
                  </label>
                </div>
              </dd>

              {/* Danger Zone */}
              <dt className="border-t border-gray-700 pt-4 text-sm font-medium text-red-400">
                Danger Zone
              </dt>
              <dd className="mt-3">
                {formStates.deletingAccount ? (
                  <DeleteAccountForm onCancel={hideAllForms} />
                ) : (
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-red-500 text-red-400 bg-transparent rounded hover:bg-red-900 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => showForm('deletingAccount')}
                  >
                    Delete Account
                  </button>
                )}
              </dd>
            </dl>
          </div>
        )}
      </main>
    </div>
  );
};

export default Settings;
