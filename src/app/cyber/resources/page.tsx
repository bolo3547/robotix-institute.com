'use client';

import React, { useState } from 'react';
import { BookOpen, ExternalLink, Search, Video, FileText, Globe, Shield, Code } from 'lucide-react';
import { RESOURCES } from '@/constants/cyber';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  video: Video,
  article: FileText,
  course: BookOpen,
  tool: Code,
  website: Globe,
};

const EXTRA_RESOURCES = [
  { title: 'CyberChef', description: 'The Cyber Swiss Army Knife — encode, decode, hash, and analyze data', url: 'https://gchq.github.io/CyberChef/', category: 'tool' },
  { title: 'HackTheBox', description: 'Online platform to test and advance your penetration testing skills', url: 'https://www.hackthebox.com/', category: 'course' },
  { title: 'TryHackMe', description: 'Learn cybersecurity through hands-on exercises and labs', url: 'https://tryhackme.com/', category: 'course' },
  { title: 'OWASP Top 10', description: 'Standard awareness document for web application security', url: 'https://owasp.org/www-project-top-ten/', category: 'article' },
  { title: 'Krebs on Security', description: 'In-depth security news and investigation by Brian Krebs', url: 'https://krebsonsecurity.com/', category: 'website' },
  { title: 'NetworkChuck (YouTube)', description: 'Free cybersecurity and networking tutorials', url: 'https://www.youtube.com/@NetworkChuck', category: 'video' },
];

export default function ResourcesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');

  const allResources = [...RESOURCES.map((r) => ({ ...r, category: 'article' })), ...EXTRA_RESOURCES];
  const categories = ['all', ...new Set(allResources.map((r) => r.category))];

  const filtered = allResources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'all' || r.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-cyan-400" /> Resources
        </h1>
        <p className="text-sm text-gray-400 mt-1">Curated cybersecurity learning materials</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources…"
            className="w-full pl-10 pr-4 py-2.5 bg-[#0d1117] border border-gray-800 rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all capitalize ${
                category === c ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'border-gray-800 text-gray-500 hover:text-gray-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 border border-emerald-500/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-semibold text-white">Getting Started with Cybersecurity</h2>
        </div>
        <p className="text-xs text-gray-400 mb-3">
          New to cybersecurity? Start with the awareness quiz challenge, then explore these resources
          to build a solid foundation in security fundamentals.
        </p>
        <div className="flex gap-2">
          <a href="https://www.cybrary.it/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded transition-colors flex items-center gap-1">
            Start Learning <ExternalLink className="w-3 h-3" />
          </a>
          <a href="/cyber/challenges" className="px-3 py-1.5 border border-gray-700 text-gray-300 text-xs rounded hover:bg-gray-800 transition-colors">
            Go to Challenges
          </a>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((resource, i) => {
          const Icon = CATEGORY_ICONS[resource.category] || Globe;
          return (
            <a
              key={i}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#0d1117] border border-gray-800/60 rounded-lg p-4 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-800/50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/10 transition-colors">
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-200 group-hover:text-white truncate">{resource.title}</h3>
                    <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-emerald-400 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{resource.description}</p>
                  <span className="inline-block mt-2 text-[10px] px-2 py-0.5 bg-gray-800/50 text-gray-500 rounded capitalize font-mono">
                    {resource.category}
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-8 h-8 text-gray-700 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No resources match your search.</p>
        </div>
      )}
    </div>
  );
}
