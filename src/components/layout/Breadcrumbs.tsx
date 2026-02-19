'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const labelOverrides: Record<string, string> = {
  'programs': 'Programs',
  'robotics-foundations': 'Robotics Foundations',
  'advanced-robotics': 'Advanced Robotics',
  'python': 'Python',
  'web-development': 'Web Development',
  'coding-basics': 'Coding Basics',
  'digital-skills': 'Digital Skills',
  'ai-machine-learning': 'AI & Machine Learning',
  'about': 'About Us',
  'contact': 'Contact',
  'pricing': 'Pricing',
  'blog': 'Blog',
  'gallery': 'Gallery',
  'instructors': 'Instructors',
  'faq': 'FAQ',
  'events': 'Events',
  'referral': 'Referral Program',
  'testimonials': 'Testimonials',
  'privacy': 'Privacy Policy',
  'terms': 'Terms of Service',
  'auth': 'Account',
  'login': 'Login',
  'signup': 'Sign Up',
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: labelOverrides[seg] || seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));

  return (
    <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-2">
        <ol className="flex items-center gap-1 text-sm flex-wrap">
          <li>
            <Link href="/" className="text-gray-500 hover:text-brand-600 transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span className="sr-only md:not-sr-only">Home</span>
            </Link>
          </li>
          {crumbs.map((crumb) => (
            <li key={crumb.href} className="flex items-center gap-1">
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              {crumb.isLast ? (
                <span className="text-gray-800 font-medium">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-gray-500 hover:text-brand-600 transition-colors">
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
