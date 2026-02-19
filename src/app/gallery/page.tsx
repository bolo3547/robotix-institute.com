'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink, Heart, Award } from 'lucide-react';

const categories = ['All', 'Robotics', 'Python', 'Web Apps', 'AI Projects', 'Games'];

const projects = [
  {
    id: 1,
    title: 'Line-Following Robot',
    student: 'Mwila Chanda, Age 12',
    program: 'Advanced Robotics',
    category: 'Robotics',
    description: 'An autonomous line-following robot built with Arduino and IR sensors. Won 2nd place at the Zambia Robotics Challenge.',
    image: '/robotix1.jpg',
    featured: true,
    likes: 145,
    award: 'Competition Winner',
  },
  {
    id: 2,
    title: 'Weather Dashboard App',
    student: 'Natasha Banda, Age 15',
    program: 'Python Programming',
    category: 'Python',
    description: 'A real-time weather dashboard using Python and OpenWeatherMap API with data visualization charts.',
    image: '/ai-learning.jpg',
    featured: false,
    likes: 89,
    award: null,
  },
  {
    id: 3,
    title: 'School Management Portal',
    student: 'Joseph Tembo, Age 17',
    program: 'Web Development',
    category: 'Web Apps',
    description: 'A full-stack school management web app with student records, attendance tracking, and grade management.',
    image: '/students2.jpg',
    featured: true,
    likes: 203,
    award: 'Best Project 2025',
  },
  {
    id: 4,
    title: 'Obstacle Avoidance Drone',
    student: 'Chileshe Mulenga, Age 14',
    program: 'Advanced Robotics',
    category: 'Robotics',
    description: 'A drone programmed to navigate obstacle courses autonomously using ultrasonic sensors.',
    image: '/robotix3.jpg',
    featured: false,
    likes: 167,
    award: null,
  },
  {
    id: 5,
    title: 'Crop Disease Detector',
    student: 'Grace Mumba, Age 16',
    program: 'AI & Machine Learning',
    category: 'AI Projects',
    description: 'An ML model that identifies crop diseases from plant leaf images. Built to help Zambian farmers.',
    image: '/digital-divide.jpg',
    featured: true,
    likes: 312,
    award: 'Innovation Award',
  },
  {
    id: 6,
    title: 'Space Adventure Game',
    student: 'David Kasonde, Age 10',
    program: 'Coding Basics',
    category: 'Games',
    description: 'A Scratch-based space shooter game with multiple levels, power-ups, and a high score system.',
    image: '/team1.jpg',
    featured: false,
    likes: 78,
    award: null,
  },
  {
    id: 7,
    title: 'Smart Irrigation System',
    student: 'Chipo Lungu, Age 13',
    program: 'Robotics Foundations',
    category: 'Robotics',
    description: 'An Arduino-based system that monitors soil moisture and automatically waters plants when needed.',
    image: '/robotix1.jpg',
    featured: false,
    likes: 134,
    award: 'STEM Fair Winner',
  },
  {
    id: 8,
    title: 'Bemba Translation App',
    student: 'Bwalya Mwape, Age 16',
    program: 'AI & Machine Learning',
    category: 'AI Projects',
    description: 'An NLP-powered translation tool that translates between English and Bemba language.',
    image: '/ai-learning.jpg',
    featured: false,
    likes: 198,
    award: null,
  },
  {
    id: 9,
    title: 'E-Commerce Store',
    student: 'Luyando Sakala, Age 17',
    program: 'Web Development',
    category: 'Web Apps',
    description: 'A fully functional e-commerce store with product listings, cart, and mobile money payment integration.',
    image: '/students2.jpg',
    featured: false,
    likes: 156,
    award: null,
  },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

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
            Student Project Gallery
          </motion.h1>
          <p className="text-xl text-gray-600">
            See what our students have built. Real projects. Real impact.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-accent-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 shadow-sm transition-colors group"
            >
              <div className="relative h-48">
                <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                {project.award && (
                  <div className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Award className="w-3 h-3" /> {project.award}
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-3 right-3 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="text-xs text-accent-400 font-medium mb-1">{project.program}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{project.title}</h3>
                <p className="text-sm text-gray-500 mb-3">by {project.student}</p>
                <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-400 transition-colors">
                    <Heart className="w-4 h-4" /> {project.likes}
                  </button>
                  <button className="flex items-center gap-1 text-sm text-accent-400 hover:text-accent-300 transition-colors">
                    <ExternalLink className="w-4 h-4" /> View Project
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
          <h2 className="text-2xl font-bold text-white mb-2">Want Your Child&apos;s Project Here?</h2>
          <p className="text-white/80 mb-6">Enroll today and let them build something amazing.</p>
          <a
            href="/auth/signup"
            className="inline-flex items-center px-6 py-3 bg-white text-accent-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Get Started
          </a>
        </div>
      </section>
    </main>
  );
}
