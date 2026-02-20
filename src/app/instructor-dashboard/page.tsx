'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Legacy route — redirects to the consolidated dashboard.
 * All instructor dashboard functionality is now at /dashboard/instructor.
 */
export default function InstructorDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/instructor');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
    </div>
  );
}
