'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Plus, Trash2, Edit2, Eye, EyeOff, Upload, X, Image as ImageIcon } from 'lucide-react';

interface Photo {
  id: string;
  title: string;
  description: string | null;
  url: string;
  category: string;
  published: boolean;
  createdAt: string;
}

const categories = ['general', 'robotics', 'events', 'students', 'projects'];

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', url: '', category: 'general', published: true });

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/photos');
      if (res.ok) {
        const data = await res.json();
        setPhotos(data);
      }
    } catch (err) {
      console.error('Failed to fetch photos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'gallery');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        setForm(prev => ({ ...prev, url: data.url }));
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingPhoto ? 'PUT' : 'POST';
      const body = editingPhoto ? { id: editingPhoto.id, ...form } : form;

      const res = await fetch('/api/admin/photos', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowForm(false);
        setEditingPhoto(null);
        setForm({ title: '', description: '', url: '', category: 'general', published: true });
        fetchPhotos();
      }
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    try {
      await fetch(`/api/admin/photos?id=${id}`, { method: 'DELETE' });
      fetchPhotos();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const togglePublished = async (photo: Photo) => {
    try {
      await fetch('/api/admin/photos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: photo.id, published: !photo.published }),
      });
      fetchPhotos();
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const openEdit = (photo: Photo) => {
    setEditingPhoto(photo);
    setForm({
      title: photo.title,
      description: photo.description || '',
      url: photo.url,
      category: photo.category,
      published: photo.published,
    });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white">Photo Gallery</h1>
              <p className="text-white/60 text-xs">{photos.length} photos</p>
            </div>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditingPhoto(null); setForm({ title: '', description: '', url: '', category: 'general', published: true }); }}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Photo
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{editingPhoto ? 'Edit Photo' : 'Add New Photo'}</h2>
                <button onClick={() => setShowForm(false)} className="text-white/60 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-brand-500 focus:outline-none"
                    placeholder="Photo title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-brand-500 focus:outline-none"
                    placeholder="Optional description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Image *</label>
                  <div className="space-y-2">
                    {form.url && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden">
                        <Image src={form.url} alt="Preview" fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-white/20 text-white/60 hover:border-brand-500 hover:text-brand-400 cursor-pointer transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <Upload className="w-4 h-4" />
                        {uploading ? 'Uploading...' : 'Upload Image'}
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={form.url}
                      onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-brand-500 focus:outline-none text-sm"
                      placeholder="Or paste image URL"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-brand-500 focus:outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-slate-900">{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={form.published}
                    onChange={(e) => setForm(prev => ({ ...prev, published: e.target.checked }))}
                    className="rounded border-white/20"
                  />
                  <label htmlFor="published" className="text-sm text-white/80">Published (visible on gallery page)</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-white/60 hover:text-white transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium hover:shadow-lg transition-all">
                    {editingPhoto ? 'Save Changes' : 'Add Photo'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Photos Grid */}
        {loading ? (
          <div className="text-center py-20 text-white/60">Loading photos...</div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg mb-2">No photos yet</p>
            <p className="text-white/40 text-sm">Click "Add Photo" to upload your first image.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="relative h-48">
                  <Image src={photo.url} alt={photo.title} fill className="object-cover" />
                  {!photo.published && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white/80 text-sm font-medium bg-black/60 px-3 py-1 rounded-full">Hidden</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(photo)} className="p-1.5 bg-black/60 rounded-lg text-white hover:bg-black/80 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => togglePublished(photo)} className="p-1.5 bg-black/60 rounded-lg text-white hover:bg-black/80 transition-colors">
                      {photo.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => handleDelete(photo.id)} className="p-1.5 bg-red-500/60 rounded-lg text-white hover:bg-red-500/80 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-white truncate">{photo.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-white/40 capitalize">{photo.category}</span>
                    <span className="text-xs text-white/30">•</span>
                    <span className="text-xs text-white/40">{new Date(photo.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
