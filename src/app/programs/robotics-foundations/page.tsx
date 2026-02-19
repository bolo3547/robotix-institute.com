'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { CheckCircle, Users, Clock, Award, Zap, Target } from 'lucide-react';

const curriculum = [
  {
    week: 'Week 1-2',
    topic: 'Introduction to Robotics',
    details: ['What are robots?', 'Basic components & parts', 'Safety protocols', 'Building your first robot'],
  },
  {
    week: 'Week 3-4',
    topic: 'Visual Programming',
    details: ['Block-based coding', 'Logic and sequences', 'Controlling motors', 'First autonomous movement'],
  },
  {
    week: 'Week 5-6',
    topic: 'Sensors & Challenges',
    details: ['Intro to sensors', 'Design thinking', 'Speed & accuracy challenges', 'Line-following basics'],
  },
  {
    week: 'Week 7-8',
    topic: 'Teamwork & Showcase',
    details: ['Team collaboration', 'Final group project', 'Peer learning', 'Showcase at BongoHive'],
  },
];

const outcomes = [
  'Understand basic robotics principles',
  'Build and program simple robots',
  'Visual & block-based programming skills',
  'Teamwork and collaboration',
  'Confidence in hands-on STEM learning',
  'Foundation for advanced programs',
];

const testimonials = [
  {
    name: 'Mrs. Banda',
    text: 'My son was hesitant about tech, but after this program he\'s obsessed with robotics! Great instructors.',
    rating: 5,
  },
  {
    name: 'Mr. Simfukwe',
    text: 'The progress in just 8 weeks was amazing. Highly recommend!',
    rating: 5,
  },
];

export default function RoboticsFoundationsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 bg-gradient-to-br from-brand-600 to-brand-700 text-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-5xl mb-4">🤖</div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4">Robotics Foundations</h1>
            <p className="text-xl opacity-90 mb-6">
              Your child's first adventure into hands-on robotics and creative coding. Build, program, and discover at BongoHive, Lusaka!
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
                <p className="text-4xl font-bold text-gray-900 mb-2">2hr</p>
                <p className="text-gray-600">Per Session</p>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-gray-900 mb-2">12</p>
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
                <Zap className="w-6 h-6 text-brand-600" />
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
                <Target className="w-6 h-6 text-brand-600" />
                Who It's For
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>✓ Young learners ages 6-12</p>
                <p>✓ First-time robotics learners</p>
                <p>✓ Kids who love building things</p>
                <p>✓ Students wanting hands-on STEM learning</p>
                <p>âœ“ No prior experience needed</p>
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
                      <div className="bg-brand-600 text-white rounded-lg p-3 font-bold flex-shrink-0">
                        {week.week}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold mb-2">{week.topic}</h3>
                        <div className="flex flex-wrap gap-2">
                          {week.details.map((detail, i) => (
                            <span
                              key={i}
                              className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm"
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
          <h2 className="text-4xl font-bold mb-8 text-gray-900">What Your Child Will Build</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '🤖', title: 'Simple Robot', desc: 'Their first working robot from scratch' },
              { icon: '🚗', title: 'Line Follower', desc: 'Robot that follows drawn lines autonomously' },
              { icon: '🎯', title: 'Obstacle Avoider', desc: 'Robot that detects and avoids obstacles' },
              { icon: '🏗️', title: 'Custom Projects', desc: 'Student-designed robotics creations' },
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

      {/* Testimonials */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">Parent Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, i) => (
              <Card key={i} variant="elevated">
                <CardContent>
                  <div className="flex gap-1 mb-3">
                    {Array(testimonial.rating)
                      .fill(null)
                      .map((_, j) => (
                        <span key={j} className="text-yellow-400">â˜…</span>
                      ))}
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                  <p className="font-bold text-brand-600">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Do they need prior experience?',
                a: 'No! This program is designed for absolute beginners. We start from the basics.',
              },
              {
                q: 'What happens if they need to miss a class?',
                a: 'We provide recorded sessions and one-on-one catch-up sessions at no extra cost.',
              },
              {
                q: 'Do they get to take home their robot?',
                a: 'Yes! Students build their own robot and can take it home after the program.',
              },
              {
                q: 'What if they want to continue?',
                a: 'Students can enroll in Advanced Robotics after completing this program.',
              },
            ].map((item, i) => (
              <details key={i} className="border border-gray-200 rounded-lg overflow-hidden group">
                <summary className="flex items-center cursor-pointer p-4 bg-blue-50 hover:bg-blue-100 font-semibold text-gray-900">
                  <span className="mr-3 text-brand-600 group-open:rotate-90 transition">â–¶</span>
                  {item.q}
                </summary>
                <div className="p-4 border-t border-gray-200 bg-gray-100 text-gray-600">
                  {item.a}
                </div>
              </details>
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
                  <p className="text-3xl font-bold text-brand-600 mb-1">Contact Us</p>
                  <p className="text-sm text-gray-600">Cohort-based enrolment</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">What's Included</p>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>✓ Materials included</li>
                    <li>✓ Hands-on robot kit</li>
                    <li>✓ Certificate</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Schedule</p>
                  <p className="font-bold text-gray-900 mb-1">Weekends at BongoHive</p>
                  <p className="text-sm text-gray-600">Hive Coworking, Lusaka</p>
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
