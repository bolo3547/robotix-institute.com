'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  MessageSquare, Heart, Pin, Search, Plus, Send,
  Tag, Users, HelpCircle, Lightbulb, Megaphone,
  ThumbsUp, Clock, X, LogIn, Trash2, Loader2
} from 'lucide-react';

/* ───── types ───── */
interface UserInfo {
  id: string;
  name: string;
  role: string;
  image: string | null;
}

interface CommentLike { userId: string }

interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  user: UserInfo;
  likes: CommentLike[];
  createdAt: string;
}

interface PostLike { userId: string }

interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  tags: string | null;
  image: string | null;
  pinned: boolean;
  published: boolean;
  user: UserInfo;
  comments: Comment[];
  likes: PostLike[];
  _count: { comments: number; likes: number };
  createdAt: string;
}

/* ───── constants ───── */
const categories = [
  { id: 'general', label: 'General', icon: MessageSquare, color: 'bg-blue-500/20 text-blue-400' },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, color: 'bg-red-500/20 text-red-400' },
  { id: 'showcase', label: 'Showcase', icon: Lightbulb, color: 'bg-purple-500/20 text-purple-400' },
  { id: 'events', label: 'Events', icon: Megaphone, color: 'bg-green-500/20 text-green-400' },
  { id: 'feedback', label: 'Feedback', icon: ThumbsUp, color: 'bg-amber-500/20 text-amber-400' },
];

const roleColors: Record<string, string> = {
  parent: 'bg-blue-500/20 text-blue-400',
  instructor: 'bg-green-500/20 text-green-400',
  admin: 'bg-amber-500/20 text-amber-400',
  student: 'bg-purple-500/20 text-purple-400',
};

const avatarFallback = (name: string) => {
  const parts = name.split(' ');
  return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
};

function timeAgo(dateStr: string) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ───── component ───── */
export default function CommunityPage() {
  const { data: session, status } = useSession();
  const currentUser = session?.user as (UserInfo & { email?: string }) | undefined;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  // new post form
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [newTags, setNewTags] = useState('');
  const [posting, setPosting] = useState(false);

  // reply state per post
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // deleting
  const [deletingPost, setDeletingPost] = useState<string | null>(null);
  const [deletingComment, setDeletingComment] = useState<string | null>(null);

  /* ── fetch posts ── */
  const fetchPosts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (searchQuery) params.set('search', searchQuery);
      params.set('limit', '50');
      const res = await fetch(`/api/community/posts?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /* ── create post ── */
  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    setPosting(true);
    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          content: newContent.trim(),
          category: newCategory,
          tags: newTags.trim() || null,
        }),
      });
      if (res.ok) {
        setNewTitle('');
        setNewContent('');
        setNewCategory('general');
        setNewTags('');
        setShowNewPost(false);
        await fetchPosts();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create post');
      }
    } catch {
      alert('Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  /* ── add comment ── */
  const handleAddComment = async (postId: string) => {
    const content = replyContent[postId]?.trim();
    if (!content) return;
    setReplyingTo(postId);
    try {
      const res = await fetch('/api/community/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content }),
      });
      if (res.ok) {
        setReplyContent(prev => ({ ...prev, [postId]: '' }));
        await fetchPosts();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to comment');
      }
    } catch {
      alert('Failed to add comment');
    } finally {
      setReplyingTo(null);
    }
  };

  /* ── toggle like ── */
  const handleLikePost = async (postId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/community/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      if (res.ok) await fetchPosts();
    } catch {
      // ignore
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/community/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId }),
      });
      if (res.ok) await fetchPosts();
    } catch {
      // ignore
    }
  };

  /* ── delete post ── */
  const handleDeletePost = async (postId: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    setDeletingPost(postId);
    try {
      const res = await fetch(`/api/community/posts?id=${postId}`, { method: 'DELETE' });
      if (res.ok) await fetchPosts();
    } catch {
      alert('Failed to delete post');
    } finally {
      setDeletingPost(null);
    }
  };

  /* ── delete comment ── */
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;
    setDeletingComment(commentId);
    try {
      const res = await fetch(`/api/community/comments?id=${commentId}`, { method: 'DELETE' });
      if (res.ok) await fetchPosts();
    } catch {
      alert('Failed to delete comment');
    } finally {
      setDeletingComment(null);
    }
  };

  /* ── helpers ── */
  const isLikedByMe = (likes: { userId: string }[]) =>
    currentUser ? likes.some(l => l.userId === currentUser.id) : false;

  const canDelete = (ownerId: string) =>
    currentUser && (currentUser.id === ownerId || (currentUser as unknown as { role: string }).role === 'admin');

  const parseTags = (tags: string | null): string[] => {
    if (!tags) return [];
    return tags.split(',').map(t => t.trim()).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-600 rounded-full text-sm font-medium mb-4">
            <Users className="w-4 h-4" /> Community
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Parent &amp; Instructor Forum</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Connect with other parents, share experiences, ask questions, and celebrate your children&apos;s achievements.
          </p>
        </motion.div>

        {/* Auth Banner */}
        {status !== 'loading' && !currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3"
          >
            <p className="text-blue-800 text-sm">
              <strong>Sign in</strong> to create posts, comment, and like discussions.
            </p>
            <div className="flex gap-3">
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 shadow-sm rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
          {currentUser ? (
            <button
              onClick={() => setShowNewPost(true)}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" /> New Post
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-500 rounded-xl font-bold cursor-pointer hover:bg-gray-300 transition-colors"
            >
              <LogIn className="w-5 h-5" /> Sign in to Post
            </Link>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
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
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
              }`}
            >
              <cat.icon className="w-4 h-4" /> {cat.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No discussions yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Be the first to start a conversation! Share your experience, ask a question, or celebrate an achievement.
            </p>
            {currentUser && (
              <button
                onClick={() => setShowNewPost(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors"
              >
                <Plus className="w-5 h-5" /> Create First Post
              </button>
            )}
          </motion.div>
        )}

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post, idx) => {
            const categoryInfo = categories.find(c => c.id === post.category);
            const isExpanded = expandedPost === post.id;
            const tags = parseTags(post.tags);
            const liked = isLikedByMe(post.likes);

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden hover:border-gray-300 transition-all"
              >
                {/* Post Header */}
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    {post.user.image ? (
                      <Image src={post.user.image} alt={post.user.name} width={44} height={44} className="w-11 h-11 rounded-full object-cover" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {avatarFallback(post.user.name)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-gray-900 font-semibold text-sm">{post.user.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[post.user.role] || roleColors.parent}`}>
                          {post.user.role}
                        </span>
                        {post.pinned && <Pin className="w-3.5 h-3.5 text-amber-500" />}
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {timeAgo(post.createdAt)}
                        </span>
                        {canDelete(post.userId) && (
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            disabled={deletingPost === post.id}
                            className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete post"
                          >
                            {deletingPost === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        )}
                      </div>

                      <h3 className="text-gray-900 font-bold text-lg mb-2">{post.title}</h3>

                      {/* Post image */}
                      {post.image && (
                        <div className="mb-3 rounded-lg overflow-hidden">
                          <Image src={post.image} alt={post.title} width={600} height={300} className="w-full max-h-64 object-cover" />
                        </div>
                      )}

                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                        {isExpanded ? post.content : post.content.length > 250 ? post.content.slice(0, 250) + '...' : post.content}
                      </p>
                      {!isExpanded && post.content.length > 250 && (
                        <button
                          onClick={() => setExpandedPost(post.id)}
                          className="text-amber-600 text-sm font-medium mt-1 hover:underline"
                        >
                          Read more
                        </button>
                      )}

                      {/* Tags */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
                              <Tag className="w-2.5 h-2.5" /> {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-4 mt-4">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          disabled={!currentUser}
                          className={`flex items-center gap-1.5 transition-colors text-sm ${
                            liked
                              ? 'text-red-500'
                              : currentUser ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 cursor-default'
                          }`}
                          title={currentUser ? (liked ? 'Unlike' : 'Like') : 'Sign in to like'}
                        >
                          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                          {post._count.likes}
                        </button>
                        <button
                          onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                          className="flex items-center gap-1.5 text-gray-500 hover:text-amber-600 transition-colors text-sm"
                        >
                          <MessageSquare className="w-4 h-4" />
                          {post._count.comments} {post._count.comments === 1 ? 'comment' : 'comments'}
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

                {/* Comments Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-200 bg-gray-50">
                        {/* Existing Comments */}
                        {post.comments.length > 0 && post.comments.map((comment) => {
                          const commentLiked = isLikedByMe(comment.likes);
                          return (
                            <div key={comment.id} className="px-3 sm:px-5 py-4 border-b border-gray-100 last:border-0 ml-4 sm:ml-12">
                              <div className="flex items-start gap-3">
                                {comment.user.image ? (
                                  <Image src={comment.user.image} alt={comment.user.name} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                    {avatarFallback(comment.user.name)}
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-gray-900 font-semibold text-sm">{comment.user.name}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[comment.user.role] || roleColors.parent}`}>
                                      {comment.user.role}
                                    </span>
                                    <span className="text-gray-400 text-xs">{timeAgo(comment.createdAt)}</span>
                                    {canDelete(comment.userId) && (
                                      <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        disabled={deletingComment === comment.id}
                                        className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                                        title="Delete comment"
                                      >
                                        {deletingComment === comment.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-gray-600 text-sm whitespace-pre-line">{comment.content}</p>
                                  <button
                                    onClick={() => handleLikeComment(comment.id)}
                                    disabled={!currentUser}
                                    className={`flex items-center gap-1 transition-colors text-xs mt-2 ${
                                      commentLiked
                                        ? 'text-red-500'
                                        : currentUser ? 'text-gray-500 hover:text-red-400' : 'text-gray-400'
                                    }`}
                                  >
                                    <Heart className={`w-3 h-3 ${commentLiked ? 'fill-current' : ''}`} /> {comment.likes.length}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* No comments yet message */}
                        {post.comments.length === 0 && (
                          <div className="px-3 sm:px-5 py-6 ml-4 sm:ml-12 text-center text-gray-400 text-sm">
                            No comments yet. Be the first to reply!
                          </div>
                        )}

                        {/* Comment Input */}
                        {currentUser ? (
                          <div className="px-3 sm:px-5 py-4 ml-4 sm:ml-12">
                            <div className="flex gap-3">
                              <input
                                type="text"
                                value={replyContent[post.id] || ''}
                                onChange={(e) => setReplyContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                                placeholder="Write a comment..."
                                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                              />
                              <button
                                onClick={() => handleAddComment(post.id)}
                                disabled={!replyContent[post.id]?.trim() || replyingTo === post.id}
                                className="px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold text-sm hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {replyingTo === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="px-3 sm:px-5 py-4 ml-4 sm:ml-12 text-center">
                            <Link href="/auth/login" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                              Sign in to join the conversation →
                            </Link>
                          </div>
                        )}
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
                className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
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
                    <select
                      id="post-category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="post-title" className="text-gray-900 text-sm font-medium mb-1.5 block">Title</label>
                    <input
                      id="post-title"
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="What's on your mind?"
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="post-content" className="text-gray-900 text-sm font-medium mb-1.5 block">Content</label>
                    <textarea
                      id="post-content"
                      rows={5}
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Share your thoughts, questions, or experiences..."
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="post-tags" className="text-gray-900 text-sm font-medium mb-1.5 block">Tags (comma separated)</label>
                    <input
                      id="post-tags"
                      type="text"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      placeholder="e.g., robotics, question, beginner"
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                  <button
                    onClick={handleCreatePost}
                    disabled={posting || !newTitle.trim() || !newContent.trim()}
                    className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {posting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Posting...
                      </>
                    ) : (
                      'Post to Community'
                    )}
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
