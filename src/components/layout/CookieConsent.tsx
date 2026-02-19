'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'robotix-cookie-consent';

type ConsentType = 'all' | 'essential' | null;

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent) return;
    
    // Show banner after a short delay for better UX
    const timer = setTimeout(() => setShowBanner(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleConsent = (type: ConsentType) => {
    if (type) {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
        type,
        timestamp: new Date().toISOString(),
      }));
      
      // Initialize analytics if user accepted all cookies
      if (type === 'all') {
        // Initialize Google Analytics when configured
      }
    }
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-6">
            {/* Main Content */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Cookie Icon */}
              <div className="text-4xl flex-shrink-0">🍪</div>

              {/* Text */}
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  We value your privacy
                </h3>
                <p className="text-gray-600 text-sm">
                  We use cookies to enhance your browsing experience, provide personalized content, 
                  and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                  {' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Learn more
                  </Link>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  Customize
                </button>
                <button
                  onClick={() => handleConsent('essential')}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors text-sm"
                >
                  Essential Only
                </button>
                <button
                  onClick={() => handleConsent('all')}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
                >
                  Accept All
                </button>
              </div>
            </div>

            {/* Detailed Options */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Essential */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Essential</h4>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Always On
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Required for basic site functionality. Cannot be disabled.
                      </p>
                    </div>

                    {/* Analytics */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Analytics</h4>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" aria-label="Enable analytics cookies" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                        </label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Help us understand how visitors interact with our website.
                      </p>
                    </div>

                    {/* Marketing */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Marketing</h4>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" aria-label="Enable marketing cookies" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                        </label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Used to deliver relevant advertisements and track campaigns.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
