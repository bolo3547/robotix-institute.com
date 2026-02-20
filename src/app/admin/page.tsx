'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Settings, Users, BookOpen, MessageSquare, FileText, LogOut, ChevronRight, BarChart3, Zap, Receipt, Megaphone, Image as ImageIcon, CalendarDays, CreditCard, Upload, PenTool, GraduationCap, TrendingUp, UserPlus, Briefcase, ClipboardList, MessageCircle, Building2 } from 'lucide-react';

const INSTITUTE_WA = '260956355117';

const adminSections = [
  {
    icon: ClipboardList,
    title: 'Enrollment Applications',
    description: 'Review parent sign-up forms & send acceptance letters',
    href: '/admin/enrollment-applications',
    color: 'from-violet-500 to-purple-600',
    count: 'Review',
  },
  {
    icon: UserPlus,
    title: 'Sign Ups',
    description: 'View all new user registrations & accounts',
    href: '/admin/signups',
    color: 'from-cyan-500 to-cyan-600',
    count: 'New Users',
  },
  {
    icon: Briefcase,
    title: 'Team Applications',
    description: 'Review & manage join-team applications',
    href: '/admin/applications',
    color: 'from-amber-500 to-orange-600',
    count: 'Applications',
  },
  {
    icon: Receipt,
    title: 'Quotations',
    description: 'Manage quote requests & send PDF quotes',
    href: '/admin/quotations',
    color: 'from-emerald-500 to-emerald-600',
    count: 'New Requests',
  },
  {
    icon: Megaphone,
    title: 'Promotions & Ads',
    description: 'Create banners, popups & manage ad tracking',
    href: '/admin/promotions',
    color: 'from-yellow-500 to-orange-500',
    count: 'Run Ads',
  },
  {
    icon: CreditCard,
    title: 'Payments',
    description: 'Track & update parent payments, issue receipts',
    href: '/admin/payments',
    color: 'from-indigo-500 to-indigo-600',
    count: 'Manage',
  },
  {
    icon: PenTool,
    title: 'Blog Posts',
    description: 'Create & publish blog articles on the website',
    href: '/admin/blog',
    color: 'from-violet-500 to-violet-600',
    count: 'Write',
  },
  {
    icon: GraduationCap,
    title: 'Student Enrollments',
    description: 'Enroll students in programs & manage registrations',
    href: '/admin/enrollments',
    color: 'from-sky-500 to-sky-600',
    count: 'Enroll',
  },
  {
    icon: TrendingUp,
    title: 'Student Progress',
    description: 'Track & update each child\'s weekly learning progress',
    href: '/admin/progress',
    color: 'from-lime-500 to-lime-600',
    count: 'Track',
  },
  {
    icon: Upload,
    title: 'Website Logo',
    description: 'Upload & change the site logo',
    href: '/admin/logo',
    color: 'from-teal-500 to-teal-600',
    count: 'Upload',
  },
  {
    icon: Building2,
    title: 'Trusted Partners',
    description: 'Manage partner logos on the homepage',
    href: '/admin/partners',
    color: 'from-blue-500 to-indigo-600',
    count: 'Manage',
  },
  {
    icon: ImageIcon,
    title: 'Photo Gallery',
    description: 'Upload & manage gallery photos',
    href: '/admin/photos',
    color: 'from-cyan-500 to-cyan-600',
    count: 'Manage',
  },
  {
    icon: CalendarDays,
    title: 'Events',
    description: 'Create & manage events and workshops',
    href: '/admin/events',
    color: 'from-rose-500 to-rose-600',
    count: 'Manage',
  },
  {
    icon: BookOpen,
    title: 'Programs',
    description: 'Manage all courses and programs',
    href: '/admin/programs',
    color: 'from-blue-500 to-blue-600',
    count: '7 Programs',
  },
  {
    icon: MessageSquare,
    title: 'Testimonials',
    description: 'Manage student & parent reviews',
    href: '/admin/testimonials',
    color: 'from-purple-500 to-purple-600',
    count: '6 Testimonials',
  },
  {
    icon: Users,
    title: 'Team Members',
    description: 'Manage instructors & staff',
    href: '/admin/team',
    color: 'from-green-500 to-green-600',
    count: '4 Members',
  },
  {
    icon: FileText,
    title: 'Pages & Content',
    description: 'Edit website content & pages',
    href: '/admin/content',
    color: 'from-pink-500 to-pink-600',
    count: '8 Pages',
  },
  {
    icon: Settings,
    title: 'Settings',
    description: 'Website settings & configuration',
    href: '/admin/settings',
    color: 'from-orange-500 to-orange-600',
    count: 'Configure',
  },
];

const stats = [
  { label: '2,500+', value: 'Students' },
  { label: '7', value: 'Programs' },
  { label: '4', value: 'Instructors' },
  { label: '95%', value: 'Satisfaction' },
];

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const { signOut } = await import('next-auth/react');
      await signOut({ callbackUrl: '/auth/login' });
    } catch {
      window.location.href = '/auth/login';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-yellow-500/5 to-transparent"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-orange-400 to-yellow-600 flex items-center justify-center text-base sm:text-lg shadow-lg">
              ⚙️
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white">ROBOTIX</h1>
              <p className="text-white/60 text-[10px] sm:text-xs">Admin Dashboard</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              disabled={isLoading}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white text-xs sm:text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-1.5 sm:gap-2"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-12"
        >
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-white/10 backdrop-blur-xl p-5 sm:p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-yellow-400/10 opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">Admin Control Center 🎛️</h2>
              <p className="text-white/70 text-sm sm:text-base">Manage all aspects of the ROBOTIX platform</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl p-4 sm:p-6 hover:border-white/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 flex items-center justify-center text-orange-400">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
                <p className="text-white/70 text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">{stat.value}</p>
                <p className="text-xl sm:text-3xl font-bold text-white">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Management Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delayChildren: 0.3, staggerChildren: 0.1 }}
          className="mb-8 sm:mb-12"
        >
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white">Management Sections</h3>
            <p className="text-white/60 text-xs sm:text-sm mt-1">Control and manage platform content</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            {adminSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <Link href={section.href} className="block h-full">
                    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl p-4 sm:p-6 hover:border-white/40 transition-all duration-300 h-full">
                      <div className="flex items-start justify-between mb-3 sm:mb-6">
                        <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                          <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <span className="text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/10 text-white/70">{section.count}</span>
                      </div>

                      <h4 className="text-base sm:text-xl font-bold text-white mb-1 sm:mb-2">{section.title}</h4>
                      <p className="text-white/70 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2">{section.description}</p>

                      <div className="flex items-center gap-2 text-orange-400 font-semibold text-xs sm:text-sm group-hover:gap-3 transition-all">
                        <span>Access</span>
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl p-4 sm:p-8">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                Quick Actions
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              <Link href="/admin/programs?action=create">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xs sm:text-sm font-medium hover:shadow-lg transition-all"
                >
                  + Program
                </motion.button>
              </Link>
              <Link href="/admin/testimonials?action=create">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 text-white text-xs sm:text-sm font-medium hover:shadow-lg transition-all"
                >
                  + Testimonial
                </motion.button>
              </Link>
              <Link href="/admin/team?action=create">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-white text-xs sm:text-sm font-medium hover:shadow-lg transition-all"
                >
                  + Team Member
                </motion.button>
              </Link>
              <Link href="/admin/photos">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600 text-white text-xs sm:text-sm font-medium hover:shadow-lg transition-all"
                >
                  + Photo
                </motion.button>
              </Link>
              <Link href="/admin/events">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-gradient-to-r from-rose-400 to-rose-600 text-white text-xs sm:text-sm font-medium hover:shadow-lg transition-all"
                >
                  + Event
                </motion.button>
              </Link>
              <Link href="/admin/payments">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-gradient-to-r from-indigo-400 to-indigo-600 text-white text-xs sm:text-sm font-medium hover:shadow-lg transition-all"
                >
                  + Payment
                </motion.button>
              </Link>
              <Link href="/admin/logo">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-gradient-to-r from-teal-400 to-teal-600 text-white text-xs sm:text-sm font-medium hover:shadow-lg transition-all"
                >
                  Upload Logo
                </motion.button>
              </Link>
              <a href={`https://wa.me/${INSTITUTE_WA}`} target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white text-xs sm:text-sm font-medium hover:shadow-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> WhatsApp
                </motion.button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${INSTITUTE_WA}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-green-500 text-white font-semibold shadow-lg hover:bg-green-600 hover:shadow-xl transition-all text-sm"
      >
        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-10 sm:mt-20 py-6 sm:py-8 text-center text-white/50 text-xs sm:text-sm px-4">
        <p>© 2026 ROBOTIX Institute. Admin Dashboard - {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  );
}
