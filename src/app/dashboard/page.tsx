'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Button from '@/components/ui/Button';
import { ChevronRight, BookOpen, Trophy, Users, Code, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [greeting, setGreeting] = useState('Hello');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Auto-redirect role-specific users to consolidated sub-routes
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const role = (session.user as any).role;
      if (role === 'admin') router.push('/dashboard/admin');
      else if (role === 'parent') router.push('/dashboard/parent');
      else if (role === 'instructor') router.push('/dashboard/instructor');
      // students stay on this page — it's their dashboard
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  const userName = session?.user?.name || 'Learner';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-xl shadow-lg">
              🤖
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ROBOTIX Institute</h1>
              <p className="text-white/60 text-xs font-medium tracking-wide">LEARNING PLATFORM</p>
            </div>
          </motion.div>

          <Button
            variant="ghost"
            className="text-white/70 hover:text-white"
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
          >
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {greeting}, {userName}! 🚀
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Welcome to your learning hub. Explore programs, track your progress, and level up your skills.
          </p>
        </motion.div>

        {/* Quick Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { title: 'My Programs', icon: BookOpen, href: '/programs', color: 'from-blue-400 to-blue-600', desc: 'Browse & enroll in courses' },
            { title: 'Leaderboard', icon: Trophy, href: '/leaderboard', color: 'from-yellow-400 to-orange-500', desc: 'See how you rank' },
            { title: 'Community', icon: Users, href: '/community', color: 'from-green-400 to-green-600', desc: 'Connect with peers' },
            { title: 'Playground', icon: Code, href: '/playground', color: 'from-purple-400 to-purple-600', desc: 'Practice coding' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <Link href={item.href} className="block h-full">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl hover:border-white/40 transition-all duration-300 p-6 h-full group cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                  <ChevronRight className="w-4 h-4 text-white/40 absolute top-6 right-6 group-hover:text-white/80 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>


        {/* Role Selection Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <h3 className="text-xl font-bold text-white/80 mb-6 text-center">Explore Dashboards</h3>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Parent Dashboard Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -8 }}
          >
            <Link href="/dashboard/parent" className="block h-full">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl hover:border-blue-400/50 transition-all duration-300 p-5 sm:p-8 h-full group cursor-pointer">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 space-y-6">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl shadow-lg group-hover:shadow-2xl transition-shadow">
                    👨‍👩‍👧
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Parent Portal</h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Monitor your child's learning journey with real-time progress tracking and insights
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-400/20 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      </div>
                      <p className="text-white/80 text-sm">Track course progress and lesson completion</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-400/20 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      </div>
                      <p className="text-white/80 text-sm">View achievements and skill development</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-400/20 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      </div>
                      <p className="text-white/80 text-sm">Direct messaging with instructors</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-400/20 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      </div>
                      <p className="text-white/80 text-sm">Download reports and certificates</p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-2">
                    <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm group-hover:gap-3 transition-all">
                      <span>Enter Dashboard</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Instructor Dashboard Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -8 }}
          >
            <Link href="/dashboard/instructor" className="block h-full">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl hover:border-purple-400/50 transition-all duration-300 p-5 sm:p-8 h-full group cursor-pointer">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 space-y-6">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-2xl shadow-lg group-hover:shadow-2xl transition-shadow">
                    👨‍🏫
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Instructor Hub</h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Empower your teaching with comprehensive student management and analytics
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-purple-400/20 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      </div>
                      <p className="text-white/80 text-sm">Manage multiple classes and cohorts</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-purple-400/20 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      </div>
                      <p className="text-white/80 text-sm">Real-time student performance analytics</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-purple-400/20 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      </div>
                      <p className="text-white/80 text-sm">Create assignments and track submissions</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-purple-400/20 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      </div>
                      <p className="text-white/80 text-sm">Generate detailed progress reports</p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-2">
                    <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm group-hover:gap-3 transition-all">
                      <span>Enter Dashboard</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24 max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl p-6 sm:p-8 md:p-12">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-12 text-center">Why ROBOTIX?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-400/20 to-transparent border border-blue-400/30 flex items-center justify-center mx-auto mb-4 text-2xl">
                    🎓
                  </div>
                  <h4 className="font-bold text-white mb-2">Expert Curriculum</h4>
                  <p className="text-white/70 text-sm leading-relaxed">Structured learning programs designed by experienced educators for ages 6–18</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-400/20 to-transparent border border-purple-400/30 flex items-center justify-center mx-auto mb-4 text-2xl">
                    🔒
                  </div>
                  <h4 className="font-bold text-white mb-2">Safe & Secure</h4>
                  <p className="text-white/70 text-sm leading-relaxed">Ad-free platform with parental controls and comprehensive privacy protection</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-pink-400/20 to-transparent border border-pink-400/30 flex items-center justify-center mx-auto mb-4 text-2xl">
                    🚀
                  </div>
                  <h4 className="font-bold text-white mb-2">Future Ready</h4>
                  <p className="text-white/70 text-sm leading-relaxed">Robotics, coding, and problem-solving skills for tomorrow's opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20 py-8 text-center text-white/50 text-sm">
        <p>© 2026 ROBOTIX Institute. All rights reserved.</p>
      </footer>
    </div>
  );
}
