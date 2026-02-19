'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ArrowRight, Filter } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  location: string | null;
  category: string;
  featured: boolean;
}

const categoryColors: Record<string, string> = {
  workshop: 'bg-blue-500',
  competition: 'bg-red-500',
  seminar: 'bg-amber-500',
  camp: 'bg-purple-500',
  exhibition: 'bg-teal-500',
  general: 'bg-green-500',
};

const filterTypes = ['All', 'workshop', 'competition', 'seminar', 'camp', 'exhibition', 'general'];

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Failed to load events:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'All'
    ? events
    : events.filter((e) => e.category === activeFilter);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4"
          >
            Events &amp; Workshops
          </motion.h1>
          <p className="text-xl text-gray-600">
            Workshops, camps, competitions, and open days — join the action!
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-2">
          {filterTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 capitalize ${
                activeFilter === type
                  ? 'bg-accent-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {type === 'All' ? (
                <><Filter className="w-3.5 h-3.5" /> All Events</>
              ) : (
                type
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Events List */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-4">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading events...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg mb-2">No upcoming events</p>
              <p className="text-sm">Check back soon for new events and workshops!</p>
            </div>
          ) : (
            filtered.map((event, i) => {
              const colorClass = categoryColors[event.category] || 'bg-gray-500';
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 shadow-sm transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Date block */}
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-xl flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">{new Date(event.date).getDate()}</span>
                      <span className="text-xs text-gray-500 uppercase">
                        {new Date(event.date).toLocaleString('en', { month: 'short' })}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`${colorClass} text-white text-xs font-bold px-2 py-0.5 rounded-full capitalize`}>
                          {event.category}
                        </span>
                        {event.featured && (
                          <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">Featured</span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(event.date).toLocaleDateString()}</span>
                        {event.time && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {event.time}</span>}
                        {event.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex-shrink-0">
                      <Link
                        href="/contact"
                        className="inline-flex items-center px-5 py-2.5 bg-accent-500 text-white text-sm font-semibold rounded-xl hover:bg-accent-600 transition-colors"
                      >
                        Register <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      {/* Subscribe */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Don&apos;t Miss Out</h2>
          <p className="text-gray-600 mb-6">Get notified about new events and early-bird discounts.</p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); const input = e.currentTarget.querySelector('input'); if (input && input.value) { alert("You'll be notified about upcoming events!"); input.value = ''; } }}>
            <input
              type="email"
              placeholder="Your email"
              required
              className="flex-1 px-4 py-3 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-400 outline-none"
            />
            <button type="submit" className="px-6 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors">
              Notify Me
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
