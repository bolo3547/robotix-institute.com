'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Award, Star, Trophy, Code, Heart, Share2,
  ExternalLink, Calendar, MapPin, Zap, Eye
} from 'lucide-react';

const mockPortfolio = {
  id: '1',
  childName: 'Mwamba Chisanga',
  bio: 'Young innovator and aspiring robotics engineer. I love building robots and coding games! 🤖✨',
  avatar: '👦🏾',
  level: 15,
  totalXP: 12450,
  joinDate: 'September 2024',
  location: 'Lusaka, Zambia',
  badges: [
    { name: 'First Steps', icon: '🎯', rarity: 'common' },
    { name: 'Code Warrior', icon: '⚔️', rarity: 'rare' },
    { name: 'Robot Master', icon: '🤖', rarity: 'epic' },
    { name: 'Streak Legend', icon: '🔥', rarity: 'legendary' },
    { name: 'Team Player', icon: '🤝', rarity: 'common' },
    { name: 'Bug Hunter', icon: '🐛', rarity: 'rare' },
  ],
  stats: {
    projectsCompleted: 12,
    certificatesEarned: 3,
    challengesSolved: 28,
    daysStreak: 42,
  },
  projects: [
    {
      id: 'p1',
      title: 'Line Following Robot',
      description: 'Built an autonomous robot that follows a black line using infrared sensors and Arduino.',
      tags: ['Arduino', 'Robotics', 'Sensors'],
      programName: 'Robotics Fundamentals',
      likes: 45,
      featured: true,
      createdAt: '2026-01-20',
      mediaUrl: '🤖',
    },
    {
      id: 'p2',
      title: 'Python Calculator App',
      description: 'A command-line calculator that supports basic arithmetic, square roots, and memory functions.',
      tags: ['Python', 'Math', 'CLI'],
      programName: 'Python for Kids',
      likes: 32,
      featured: true,
      createdAt: '2026-01-10',
      mediaUrl: '🐍',
    },
    {
      id: 'p3',
      title: 'Obstacle Avoidance Bot',
      description: 'A robot that uses ultrasonic sensors to detect and avoid obstacles autonomously.',
      tags: ['Arduino', 'Ultrasonic', 'Movement'],
      programName: 'Robotics Fundamentals',
      likes: 38,
      featured: false,
      createdAt: '2025-12-15',
      mediaUrl: '🚗',
    },
    {
      id: 'p4',
      title: 'Guess the Number Game',
      description: 'Interactive Python game that generates a random number and gives hints (higher/lower).',
      tags: ['Python', 'Games', 'Random'],
      programName: 'Python for Kids',
      likes: 27,
      featured: false,
      createdAt: '2025-11-20',
      mediaUrl: '🎮',
    },
    {
      id: 'p5',
      title: 'Smart Night Light',
      description: 'Arduino project using a light sensor to automatically turn on LEDs when it gets dark.',
      tags: ['Arduino', 'LED', 'Light Sensor'],
      programName: 'Robotics Fundamentals',
      likes: 21,
      featured: false,
      createdAt: '2025-10-05',
      mediaUrl: '💡',
    },
    {
      id: 'p6',
      title: 'ASCII Art Generator',
      description: 'Python program that converts text input into creative ASCII art patterns.',
      tags: ['Python', 'Creative', 'Text'],
      programName: 'Python for Kids',
      likes: 19,
      featured: false,
      createdAt: '2025-09-25',
      mediaUrl: '🎨',
    },
  ],
  certificates: [
    { name: 'Robotics Fundamentals', grade: 'distinction', date: '2026-01-15' },
    { name: 'Python for Kids', grade: 'merit', date: '2025-12-20' },
    { name: 'Scratch Coding', grade: 'distinction', date: '2025-06-10' },
  ],
};

const allPortfolios = [
  { id: '1', name: 'Mwamba Chisanga', avatar: '👦🏾', level: 15, projects: 12, xp: 12450 },
  { id: '2', name: 'Natasha Mulenga', avatar: '👧🏾', level: 14, projects: 10, xp: 11200 },
  { id: '3', name: 'Chilufya Bwalya', avatar: '👦🏿', level: 13, projects: 9, xp: 10800 },
  { id: '4', name: 'Thandiwe Nyirenda', avatar: '👧🏿', level: 12, projects: 8, xp: 9500 },
  { id: '5', name: 'Kunda Tembo', avatar: '👦🏾', level: 11, projects: 7, xp: 8900 },
  { id: '6', name: 'Mapalo Zulu', avatar: '👧🏾', level: 10, projects: 6, xp: 8200 },
];

const rarityBorder = {
  common: 'border-gray-400/40',
  rare: 'border-blue-400/40',
  epic: 'border-purple-400/40',
  legendary: 'border-yellow-400/40',
};

export default function PortfolioPage() {
  const [activeView, setActiveView] = useState<'portfolio' | 'explore'>('portfolio');
  const [selectedProject, setSelectedProject] = useState<typeof mockPortfolio.projects[0] | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium mb-4">
            <User className="w-4 h-4" /> Student Portfolios
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Student Showcase</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore amazing projects built by our students. Share achievements and inspire others!
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-xl w-fit mx-auto">
          {[
            { id: 'portfolio', label: 'My Portfolio' },
            { id: 'explore', label: 'Explore All' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveView(id as typeof activeView)}
              className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeView === id
                  ? 'bg-accent-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeView === 'portfolio' && (
          <>
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-accent-50 to-gray-50 border border-gray-200 rounded-2xl p-8 mb-8"
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-center">
                  <span className="text-6xl block mb-2">{mockPortfolio.avatar}</span>
                  <div className="flex items-center gap-1 bg-accent-500/20 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-accent-400" />
                    <span className="text-accent-400 text-sm font-bold">Level {mockPortfolio.level}</span>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{mockPortfolio.childName}</h2>
                  <p className="text-gray-600 mb-3">{mockPortfolio.bio}</p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Joined {mockPortfolio.joinDate}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {mockPortfolio.location}</span>
                    <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-accent-400" /> {mockPortfolio.totalXP.toLocaleString()} XP</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg font-semibold text-sm hover:bg-accent-600 transition-colors">
                  <Share2 className="w-4 h-4" /> Share Portfolio
                </button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                {[
                  { label: 'Projects', value: mockPortfolio.stats.projectsCompleted, icon: Code },
                  { label: 'Certificates', value: mockPortfolio.stats.certificatesEarned, icon: Award },
                  { label: 'Challenges', value: mockPortfolio.stats.challengesSolved, icon: Trophy },
                  { label: 'Day Streak', value: mockPortfolio.stats.daysStreak, icon: Zap },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="text-center p-3 bg-gray-100 rounded-xl">
                    <Icon className="w-5 h-5 mx-auto text-accent-400 mb-1" />
                    <p className="text-gray-900 font-bold text-xl">{value}</p>
                    <p className="text-gray-500 text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Badges */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-accent-400" /> Badges Earned
              </h3>
              <div className="flex flex-wrap gap-3">
                {mockPortfolio.badges.map((badge, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border bg-white ${rarityBorder[badge.rarity as keyof typeof rarityBorder]}`}
                  >
                    <span className="text-xl">{badge.icon}</span>
                    <span className="text-gray-900 font-medium text-sm">{badge.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Certificates */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-accent-400" /> Certificates
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {mockPortfolio.certificates.map((cert, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white border border-gray-200 rounded-xl p-5 text-center"
                  >
                    <Award className="w-10 h-10 mx-auto text-accent-400 mb-2" />
                    <h4 className="text-gray-900 font-semibold text-sm mb-1">{cert.name}</h4>
                    <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${
                      cert.grade === 'distinction' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {cert.grade.charAt(0).toUpperCase() + cert.grade.slice(1)}
                    </span>
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(cert.date).toLocaleDateString('en-ZM', { month: 'short', year: 'numeric' })}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-accent-400" /> Projects ({mockPortfolio.projects.length})
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockPortfolio.projects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-accent-500/30 transition-all group cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    {/* Thumbnail */}
                    <div className="h-32 bg-gradient-to-br from-brand-400/20 to-accent-500/10 flex items-center justify-center relative">
                      <span className="text-5xl">{project.mediaUrl}</span>
                      {project.featured && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 bg-accent-500 text-white text-xs font-bold rounded-full">
                          ⭐ Featured
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4">
                      <h4 className="text-gray-900 font-bold mb-1">{project.title}</h4>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{project.programName}</span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <Heart className="w-3.5 h-3.5" /> {project.likes}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeView === 'explore' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPortfolios.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:border-accent-500/30 transition-all cursor-pointer"
              >
                <span className="text-5xl block mb-3">{p.avatar}</span>
                <h3 className="text-gray-900 font-bold text-lg mb-1">{p.name}</h3>
                <div className="flex items-center justify-center gap-1 mb-4">
                  <Star className="w-4 h-4 text-accent-400" />
                  <span className="text-accent-400 font-bold text-sm">Level {p.level}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-100 rounded-lg p-2">
                    <p className="text-gray-900 font-bold">{p.projects}</p>
                    <p className="text-gray-500 text-xs">Projects</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-2">
                    <p className="text-gray-900 font-bold">{p.xp.toLocaleString()}</p>
                    <p className="text-gray-500 text-xs">XP</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-2">
                    <p className="text-gray-900 font-bold">Lv.{p.level}</p>
                    <p className="text-gray-500 text-xs">Level</p>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-accent-500 text-white rounded-lg font-semibold text-sm hover:bg-accent-600 transition-colors flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" /> View Portfolio
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Project Detail Modal */}
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
            >
              <div className="text-center mb-4">
                <span className="text-5xl">{selectedProject.mediaUrl}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedProject.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{selectedProject.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {selectedProject.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{selectedProject.programName}</span>
                <span>{new Date(selectedProject.createdAt).toLocaleDateString('en-ZM', { month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-200 text-gray-800 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                  <Heart className="w-4 h-4" /> Like ({selectedProject.likes})
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent-500 text-white rounded-lg font-semibold text-sm hover:bg-accent-600 transition-colors">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="w-full mt-3 py-2 text-gray-500 hover:text-gray-900 text-sm transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
