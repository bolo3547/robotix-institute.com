'use client';

import Link from 'next/link';

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payments</h1>
        <p className="text-gray-600 mb-8">
          Manage your payments and billing information through your parent dashboard.
        </p>
        <Link
          href="/dashboard/parent"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-white rounded-xl font-medium hover:bg-accent-600 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
