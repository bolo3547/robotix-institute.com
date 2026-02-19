'use client';

import { motion } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  type: 'Robotics' | 'Coding' | 'Game';
  thumbnail?: string; // optional URL
}

interface Props {
  projects: Project[];
}

export default function ProjectGallery({ projects }: Props) {
  return (
    <section aria-label="Project gallery">
      <h3 className="text-xl font-bold mb-4">Project Gallery</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {projects.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
          >
            <div className="w-full h-36 bg-gray-50 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
              {p.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.thumbnail} alt={`${p.title} thumbnail`} className="w-full h-full object-cover" />
              ) : (
                <div className="text-4xl">{p.type === 'Robotics' ? '🤖' : p.type === 'Game' ? '🎮' : '💻'}</div>
              )}
            </div>
            <div className="text-sm font-semibold">{p.title}</div>
            <div className="text-xs text-gray-500">{p.type}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
