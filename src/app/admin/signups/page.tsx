'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, UserPlus, Search, Filter, Mail, Phone, Calendar,
  Shield, User, Users, ChevronDown, RefreshCw, Eye
} from 'lucide-react';

interface SignupUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  phone?: string | null;
  createdAt?: string;
  image?: string | null;
}

export default function AdminSignupsPage() {
  const [users, setUsers] = useState<SignupUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<SignupUser | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/api/admin/users';
      if (roleFilter !== 'all') url += `?role=${roleFilter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filteredUsers = users.filter(u => {
    const matchSearch = !search || 
      (u.name?.toLowerCase().includes(search.toLowerCase())) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const roleColors: Record<string, string> = {
    parent: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    student: 'bg-green-500/20 text-green-400 border-green-500/30',
    instructor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    admin: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const roleIcons: Record<string, React.ReactNode> = {
    parent: <Users className="w-4 h-4" />,
    student: <User className="w-4 h-4" />,
    instructor: <Shield className="w-4 h-4" />,
    admin: <Shield className="w-4 h-4" />,
  };

  const stats = {
    total: users.length,
    parents: users.filter(u => u.role === 'parent').length,
    students: users.filter(u => u.role === 'student').length,
    instructors: users.filter(u => u.role === 'instructor').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 text-white/70 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-cyan-400" />
            Sign Up Submissions
          </h1>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={fetchUsers}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <RefreshCw className="w-5 h-5" />
          </motion.button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Sign Ups', value: stats.total, color: 'from-cyan-500 to-blue-600', icon: <UserPlus className="w-5 h-5" /> },
            { label: 'Parents', value: stats.parents, color: 'from-blue-500 to-indigo-600', icon: <Users className="w-5 h-5" /> },
            { label: 'Students', value: stats.students, color: 'from-green-500 to-emerald-600', icon: <User className="w-5 h-5" /> },
            { label: 'Instructors', value: stats.instructors, color: 'from-purple-500 to-violet-600', icon: <Shield className="w-5 h-5" /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl bg-gradient-to-br ${stat.color} p-4`}
            >
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                {stat.icon} {stat.label}
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-white/10 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-white/40 focus:border-cyan-400 outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="bg-white/10 border border-white/10 rounded-lg pl-10 pr-8 py-2.5 text-white appearance-none cursor-pointer focus:border-cyan-400 outline-none"
            >
              <option value="all">All Roles</option>
              <option value="parent">Parents</option>
              <option value="student">Students</option>
              <option value="instructor">Instructors</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="inline-block">
              <RefreshCw className="w-8 h-8 text-cyan-400" />
            </motion.div>
            <p className="text-white/60 mt-2">Loading sign ups...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
            <UserPlus className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/60">No sign ups found</p>
          </div>
        ) : (
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3 text-white/60 text-sm font-medium">#</th>
                    <th className="text-left px-4 py-3 text-white/60 text-sm font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-white/60 text-sm font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-white/60 text-sm font-medium">Role</th>
                    <th className="text-left px-4 py-3 text-white/60 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="px-4 py-3 text-white/40 text-sm">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm font-bold">
                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <span className="text-white font-medium">{user.name || 'No name'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${user.email}`} className="text-cyan-400 hover:underline flex items-center gap-1 text-sm">
                          <Mail className="w-3.5 h-3.5" /> {user.email}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${roleColors[user.role] || 'bg-white/10 text-white/60'}`}>
                          {roleIcons[user.role]} {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedUser(user)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-cyan-500/20 text-cyan-400 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl font-bold">
                  {selectedUser.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedUser.name || 'No name'}</h3>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleColors[selectedUser.role] || ''}`}>
                    {roleIcons[selectedUser.role]} {selectedUser.role}
                  </span>
                </div>
              </div>

              <div className="space-y-3 bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span className="text-white/60">Email:</span>
                  <a href={`mailto:${selectedUser.email}`} className="text-cyan-400 hover:underline">{selectedUser.email}</a>
                </div>
                {selectedUser.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-green-400" />
                    <span className="text-white/60">Phone:</span>
                    <span className="text-white">{selectedUser.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/60">ID:</span>
                  <span className="text-white font-mono text-xs">{selectedUser.id}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`mailto:${selectedUser.email}`}
                  className="flex-1 py-2.5 rounded-lg bg-cyan-500 text-white text-center font-medium text-sm hover:bg-cyan-600 transition"
                >
                  📧 Email User
                </a>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2.5 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/20 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
