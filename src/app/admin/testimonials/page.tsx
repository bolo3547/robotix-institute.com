'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ChevronLeft, Plus, Edit, Trash2, Save, Star, MessageSquare } from 'lucide-react';

const defaultTestimonials: { id: number; name: string; role: string; text: string; rating: number; childName: string; program: string; location: string }[] = [];

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Parent',
    text: '',
    rating: 5,
    childName: '',
    program: '',
    location: '',
  });

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  };

  const handleEdit = (testimonial: any) => {
    setEditingId(testimonial.id);
    setFormData(testimonial);
  };

  const handleSave = () => {
    if (editingId) {
      setTestimonials(testimonials.map(t => t.id === editingId ? { ...formData, id: editingId } : t));
      setEditingId(null);
    } else if (isAdding) {
      setTestimonials([...testimonials, { ...formData, id: Math.max(...testimonials.map(t => t.id), 0) + 1 }]);
      setIsAdding(false);
    }
    setFormData({ name: '', role: 'Parent', text: '', rating: 5, childName: '', program: '', location: '' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', role: 'Parent', text: '', rating: 5, childName: '', program: '', location: '' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 hover:opacity-70 transition">
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold">Manage Testimonials</h1>
          <Button
            variant="primary"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Add Testimonial Form */}
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700"
          >
            <h2 className="text-xl font-bold mb-6">Add New Testimonial</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Parent Name</label>
                <input
                  type="text"
                  placeholder="e.g., Mukamba Chanda"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Child Name</label>
                <input
                  type="text"
                  placeholder="e.g., Zainab"
                  value={formData.childName}
                  onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Program</label>
                <input
                  type="text"
                  placeholder="e.g., Robotics Basics"
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  placeholder="e.g., Lusaka"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Testimonial Text</label>
                <textarea
                  placeholder="Enter the testimonial text..."
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="primary" onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Testimonial
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {/* Testimonials List */}
        <div className="space-y-4">
          {testimonials.length === 0 && !isAdding && (
            <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No testimonials yet</h3>
              <p className="text-gray-500 mb-6">Click &quot;Add Testimonial&quot; to add your first testimonial.</p>
            </div>
          )}
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {editingId === testimonial.id ? (
                <Card className="bg-gray-800 border border-blue-500 p-6">
                  <h3 className="text-lg font-bold mb-4">Edit Testimonial</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Parent Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Child Name</label>
                      <input
                        type="text"
                        value={formData.childName}
                        onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Program</label>
                      <input
                        type="text"
                        value={formData.program}
                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <select
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      >
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Testimonial Text</label>
                      <textarea
                        value={formData.text}
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        rows={4}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="primary" onClick={handleSave} className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="bg-gray-800 border border-gray-700 hover:border-gray-600 transition p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold">{testimonial.name}</h3>
                        <div className="flex gap-0.5">
                          {Array(testimonial.rating)
                            .fill(null)
                            .map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                        <div>
                          <span className="text-gray-500">Child:</span> {testimonial.childName}
                        </div>
                        <div>
                          <span className="text-gray-500">Program:</span> {testimonial.program}
                        </div>
                        <div>
                          <span className="text-gray-500">Location:</span> {testimonial.location}
                        </div>
                        <div>
                          <span className="text-gray-500">Role:</span> {testimonial.role}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-8 text-center text-gray-400">
          Total Testimonials: {testimonials.length}
        </div>
      </div>
    </div>
  );
}
