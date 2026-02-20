'use client';

import { useSession } from 'next-auth/react';

/**
 * Convenience hook wrapping NextAuth's useSession.
 * Provides typed access to the current user's session data.
 */
export function useAuth() {
  const { data: session, status, update } = useSession();

  return {
    /** The current user object, or null if not authenticated */
    user: session?.user ?? null,
    /** Whether the session is currently loading */
    isLoading: status === 'loading',
    /** Whether the user is authenticated */
    isAuthenticated: status === 'authenticated',
    /** The raw session status: 'loading' | 'authenticated' | 'unauthenticated' */
    status,
    /** The full session object */
    session,
    /** Trigger a session refresh */
    refresh: update,
  };
}
