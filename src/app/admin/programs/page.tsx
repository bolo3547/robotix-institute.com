'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ChevronLeft, Plus, Edit, Trash2, Save, BookOpen } from 'lucide-react';

const defaultPrograms: { id: number; name: string; ageGroup: string; level: string; price: string; duration: string }[] = [];

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState(defaultPrograms);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ageGroup: '',
    level: '',
    price: '',
    duration: '',
  });

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this program?')) {
      setPrograms(programs.filter(p => p.id !== id));
    }
  };

  const handleEdit = (program: any) => {
    setEditingId(program.id);
    setFormData(program);
  };

  const handleSave = () => {
    if (editingId) {
      setPrograms(programs.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
      setEditingId(null);
    } else if (isAdding) {
      setPrograms([...programs, { ...formData, id: Math.max(...programs.map(p => p.id), 0) + 1 }]);
      setIsAdding(false);
    }
    setFormData({ name: '', ageGroup: '', level: '', price: '', duration: '' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', ageGroup: '', level: '', price: '', duration: '' });
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
          <h1 className="text-2xl font-bold">Manage Programs</h1>
          <Button
            variant="primary"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Program
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Add Program Form */}
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700"
          >
            <h2 className="text-xl font-bold mb-6">Add New Program</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Program Name</label>
                <input
                  type="text"
                  placeholder="e.g., Web Development Pro"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Age Group</label>
                <input
                  type="text"
                  placeholder="e.g., 12-18 years"
                  value={formData.ageGroup}
                  onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <input
                  type="text"
                  placeholder="e.g., 4,500 ZMW/month"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Duration</label>
                <input
                  type="text"
                  placeholder="e.g., 10 weeks"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="primary" onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Program
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {/* Programs List */}
        <div className="space-y-4">
          {programs.length === 0 && !isAdding && (
            <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700">
              <BookOpen className="w-12 h-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No programs yet</h3>
              <p className="text-gray-500 mb-6">Click &quot;Add Program&quot; to create your first program.</p>
            </div>
          )}
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {editingId === program.id ? (
                <Card className="bg-gray-800 border border-blue-500 p-6">
                  <h3 className="text-lg font-bold mb-4">Edit Program</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Program Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Age Group</label>
                      <input
                        type="text"
                        value={formData.ageGroup}
                        onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Level</label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Price</label>
                      <input
                        type="text"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Duration</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
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
                      <h3 className="text-lg font-bold mb-2">{program.name}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
                        <div>
                          <span className="text-gray-400">Age Group:</span> {program.ageGroup}
                        </div>
                        <div>
                          <span className="text-gray-400">Level:</span> {program.level}
                        </div>
                        <div>
                          <span className="text-gray-400">Price:</span> {program.price}
                        </div>
                        <div>
                          <span className="text-gray-400">Duration:</span> {program.duration}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(program)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(program.id)}
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
          Total Programs: {programs.length}
        </div>
      </div>
    </div>
  );
}
