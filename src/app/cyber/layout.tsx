'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Shield,
  TrendingUp,
  Trophy,
  BookOpen,
  Settings,
  Menu,
  X,
  Terminal,
  LogOut,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/cyberService';

const navItems = [
  { label: 'Dashboard', href: '/cyber', icon: LayoutDashboard },
  { label: 'Challenges', href: '/cyber/challenges', icon: Shield },
  { label: 'Progress', href: '/cyber/progress', icon: TrendingUp },
  { label: 'Leaderboard', href: '/cyber/leaderboard', icon: Trophy },
  { label: 'Resources', href: '/cyber/resources', icon: BookOpen },
  { label: 'Admin Panel', href: '/cyber/admin', icon: Settings, adminOnly: true },
];

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  level: number;
  xp: number;
  rank: string;
}

export default function CyberLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    getCurrentUser().then((data) => {
      if (data) setProfile(data);
    });
  }, []);

  const isAdmin = profile?.role === 'admin' || profile?.role === 'instructor' || session?.user?.role === 'admin';
  const userName = profile?.name || session?.user?.name || 'Trainee';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  const userLevel = profile?.level || 1;
  const userRank = profile?.rank || 'Script Kiddie';

  const filteredNav = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0d1117] border-r border-gray-800/60
          flex flex-col transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800/60">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide font-mono">CyberLab</h1>
            <p className="text-[10px] text-gray-500 font-mono">TRAINING PLATFORM</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-1 hover:bg-gray-800 rounded"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/cyber'
                ? pathname === '/cyber'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                  ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent'
                  }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-emerald-500/60" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-4 border-t border-gray-800/60 space-y-3">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800/30">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-200 truncate">{userName}</p>
              <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Zap className="w-3 h-3" /> Lvl {userLevel} · {userRank}
              </p>
            </div>
          </div>
          <Link
            href="/auth/login"
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0a0e1a]/80 backdrop-blur-xl border-b border-gray-800/40 px-4 py-3 flex items-center gap-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
            <span className="text-emerald-400">$</span>
            <span className="text-gray-400">{pathname.replace(/\//g, ' > ').substring(3) || 'dashboard'}</span>
            <span className="animate-pulse text-emerald-400">_</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
              SECURE SESSION
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
