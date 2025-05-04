import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else {
      setPreferences(JSON.parse(consent));
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allPreferences);
  };

  const handleRejectAll = () => {
    const minimalPreferences: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    savePreferences(minimalPreferences);
  };

  const handleSaveSettings = () => {
    savePreferences(preferences);
    setShowSettings(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    setShowBanner(false);
    
    // Here you would trigger your cookie management system
    // to enable/disable cookies based on the preferences
    console.log('Cookie preferences saved:', prefs);
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Can't change necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const resetConsent = () => {
    localStorage.removeItem('cookieConsent');
    setShowBanner(true);
    setPreferences({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      {showSettings ? (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">Cookie Preferences</h2>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium text-gray-900">Necessary Cookies</h3>
                <p className="text-sm text-gray-500">Required for basic site functionality</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.necessary}
                disabled
                className="w-4 h-4 rounded border-gray-300 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium text-gray-900">Functional Cookies</h3>
                <p className="text-sm text-gray-500">Remember your preferences and settings</p>
              </div>
              <button
                onClick={() => handleTogglePreference('functional')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.functional ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className="sr-only">Toggle functional cookies</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    preferences.functional ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium text-gray-900">Analytics Cookies</h3>
                <p className="text-sm text-gray-500">Help us understand how visitors use our site</p>
              </div>
              <button
                onClick={() => handleTogglePreference('analytics')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.analytics ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className="sr-only">Toggle analytics cookies</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium text-gray-900">Marketing Cookies</h3>
                <p className="text-sm text-gray-500">Used to deliver personalized advertisements</p>
              </div>
              <button
                onClick={() => handleTogglePreference('marketing')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.marketing ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className="sr-only">Toggle marketing cookies</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleSaveSettings}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Preferences
            </button>
            <button
              onClick={handleAcceptAll}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Accept All
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-gray-700">
              <p className="text-sm sm:text-base">
                We use cookies to improve your experience and analyze site usage.{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">Learn more</a>
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
              >
                Reject All
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
              >
                Settings
              </button>
              <button
                onClick={handleAcceptAll}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieConsent;