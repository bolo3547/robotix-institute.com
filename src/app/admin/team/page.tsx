'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ChevronLeft, Plus, Edit, Trash2, Save } from 'lucide-react';

const defaultTeam = [
  {
    id: 1,
    name: 'Dr. Chileshe Mwale',
    role: 'Founder & Director',
    bio: 'PhD in Computer Science, 15+ years in tech education',
    specialty: 'Robotics & AI',
  },
  {
    id: 2,
    name: 'Linda Banda',
    role: 'Head of Curriculum',
    bio: 'Master\'s in Education, expert in STEM pedagogy',
    specialty: 'Curriculum Design',
  },
  {
    id: 3,
    name: 'Thomas Kafwimbi',
    role: 'Lead Instructor - Robotics',
    bio: 'Certified robotics engineer, competition winner',
    specialty: 'Robotics',
  },
  {
    id: 4,
    name: 'Grace Nkonde',
    role: 'Lead Instructor - Programming',
    bio: 'Full-stack developer, 8 years industry experience',
    specialty: 'Web Development & Python',
  },
];

export default function AdminTeamPage() {
  const [team, setTeam] = useState(defaultTeam);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    specialty: '',
  });

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      setTeam(team.filter(m => m.id !== id));
    }
  };

  const handleEdit = (member: any) => {
    setEditingId(member.id);
    setFormData(member);
  };

  const handleSave = () => {
    if (editingId) {
      setTeam(team.map(m => m.id === editingId ? { ...formData, id: editingId } : m));
      setEditingId(null);
    } else if (isAdding) {
      setTeam([...team, { ...formData, id: Math.max(...team.map(m => m.id), 0) + 1 }]);
      setIsAdding(false);
    }
    setFormData({ name: '', role: '', bio: '', specialty: '' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', role: '', bio: '', specialty: '' });
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
          <h1 className="text-2xl font-bold">Manage Team</h1>
          <Button
            variant="primary"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Team Member
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Add Team Member Form */}
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700"
          >
            <h2 className="text-xl font-bold mb-6">Add New Team Member</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g., Dr. Chileshe Mwale"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <input
                  type="text"
                  placeholder="e.g., Lead Instructor - Robotics"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Specialty</label>
                <input
                  type="text"
                  placeholder="e.g., Robotics & AI"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Biography</label>
                <textarea
                  placeholder="Enter professional background and qualifications..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="primary" onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Member
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {/* Team List */}
        <div className="space-y-4">
          {team.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {editingId === member.id ? (
                <Card className="bg-gray-800 border border-blue-500 p-6">
                  <h3 className="text-lg font-bold mb-4">Edit Team Member</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Role</label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Specialty</label>
                      <input
                        type="text"
                        value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Biography</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={3}
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
                      <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                      <p className="text-blue-400 font-semibold mb-3">{member.role}</p>
                      <p className="text-gray-300 mb-3">{member.bio}</p>
                      <div className="inline-block bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-200">
                        {member.specialty}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(member)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
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
          Total Team Members: {team.length}
        </div>
      </div>
    </div>
  );
}
