'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, BellOff, Check, CheckCheck, Trash2,
  GraduationCap, Calendar, CreditCard, Award, Megaphone,
  MessageSquare, UserCheck, FileCheck, Settings, X
} from 'lucide-react';

const typeIcons: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  grade_posted: { icon: GraduationCap, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  attendance_marked: { icon: UserCheck, color: 'text-green-400', bg: 'bg-green-500/20' },
  payment_due: { icon: CreditCard, color: 'text-red-400', bg: 'bg-red-500/20' },
  payment_received: { icon: CreditCard, color: 'text-green-400', bg: 'bg-green-500/20' },
  class_reminder: { icon: Calendar, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  achievement_unlocked: { icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  announcement: { icon: Megaphone, color: 'text-accent-400', bg: 'bg-accent-500/20' },
  message: { icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  enrollment_confirmed: { icon: Check, color: 'text-green-400', bg: 'bg-green-500/20' },
  certificate_ready: { icon: FileCheck, color: 'text-accent-400', bg: 'bg-accent-500/20' },
};

const mockNotifications = [
  { id: '1', type: 'grade_posted', title: 'New Grade Posted', message: 'Mwamba received 92% in Robotics Week 5 Quiz.', read: false, createdAt: '2026-02-09T10:30:00Z', actionUrl: '/dashboard/parent' },
  { id: '2', type: 'class_reminder', title: 'Class Tomorrow', message: 'Robotics Fundamentals class at 9:00 AM tomorrow.', read: false, createdAt: '2026-02-09T08:00:00Z', actionUrl: '/schedule' },
  { id: '3', type: 'achievement_unlocked', title: 'Badge Earned! 🎉', message: 'Mwamba earned the "Code Warrior" badge!', read: false, createdAt: '2026-02-08T15:00:00Z', actionUrl: '/leaderboard' },
  { id: '4', type: 'payment_due', title: 'Payment Reminder', message: 'March tuition of ZMW 2,500 for Python for Kids is due.', read: true, createdAt: '2026-02-07T09:00:00Z', actionUrl: '/payments' },
  { id: '5', type: 'announcement', title: 'Holiday Schedule', message: 'Classes will be suspended from March 15-22 for school break.', read: true, createdAt: '2026-02-06T12:00:00Z' },
  { id: '6', type: 'attendance_marked', title: 'Attendance Recorded', message: 'Natasha was marked present in Python for Kids class.', read: true, createdAt: '2026-02-05T10:00:00Z' },
  { id: '7', type: 'certificate_ready', title: 'Certificate Ready! 🏆', message: 'Download Chilufya\'s certificate for Web Development Junior.', read: true, createdAt: '2026-02-04T14:00:00Z', actionUrl: '/certificates' },
  { id: '8', type: 'message', title: 'Message from Mr. Banda', message: 'Regarding Mwamba\'s excellent progress in the robotics project...', read: true, createdAt: '2026-02-03T11:00:00Z' },
];

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-ZM', { month: 'short', day: 'numeric' });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    inApp: true, email: true, sms: true, whatsapp: false,
    grades: true, attendance: true, payments: true, announcements: true, reminders: true,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'all') return true;
    return n.type === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bell className="w-8 h-8 text-accent-400" />
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-gray-900 text-sm font-bold px-2.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-600 mt-1">Stay updated on your children&apos;s progress</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors text-sm"
            >
              <CheckCheck className="w-4 h-4" /> Mark all read
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors text-sm"
              aria-label="Notification settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'grade_posted', label: 'Grades' },
            { id: 'class_reminder', label: 'Reminders' },
            { id: 'payment_due', label: 'Payments' },
            { id: 'announcement', label: 'Announcements' },
            { id: 'achievement_unlocked', label: 'Achievements' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filter === id
                  ? 'bg-accent-500 text-white'
                  : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((notification, idx) => {
              const typeInfo = typeIcons[notification.type] || typeIcons.announcement;
              const Icon = typeInfo.icon;

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${
                    notification.read
                      ? 'bg-gray-50 border-gray-100 hover:bg-white'
                      : 'bg-accent-50 border-accent-200 hover:bg-accent-100'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${typeInfo.bg}`}>
                    <Icon className={`w-5 h-5 ${typeInfo.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-semibold text-sm ${notification.read ? 'text-gray-500' : 'text-gray-900'}`}>
                        {notification.title}
                        {!notification.read && (
                          <span className="inline-block w-2 h-2 bg-accent-500 rounded-full ml-2" />
                        )}
                      </h3>
                      <span className="text-gray-400 text-xs whitespace-nowrap">{timeAgo(notification.createdAt)}</span>
                    </div>
                    <p className={`text-sm mt-0.5 ${notification.read ? 'text-gray-500' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    {notification.actionUrl && (
                      <a href={notification.actionUrl} className="text-accent-400 text-xs mt-1 inline-block hover:text-accent-300">
                        View details →
                      </a>
                    )}
                  </div>

                  {/* Delete */}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-400 transition-all"
                    aria-label="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <BellOff className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You&apos;re all caught up!</p>
            </div>
          )}
        </div>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-accent-400" /> Notification Settings
                  </h2>
                  <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-900" aria-label="Close settings">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Channels */}
                <div className="mb-6">
                  <h3 className="text-gray-900 font-semibold mb-3">Delivery Channels</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'inApp', label: 'In-App Notifications', icon: '🔔' },
                      { key: 'email', label: 'Email', icon: '📧' },
                      { key: 'sms', label: 'SMS', icon: '📱' },
                      { key: 'whatsapp', label: 'WhatsApp', icon: '💬' },
                    ].map(({ key, label, icon }) => (
                      <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                        <span className="flex items-center gap-2 text-gray-700">
                          <span>{icon}</span> {label}
                        </span>
                        <div
                          onClick={() => setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                            settings[key as keyof typeof settings] ? 'bg-accent-500' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              settings[key as keyof typeof settings] ? 'translate-x-5' : ''
                            }`}
                          />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-gray-900 font-semibold mb-3">Notification Types</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'grades', label: 'Grades & Feedback' },
                      { key: 'attendance', label: 'Attendance Updates' },
                      { key: 'payments', label: 'Payment Reminders' },
                      { key: 'announcements', label: 'Announcements' },
                      { key: 'reminders', label: 'Class Reminders' },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                        <span className="text-gray-700">{label}</span>
                        <div
                          onClick={() => setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                            settings[key as keyof typeof settings] ? 'bg-accent-500' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              settings[key as keyof typeof settings] ? 'translate-x-5' : ''
                            }`}
                          />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full mt-6 py-3 bg-accent-500 text-white rounded-xl font-bold hover:bg-accent-600 transition-colors"
                >
                  Save Settings
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
