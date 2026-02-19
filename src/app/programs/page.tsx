'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, Users, Target, Award } from 'lucide-react';

const programs = [
  {
    id: 1,
    name: 'Robotics Foundations',
    ageGroup: '6-12 years',
    level: 'Beginner',
    description: 'Hands-on introduction to robotics with building, sensors, and visual programming for young innovators.',
    image: '🤖',
    highlights: ['Build simple robots', 'Visual programming', 'Hands-on STEM learning'],
    price: 'Contact Us',
    duration: 'Per Cohort',
    schedule: 'Weekends at BongoHive',
    maxStudents: 12,
  },
  {
    id: 2,
    name: 'Coding Basics',
    ageGroup: '6-12 years',
    level: 'Beginner',
    description: 'Learn block-based coding through interactive projects, games, and creative challenges using Scratch and more.',
    image: '💻',
    highlights: ['Block-based coding', 'Game creation', 'Creative projects'],
    price: 'Contact Us',
    duration: 'Per Cohort',
    schedule: 'Weekends & After-School',
    maxStudents: 15,
  },
  {
    id: 3,
    name: 'Python Programming',
    ageGroup: '13-18 years',
    level: 'Intermediate',
    description: 'Master Python through real-world projects, robotics integration, and hands-on coding challenges.',
    image: '🐍',
    highlights: ['Python fundamentals', 'Robotics scripting', 'Real-world projects'],
    price: 'Contact Us',
    duration: 'Per Cohort',
    schedule: 'Weekends at BongoHive',
    maxStudents: 15,
  },
  {
    id: 4,
    name: 'Advanced Robotics',
    ageGroup: '13-18 years',
    level: 'Advanced',
    description: 'Advanced robot building with C++, sensors, IoT, and competition-level projects.',
    image: '⚙️',
    highlights: ['C++ programming', 'Sensors & IoT', 'Competition prep'],
    price: 'Contact Us',
    duration: 'Per Cohort',
    schedule: 'Weekends at BongoHive',
    maxStudents: 12,
  },
  {
    id: 5,
    name: 'AI & Machine Learning',
    ageGroup: '13-18 years',
    level: 'Advanced',
    description: 'Explore AI concepts, build intelligent projects, and discover how machine learning shapes the future.',
    image: '🧠',
    highlights: ['AI fundamentals', 'Python for AI', 'Hands-on ML projects'],
    price: 'Contact Us',
    duration: 'Per Cohort',
    schedule: 'Weekends at BongoHive',
    maxStudents: 10,
  },
  {
    id: 7,
    name: 'Digital Skills',
    ageGroup: '6-12 years',
    level: 'Beginner',
    description: 'Essential digital literacy, online safety, and productivity tools for the modern young learner.',
    image: '🖥️',
    highlights: ['Digital literacy', 'Online safety', 'Creative projects'],
    price: 'Contact Us',
    duration: 'Per Cohort',
    schedule: 'Weekends & After-School',
    maxStudents: 15,
  },
];

export default function ProgramsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Our Programs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 mb-8"
          >
            Empowering tomorrow's innovators ages 6-18 with hands-on robotics and creative coding education. Cohort-based programs at BongoHive, Lusaka.
          </motion.p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card variant="elevated">
                  <CardContent>
                    <div className="text-5xl mb-4">{program.image}</div>
                    <CardTitle className="text-2xl mb-2">{program.name}</CardTitle>
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                        {program.ageGroup}
                      </span>
                      <span className="bg-accent-100 text-accent-700 px-3 py-1 rounded-full">
                        {program.level}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{program.description}</p>

                    <div className="space-y-2 mb-6">
                      {program.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="text-brand-500">âœ“</span>
                          {highlight}
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Price</p>
                          <p className="font-bold text-gray-900">{program.price}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Duration</p>
                          <p className="font-bold">{program.duration}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Schedule</p>
                          <p className="text-xs">{program.schedule}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Max Students</p>
                          <p className="font-bold">{program.maxStudents}</p>
                        </div>
                      </div>
                    </div>

                    <Link href="/contact">
                      <Button variant="primary" className="w-full">
                        Learn More <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Why Choose Our Programs?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-brand-500" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">9+ Years of Experience</h3>
              <p className="text-gray-600">
                Founded in 2016, with 2,500+ students trained by passionate STEM educators
              </p>
            </div>
            <div className="text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-brand-500" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">Cohort-Based Learning</h3>
              <p className="text-gray-600">
                Small cohort sizes at BongoHive ensure hands-on attention and real progress
              </p>
            </div>
            <div className="text-center">
              <Award className="w-12 h-12 mx-auto mb-4 text-brand-500" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">Real-World Skills</h3>
              <p className="text-gray-600">
                From robotics to coding, learn skills that matter — backed by partners like Stanbic Bank Zambia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-accent-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Cohort 3?</h2>
          <p className="text-xl mb-8 opacity-90">
            Contact us to enrol your child and discover their potential in robotics and coding
          </p>
          <Link href="/contact">
            <Button variant="kidPrimary" className="bg-white text-brand-500 hover:bg-gray-100">
              Contact Us to Enrol
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
