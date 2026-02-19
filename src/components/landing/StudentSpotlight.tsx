'use client';

import { useState } from 'react';
import Image from 'next/image';

const spotlights = [
  {
    name: 'Mwila Chanda',
    age: 14,
    achievement: '1st Place — National Robotics Competition 2024',
    quote: 'ROBOTIX taught me that I can build anything if I break the problem into smaller pieces.',
    program: 'Imagineering',
    image: '/students2.jpg',
    badge: '🥇',
  },
  {
    name: 'Natasha Banda',
    age: 12,
    achievement: 'Built a Solar-Powered Water Pump Prototype',
    quote: 'I want to use technology to help people in my village get clean water.',
    program: 'Byte Buddies',
    image: '/robotix1.jpg',
    badge: '🌟',
  },
  {
    name: 'Joseph Tembo',
    age: 16,
    achievement: 'Developed a School Attendance App with Python',
    quote: 'Coding opened a whole new world for me. Now I dream of studying at MIT.',
    program: 'Code Quest',
    image: '/robotix3.jpg',
    badge: '💻',
  },
  {
    name: 'Chileshe Mulenga',
    age: 10,
    achievement: 'Youngest Participant — Zambia Tech Expo 2024',
    quote: 'I love making robots! My favorite is the one that follows a line.',
    program: 'Byte Buddies',
    image: '/ai-learning.jpg',
    badge: '🤖',
  },
];

export default function StudentSpotlight() {
  const [active, setActive] = useState(0);
  const student = spotlights[active];

  return (
    <section className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-50 text-accent-600 text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
            <span>⭐</span> Student Spotlight
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Students Shine</h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            Celebrating the achievements of young innovators who are building the future.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Featured Student */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
            <Image
              src={student.image}
              alt={student.name}
              fill
              className="object-cover"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            {/* Content on image */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{student.badge}</span>
                <span className="text-xs font-semibold text-white/80 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  {student.program}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                {student.name}, {student.age}
              </h3>
              <p className="text-sm text-white/90 font-medium">{student.achievement}</p>
            </div>
          </div>

          {/* Details + Navigation */}
          <div>
            {/* Quote */}
            <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
              <svg className="w-8 h-8 text-accent-300 mb-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <blockquote className="text-lg text-gray-700 leading-relaxed mb-4">
                &ldquo;{student.quote}&rdquo;
              </blockquote>
              <p className="text-sm text-gray-500">
                — {student.name}, Age {student.age}
              </p>
            </div>

            {/* Student Cards */}
            <div className="grid grid-cols-2 gap-3">
              {spotlights.map((s, i) => (
                <button
                  key={s.name}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    i === active
                      ? 'border-accent-400 bg-accent-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={s.image} alt={s.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
                    <p className="text-xs text-gray-500 truncate">{s.program}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
