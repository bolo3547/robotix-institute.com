'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { CheckCircle, Users, Clock, Award, Zap, Target } from 'lucide-react';

const curriculum = [
  {
    week: 'Week 1-2',
    topic: 'Introduction to Block-Based Coding',
    details: ['What is coding?', 'Scratch basics', 'Sequences & loops', 'First animated project'],
  },
  {
    week: 'Week 3-4',
    topic: 'Logic & Problem Solving',
    details: ['Conditionals', 'Events & interactions', 'Debugging basics', 'Creative storytelling'],
  },
  {
    week: 'Week 5-6',
    topic: 'Building Games & Animations',
    details: ['Game design', 'Character movement', 'Scoring systems', 'Sound & effects'],
  },
  {
    week: 'Week 7-8',
    topic: 'Final Projects & Showcase',
    details: ['Design your own game', 'Peer review', 'Showcase at BongoHive', 'Certificates'],
  },
];

const outcomes = [
  'Understand programming logic with blocks',
  'Create games & animations in Scratch',
  'Problem-solving through code',
  'Creative thinking with technology',
  'Confidence in visual programming',
  'Foundation for Python & robotics',
];

export default function CodingBasicsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 bg-gradient-to-br from-accent-600 to-accent-700 text-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-5xl mb-4">💻</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Coding Basics</h1>
            <p className="text-xl opacity-90 mb-6">
              Learn block-based coding through interactive projects, games, and creative challenges using Scratch and visual programming tools
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>8 weeks per cohort</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Ages 6-12</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>Beginner</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card variant="elevated">
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-gray-900 mb-2">8</p>
                <p className="text-gray-600">Weeks</p>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-gray-900 mb-2">1.5hr</p>
                <p className="text-gray-600">Per Session</p>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-gray-900 mb-2">15</p>
                <p className="text-gray-600">Max Students</p>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-gray-900 mb-2">Contact Us</p>
                <p className="text-gray-600">For Pricing</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">What Your Child Will Learn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                <Zap className="w-6 h-6 text-accent-600" />
                Key Skills
              </h3>
              <ul className="space-y-3 text-gray-600">
                {outcomes.map((outcome, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                <Target className="w-6 h-6 text-accent-600" />
                Who It's For
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>✓ Children ages 6-12</p>
                <p>✓ No coding experience needed</p>
                <p>✓ Kids interested in games & stories</p>
                <p>✓ Creative visual learners</p>
                <p>✓ Perfect first step into coding</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">8-Week Curriculum</h2>
          <div className="space-y-4">
            {curriculum.map((week, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card variant="outlined">
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <div className="bg-accent-600 text-white rounded-lg p-3 font-bold flex-shrink-0">
                        {week.week}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold mb-2">{week.topic}</h3>
                        <div className="flex flex-wrap gap-2">
                          {week.details.map((detail, i) => (
                            <span
                              key={i}
                              className="bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-sm"
                            >
                              {detail}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Build */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">Projects & Games Built</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '🎮', title: 'Scratch Game', desc: 'Create a playable game with Scratch' },
              { icon: '🎨', title: 'Animated Story', desc: 'Build an interactive storytelling project' },
              { icon: '🧱', title: 'Block-Based Robot', desc: 'Program a robot with visual blocks' },
              { icon: '🎯', title: 'Quiz Game', desc: 'Educational quiz with scoring' },
            ].map((item, i) => (
              <Card key={i} variant="elevated">
                <CardContent className="text-center">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & CTA */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card variant="kid" className="mb-8">
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Pricing</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">Contact Us</p>
                  <p className="text-sm text-gray-600">Cohort-based enrolment</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">What's Included</p>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>✓ All materials</li>
                    <li>✓ Project files</li>
                    <li>✓ Certificate</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Schedule</p>
                  <p className="font-bold text-gray-900 mb-1">Weekends & After-School</p>
                  <p className="text-sm text-gray-600">BongoHive & select Lusaka schools</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="primary" className="w-full md:w-auto">
                Contact Us to Enrol
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="w-full md:w-auto">
                Ask Questions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
