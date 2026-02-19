'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink, Heart, Award } from 'lucide-react';

interface Photo {
  id: string;
  title: string;
  description: string | null;
  url: string;
  category: string;
  createdAt: string;
}

const categories = ['All', 'general', 'robotics', 'events', 'students', 'projects'];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/photos')
      .then(res => res.json())
      .then(data => setPhotos(data))
      .catch(err => console.error('Failed to load gallery:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All'
    ? photos
    : photos.filter((p) => p.category === activeCategory);

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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
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

      {/* Photos Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading gallery...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg mb-2">No photos yet</p>
              <p className="text-sm">Check back soon for updates!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 shadow-sm transition-colors group"
                >
                  <div className="relative h-48">
                    <Image src={photo.url} alt={photo.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 right-3 bg-brand-500/80 text-white text-xs font-bold px-3 py-1 rounded-full capitalize">
                      {photo.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{photo.title}</h3>
                    {photo.description && (
                      <p className="text-sm text-gray-600 mb-3">{photo.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-400">{new Date(photo.createdAt).toLocaleDateString()}</span>
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-400 transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
