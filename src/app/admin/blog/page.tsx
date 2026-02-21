'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff,
  Save, X, Star, FileText, Image as ImageIcon
} from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string | null;
  readTime: string;
  author: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const categories = ['Robotics', 'Coding', 'STEM Tips', 'Parent Guide', 'News'];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'News',
    image: '',
    readTime: '5 min',
    author: 'Robotix Institute',
    featured: false,
    published: true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const startCreate = () => {
    setForm({
      title: '',
      excerpt: '',
      content: '',
      category: 'News',
      image: '',
      readTime: '5 min',
      author: 'Robotix Institute',
      featured: false,
      published: true,
    });
    setCreating(true);
    setEditing(null);
  };

  const startEdit = (post: BlogPost) => {
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      image: post.image || '',
      readTime: post.readTime,
      author: post.author,
      featured: post.featured,
      published: post.published,
    });
    setEditing(post);
    setCreating(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.excerpt || !form.content) {
      showMessage('error', 'Title, excerpt and content are required');
      return;
    }

    setSaving(true);
    try {
      const url = '/api/admin/blog';
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { ...form, id: editing.id } : form;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showMessage('success', editing ? 'Post updated!' : 'Post created!');
        setEditing(null);
        setCreating(false);
        fetchPosts();
      } else {
        showMessage('error', 'Failed to save post');
      }
    } catch {
      showMessage('error', 'Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Delete "${post.title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/blog?id=${post.id}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('success', 'Post deleted');
        fetchPosts();
      }
    } catch {
      showMessage('error', 'Failed to delete post');
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: post.id, published: !post.published }),
      });
      if (res.ok) {
        showMessage('success', post.published ? 'Post unpublished' : 'Post published!');
        fetchPosts();
      }
    } catch {
      showMessage('error', 'Failed to toggle publish');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      showMessage('error', `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: 4MB`);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'blog');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setForm(prev => ({ ...prev, image: data.url || data.path }));
        showMessage('success', 'Image uploaded!');
      } else {
        showMessage('error', data.error || 'Upload failed');
      }
    } catch {
      showMessage('error', 'Failed to upload image');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
              <p className="text-gray-400">Create & manage blog articles that appear on the website</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={startCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" /> New Post
          </motion.button>
        </div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-6 p-4 rounded-xl ${
                message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor */}
        {(creating || editing) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {editing ? 'Edit Post' : 'Create New Post'}
              </h2>
              <button onClick={() => { setEditing(null); setCreating(false); }}
                className="p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title *</label>
                <input type="text" value={form.title}
                  onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-accent-400 outline-none"
                  placeholder="Post title" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select value={form.category}
                  onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-accent-400 outline-none"
                  title="Category">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Excerpt / Summary *</label>
              <textarea value={form.excerpt}
                onChange={(e) => setForm(p => ({ ...p, excerpt: e.target.value }))}
                rows={2}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-accent-400 outline-none resize-none"
                placeholder="Brief summary shown in blog listing" />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Full Content *</label>
              <textarea value={form.content}
                onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))}
                rows={10}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-accent-400 outline-none resize-none font-mono text-sm"
                placeholder="Write the full article content here..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Image</label>
                <div className="flex gap-2">
                  <input type="text" value={form.image}
                    onChange={(e) => setForm(p => ({ ...p, image: e.target.value }))}
                    className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-accent-400 outline-none"
                    placeholder="/image-name.jpg" />
                  <label className="p-3 bg-accent-500/20 border border-accent-500/30 rounded-xl cursor-pointer hover:bg-accent-500/30 transition-colors">
                    <ImageIcon className="w-5 h-5 text-accent-400" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Read Time</label>
                <input type="text" value={form.readTime}
                  onChange={(e) => setForm(p => ({ ...p, readTime: e.target.value }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-accent-400 outline-none"
                  placeholder="5 min" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Author</label>
                <input type="text" value={form.author}
                  onChange={(e) => setForm(p => ({ ...p, author: e.target.value }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-accent-400 outline-none"
                  placeholder="Robotix Institute" />
              </div>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input type="checkbox" checked={form.featured}
                  onChange={(e) => setForm(p => ({ ...p, featured: e.target.checked }))}
                  className="w-4 h-4 rounded accent-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400" /> Featured Post
              </label>
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input type="checkbox" checked={form.published}
                  onChange={(e) => setForm(p => ({ ...p, published: e.target.checked }))}
                  className="w-4 h-4 rounded accent-green-400" />
                <Eye className="w-4 h-4 text-green-400" /> Published
              </label>
            </div>

            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors">
              <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Post'}
            </button>
          </motion.div>
        )}

        {/* Posts List */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading posts...</div>
        ) : posts.length === 0 && !creating ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No blog posts yet</h3>
            <p className="text-gray-400 mb-6">Create your first blog post to appear on the website.</p>
            <button onClick={startCreate}
              className="px-6 py-3 bg-accent-500 text-white rounded-xl font-semibold">
              <Plus className="w-5 h-5 inline mr-2" /> Create First Post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-5 flex items-center gap-5"
              >
                {post.image && (
                  <div className="w-20 h-20 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                    <img src={post.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white truncate">{post.title}</h3>
                    {post.featured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />}
                    {!post.published && (
                      <span className="px-2 py-0.5 text-xs rounded bg-red-500/20 text-red-400 flex-shrink-0">Draft</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate">{post.excerpt}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>{post.category}</span>
                    <span>{post.readTime}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => togglePublished(post)}
                    className="p-2 text-gray-400 hover:text-white transition-colors" title={post.published ? 'Unpublish' : 'Publish'}>
                    {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => startEdit(post)}
                    className="p-2 text-gray-400 hover:text-accent-400 transition-colors" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(post)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
