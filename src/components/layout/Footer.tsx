'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/hooks/useTheme';

export default function Footer() {
  const year = new Date().getFullYear();
  const { isDark } = useTheme();

  const mainLinks = [
    { label: 'Programs', href: '/programs' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const resourceLinks = [
    { label: 'Blog', href: '/blog' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Events', href: '/events' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Instructors', href: '/instructors' },
    { label: 'Referral Program', href: '/referral' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ];

  return (
    <footer className={`border-t ${isDark ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-gray-50'}`}>
      {/* CTA Banner */}
      <div className="bg-brand-600">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Ready to start your child&apos;s coding journey?</h3>
            <p className="text-sm text-white/80 mt-1">Free trial class — no commitment required.</p>
          </div>
          <Link
            href="/auth/signup"
            className={`inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded-lg transition-colors shadow-sm whitespace-nowrap ${
              isDark ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-brand-600 hover:bg-gray-50'
            }`}
          >
            Get Started Free →
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Image 
                src="/logo.svg" 
                alt="Robotix Institute" 
                width={120} 
                height={35}
                className="h-9 w-auto"
              />
            </Link>
            <p className={`text-sm max-w-xs mb-3 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              Empowering tomorrow&apos;s innovators with hands-on robotics and creative coding education. Ages 6–18.
            </p>
            <div className={`text-xs space-y-1 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
              <p>📍 No. 7 Mistry Court, Great East Road, Lusaka</p>
              <p>📞 +260 956 355 117</p>
              <p>✉️ info@robotixinstitute.io</p>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>Quick Links</h4>
              <nav className="space-y-2">
                {mainLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-brand-400' : 'text-gray-500 hover:text-brand-600'}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>Resources</h4>
              <nav className="space-y-2">
                {resourceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-brand-400' : 'text-gray-500 hover:text-brand-600'}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>Legal</h4>
              <nav className="space-y-2">
                {legalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-brand-400' : 'text-gray-500 hover:text-brand-600'}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className={`mt-10 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm ${
          isDark ? 'border-slate-700 text-slate-500' : 'border-gray-200 text-gray-500'
        }`}>
          <p>&copy; {year} Robotix Institute. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://facebook.com/robotixinstitute" className={`transition-colors ${isDark ? 'hover:text-brand-400' : 'hover:text-brand-600'}`} aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://instagram.com/robotix_institute_" className={`transition-colors ${isDark ? 'hover:text-brand-400' : 'hover:text-brand-600'}`} aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://tiktok.com/@robotix.institute" className={`transition-colors ${isDark ? 'hover:text-brand-400' : 'hover:text-brand-600'}`} aria-label="TikTok">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
            <a href="https://linkedin.com/company/robotix-institute-zm" className={`transition-colors ${isDark ? 'hover:text-brand-400' : 'hover:text-brand-600'}`} aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
