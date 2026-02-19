'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, LogOut, Settings, Home, BarChart3, Users, BookOpen } from 'lucide-react';
import { useState } from 'react';

interface InstructorDashboardLayoutProps {
  children: React.ReactNode;
}

export default function InstructorDashboardLayout({ children }: InstructorDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', href: '/instructor-dashboard', icon: Home },
    { label: 'Classes', href: '/instructor-dashboard/classes', icon: BookOpen },
    { label: 'Students', href: '/instructor-dashboard/students', icon: Users },
    { label: 'Analytics', href: '/instructor-dashboard/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/instructor-dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            🤖 ROBOTIX
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ x: sidebarOpen ? 0 : -280 }}
          className="fixed md:relative w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto z-30"
        >
          <nav className="p-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 p-6 mt-6">
            <button
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="w-full flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium md:hidden"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
