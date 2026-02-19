'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Heart, Pin, Search, Plus, Send,
  Tag, Users, HelpCircle, Lightbulb, Megaphone,
  ThumbsUp, Clock, X
} from 'lucide-react';

const categories = [
  { id: 'general', label: 'General', icon: MessageSquare, color: 'bg-blue-500/20 text-blue-400' },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, color: 'bg-red-500/20 text-red-400' },
  { id: 'showcase', label: 'Showcase', icon: Lightbulb, color: 'bg-purple-500/20 text-purple-400' },
  { id: 'events', label: 'Events', icon: Megaphone, color: 'bg-green-500/20 text-green-400' },
  { id: 'feedback', label: 'Feedback', icon: ThumbsUp, color: 'bg-accent-500/20 text-accent-400' },
];

const mockPosts = [
  {
    id: '1',
    author: 'Mrs. Chisanga',
    authorRole: 'parent' as const,
    avatar: '👩🏾',
    title: 'Amazing progress in Robotics class! 🤖',
    content: 'My son Mwamba just built his first robot that can follow a line! The joy on his face was priceless. Thank you ROBOTIX INSTITUTE for such an incredible program. The instructors are patient and really know how to engage the children.',
    category: 'showcase',
    tags: ['robotics', 'success-story', 'parent-review'],
    likes: 24,
    replies: [
      { id: 'r1', author: 'Mr. Banda', authorRole: 'instructor' as const, avatar: '👨🏾‍🏫', content: 'Thank you Mrs. Chisanga! Mwamba is doing exceptionally well. His curiosity and dedication are truly impressive.', likes: 8, createdAt: '2 hours ago' },
      { id: 'r2', author: 'Mrs. Mulenga', authorRole: 'parent' as const, avatar: '👩🏿', content: 'That\'s wonderful! My daughter Natasha talks about Mwamba\'s robots all the time. They inspire each other!', likes: 5, createdAt: '1 hour ago' },
    ],
    pinned: true,
    createdAt: '3 hours ago',
  },
  {
    id: '2',
    author: 'Admin Team',
    authorRole: 'admin' as const,
    avatar: '🏫',
    title: '📅 Holiday Schedule: March Break 2026',
    content: 'Dear parents, please note that classes will be suspended from March 15-22 for the school break. Normal classes resume on Monday, March 23. Enjoy the holidays with your families!',
    category: 'events',
    tags: ['schedule', 'holidays', 'announcement'],
    likes: 15,
    replies: [
      { id: 'r3', author: 'Mr. Tembo', authorRole: 'parent' as const, avatar: '👨🏾', content: 'Thank you for the heads up!', likes: 2, createdAt: '5 hours ago' },
    ],
    pinned: true,
    createdAt: '1 day ago',
  },
  {
    id: '3',
    author: 'Mr. Sakala',
    authorRole: 'parent' as const,
    avatar: '👨🏿',
    title: 'Which program for a 6-year-old beginner?',
    content: 'My daughter is turning 6 and she\'s really interested in technology. Which program would you recommend for a complete beginner at that age? She loves playing games on the tablet.',
    category: 'help',
    tags: ['advice', 'beginner', 'young-learner'],
    likes: 7,
    replies: [
      { id: 'r4', author: 'Ms. Zulu', authorRole: 'instructor' as const, avatar: '👩🏾‍🏫', content: 'Hi Mr. Sakala! I\'d recommend our Scratch Coding program for ages 6-8. It uses visual blocks instead of text coding, which is perfect for young beginners. We also offer free trial classes so she can try before you commit!', likes: 12, createdAt: '4 hours ago' },
      { id: 'r5', author: 'Mrs. Nyirenda', authorRole: 'parent' as const, avatar: '👩🏾', content: 'My Thandiwe started with Scratch at age 6 and loved it! She\'s now doing Python at age 10. Highly recommend starting there.', likes: 6, createdAt: '3 hours ago' },
    ],
    pinned: false,
    createdAt: '6 hours ago',
  },
  {
    id: '4',
    author: 'Mrs. Bwalya',
    authorRole: 'parent' as const,
    avatar: '👩🏿',
    title: 'Suggestion: Weekend makeup classes',
    content: 'My child recently missed a few classes due to illness. It would be great if there were weekend makeup class options available. Is this something that could be arranged?',
    category: 'feedback',
    tags: ['suggestion', 'scheduling', 'makeup-class'],
    likes: 19,
    replies: [
      { id: 'r6', author: 'Admin Team', authorRole: 'admin' as const, avatar: '🏫', content: 'Great suggestion! We\'re looking into offering Saturday makeup classes starting next month. Stay tuned for the announcement!', likes: 10, createdAt: '2 hours ago' },
    ],
    pinned: false,
    createdAt: '1 day ago',
  },
  {
    id: '5',
    author: 'Ms. Phiri',
    authorRole: 'instructor' as const,
    avatar: '👩🏾‍🏫',
    title: '🐍 Python Tips: 5 Fun Projects for Kids',
    content: 'Here are 5 fun Python projects your kids can try at home:\n\n1. Build a simple calculator\n2. Create a guessing game\n3. Make a to-do list app\n4. Draw shapes with Turtle graphics\n5. Build a quiz game\n\nAll of these use concepts we cover in class. Happy coding!',
    category: 'general',
    tags: ['python', 'projects', 'learning-at-home'],
    likes: 32,
    replies: [],
    pinned: false,
    createdAt: '2 days ago',
  },
];

const roleColors = {
  parent: 'bg-blue-500/20 text-blue-400',
  instructor: 'bg-green-500/20 text-green-400',
  admin: 'bg-accent-500/20 text-accent-400',
  child: 'bg-purple-500/20 text-purple-400',
};

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newReply, setNewReply] = useState('');

  const filtered = mockPosts.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium mb-4">
            <Users className="w-4 h-4" /> Community
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Parent & Instructor Forum</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Connect with other parents, share experiences, ask questions, and celebrate your children&apos;s achievements.
          </p>
        </motion.div>

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 shadow-sm rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50"
            />
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-2 px-6 py-3 bg-accent-500 text-brand-900 rounded-xl font-bold hover:bg-accent-400 transition-colors"
          >
            <Plus className="w-5 h-5" /> New Post
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-accent-500 text-brand-900'
                : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            All Topics
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-accent-500 text-brand-900'
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <cat.icon className="w-4 h-4" /> {cat.label}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filtered.map((post, idx) => {
            const categoryInfo = categories.find(c => c.id === post.category);
            const isExpanded = expandedPost === post.id;

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden hover:border-gray-300 transition-all"
              >
                {/* Post Header */}
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{post.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-gray-900 font-semibold text-sm">{post.author}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[post.authorRole]}`}>
                          {post.authorRole}
                        </span>
                        {post.pinned && (
                          <Pin className="w-3.5 h-3.5 text-accent-400" />
                        )}
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {post.createdAt}
                        </span>
                      </div>

                      <h3 className="text-gray-900 font-bold text-lg mb-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                        {isExpanded ? post.content : post.content.slice(0, 200) + (post.content.length > 200 ? '...' : '')}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {post.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" /> {tag}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-4 mt-4">
                        <button className="flex items-center gap-1.5 text-gray-600 hover:text-red-400 transition-colors text-sm">
                          <Heart className="w-4 h-4" /> {post.likes}
                        </button>
                        <button
                          onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                          className="flex items-center gap-1.5 text-gray-600 hover:text-accent-600 transition-colors text-sm"
                        >
                          <MessageSquare className="w-4 h-4" /> {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                        </button>
                        {categoryInfo && (
                          <span className={`flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full ${categoryInfo.color}`}>
                            <categoryInfo.icon className="w-3 h-3" /> {categoryInfo.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                <AnimatePresence>
                  {isExpanded && post.replies.length > 0 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-200 bg-gray-50">
                        {post.replies.map((reply) => (
                          <div key={reply.id} className="px-5 py-4 border-b border-gray-100 last:border-0 ml-12">
                            <div className="flex items-start gap-3">
                              <span className="text-xl">{reply.avatar}</span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-gray-900 font-semibold text-sm">{reply.author}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[reply.authorRole]}`}>
                                    {reply.authorRole}
                                  </span>
                                  <span className="text-gray-400 text-xs">{reply.createdAt}</span>
                                </div>
                                <p className="text-gray-600 text-sm">{reply.content}</p>
                                <button className="flex items-center gap-1 text-gray-500 hover:text-red-400 transition-colors text-xs mt-2">
                                  <Heart className="w-3 h-3" /> {reply.likes}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Reply Input */}
                        <div className="px-5 py-4 ml-12">
                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={newReply}
                              onChange={(e) => setNewReply(e.target.value)}
                              placeholder="Write a reply..."
                              className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50"
                            />
                            <button className="px-4 py-2 bg-accent-500 text-brand-900 rounded-lg font-semibold text-sm hover:bg-accent-400 transition-colors">
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* New Post Modal */}
        <AnimatePresence>
          {showNewPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
              onClick={() => setShowNewPost(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
                  <button onClick={() => setShowNewPost(false)} className="text-gray-500 hover:text-gray-900" aria-label="Close dialog">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="post-category" className="text-gray-900 text-sm font-medium mb-1.5 block">Category</label>
                    <select id="post-category" className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/50">
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-900 text-sm font-medium mb-1.5 block">Title</label>
                    <input
                      type="text"
                      placeholder="What's on your mind?"
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-gray-900 text-sm font-medium mb-1.5 block">Content</label>
                    <textarea
                      rows={5}
                      placeholder="Share your thoughts, questions, or experiences..."
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-900 text-sm font-medium mb-1.5 block">Tags (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g., robotics, question, beginner"
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50"
                    />
                  </div>
                  <button
                    onClick={() => setShowNewPost(false)}
                    className="w-full py-3 bg-accent-500 text-brand-900 rounded-xl font-bold hover:bg-accent-400 transition-colors"
                  >
                    Post to Community
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
