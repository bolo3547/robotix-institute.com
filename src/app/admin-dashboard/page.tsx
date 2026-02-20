'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Legacy route — redirects to the consolidated dashboard.
 * All admin dashboard functionality is now at /dashboard/admin.
 */
export default function AdminDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/admin');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
    </div>
  );
}
