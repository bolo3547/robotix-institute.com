'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Monitor, Clock, Users, Code2, Cpu, Star } from 'lucide-react';
import Link from 'next/link';

const demoSteps = [
  {
    id: 1,
    title: 'Introduction (5 min)',
    description: 'Instructor greets students and reviews what was learned last session. Quick fun quiz to warm up!',
    icon: Users,
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 2,
    title: 'Concept Lesson (10 min)',
    description: 'Interactive visual lesson introducing the day\u2019s topic \u2014 like programming loops or sensor inputs \u2014 with real examples.',
    icon: Monitor,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 3,
    title: 'Hands-On Build (20 min)',
    description: 'Students build and program their own robots or coding projects with step-by-step guidance from instructors.',
    icon: Cpu,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 4,
    title: 'Challenge Time (10 min)',
    description: 'Fun challenges where students modify their code to solve puzzles, race robots, or add creative features.',
    icon: Code2,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 5,
    title: 'Show & Tell (5 min)',
    description: 'Students present what they built to the class. Best projects earn digital badges and certificates!',
    icon: Star,
    color: 'from-pink-500 to-rose-500',
  },
];

export default function LiveClassDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <>
      {/* Demo Preview Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-400 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 bg-accent-50 text-accent-600 rounded-full text-sm font-semibold mb-4"
            >
              👀 See How It Works
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              What a ROBOTIX Class Looks Like
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 max-w-2xl mx-auto text-lg"
            >
              Every 50-minute session is packed with learning, building, and fun. Here&apos;s what your child will experience!
            </motion.p>
          </div>

          {/* Video Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div
              className="relative aspect-video bg-brand-600 rounded-2xl overflow-hidden border border-brand-300 cursor-pointer group shadow-lg"
              onClick={() => setIsOpen(true)}
            >
              {/* Placeholder visual */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-accent-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-accent-500/30">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <p className="text-xl font-bold text-white">Watch Our Classes in Action</p>
                  <p className="text-white/80 text-sm mt-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    2-minute overview
                  </p>
                </div>
              </div>

              {/* Class type indicator */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                ROBOTIX CLASS
              </div>
            </div>
          </motion.div>

          {/* Class Timeline */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 text-center mb-8">Class Flow — 50 Minutes</h3>
            <div className="space-y-4">
              {demoSteps.map((step, i) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex items-start gap-4 p-5 rounded-xl border transition-all cursor-pointer ${
                    activeStep === i
                      ? 'bg-brand-50 border-accent-500 shadow-lg shadow-accent-500/10'
                      : 'bg-gray-50 border-gray-200 hover:border-brand-300'
                  }`}
                  onClick={() => setActiveStep(i)}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Step {step.id}: {step.title}
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                  </div>
                  <div className="absolute top-5 right-5 text-accent-500 text-xs font-semibold">
                    {activeStep === i && '▶'}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-accent-500 text-white font-bold rounded-full hover:bg-accent-600 transition-colors shadow-lg shadow-accent-500/30"
            >
              Book a Free Trial Class
            </Link>
            <p className="text-gray-400 text-sm mt-3">No commitment required — see if your child loves it!</p>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                aria-label="Close video preview"
              >
                <X className="w-5 h-5" />
              </button>
              {/* Video player area */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4 text-accent-500" />
                  <p className="text-xl font-bold mb-2">Class Preview Coming Soon</p>
                  <p className="text-sm text-white/70">Contact us to schedule a free trial class for your child</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
