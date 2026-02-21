'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Award, BookOpen, Users, Star } from 'lucide-react';

const instructors = [
  {
    name: 'Expert Robotics Instructor',
    role: 'Lead Robotics & STEM',
    bio: 'Passionate about making robotics accessible to every child in Zambia.',
    specialties: ['Robotics', 'Arduino', 'IoT'],
    icon: '🤖',
  },
  {
    name: 'Python Programming Instructor',
    role: 'Lead Python & AI',
    bio: 'Helping students master Python through real-world projects and challenges.',
    specialties: ['Python', 'Data Science', 'AI Basics'],
    icon: '🐍',
  },
  {
    name: 'Web Development Instructor',
    role: 'Lead Web & App Dev',
    bio: 'Teaching modern web technologies to build the next generation of African developers.',
    specialties: ['HTML/CSS', 'JavaScript', 'React'],
    icon: '🌐',
  },
  {
    name: 'Electronics & Hardware Instructor',
    role: 'Lead Hardware & Circuits',
    bio: 'Bridging the gap between software and hardware with hands-on projects.',
    specialties: ['Circuits', '3D Printing', 'Sensors'],
    icon: '⚡',
  },
];

export default function InstructorsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="pt-32 pb-12 px-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">Meet Our Instructors</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Our certified instructors bring industry experience and a passion for teaching
              to every class at ROBOTIX Institute.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Users, label: 'Instructors', value: '10+' },
            { icon: Award, label: 'Certified', value: '100%' },
            { icon: BookOpen, label: 'Courses Taught', value: '25+' },
            { icon: Star, label: 'Student Rating', value: '4.9/5' },
          ].map((stat, i) => (
            <Card key={i} variant="elevated">
              <CardContent className="text-center">
                <stat.icon className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Instructor Cards */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Our Teaching Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {instructors.map((instructor, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card variant="elevated" className="h-full">
                  <CardContent>
                    <div className="text-4xl mb-3">{instructor.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{instructor.name}</h3>
                    <p className="text-sm text-indigo-600 font-semibold mb-3">{instructor.role}</p>
                    <p className="text-gray-600 mb-4">{instructor.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {instructor.specialties.map((s) => (
                        <span key={s} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Want to Join Our Team?</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            We&apos;re always looking for passionate educators who want to shape the future of tech education in Africa.
          </p>
          <Link href="/join-team">
            <Button variant="primary">Apply to Teach</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
