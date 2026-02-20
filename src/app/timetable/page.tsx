'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Calendar, Clock, MapPin, Users,
  Filter, Search, Printer, RefreshCw, User, Grid3X3
} from 'lucide-react';

interface ScheduleEntry {
  id: string;
  title: string;
  description?: string;
  program: string;
  instructor?: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location?: string;
  ageGroup?: string;
  capacity: number;
  enrolled: number;
  active: boolean;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

// Time slots from 07:00 to 18:00
const TIME_SLOTS = Array.from({ length: 23 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7;
  const minutes = i % 2 === 0 ? '00' : '30';
  return `${String(hour).padStart(2, '0')}:${minutes}`;
});

// Color map for programs
const PROGRAM_COLORS: Record<string, { bg: string; border: string; text: string; darkBg: string; darkBorder: string; darkText: string }> = {};
const COLOR_PALETTE = [
  { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800', darkBg: 'bg-blue-900/40', darkBorder: 'border-blue-500/50', darkText: 'text-blue-200' },
  { bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-800', darkBg: 'bg-emerald-900/40', darkBorder: 'border-emerald-500/50', darkText: 'text-emerald-200' },
  { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800', darkBg: 'bg-purple-900/40', darkBorder: 'border-purple-500/50', darkText: 'text-purple-200' },
  { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800', darkBg: 'bg-orange-900/40', darkBorder: 'border-orange-500/50', darkText: 'text-orange-200' },
  { bg: 'bg-rose-100', border: 'border-rose-300', text: 'text-rose-800', darkBg: 'bg-rose-900/40', darkBorder: 'border-rose-500/50', darkText: 'text-rose-200' },
  { bg: 'bg-cyan-100', border: 'border-cyan-300', text: 'text-cyan-800', darkBg: 'bg-cyan-900/40', darkBorder: 'border-cyan-500/50', darkText: 'text-cyan-200' },
  { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-800', darkBg: 'bg-amber-900/40', darkBorder: 'border-amber-500/50', darkText: 'text-amber-200' },
  { bg: 'bg-indigo-100', border: 'border-indigo-300', text: 'text-indigo-800', darkBg: 'bg-indigo-900/40', darkBorder: 'border-indigo-500/50', darkText: 'text-indigo-200' },
];

function getProgramColor(program: string) {
  if (!PROGRAM_COLORS[program]) {
    const idx = Object.keys(PROGRAM_COLORS).length % COLOR_PALETTE.length;
    PROGRAM_COLORS[program] = COLOR_PALETTE[idx];
  }
  return PROGRAM_COLORS[program];
}

function timeToMinutes(time: string) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export default function TimetablePage() {
  const { data: session } = useSession();
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterInstructor, setFilterInstructor] = useState<string>('all');
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [highlightMine, setHighlightMine] = useState(false);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/schedule');
      if (res.ok) {
        const data = await res.json();
        setSchedules(data);
      }
    } catch (err) {
      console.error('Failed to fetch schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Auto-highlight if user is an instructor
  useEffect(() => {
    if (session?.user && (session.user as any).role === 'instructor') {
      setHighlightMine(true);
    }
  }, [session]);

  const instructors = useMemo(() => {
    const set = new Set(schedules.map((s) => s.instructor).filter(Boolean));
    return Array.from(set).sort();
  }, [schedules]);

  const programs = useMemo(() => {
    const set = new Set(schedules.map((s) => s.program));
    return Array.from(set).sort();
  }, [schedules]);

  // Filter schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      if (filterInstructor !== 'all' && s.instructor !== filterInstructor) return false;
      if (filterProgram !== 'all' && s.program !== filterProgram) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          s.title.toLowerCase().includes(q) ||
          s.program.toLowerCase().includes(q) ||
          (s.instructor || '').toLowerCase().includes(q) ||
          (s.location || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [schedules, filterInstructor, filterProgram, searchQuery]);

  // Group by day
  const schedulesByDay = useMemo(() => {
    const map: Record<string, ScheduleEntry[]> = {};
    DAYS.forEach((d) => (map[d] = []));
    filteredSchedules.forEach((s) => {
      if (map[s.dayOfWeek]) {
        map[s.dayOfWeek].push(s);
      }
    });
    // Sort each day by startTime
    Object.values(map).forEach((arr) => arr.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)));
    return map;
  }, [filteredSchedules]);

  const userName = session?.user?.name || '';
  const isMySession = (entry: ScheduleEntry) => {
    if (!highlightMine || !userName) return false;
    return entry.instructor?.toLowerCase().includes(userName.split(' ')[0].toLowerCase()) || false;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-16 print:bg-white">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-brand-600 via-brand-700 to-accent-600 text-white overflow-hidden print:hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-3">
                  <Grid3X3 className="w-4 h-4" /> Worker Timetable
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                  Weekly Timetable
                </h1>
                <p className="text-white/80 text-base sm:text-lg max-w-xl">
                  View all staff duties and class assignments at a glance — like a spreadsheet.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchSchedules}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-4 mb-6 print:hidden"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, program, instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search timetable"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Instructor Filter */}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <select
                value={filterInstructor}
                onChange={(e) => setFilterInstructor(e.target.value)}
                title="Filter by instructor"
                aria-label="Filter by instructor"
                className="px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">All Instructors</option>
                {instructors.map((inst) => (
                  <option key={inst} value={inst!}>{inst}</option>
                ))}
              </select>
            </div>

            {/* Program Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterProgram}
                onChange={(e) => setFilterProgram(e.target.value)}
                title="Filter by program"
                aria-label="Filter by program"
                className="px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">All Programs</option>
                {programs.map((prog) => (
                  <option key={prog} value={prog}>{prog}</option>
                ))}
              </select>
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-brand-600 text-white shadow'
                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-brand-600 text-white shadow'
                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                List
              </button>
            </div>

            {/* Highlight My Sessions */}
            {session?.user && (
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={highlightMine}
                  onChange={(e) => setHighlightMine(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                Highlight my duties
              </label>
            )}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-200 border-t-brand-600"></div>
          </div>
        )}

        {/* No Data */}
        {!loading && filteredSchedules.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Calendar className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-slate-400 mb-2">No schedules found</h3>
            <p className="text-gray-400 dark:text-slate-500 mb-6">
              {searchQuery || filterInstructor !== 'all' || filterProgram !== 'all'
                ? 'Try adjusting your filters'
                : 'The admin has not added any timetable entries yet'}
            </p>
            {(session?.user as any)?.role === 'admin' && (
              <Link
                href="/admin/schedule"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                + Add Schedules
              </Link>
            )}
          </motion.div>
        )}

        {/* GRID VIEW — Google Sheets Style */}
        {!loading && filteredSchedules.length > 0 && viewMode === 'grid' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[900px]">
                {/* Column Headers = Days */}
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 w-20 bg-gray-100 dark:bg-slate-800 border-b border-r border-gray-200 dark:border-slate-700 px-3 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                      Time
                    </th>
                    {DAYS.map((day) => (
                      <th
                        key={day}
                        className="bg-gray-100 dark:bg-slate-800 border-b border-r last:border-r-0 border-gray-200 dark:border-slate-700 px-3 py-3 text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider text-center min-w-[140px]"
                      >
                        {DAY_LABELS[day]}
                        <span className="block text-[10px] text-gray-400 dark:text-slate-500 font-normal mt-0.5">
                          {schedulesByDay[day].length} session{schedulesByDay[day].length !== 1 ? 's' : ''}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map((slot, idx) => {
                    const slotMinutes = timeToMinutes(slot);
                    const nextSlotMinutes = slotMinutes + 30;

                    return (
                      <tr
                        key={slot}
                        className={`${
                          idx % 2 === 0
                            ? 'bg-white dark:bg-slate-900'
                            : 'bg-gray-50/50 dark:bg-slate-900/50'
                        } hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors`}
                      >
                        {/* Time label */}
                        <td className="sticky left-0 z-10 bg-inherit border-r border-b border-gray-200 dark:border-slate-700 px-3 py-2 text-xs font-mono text-gray-500 dark:text-slate-400 whitespace-nowrap">
                          {slot}
                        </td>

                        {/* Day cells */}
                        {DAYS.map((day) => {
                          const entriesInSlot = schedulesByDay[day].filter((entry) => {
                            const start = timeToMinutes(entry.startTime);
                            return start >= slotMinutes && start < nextSlotMinutes;
                          });

                          return (
                            <td
                              key={day}
                              className="border-r last:border-r-0 border-b border-gray-200 dark:border-slate-700 px-1.5 py-1 align-top min-h-[40px]"
                            >
                              {entriesInSlot.map((entry) => {
                                const colors = getProgramColor(entry.program);
                                const mine = isMySession(entry);


                                return (
                                  <div
                                    key={entry.id}
                                    className={`
                                      rounded-lg border px-2.5 py-2 mb-1 text-xs transition-all cursor-default
                                      ${mine
                                        ? 'ring-2 ring-yellow-400 dark:ring-yellow-500 shadow-md'
                                        : ''
                                      }
                                      ${colors.bg} ${colors.border} ${colors.text}
                                      dark:${colors.darkBg} dark:${colors.darkBorder} dark:${colors.darkText}
                                    `}
                                    title={`${entry.title}\n${entry.program}\n${entry.startTime} - ${entry.endTime}\n${entry.instructor || 'No instructor'}\n${entry.location || 'No location'}`}
                                  >
                                    <div className="font-semibold text-[11px] leading-tight truncate">
                                      {entry.title}
                                    </div>
                                    <div className="flex items-center gap-1 mt-1 opacity-80">
                                      <Clock className="w-3 h-3 flex-shrink-0" />
                                      <span>{entry.startTime} – {entry.endTime}</span>
                                    </div>
                                    {entry.instructor && (
                                      <div className="flex items-center gap-1 mt-0.5 opacity-80">
                                        <User className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">{entry.instructor}</span>
                                      </div>
                                    )}
                                    {entry.location && (
                                      <div className="flex items-center gap-1 mt-0.5 opacity-70">
                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">{entry.location}</span>
                                      </div>
                                    )}
                                    {mine && (
                                      <div className="mt-1 px-1.5 py-0.5 bg-yellow-400/30 dark:bg-yellow-500/30 rounded text-yellow-700 dark:text-yellow-300 font-medium text-[10px] w-fit">
                                        YOUR DUTY
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* LIST VIEW */}
        {!loading && filteredSchedules.length > 0 && viewMode === 'list' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {DAYS.map((day) => {
              const entries = schedulesByDay[day];
              if (entries.length === 0) return null;

              return (
                <div key={day} className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                  <div className="bg-gray-50 dark:bg-slate-800 px-5 py-3 border-b border-gray-200 dark:border-slate-700">
                    <h3 className="font-bold text-gray-800 dark:text-white text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-brand-500" />
                      {DAY_LABELS[day]}
                      <span className="ml-auto text-sm font-normal text-gray-400 dark:text-slate-500">
                        {entries.length} session{entries.length !== 1 ? 's' : ''}
                      </span>
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-slate-800">
                          <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Time</th>
                          <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Title</th>
                          <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Program</th>
                          <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Instructor</th>
                          <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Location</th>
                          <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Capacity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map((entry) => {
                          const mine = isMySession(entry);
                          const colors = getProgramColor(entry.program);
                          return (
                            <tr
                              key={entry.id}
                              className={`border-b last:border-b-0 border-gray-100 dark:border-slate-800 transition-colors ${
                                mine
                                  ? 'bg-yellow-50 dark:bg-yellow-900/20'
                                  : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'
                              }`}
                            >
                              <td className="px-5 py-3 text-sm font-mono text-gray-600 dark:text-slate-300 whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                                  {entry.startTime} – {entry.endTime}
                                </div>
                              </td>
                              <td className="px-5 py-3">
                                <div className="text-sm font-semibold text-gray-800 dark:text-white">
                                  {entry.title}
                                  {mine && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200 rounded text-[10px] font-bold">
                                      YOUR DUTY
                                    </span>
                                  )}
                                </div>
                                {entry.ageGroup && (
                                  <div className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Ages {entry.ageGroup}</div>
                                )}
                              </td>
                              <td className="px-5 py-3">
                                <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${colors.bg} ${colors.text} dark:bg-opacity-40`}>
                                  {entry.program}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-sm text-gray-600 dark:text-slate-300">
                                <div className="flex items-center gap-1.5">
                                  <User className="w-3.5 h-3.5 text-gray-400" />
                                  {entry.instructor || '—'}
                                </div>
                              </td>
                              <td className="px-5 py-3 text-sm text-gray-600 dark:text-slate-300">
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                  {entry.location || '—'}
                                </div>
                              </td>
                              <td className="px-5 py-3 text-sm text-gray-600 dark:text-slate-300">
                                <div className="flex items-center gap-1.5">
                                  <Users className="w-3.5 h-3.5 text-gray-400" />
                                  {entry.enrolled}/{entry.capacity}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Legend */}
        {!loading && filteredSchedules.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-white dark:bg-slate-900 rounded-xl shadow border border-gray-200 dark:border-slate-700 p-5 print:shadow-none"
          >
            <h4 className="text-sm font-semibold text-gray-600 dark:text-slate-300 mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Program Legend
            </h4>
            <div className="flex flex-wrap gap-2">
              {programs.map((prog) => {
                const colors = getProgramColor(prog);
                return (
                  <span
                    key={prog}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.border} ${colors.text}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${colors.bg.replace('100', '500')}`}></span>
                    {prog}
                  </span>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          header, footer, nav, .print\\:hidden { display: none !important; }
          body { background: white !important; }
          .dark\\:bg-slate-900 { background: white !important; }
          .dark\\:text-white { color: black !important; }
          .dark\\:text-slate-300 { color: #333 !important; }
          .dark\\:border-slate-700 { border-color: #ddd !important; }
        }
      `}</style>
    </div>
  );
}
