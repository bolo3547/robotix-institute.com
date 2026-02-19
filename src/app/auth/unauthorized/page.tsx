'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="bg-white rounded-lg p-8 shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6"
          >
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this resource. Please check your account role or contact support.</p>

          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Back to Login
            </Link>
            <Link
              href="/"
              className="inline-block w-full bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Return Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
