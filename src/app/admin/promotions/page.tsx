'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  ArrowLeft, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  Megaphone,
  Calendar,
  ExternalLink,

  Type,
  Palette
} from 'lucide-react';

interface Promotion {
  id: string;
  title: string;
  description: string;
  type: 'banner' | 'popup' | 'announcement';
  backgroundColor: string;
  textColor: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  position: 'top' | 'bottom' | 'hero' | 'sidebar';
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: Date;
}

const defaultPromotions: Promotion[] = [
  {
    id: '1',
    title: '🎉 New Year Special - 20% Off!',
    description: 'Enroll in any program before January 31st and get 20% off your first term!',
    type: 'banner',
    backgroundColor: '#10b981',
    textColor: '#ffffff',
    ctaText: 'Claim Offer',
    ctaLink: '/request-quote',
    position: 'top',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    isActive: true,
    createdAt: new Date('2026-01-01'),
  },
  {
    id: '2',
    title: 'Free Trial Classes Available!',
    description: 'Try any program free before you commit. Limited spots available.',
    type: 'announcement',
    backgroundColor: '#2563eb',
    textColor: '#ffffff',
    ctaText: 'Book Trial',
    ctaLink: '/auth/signup',
    position: 'hero',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: false,
    createdAt: new Date('2026-01-15'),
  },
];

const positionLabels = {
  top: 'Top Banner',
  bottom: 'Bottom Banner',
  hero: 'Hero Section',
  sidebar: 'Sidebar',
};

const typeLabels = {
  banner: 'Banner',
  popup: 'Popup',
  announcement: 'Announcement Bar',
};

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(defaultPromotions);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Promotion>>({
    title: '',
    description: '',
    type: 'banner',
    backgroundColor: '#2563eb',
    textColor: '#ffffff',
    ctaText: '',
    ctaLink: '',
    position: 'top',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in title and description');
      return;
    }

    if (editingId) {
      setPromotions(prev => prev.map(p => 
        p.id === editingId 
          ? { ...p, ...formData } as Promotion
          : p
      ));
    } else {
      const newPromo: Promotion = {
        ...formData,
        id: `promo-${Date.now()}`,
        createdAt: new Date(),
      } as Promotion;
      setPromotions(prev => [newPromo, ...prev]);
    }

    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      type: 'banner',
      backgroundColor: '#2563eb',
      textColor: '#ffffff',
      ctaText: '',
      ctaLink: '',
      position: 'top',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
    });
  };

  const handleEdit = (promo: Promotion) => {
    setFormData(promo);
    setEditingId(promo.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      setPromotions(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setPromotions(prev => prev.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const activeCount = promotions.filter(p => p.isActive).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Promotions & Banners</h1>
                <p className="text-sm text-gray-500">Create promotional banners and announcements</p>
              </div>
            </div>
            <Button variant="primary" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Promotion
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
                  <p className="text-sm text-gray-500">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <EyeOff className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{promotions.length - activeCount}</p>
                  <p className="text-sm text-gray-500">Inactive</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{promotions.length}</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {editingId ? 'Edit Promotion' : 'Create New Promotion'}
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="🎉 Special Offer - 20% Off!"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                      placeholder="Enroll before the end of the month..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as Promotion['type'] }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="banner">Banner</option>
                        <option value="announcement">Announcement Bar</option>
                        <option value="popup">Popup</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <select
                        value={formData.position}
                        onChange={e => setFormData(prev => ({ ...prev, position: e.target.value as Promotion['position'] }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="top">Top of Page</option>
                        <option value="hero">Hero Section</option>
                        <option value="bottom">Bottom of Page</option>
                        <option value="sidebar">Sidebar</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CTA Button Text
                      </label>
                      <input
                        type="text"
                        value={formData.ctaText}
                        onChange={e => setFormData(prev => ({ ...prev, ctaText: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="Learn More"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CTA Link
                      </label>
                      <input
                        type="text"
                        value={formData.ctaLink}
                        onChange={e => setFormData(prev => ({ ...prev, ctaLink: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="/request-quote"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Palette className="w-4 h-4 inline mr-1" />
                        Background Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={formData.backgroundColor}
                          onChange={e => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                          className="w-12 h-10 rounded border border-gray-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.backgroundColor}
                          onChange={e => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Type className="w-4 h-4 inline mr-1" />
                        Text Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={formData.textColor}
                          onChange={e => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                          className="w-12 h-10 rounded border border-gray-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.textColor}
                          onChange={e => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 text-brand-500 rounded border-gray-300"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Active (visible on website)
                    </label>
                  </div>

                  {/* Preview */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </label>
                    <div
                      className="rounded-lg p-4 text-center"
                      style={{ 
                        backgroundColor: formData.backgroundColor,
                        color: formData.textColor
                      }}
                    >
                      <p className="font-semibold">{formData.title || 'Your Title Here'}</p>
                      <p className="text-sm opacity-90 mt-1">{formData.description || 'Your description here...'}</p>
                      {formData.ctaText && (
                        <button className="mt-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded text-sm font-medium">
                          {formData.ctaText}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  {editingId ? 'Update Promotion' : 'Create Promotion'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Promotions List */}
        <div className="space-y-4">
          {promotions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No promotions yet. Create your first one!</p>
              </CardContent>
            </Card>
          ) : (
            promotions.map(promo => (
              <Card key={promo.id} className={!promo.isActive ? 'opacity-60' : ''}>
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Color Preview */}
                    <div 
                      className="w-2 rounded-l-lg"
                      style={{ backgroundColor: promo.backgroundColor }}
                    />
                    
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{promo.title}</h3>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              promo.isActive 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {promo.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                              {typeLabels[promo.type]}
                            </span>
                            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                              {positionLabels[promo.position]}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{promo.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {promo.startDate} to {promo.endDate}
                            </span>
                            {promo.ctaLink && (
                              <span className="flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" />
                                {promo.ctaLink}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleActive(promo.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              promo.isActive 
                                ? 'text-green-600 hover:bg-green-50' 
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={promo.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {promo.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => handleEdit(promo)}
                            className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(promo.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
