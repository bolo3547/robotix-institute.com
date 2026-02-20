'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import LanguageToggle from '@/components/layout/LanguageToggle';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';

function getDashboardPath(role?: string) {
  switch (role) {
    case 'admin': return '/admin';
    case 'parent': return '/parent-dashboard';
    case 'instructor': return '/instructor-dashboard';
    default: return '/dashboard';
  }
}

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('/logo.svg');
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for glassmorphism effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Load custom logo from database, then listen for local changes
  useEffect(() => {
    // 1. First check localStorage for instant display
    try {
      const stored = localStorage.getItem('robotix-site-settings');
      if (stored) {
        const settings = JSON.parse(stored);
        if (settings.logoUrl) {
          setLogoUrl(settings.logoUrl);
        }
      }
    } catch {
      // Keep default logo
    }

    // 2. Then fetch from database (source of truth)
    fetch('/api/settings/logo')
      .then((res) => res.json())
      .then((data) => {
        if (data.logoUrl && data.logoUrl !== '/logo.svg') {
          setLogoUrl(data.logoUrl);
          localStorage.setItem('robotix-site-settings', JSON.stringify({ logoUrl: data.logoUrl }));
        }
      })
      .catch(() => {});

    // 3. Listen for settings changes from admin (same-tab updates)
    const handleSettingsChange = () => {
      try {
        const stored = localStorage.getItem('robotix-site-settings');
        if (stored) {
          const settings = JSON.parse(stored);
          if (settings.logoUrl) {
            setLogoUrl(settings.logoUrl);
          }
        }
      } catch {
        // Keep current logo
      }
    };
    window.addEventListener('site-settings-changed', handleSettingsChange);
    window.addEventListener('storage', (e) => {
      if (e.key === 'robotix-site-settings') {
        handleSettingsChange();
      }
    });
    return () => {
      window.removeEventListener('site-settings-changed', handleSettingsChange);
    };
  }, []);

  const navLinks = [
    { label: 'Programs', href: '/programs' },
    { label: 'Enroll', href: '/enroll' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const moreLinks = [
    { label: 'Gallery', href: '/gallery' },
    { label: 'Events', href: '/events' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Instructors', href: '/instructors' },
    { label: 'Join Our Team', href: '/join-team' },
    { label: 'Referral', href: '/referral' },
  ];

  const platformLinks = [
    { label: 'Learning', href: '/learning' },
    { label: 'Playground', href: '/playground' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Community', href: '/community' },
    { label: 'Schedule', href: '/schedule' },
    { label: 'Timetable', href: '/timetable' },
    { label: 'Certificates', href: '/certificates' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Payments', href: '/payments' },
    { label: 'Notifications', href: '/notifications' },
    { label: 'Analytics', href: '/analytics' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? isDark
          ? 'bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 shadow-lg shadow-black/10'
          : 'bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-black/[0.03]'
        : isDark
          ? 'bg-transparent border-b border-transparent'
          : 'bg-transparent border-b border-transparent'
    }`}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src={logoUrl} 
            alt="Robotix Institute" 
            width={140} 
            height={40}
            className="h-10 w-auto"
            priority
            unoptimized={logoUrl.includes('/uploads/')}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  isActive
                    ? 'text-brand-500 bg-brand-50/10 font-semibold'
                    : isDark 
                      ? 'text-slate-300 hover:text-brand-400 hover:bg-slate-800'
                      : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Platform dropdown */}
        <div className="hidden md:flex items-center relative group">
          <button className={`px-4 py-2 text-sm rounded-lg transition-colors font-medium ${
            isDark 
              ? 'text-accent-400 hover:text-accent-300 hover:bg-slate-800' 
              : 'text-accent-600 hover:text-accent-700 hover:bg-accent-50'
          }`}>
            Platform ▾
          </button>
          <div className={`absolute top-full right-0 mt-1 w-48 border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
          }`}>
            {platformLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2.5 text-sm first:rounded-t-xl last:rounded-b-xl transition-colors ${
                  isDark 
                    ? 'text-slate-300 hover:text-brand-400 hover:bg-slate-700' 
                    : 'text-gray-600 hover:text-brand-600 hover:bg-brand-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* More dropdown */}
        <div className="hidden md:flex items-center relative group">
          <button className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            isDark 
              ? 'text-slate-300 hover:text-brand-400 hover:bg-slate-800' 
              : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50'
          }`}>
            More ▾
          </button>
          <div className={`absolute top-full right-0 mt-1 w-44 border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
          }`}>
            {moreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2.5 text-sm first:rounded-t-xl last:rounded-b-xl transition-colors ${
                  isDark 
                    ? 'text-slate-300 hover:text-brand-400 hover:bg-slate-700' 
                    : 'text-gray-600 hover:text-brand-600 hover:bg-brand-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Auth + Toggles */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          {status === 'authenticated' && session?.user ? (
            <>
              <Link
                href={getDashboardPath((session.user as any).role)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isDark 
                    ? 'text-accent-400 hover:text-accent-300 hover:bg-slate-800' 
                    : 'text-accent-600 hover:text-accent-700 hover:bg-accent-50'
                }`}
              >
                Dashboard
              </Link>
              <div className="relative group">
                <button className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-700 hover:bg-brand-50'
                }`}>
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                    {session.user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                  <span className="max-w-[100px] truncate">{session.user.name?.split(' ')[0]}</span>
                </button>
                <div className={`absolute top-full right-0 mt-1 w-48 border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                }`}>
                  <div className={`px-4 py-3 border-b ${
                    isDark ? 'border-slate-700' : 'border-gray-100'
                  }`}>
                    <p className={`text-sm font-semibold truncate ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>{session.user.name}</p>
                    <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{session.user.email}</p>
                  </div>
                  <Link
                    href={getDashboardPath((session.user as any).role)}
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      isDark ? 'text-slate-300 hover:text-brand-400 hover:bg-slate-700' : 'text-gray-600 hover:text-brand-600 hover:bg-brand-50'
                    }`}
                  >
                    My Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className={`block w-full text-left px-4 py-2.5 text-sm rounded-b-xl transition-colors ${
                      isDark ? 'text-red-400 hover:bg-slate-700' : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isDark ? 'text-slate-300 hover:text-brand-400' : 'text-gray-600 hover:text-brand-600'
                }`}
              >
                Log in
              </Link>
              <Link
                href="/enroll"
                className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
              >
                Enroll Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden p-2 -mr-2 transition-colors ${isDark ? 'text-slate-300 hover:text-brand-400' : 'text-gray-600 hover:text-brand-600'}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t px-6 py-4 ${
          isDark ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'
        }`}>
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'text-brand-500 bg-brand-50/10 font-semibold'
                      : isDark
                        ? 'text-slate-300 hover:text-brand-400 hover:bg-slate-800'
                        : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className={`mt-2 pt-2 border-t space-y-1 ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <p className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-accent-400' : 'text-accent-600'}`}>Platform</p>
            {platformLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2.5 rounded-lg transition-colors ${
                  isDark ? 'text-slate-300 hover:text-brand-400 hover:bg-slate-800' : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className={`mt-2 pt-2 border-t space-y-1 ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <p className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>More</p>
            {moreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2.5 rounded-lg transition-colors ${
                  isDark ? 'text-slate-300 hover:text-brand-400 hover:bg-slate-800' : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className={`mt-3 pt-3 border-t flex items-center gap-2 px-3 ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <div className={`mt-3 pt-3 border-t space-y-2 ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            {status === 'authenticated' && session?.user ? (
              <>
                <Link
                  href={getDashboardPath((session.user as any).role)}
                  className="block px-3 py-2.5 text-center font-medium text-white bg-accent-500 hover:bg-accent-600 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Dashboard
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                  className={`block w-full px-3 py-2.5 text-center rounded-lg transition-colors ${
                    isDark ? 'text-red-400 hover:bg-slate-800' : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`block px-3 py-2.5 text-center rounded-lg transition-colors ${
                    isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-brand-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/enroll"
                  className="block px-3 py-2.5 text-center font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Enroll Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
