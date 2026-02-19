'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, ArrowRight, Filter } from 'lucide-react';

type EventType = 'workshop' | 'open-day' | 'competition' | 'camp' | 'webinar';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
  spots: number;
  spotsLeft: number;
  description: string;
  price: string;
}

const typeLabels: Record<EventType, { label: string; color: string }> = {
  workshop: { label: 'Workshop', color: 'bg-blue-500' },
  'open-day': { label: 'Open Day', color: 'bg-green-500' },
  competition: { label: 'Competition', color: 'bg-red-500' },
  camp: { label: 'Holiday Camp', color: 'bg-purple-500' },
  webinar: { label: 'Webinar', color: 'bg-amber-500' },
};

const events: Event[] = [
  {
    id: 1,
    title: 'Open Day: Experience Robotix',
    date: '2026-02-22',
    time: '9:00 AM - 1:00 PM',
    location: 'Robotix Institute, Great East Road',
    type: 'open-day',
    spots: 50,
    spotsLeft: 18,
    description: 'Visit our facility, meet instructors, and let your child try a free mini-workshop. Refreshments provided.',
    price: 'Free',
  },
  {
    id: 2,
    title: 'Build Your First Robot Workshop',
    date: '2026-03-01',
    time: '10:00 AM - 2:00 PM',
    location: 'Robotix Institute, Great East Road',
    type: 'workshop',
    spots: 20,
    spotsLeft: 7,
    description: 'A hands-on 4-hour workshop where kids ages 6-12 build and program their first robot to take home.',
    price: '350 ZMW',
  },
  {
    id: 3,
    title: 'Easter Holiday Coding Camp',
    date: '2026-03-30',
    time: '8:30 AM - 4:00 PM (5 days)',
    location: 'Robotix Institute, Great East Road',
    type: 'camp',
    spots: 30,
    spotsLeft: 12,
    description: 'A week-long intensive coding camp during Easter break. Learn Python, build games, and make new friends!',
    price: '2,500 ZMW',
  },
  {
    id: 4,
    title: 'Zambia Junior Robotics Challenge 2026',
    date: '2026-04-19',
    time: '8:00 AM - 5:00 PM',
    location: 'Mulungushi Conference Centre, Lusaka',
    type: 'competition',
    spots: 100,
    spotsLeft: 42,
    description: 'Annual robotics competition for schools and coding clubs. Teams of 2-4 students compete in challenges.',
    price: '500 ZMW/team',
  },
  {
    id: 5,
    title: 'Parent Webinar: STEM Careers for Your Child',
    date: '2026-03-15',
    time: '7:00 PM - 8:30 PM',
    location: 'Online (Zoom)',
    type: 'webinar',
    spots: 200,
    spotsLeft: 156,
    description: 'Learn about career paths in STEM, how to support your child\'s tech journey, and Q&A with industry professionals.',
    price: 'Free',
  },
  {
    id: 6,
    title: 'Drone Flying & Programming Workshop',
    date: '2026-04-05',
    time: '9:00 AM - 1:00 PM',
    location: 'Robotix Institute, Great East Road',
    type: 'workshop',
    spots: 15,
    spotsLeft: 3,
    description: 'Learn to fly and program drones! Ages 10+. Includes outdoor flying practice and autonomous flight programming.',
    price: '500 ZMW',
  },
  {
    id: 7,
    title: 'Winter Holiday STEM Camp',
    date: '2026-07-06',
    time: '8:30 AM - 4:00 PM (10 days)',
    location: 'Robotix Institute, Great East Road',
    type: 'camp',
    spots: 40,
    spotsLeft: 40,
    description: 'Our flagship 2-week summer camp covering robotics, coding, AI, and digital skills. Ages 6-16.',
    price: '5,000 ZMW',
  },
];

const filterTypes = ['All', 'workshop', 'open-day', 'competition', 'camp', 'webinar'] as const;

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filtered = activeFilter === 'All'
    ? events
    : events.filter((e) => e.type === activeFilter);

  const upcoming = filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-4"
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                activeFilter === type
                  ? 'bg-accent-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {type === 'All' ? (
                <><Filter className="w-3.5 h-3.5" /> All Events</>
              ) : (
                typeLabels[type as EventType].label
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Events List */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-4">
          {upcoming.map((event, i) => {
            const percentFull = ((event.spots - event.spotsLeft) / event.spots) * 100;
            const typeInfo = typeLabels[event.type];
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
                      <span className={`${typeInfo.color} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                        {typeInfo.label}
                      </span>
                      <span className="text-accent-400 font-bold text-sm">{event.price}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {event.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {event.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {event.spotsLeft} spots left</span>
                    </div>
                    {/* Capacity bar */}
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${percentFull > 80 ? 'bg-red-400' : 'bg-accent-400'}`}
                        style={{ width: `${percentFull}%` }}
                      />
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
          })}
        </div>
      </section>

      {/* Subscribe */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Don&apos;t Miss Out</h2>
          <p className="text-gray-600 mb-6">Get notified about new events and early-bird discounts.</p>
          <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); const input = e.currentTarget.querySelector('input'); if (input && input.value) { alert("You'll be notified about upcoming events!"); input.value = ''; } }}>
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
