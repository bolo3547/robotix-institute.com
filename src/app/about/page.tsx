'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Award, Users, Lightbulb } from 'lucide-react';

const milestones = [
  { year: '2016', title: 'Founded', description: 'ROBOTIX Institute established with a mission to teach digital technologies to every school-aged child in Zambia' },
  { year: '2018', title: 'School Partnerships', description: 'Expanded to leading International schools across Zambia with after-school coding & robotics programs' },
  { year: '2021', title: 'Community Focus', description: 'Launched community initiatives including Stanbic Bank Zambia partnership and the Lazarus Project for underserved schools' },
  { year: '2023', title: 'BongoHive Partnership', description: 'Partnered with BongoHive Technology and Innovation Hub to launch weekend Coding & Robotics cohort programs at Hive Coworking, Lusaka' },
  { year: '2024', title: 'STEAM Roadshow', description: 'Launched the STEAM Roadshow bringing innovation and hands-on tech experiences to schools across Lusaka' },
  { year: '2025', title: '2,500+ Students & Cohort 3', description: 'Serving 2,500+ students across multiple schools, now running Cohort 3 of the BongoHive weekend program for ages 6-18' },
];

const values = [
  {
    icon: '🎯',
    title: 'Pioneering Tomorrow',
    description: 'Empowering tomorrow\'s innovators with hands-on robotics and creative coding education',
  },
  {
    icon: '🤝',
    title: 'Community Focused',
    description: 'Bridging the digital divide by making programs available to all children aged 6-18, regardless of background',
  },
  {
    icon: '💡',
    title: 'Hands-On Learning',
    description: 'Kids learn by doing — building robots, writing code, and developing problem-solving skills in a fun and engaging way',
  },
  {
    icon: '🌍',
    title: 'Impactful Partnerships',
    description: 'Collaborating with Stanbic Bank Zambia, BongoHive, and schools across Lusaka to expand digital literacy',
  },
  {
    icon: '🚀',
    title: 'Future-Ready Skills',
    description: 'From visual programming for ages 6-12 to Python and C++ for teens 13-18 — preparing youth for the digital economy',
  },
  {
    icon: '🏫',
    title: 'After-School Programs',
    description: 'Offering after-school coding & robotics programs at select schools across Lusaka, meeting students where they are',
  },
];

const team = [
  {
    name: 'Ndanji Nachangwa',
    role: 'Head of Innovation',
    bio: 'EdTech & STEM Advocate — oversees curriculum development, implementation, and strategic planning to continuously improve educational offerings',
    image: '👨‍💼',
  },
  {
    name: 'Teaching Team',
    role: 'Certified Instructors',
    bio: 'Our trained and monitored instructors ensure high-quality instruction across coding, robotics, and STEM programs',
    image: '👩‍🏫',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            About ROBOTIX Institute
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 mb-8"
          >
            Empowering tomorrow's innovators with hands-on robotics and creative coding education. Inspiring the next generation of innovators through coding, robotics, and STEM education in Zambia.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card variant="elevated">
              <CardContent>
                <Lightbulb className="w-12 h-12 text-brand-500 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
                <p className="text-gray-600">
                  To teach digital technologies to every school-aged child in Zambia, 
                  empowering children aged 6-18 with coding and robotics skills through hands-on learning.
                </p>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent>
                <Users className="w-12 h-12 text-brand-500 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
                <p className="text-gray-600">
                  A Zambia where every child has access to quality STEM education — bridging 
                  the digital divide through robotics, coding, and innovation programs.
                </p>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent>
                <Award className="w-12 h-12 text-brand-500 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Our Values</h3>
                <p className="text-gray-600">
                  Excellence, integrity, innovation, and empowerment guide every decision we make 
                  and every program we deliver.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="text-4xl flex-shrink-0">{value.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">Our Journey</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-6"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {milestone.year.slice(-2)}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-1 h-16 bg-brand-200 mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{milestone.year}</h3>
                  <p className="text-xl font-semibold mb-1">{milestone.title}</p>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-gray-600 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-brand-500 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-5xl font-bold mb-2">9+</p>
              <p className="text-sm sm:text-lg opacity-90">Years Experience</p>
            </div>
            <div>
              <p className="text-3xl sm:text-5xl font-bold mb-2">2,500+</p>
              <p className="text-sm sm:text-lg opacity-90">Students Served</p>
            </div>
            <div>
              <p className="text-3xl sm:text-5xl font-bold mb-2">6-18</p>
              <p className="text-sm sm:text-lg opacity-90">Age Range</p>
            </div>
            <div>
              <p className="text-3xl sm:text-5xl font-bold mb-2">3</p>
              <p className="text-sm sm:text-lg opacity-90">Cohorts Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl text-gray-600 mb-8">
            Inspiring the next generation of innovators — empowering young minds to build the future, one line of code at a time
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/programs">
              <Button variant="primary">Explore Programs</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Get in Touch</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
