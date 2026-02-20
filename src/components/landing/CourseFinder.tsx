'use client';

import { useState } from 'react';
import Link from 'next/link';

type AgeGroup = 'all' | '6-9' | '10-12' | '13-15' | '16-18';

const ageFilters: { value: AgeGroup; label: string }[] = [
  { value: 'all', label: 'All Ages' },
  { value: '6-9', label: '6-9 yrs' },
  { value: '10-12', label: '10-12 yrs' },
  { value: '13-15', label: '13-15 yrs' },
  { value: '16-18', label: '16-18 yrs' },
];

const courses = [
  {
    id: 1,
    name: 'Visual Programming & Intro to Robotics',
    ageGroup: '6-9' as AgeGroup,
    ageLabel: 'Ages 6-9',
    level: 'Beginner',
    duration: '2 hrs/week',
    price: '2,500',
    color: 'bg-pink-50 border-pink-200',
    iconBg: 'bg-pink-100 text-pink-600',
    emoji: '🧩',
    description: 'Play-based introduction to visual programming and robotics. Kids learn to code using drag-and-drop blocks while building fun projects.',
    skills: ['Visual coding', 'Intro to robotics', 'Problem solving'],
  },
  {
    id: 2,
    name: 'Coding & Robotics Foundations',
    ageGroup: '10-12' as AgeGroup,
    ageLabel: 'Ages 10-12',
    level: 'Beginner-Intermediate',
    duration: '2 hrs/week',
    price: '2,500',
    color: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100 text-blue-600',
    emoji: '🤖',
    description: 'Hands-on experience building robotics projects and developing coding skills. Students start programming and working with robotics kits.',
    skills: ['Block coding', 'Robotics builds', 'Game design'],
  },
  {
    id: 3,
    name: 'Python & Advanced Projects',
    ageGroup: '13-15' as AgeGroup,
    ageLabel: 'Ages 13-15',
    level: 'Intermediate',
    duration: '2 hrs/week',
    price: '3,000',
    color: 'bg-amber-50 border-amber-200',
    iconBg: 'bg-amber-100 text-amber-600',
    emoji: '🚀',
    description: 'Teens dive into Python programming and advanced robotics. Build real projects, learn sensors, and explore AI & IoT concepts.',
    skills: ['Python', 'Sensors & IoT', 'AI basics'],
  },
  {
    id: 4,
    name: 'Advanced Coding & C++',
    ageGroup: '16-18' as AgeGroup,
    ageLabel: 'Ages 16-18',
    level: 'Advanced',
    duration: '2 hrs/week',
    price: '3,500',
    color: 'bg-purple-50 border-purple-200',
    iconBg: 'bg-purple-100 text-purple-600',
    emoji: '💻',
    description: 'Advanced programming with Python, C++, and real-world engineering projects. Prepare for tech careers and competitions.',
    skills: ['C++', 'Python advanced', 'Engineering projects'],
  },
  {
    id: 5,
    name: 'Weekend Cohort Program',
    ageGroup: 'all' as AgeGroup,
    ageLabel: 'Ages 6-18',
    level: 'All Levels',
    duration: 'Weekend sessions',
    price: '3,500',
    color: 'bg-green-50 border-green-200',
    iconBg: 'bg-green-100 text-green-600',
    emoji: '☀️',
    description: 'Cohort-based weekend program at BongoHive / Hive Coworking. Learn coding and robotics in a collaborative, innovative environment.',
    skills: ['Team projects', 'Robotics builds', 'Creative coding'],
  },
  {
    id: 6,
    name: 'After-School Programs',
    ageGroup: 'all' as AgeGroup,
    ageLabel: 'Ages 6-18',
    level: 'All Levels',
    duration: 'After school',
    price: '2,500',
    color: 'bg-teal-50 border-teal-200',
    iconBg: 'bg-teal-100 text-teal-600',
    emoji: '🏫',
    description: 'Coding & robotics programs delivered at select schools across Lusaka. Empowering students with digital skills right where they learn.',
    skills: ['Digital literacy', 'Coding fundamentals', 'STEM skills'],
  },
];

export default function CourseFinder() {
  const [activeFilter, setActiveFilter] = useState<AgeGroup>('all');

  const filteredCourses = courses.filter(
    (c) => activeFilter === 'all' || c.ageGroup === activeFilter || c.ageGroup === 'all'
  );

  return (
    <section id="programs" className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Find the Right Program</h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            Filter by your child&apos;s age to discover the perfect program.
          </p>
        </div>

        {/* Age Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {ageFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter.value
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`card-3d rounded-xl border p-6 transition-all ${course.color}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${course.iconBg} flex items-center justify-center text-xl`}>
                  {course.emoji}
                </div>
                <div className="flex gap-2">
                  <span className="text-xs font-medium px-2.5 py-1 bg-white/80 rounded-full text-gray-600">
                    {course.ageLabel}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 bg-white/80 rounded-full text-gray-600">
                    {course.level}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{course.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{course.description}</p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {course.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-0.5 bg-white/60 rounded-md text-gray-600 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-black/5">
                <div>
                  <span className="text-lg font-bold text-gray-900">ZMW {course.price}</span>
                  <span className="text-sm text-gray-500">/mo</span>
                </div>
                <Link
                  href="/auth/signup"
                  className="text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors"
                >
                  Enroll →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
          >
            View all program details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
