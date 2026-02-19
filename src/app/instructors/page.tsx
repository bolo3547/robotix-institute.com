'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Mail, Award } from 'lucide-react';

const instructors = [
  {
    name: 'Denuel Mwansa',
    role: 'Founder & Lead Instructor',
    bio: 'Passionate about bridging the digital divide in Zambia. With 8+ years of experience in STEM education, Denuel founded Robotix Institute to make world-class tech education accessible to every child.',
    specialties: ['Robotics', 'AI/ML', 'Leadership'],
    image: '/team1.jpg',
    credentials: 'BSc Computer Science, Certified Robotics Educator',
  },
  {
    name: 'Chanda Mulenga',
    role: 'Senior Robotics Instructor',
    bio: 'A mechanical engineering graduate with a passion for hands-on learning. Chanda brings complex robotics concepts to life through engaging, practical projects.',
    specialties: ['Robotics Foundations', 'Advanced Robotics', 'Competition Prep'],
    image: '/robotix1.jpg',
    credentials: 'BEng Mechanical Engineering, FIRST Robotics Certified',
  },
  {
    name: 'Natasha Zimba',
    role: 'Python & Web Dev Instructor',
    bio: 'A full-stack developer who transitioned to teaching after seeing firsthand how limited tech education was for Zambian youth. Makes coding fun and accessible for all ages.',
    specialties: ['Python', 'Web Development', 'Game Design'],
    image: '/students2.jpg',
    credentials: 'BSc Software Engineering, Google Certified Developer',
  },
  {
    name: 'Joseph Phiri',
    role: 'AI & Data Science Instructor',
    bio: 'AI researcher and educator with experience in both academia and industry. Joseph specializes in making cutting-edge technology understandable for young minds.',
    specialties: ['AI/ML', 'Data Science', 'Python'],
    image: '/ai-learning.jpg',
    credentials: 'MSc Data Science, TensorFlow Developer Certificate',
  },
  {
    name: 'Bwalya Kapasa',
    role: 'Digital Skills Instructor',
    bio: 'Digital literacy advocate who believes every child deserves the skills to thrive in the modern world. Expert at teaching productivity tools and online safety.',
    specialties: ['Digital Literacy', 'Coding Basics', 'Internet Safety'],
    image: '/digital-divide.jpg',
    credentials: 'BEd Technology Education, IC3 Certified',
  },
  {
    name: 'Grace Mutale',
    role: 'Junior Programs Coordinator',
    bio: 'Early childhood education specialist who adapts STEM concepts for the youngest learners. Creates playful, hands-on experiences that spark curiosity.',
    specialties: ['Little Einsteins', 'Byte Buddies', 'Creative Learning'],
    image: '/robotix3.jpg',
    credentials: 'BEd Early Childhood, Montessori STEM Certified',
  },
];

export default function InstructorsPage() {
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
            Meet Our Instructors
          </motion.h1>
          <p className="text-xl text-gray-600">
            Passionate educators. Industry experts. Dedicated to your child&apos;s success.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Instructors', value: '6+' },
            { label: 'Years Experience', value: '40+' },
            { label: 'Certifications', value: '15+' },
            { label: 'Student Rating', value: '4.9â˜…' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-accent-400">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Instructor Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {instructors.map((instructor, i) => (
            <motion.div
              key={instructor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors group"
            >
              <div className="relative h-56">
                <Image
                  src={instructor.image}
                  alt={instructor.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">{instructor.name}</h3>
                  <p className="text-accent-400 text-sm font-medium">{instructor.role}</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-600 text-sm mb-4">{instructor.bio}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <Award className="w-3.5 h-3.5 text-accent-400" />
                  {instructor.credentials}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {instructor.specialties.map((spec) => (
                    <span key={spec} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <button className="p-2 bg-gray-50 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors" aria-label="LinkedIn profile">
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-50 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors" aria-label="Email instructor">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto bg-accent-500 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Want to Join Our Team?</h2>
          <p className="text-white/80 mb-6">We&apos;re always looking for passionate educators to help bridge the digital divide.</p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-white text-accent-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </main>
  );
}
