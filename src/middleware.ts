// Middleware to protect routes using NextAuth
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that never require auth
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/admin-login',
    '/auth/unauthorized',
    '/auth/error',
    '/about',
    '/programs',
    '/pricing',
    '/contact',
    '/blog',
    '/events',
    '/faq',
    '/gallery',
    '/testimonials',
    '/instructors',
    '/privacy',
    '/terms',
    '/referral',
    '/request-quote',
    '/what-you-get',
    '/design-system',
  ];

  // Check if the current path matches a public route
  const isPublic = publicRoutes.some((route) => {
    if (route === '/') return pathname === '/';
    return pathname === route || pathname.startsWith(route + '/');
  });

  // Allow public routes, static files, API routes, and Next.js internals
  if (
    isPublic ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get NextAuth token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // No token → redirect to login
  if (!token) {
    // Admin routes → admin login page
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/auth/admin-login', request.url));
    }
    // Other protected routes → main login
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control for admin routes
  if (pathname.startsWith('/admin')) {
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
    }
  }

  // Role-based access for dashboard routes
  if (pathname.startsWith('/admin-dashboard') && token.role !== 'admin') {
    return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
  }
  if (pathname.startsWith('/instructor-dashboard') && token.role !== 'instructor') {
    return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
  }
  if (pathname.startsWith('/parent-dashboard') && token.role !== 'parent') {
    return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|images).*)',
  ],
};
