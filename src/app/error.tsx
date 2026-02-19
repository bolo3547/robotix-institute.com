'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Error badge */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          An unexpected error occurred. Our team has been notified.
        </p>

        {/* Dev error details */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-gray-700 font-mono break-all">{error.message}</p>
            {error.digest && (
              <p className="text-xs text-gray-400 mt-2">Digest: {error.digest}</p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Go home
          </button>
        </div>

        <p className="mt-8 text-sm text-gray-400">
          Need help?{' '}
          <a href="tel:+260956355117" className="text-brand-600 hover:underline">
            +260 956 355 117
          </a>
        </p>
      </motion.div>
    </div>
  );
}
