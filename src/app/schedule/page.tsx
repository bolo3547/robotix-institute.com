'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight,
  Check, AlertCircle, Star, Phone
} from 'lucide-react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const programs = [
  { id: '1', name: 'Robotics Fundamentals', ageGroup: '9-12', color: 'bg-blue-500' },
  { id: '2', name: 'Python for Kids', ageGroup: '10-14', color: 'bg-green-500' },
  { id: '3', name: 'Web Development Junior', ageGroup: '12-16', color: 'bg-purple-500' },
  { id: '4', name: 'Scratch Coding', ageGroup: '6-8', color: 'bg-orange-500' },
];

const mockSlots = [
  { id: '1', programId: '1', date: '2026-02-12', startTime: '09:00', endTime: '10:30', instructor: 'Mr. Banda', capacity: 12, booked: 8, type: 'regular' as const, location: 'Lab A' },
  { id: '2', programId: '1', date: '2026-02-12', startTime: '14:00', endTime: '15:30', instructor: 'Mr. Banda', capacity: 12, booked: 12, type: 'regular' as const, location: 'Lab A' },
  { id: '3', programId: '2', date: '2026-02-13', startTime: '10:00', endTime: '11:30', instructor: 'Ms. Phiri', capacity: 10, booked: 6, type: 'regular' as const, location: 'Lab B' },
  { id: '4', programId: '3', date: '2026-02-14', startTime: '14:00', endTime: '16:00', instructor: 'Mr. Mumba', capacity: 8, booked: 3, type: 'trial' as const, location: 'Lab A' },
  { id: '5', programId: '4', date: '2026-02-15', startTime: '09:00', endTime: '10:00', instructor: 'Ms. Zulu', capacity: 15, booked: 10, type: 'regular' as const, location: 'Lab C' },
  { id: '6', programId: '1', date: '2026-02-16', startTime: '09:00', endTime: '10:30', instructor: 'Mr. Banda', capacity: 12, booked: 5, type: 'regular' as const, location: 'Lab A' },
];

const myBookings = [
  { id: '1', program: 'Robotics Fundamentals', child: 'Mwamba', date: '2026-02-12', time: '09:00 - 10:30', status: 'confirmed', type: 'regular' },
  { id: '2', program: 'Python for Kids', child: 'Natasha', date: '2026-02-13', time: '10:00 - 11:30', status: 'confirmed', type: 'regular' },
  { id: '3', program: 'Web Dev Junior', child: 'Chilufya', date: '2026-02-14', time: '14:00 - 16:00', status: 'pending', type: 'trial' },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'book' | 'my-bookings'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(1); // February
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [bookingModal, setBookingModal] = useState<typeof mockSlots[0] | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const slotsForDate = selectedDate
    ? mockSlots.filter(s => s.date === selectedDate && (selectedProgram === 'all' || s.programId === selectedProgram))
    : [];

  const hasEvents = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mockSlots.some(s => s.date === dateStr);
  };

  const handleBook = () => {
    setBookingSuccess(true);
    setTimeout(() => { setBookingModal(null); setBookingSuccess(false); }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" /> Scheduling
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Schedule &amp; Book Classes</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse available class slots, book trial sessions, and manage your schedule.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-xl w-fit mx-auto">
          {[
            { id: 'calendar', label: 'Calendar View', icon: Calendar },
            { id: 'book', label: 'Book a Class', icon: Clock },
            { id: 'my-bookings', label: 'My Bookings', icon: Check },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === id
                  ? 'bg-accent-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Calendar View */}
          {activeTab === 'calendar' && (
            <motion.div key="calendar" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Previous month">
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">{months[currentMonth]} {currentYear}</h2>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Next month">
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {daysOfWeek.map(day => (
                      <div key={day} className="text-center text-gray-500 text-sm font-medium py-2">{day}</div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-12" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const isSelected = selectedDate === dateStr;
                      const hasClass = hasEvents(day);
                      const isToday = day === 9 && currentMonth === 1 && currentYear === 2026;

                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`h-12 rounded-lg text-sm font-medium relative transition-all ${
                            isSelected
                              ? 'bg-accent-500 text-white'
                              : isToday
                              ? 'bg-accent-100 text-gray-900 ring-2 ring-accent-500/50'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {day}
                          {hasClass && !isSelected && (
                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent-500 rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-2 h-2 bg-accent-500 rounded-full" /> Classes available
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-4 h-4 ring-2 ring-accent-500/50 rounded" /> Today
                    </div>
                  </div>
                </div>

                {/* Selected Date Slots */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-gray-900 font-bold mb-4">
                    {selectedDate
                      ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-ZM', { weekday: 'long', month: 'long', day: 'numeric' })
                      : 'Select a date'}
                  </h3>

                  {/* Program Filter */}
                  <div className="mb-4">
                    <select
                      aria-label="Filter by program"
                      value={selectedProgram}
                      onChange={(e) => setSelectedProgram(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/50"
                    >
                      <option value="all">All Programs</option>
                      {programs.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    {slotsForDate.length > 0 ? (
                      slotsForDate.map(slot => {
                        const program = programs.find(p => p.id === slot.programId);
                        const isFull = slot.booked >= slot.capacity;
                        return (
                          <div key={slot.id} className={`p-4 rounded-xl border ${isFull ? 'bg-gray-50 border-gray-100' : 'bg-gray-100 border-gray-200'}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-3 h-3 rounded-full ${program?.color}`} />
                              <span className="text-gray-900 font-semibold text-sm">{program?.name}</span>
                              {slot.type === 'trial' && (
                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">FREE TRIAL</span>
                              )}
                            </div>
                            <div className="space-y-1 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {slot.startTime} - {slot.endTime}</div>
                              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {slot.location}</div>
                              <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> {slot.booked}/{slot.capacity} spots</div>
                              <div className="flex items-center gap-2"><Star className="w-3.5 h-3.5" /> {slot.instructor}</div>
                            </div>
                            <button
                              onClick={() => !isFull && setBookingModal(slot)}
                              disabled={isFull}
                              className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
                                isFull
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-accent-500 text-white hover:bg-accent-600'
                              }`}
                            >
                              {isFull ? 'Full — Join Waitlist' : 'Book Now'}
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500 text-sm">
                          {selectedDate ? 'No classes on this date' : 'Select a date to view classes'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Book a Class Tab */}
          {activeTab === 'book' && (
            <motion.div key="book" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Free Trial Section */}
              <div className="bg-gradient-to-r from-green-500/20 to-accent-500/10 border border-green-500/30 rounded-2xl p-8 mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">📚 Book a Free Trial Class!</h2>
                <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                  Not sure which program is right for your child? Try a free trial class and see the magic of robotics and coding!
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {programs.map(p => (
                    <div key={p.id} className="p-4 bg-white rounded-xl">
                      <div className={`w-8 h-8 ${p.color} rounded-lg mb-2 mx-auto`} />
                      <h3 className="text-gray-900 font-semibold text-sm">{p.name}</h3>
                      <p className="text-gray-500 text-xs">Ages {p.ageGroup}</p>
                    </div>
                  ))}
                </div>
                <a
                  href="https://wa.me/260956355117?text=Hi%20ROBOTIX%20INSTITUTE!%20I%27d%20like%20to%20book%20a%20free%20trial%20class%20for%20my%20child."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-400 transition-colors"
                >
                  <Phone className="w-5 h-5" /> Book via WhatsApp
                </a>
              </div>

              {/* All Available Slots */}
              <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Available Classes</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockSlots.filter(s => s.booked < s.capacity).map(slot => {
                  const program = programs.find(p => p.id === slot.programId);
                  return (
                    <motion.div
                      key={slot.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 bg-white border border-gray-200 rounded-xl hover:border-accent-500/30 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-3 h-3 rounded-full ${program?.color}`} />
                        <span className="text-gray-900 font-semibold">{program?.name}</span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(slot.date + 'T00:00:00').toLocaleDateString('en-ZM', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {slot.startTime} - {slot.endTime}</div>
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {slot.location}</div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span className={slot.capacity - slot.booked <= 3 ? 'text-orange-400' : ''}>
                            {slot.capacity - slot.booked} spots left
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setBookingModal(slot)}
                        className="w-full py-2.5 bg-accent-500 text-white rounded-lg font-semibold text-sm hover:bg-accent-600 transition-colors"
                      >
                        Book This Class
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* My Bookings Tab */}
          {activeTab === 'my-bookings' && (
            <motion.div key="my-bookings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="space-y-4">
                {myBookings.map((booking, idx) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      booking.status === 'confirmed' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                    }`}>
                      {booking.status === 'confirmed' ? (
                        <Check className="w-6 h-6 text-green-400" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-semibold">{booking.program}</h3>
                      <div className="flex flex-wrap gap-x-4 text-sm text-gray-600 mt-1">
                        <span>Student: {booking.child}</span>
                        <span>{new Date(booking.date + 'T00:00:00').toLocaleDateString('en-ZM', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        <span>{booking.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {booking.type === 'trial' && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">TRIAL</span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Modal */}
        <AnimatePresence>
          {bookingModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
              onClick={() => { setBookingModal(null); setBookingSuccess(false); }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              >
                {bookingSuccess ? (
                  <div className="text-center py-4">
                    <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Booked Successfully!</h2>
                    <p className="text-gray-600">You&apos;ll receive a confirmation via SMS and email.</p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Booking</h2>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Program</span>
                        <span className="text-gray-900">{programs.find(p => p.id === bookingModal.programId)?.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Date</span>
                        <span className="text-gray-900">{new Date(bookingModal.date + 'T00:00:00').toLocaleDateString('en-ZM', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Time</span>
                        <span className="text-gray-900">{bookingModal.startTime} - {bookingModal.endTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Instructor</span>
                        <span className="text-gray-900">{bookingModal.instructor}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Location</span>
                        <span className="text-gray-900">{bookingModal.location}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="select-child" className="text-gray-900 text-sm font-medium mb-2 block">Select Child</label>
                      <select id="select-child" className="w-full px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/50">
                        <option>Mwamba Chisanga</option>
                        <option>Natasha Mulenga</option>
                        <option>Chilufya Bwalya</option>
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => { setBookingModal(null); setBookingSuccess(false); }}
                        className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBook}
                        className="flex-1 py-3 bg-accent-500 text-white rounded-xl font-bold hover:bg-accent-600 transition-colors"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
