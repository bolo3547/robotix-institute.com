'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Legacy route — redirects to the consolidated dashboard.
 * All parent dashboard functionality is now at /dashboard/parent.
 */
export default function ParentDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/parent');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
    </div>
  );
}
