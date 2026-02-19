'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, Search, Tag } from 'lucide-react';

const categories = ['All', 'Robotics', 'Coding', 'STEM Tips', 'Parent Guide', 'News'];

interface BlogPost {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date?: string;
  createdAt?: string;
  readTime: string;
  image: string | null;
  featured: boolean;
}

const fallbackPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'why-every-child-in-zambia-should-learn-to-code',
    title: 'Why Every Child in Zambia Should Learn to Code',
    excerpt: 'In the digital age, coding is becoming as fundamental as reading and writing. Here\'s why starting early gives children a massive advantage...',
    category: 'Parent Guide',
    date: '2026-01-28',
    readTime: '5 min',
    image: '/robotix1.jpg',
    featured: true,
  },
  {
    id: 2,
    slug: '5-robotics-projects-kids-can-build-at-home',
    title: '5 Robotics Projects Kids Can Build at Home',
    excerpt: 'You don\'t need expensive equipment to get started with robotics. Here are 5 fun projects using everyday materials...',
    category: 'Robotics',
    date: '2026-01-20',
    readTime: '7 min',
    image: '/robotix3.jpg',
    featured: false,
  },
  {
    id: 3,
    slug: 'robotix-institute-wins-best-stem-initiative-2025',
    title: 'Robotix Institute Wins Best STEM Initiative 2025',
    excerpt: 'We\'re proud to announce that Robotix Institute has been awarded the Best STEM Initiative at the Zambia Education Awards...',
    category: 'News',
    date: '2026-01-15',
    readTime: '3 min',
    image: '/students2.jpg',
    featured: false,
  },
  {
    id: 4,
    slug: 'python-vs-scratch-which-should-your-child-learn-first',
    title: 'Python vs Scratch: Which Should Your Child Learn First?',
    excerpt: 'Both are excellent starting points, but the right choice depends on your child\'s age and learning style...',
    category: 'Coding',
    date: '2026-01-10',
    readTime: '6 min',
    image: '/ai-learning.jpg',
    featured: false,
  },
  {
    id: 5,
    slug: 'how-stem-education-bridges-the-digital-divide-in-africa',
    title: 'How STEM Education Bridges the Digital Divide in Africa',
    excerpt: 'Access to quality STEM education is key to empowering the next generation of African innovators and creators...',
    category: 'STEM Tips',
    date: '2026-01-05',
    readTime: '8 min',
    image: '/digital-divide.jpg',
    featured: false,
  },
  {
    id: 6,
    slug: 'preparing-your-child-for-robotics-competitions',
    title: 'Preparing Your Child for Robotics Competitions',
    excerpt: 'From First LEGO League to World Robot Olympiad — a parent\'s complete guide to competitive robotics...',
    category: 'Parent Guide',
    date: '2025-12-28',
    readTime: '10 min',
    image: '/team1.jpg',
    featured: false,
  },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch('/api/blog');
        if (res.ok) {
          const dbPosts = await res.json();
          if (dbPosts && dbPosts.length > 0) {
            const mapped = dbPosts.map((p: Record<string, unknown>) => ({
              id: p.id,
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt,
              category: p.category,
              date: p.createdAt ? new Date(p.createdAt as string).toISOString().split('T')[0] : '',
              readTime: p.readTime || '5 min',
              image: p.image || '/robotix1.jpg',
              featured: p.featured || false,
            }));
            setPosts(mapped);
          }
        }
      } catch {
        // fallback to hardcoded posts already set
      }
    };
    loadPosts();
  }, []);

  const filtered = posts.filter((post) => {
    const matchCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featuredPost = posts.find((p) => p.featured);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-4"
          >
            Blog &amp; Resources
          </motion.h1>
          <p className="text-xl text-gray-600 mb-8">
            STEM tips, news, and insights for parents and young learners
          </p>

          {/* Search */}
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent-400 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-accent-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && activeCategory === 'All' && !searchQuery && (
        <section className="px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl overflow-hidden border border-gray-200"
            >
              <div className="relative h-64 md:h-full">
                <Image src={featuredPost.image} alt={featuredPost.title} fill className="object-cover" />
                <div className="absolute top-4 left-4 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Featured
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <span className="bg-gray-50 px-2 py-1 rounded text-gray-600">{featuredPost.category}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {featuredPost.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{featuredPost.title}</h2>
                <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                <Link href={`/blog/${featuredPost.slug}`} className="inline-flex items-center text-accent-400 font-semibold hover:text-accent-300 transition-colors">
                  Read More <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.filter((p) => !p.featured || activeCategory !== 'All' || searchQuery).map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors group"
              >
                <div className="relative h-48">
                  <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {post.category}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-accent-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="text-sm text-accent-400 font-medium hover:text-accent-300 inline-flex items-center">
                    Read More <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Never Miss an Update</h2>
          <p className="text-white/80 mb-6">Subscribe to our newsletter for the latest STEM tips and news.</p>
          <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); const input = e.currentTarget.querySelector('input'); if (input && input.value) { alert("Thank you for subscribing! We'll keep you updated."); input.value = ''; } }}>
            <input
              type="email"
              placeholder="Your email address"
              required
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 text-gray-900 placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button type="submit" className="px-6 py-3 bg-white text-accent-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
