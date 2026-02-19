'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Users, DollarSign, GraduationCap,
  Calendar, Award, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';

const stats = [
  { label: 'Total Revenue', value: 'ZMW 425,000', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'bg-green-500/20 text-green-400' },
  { label: 'Active Students', value: '248', change: '+8.3%', trend: 'up', icon: Users, color: 'bg-blue-500/20 text-blue-400' },
  { label: 'Enrollment Rate', value: '78%', change: '+5.2%', trend: 'up', icon: GraduationCap, color: 'bg-purple-500/20 text-purple-400' },
  { label: 'Avg. Attendance', value: '92%', change: '-1.3%', trend: 'down', icon: Calendar, color: 'bg-orange-500/20 text-orange-400' },
];

const revenueData = [
  { month: 'Sep', amount: 32000 },
  { month: 'Oct', amount: 38000 },
  { month: 'Nov', amount: 42000 },
  { month: 'Dec', amount: 35000 },
  { month: 'Jan', amount: 48000 },
  { month: 'Feb', amount: 52000 },
];

const programPerformance = [
  { name: 'Robotics Fundamentals', students: 85, revenue: 212500, avgScore: 88, completion: 75, color: 'bg-blue-500' },
  { name: 'Python for Kids', students: 62, revenue: 124000, avgScore: 82, completion: 68, color: 'bg-green-500' },
  { name: 'Web Development Jr', students: 48, revenue: 96000, avgScore: 79, completion: 72, color: 'bg-purple-500' },
  { name: 'Scratch Coding', students: 53, revenue: 79500, avgScore: 91, completion: 85, color: 'bg-orange-500' },
];

const topStudents = [
  { name: 'Mwamba Chisanga', program: 'Robotics', score: 96, avatar: '👦🏾' },
  { name: 'Natasha Mulenga', program: 'Python', score: 94, avatar: '👧🏾' },
  { name: 'Chilufya Bwalya', program: 'Web Dev', score: 93, avatar: '👦🏿' },
  { name: 'Thandiwe Nyirenda', program: 'Scratch', score: 92, avatar: '👧🏿' },
  { name: 'Kunda Tembo', program: 'Robotics', score: 91, avatar: '👦🏾' },
];

const instructorStats = [
  { name: 'Mr. Banda', classes: 12, students: 85, rating: 4.9, attendance: 96 },
  { name: 'Ms. Phiri', classes: 10, students: 62, rating: 4.8, attendance: 94 },
  { name: 'Mr. Mumba', classes: 8, students: 48, rating: 4.7, attendance: 92 },
  { name: 'Ms. Zulu', classes: 9, students: 53, rating: 4.9, attendance: 97 },
];

const recentEnrollments = [
  { child: 'Bupe Mwale', parent: 'Mrs. Mwale', program: 'Robotics Fundamentals', date: '2026-02-09', status: 'confirmed' },
  { child: 'Chanda Kapata', parent: 'Mr. Kapata', program: 'Python for Kids', date: '2026-02-08', status: 'confirmed' },
  { child: 'Luka Sakala', parent: 'Mrs. Sakala', program: 'Scratch Coding', date: '2026-02-07', status: 'pending' },
  { child: 'Monde Sichone', parent: 'Mr. Sichone', program: 'Web Dev Junior', date: '2026-02-06', status: 'confirmed' },
];

function SimpleBarChart({ data, maxAmount }: { data: typeof revenueData; maxAmount: number }) {
  return (
    <div className="flex items-end justify-between gap-3 h-48">
      {data.map((item, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
          <span className="text-gray-600 text-xs font-medium">
            {(item.amount / 1000).toFixed(0)}K
          </span>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(item.amount / maxAmount) * 100}%` }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="w-full bg-gradient-to-t from-accent-500 to-yellow-400 rounded-t-lg min-h-[4px]"
          />
          <span className="text-gray-500 text-xs">{item.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months');
  const maxRevenue = Math.max(...revenueData.map(d => d.amount));

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium mb-3">
              <BarChart3 className="w-4 h-4" /> Analytics
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-600 mt-1">Platform performance overview and insights</p>
          </div>
          <select
            aria-label="Select time range"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/50"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900 font-bold text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent-400" /> Revenue Trend
              </h2>
              <span className="text-accent-400 font-bold">ZMW 247,000 <span className="text-xs text-gray-500">this period</span></span>
            </div>
            <SimpleBarChart data={revenueData} maxAmount={maxRevenue} />
          </div>

          {/* Top Students */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-gray-900 font-bold text-lg flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-accent-400" /> Top Students
            </h2>
            <div className="space-y-3">
              {topStudents.map((student, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-400 font-bold text-sm w-6">#{idx + 1}</span>
                  <span className="text-xl">{student.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium text-sm truncate">{student.name}</p>
                    <p className="text-gray-500 text-xs">{student.program}</p>
                  </div>
                  <span className="text-accent-400 font-bold text-sm">{student.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Program Performance */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 mb-8">
          <h2 className="text-gray-900 font-bold text-lg flex items-center gap-2 mb-6">
            <GraduationCap className="w-5 h-5 text-accent-400" /> Program Performance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                  <th className="text-left pb-3 pr-4">Program</th>
                  <th className="text-center pb-3 px-4">Students</th>
                  <th className="text-center pb-3 px-4">Revenue</th>
                  <th className="text-center pb-3 px-4">Avg Score</th>
                  <th className="text-center pb-3 pl-4">Completion</th>
                </tr>
              </thead>
              <tbody>
                {programPerformance.map((prog, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${prog.color}`} />
                        <span className="text-gray-900 font-medium text-sm">{prog.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4 text-gray-700 text-sm">{prog.students}</td>
                    <td className="text-center py-4 px-4 text-accent-400 font-semibold text-sm">ZMW {prog.revenue.toLocaleString()}</td>
                    <td className="text-center py-4 px-4">
                      <span className={`font-semibold text-sm ${prog.avgScore >= 85 ? 'text-green-400' : prog.avgScore >= 75 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {prog.avgScore}%
                      </span>
                    </td>
                    <td className="text-center py-4 pl-4">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-20 h-2 bg-brand-500 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${prog.color}`} style={{ width: `${prog.completion}%` }} />
                        </div>
                        <span className="text-gray-600 text-xs">{prog.completion}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Instructor Performance */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-gray-900 font-bold text-lg flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-accent-400" /> Instructor Metrics
            </h2>
            <div className="space-y-4">
              {instructorStats.map((inst, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-gray-900 font-semibold">{inst.name}</h3>
                    <div className="flex items-center gap-1 text-accent-400">
                      <Award className="w-3.5 h-3.5" />
                      <span className="font-bold text-sm">{inst.rating}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-gray-900 font-bold">{inst.classes}</p>
                      <p className="text-gray-500 text-xs">Classes</p>
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold">{inst.students}</p>
                      <p className="text-gray-500 text-xs">Students</p>
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold">{inst.attendance}%</p>
                      <p className="text-gray-500 text-xs">Attendance</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Enrollments */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-gray-900 font-bold text-lg flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-accent-400" /> Recent Enrollments
            </h2>
            <div className="space-y-3">
              {recentEnrollments.map((enr, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium text-sm">{enr.child}</p>
                    <p className="text-gray-500 text-xs">{enr.program} • {enr.parent}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      enr.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {enr.status}
                    </span>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(enr.date).toLocaleDateString('en-ZM', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
