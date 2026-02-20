'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  platform: 'tiktok' | 'youtube';
  embedUrl: string;
  externalUrl: string;
  stats?: string;
}

const videos: Video[] = [
  {
    id: '1',
    title: 'Stanbic Bank x ROBOTIX STEAM Programme',
    description: 'Our partnership with Stanbic Bank bringing coding, robotics & design thinking to young learners across Zambia.',
    thumbnail: '/images/video-thumb-1.jpg',
    platform: 'tiktok',
    embedUrl: 'https://www.tiktok.com/embed/v2/7567784243502304568',
    externalUrl: 'https://www.tiktok.com/@robotix.institute/video/7567784243502304568',
    stats: 'Featured Partnership',
  },
  {
    id: '2',
    title: 'KITWE RECAP: Young Minds Discover Robotics',
    description: 'Highlights from our robotics crash course in Kitwe — watch young innovators build and code their first robots!',
    thumbnail: '/images/video-thumb-2.jpg',
    platform: 'tiktok',
    embedUrl: 'https://www.tiktok.com/embed/v2/7498087121467624710',
    externalUrl: 'https://www.tiktok.com/@robotix.institute/video/7498087121467624710',
    stats: 'Most Popular',
  },
  {
    id: '3',
    title: 'Empowering 40 Students at Northmead Primary',
    description: '40 students from Northmead Primary School learn coding, robotics, and computational thinking in hands-on STEAM sessions.',
    thumbnail: '/images/video-thumb-3.jpg',
    platform: 'tiktok',
    embedUrl: 'https://www.tiktok.com/embed/v2/7567694867242028300',
    externalUrl: 'https://www.tiktok.com/@robotix.institute/video/7567694867242028300',
    stats: 'School Programme',
  },
];

export default function VideoShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-200 rounded-full text-sm font-semibold text-pink-700 mb-4">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.72a8.26 8.26 0 004.84 1.55V6.82a4.84 4.84 0 01-1.08-.13z" />
            </svg>
            @robotix.institute on TikTok
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            See Us in <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">Action</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch real highlights from our workshops, school programmes, and events across Zambia.
          </p>
        </motion.div>

        {/* Featured Video - Large */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Video Embed */}
              <div className="relative bg-black aspect-[9/16] md:aspect-auto md:min-h-[520px]">
                <iframe
                  src={videos[currentIndex].embedUrl}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  allow="encrypted-media"
                  style={{ border: 'none' }}
                />
              </div>

              {/* Video Info */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                {videos[currentIndex].stats && (
                  <span className="inline-flex self-start items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 mb-4">
                    {videos[currentIndex].stats}
                  </span>
                )}
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {videos[currentIndex].title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {videos[currentIndex].description}
                </p>

                <div className="flex items-center gap-4 mb-8">
                  <a
                    href={videos[currentIndex].externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Watch on TikTok
                  </a>
                  <a
                    href="https://www.tiktok.com/@robotix.institute"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-pink-300 hover:text-pink-600 transition-colors text-sm"
                  >
                    Follow Us
                  </a>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={prevVideo}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Previous video"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>

                  <div className="flex gap-2">
                    {videos.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          idx === currentIndex
                            ? 'bg-orange-500 w-8'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to video ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextVideo}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Next video"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>

                  <span className="ml-2 text-sm text-gray-400">
                    {currentIndex + 1} / {videos.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Video Thumbnails Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {videos.map((video, idx) => (
            <motion.button
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setCurrentIndex(idx)}
              className={`relative group text-left rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                idx === currentIndex
                  ? 'border-orange-500 shadow-lg shadow-orange-500/20'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <div className="p-4 bg-white">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    idx === currentIndex
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-500'
                  } transition-colors`}>
                    <Play className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm line-clamp-1">
                      {video.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {video.description}
                    </p>
                    {video.stats && (
                      <span className="inline-block mt-2 text-xs font-semibold text-orange-600">
                        {video.stats}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {idx === currentIndex && (
                <div className="h-1 bg-gradient-to-r from-orange-500 to-pink-500" />
              )}
            </motion.button>
          ))}
        </div>

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="https://www.tiktok.com/@robotix.institute"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-gray-900/25 transition-all text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.72a8.26 8.26 0 004.84 1.55V6.82a4.84 4.84 0 01-1.08-.13z" />
            </svg>
            Follow @robotix.institute for more
            <ExternalLink className="w-4 h-4 opacity-50" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
