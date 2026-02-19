'use client';

import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-indigo-50">
      <header className="bg-white/80 backdrop-blur sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">RI</div>
            <div>
              <div className="text-sm font-bold">ROBOTIX Institute</div>
              <div className="text-xs text-gray-500">Kids Dashboard</div>
            </div>
          </div>
          <nav>
            <ul className="flex items-center gap-3">
              <li>
                <a className="px-3 py-2 rounded-lg bg-brand-600 text-white font-semibold" href="#courses">Courses</a>
              </li>
              <li>
                <a className="px-3 py-2 rounded-lg bg-white font-semibold border border-gray-200" href="#projects">Projects</a>
              </li>
              <li>
                <a className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-700" href="#achievements">Badges</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="py-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} ROBOTIX Institute — Safe, ad-free learning for ages 6–18
      </footer>
    </div>
  );
}
