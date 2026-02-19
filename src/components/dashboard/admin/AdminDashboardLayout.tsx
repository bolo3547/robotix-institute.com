'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, LogOut, Settings, Home, Users, BarChart3, DollarSign, Shield } from 'lucide-react';
import { useState } from 'react';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', href: '/admin-dashboard', icon: Home },
    { label: 'Users', href: '/admin-dashboard/users', icon: Users },
    { label: 'Courses', href: '/admin-dashboard/courses', icon: BarChart3 },
    { label: 'Payments', href: '/admin-dashboard/payments', icon: DollarSign },
    { label: 'Moderation', href: '/admin-dashboard/moderation', icon: Shield },
    { label: 'Settings', href: '/admin-dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-400">
            🤖 ROBOTIX ADMIN
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-700 rounded-lg text-gray-300"
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="flex items-center gap-2 text-gray-300 hover:text-white font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Dark Sidebar */}
        <motion.aside
          initial={false}
          animate={{ x: sidebarOpen ? 0 : -280 }}
          className="fixed md:relative w-64 bg-gray-800 border-r border-gray-700 h-screen overflow-y-auto z-30"
        >
          <nav className="p-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-700 p-6 mt-6">
            <button
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="w-full flex items-center gap-2 px-4 py-3 bg-red-900 text-red-200 rounded-lg hover:bg-red-800 transition font-medium md:hidden"
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
