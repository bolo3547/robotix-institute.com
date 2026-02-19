'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Save, Upload, Plus, Trash2, Eye, 
  CheckCircle, AlertCircle, Loader2, ImageIcon,
  Type, FileText, Link as LinkIcon
} from 'lucide-react';

// Page definitions with sections
const pageDefinitions: Record<string, { name: string; route: string; sections: SectionDef[] }> = {
  '1': {
    name: 'Homepage',
    route: '/',
    sections: [
      { 
        key: 'hero', 
        name: 'Hero', 
        fields: [
          { name: 'title', type: 'text', label: 'Main Title' },
          { name: 'subtitle', type: 'textarea', label: 'Subtitle' },
          { name: 'ctaText', type: 'text', label: 'CTA Button Text' },
          { name: 'ctaLink', type: 'text', label: 'CTA Button Link' },
          { name: 'backgroundImage', type: 'image', label: 'Background Image' },
        ]
      },
      { 
        key: 'programs', 
        name: 'Programs', 
        fields: [
          { name: 'title', type: 'text', label: 'Section Title' },
          { name: 'description', type: 'textarea', label: 'Description' },
        ]
      },
      { 
        key: 'testimonials', 
        name: 'Testimonials', 
        fields: [
          { name: 'title', type: 'text', label: 'Section Title' },
        ]
      },
      { 
        key: 'cta', 
        name: 'CTA', 
        fields: [
          { name: 'title', type: 'text', label: 'CTA Title' },
          { name: 'description', type: 'textarea', label: 'Description' },
          { name: 'buttonText', type: 'text', label: 'Button Text' },
          { name: 'buttonLink', type: 'text', label: 'Button Link' },
          { name: 'backgroundImage', type: 'image', label: 'Background Image' },
        ]
      },
    ]
  },
  '2': {
    name: 'About Us',
    route: '/about',
    sections: [
      { 
        key: 'mission', 
        name: 'Mission', 
        fields: [
          { name: 'title', type: 'text', label: 'Section Title' },
          { name: 'description', type: 'textarea', label: 'Mission Statement' },
          { name: 'image', type: 'image', label: 'Mission Image' },
        ]
      },
      { 
        key: 'team', 
        name: 'Team', 
        fields: [
          { name: 'title', type: 'text', label: 'Section Title' },
        ]
      },
      { 
        key: 'journey', 
        name: 'Journey', 
        fields: [
          { name: 'title', type: 'text', label: 'Section Title' },
        ]
      },
      { 
        key: 'values', 
        name: 'Values', 
        fields: [
          { name: 'title', type: 'text', label: 'Section Title' },
        ]
      },
    ]
  },
  '3': {
    name: 'Programs',
    route: '/programs',
    sections: [
      { 
        key: 'grid', 
        name: 'Programs Grid', 
        fields: [
          { name: 'title', type: 'text', label: 'Section Title' },
          { name: 'description', type: 'textarea', label: 'Description' },
        ]
      },
      { 
        key: 'details', 
        name: 'Details', 
        fields: [
          { name: 'title', type: 'text', label: 'Section Title' },
          { name: 'content', type: 'textarea', label: 'Content' },
        ]
      },
      { 
        key: 'pricing', 
        name: 'Pricing', 
        fields: [
          { name: 'title', type: 'text', label: 'Section Title' },
        ]
      },
    ]
  },
  '4': {
    name: 'Testimonials',
    route: '/testimonials',
    sections: [
      { 
        key: 'stories', 
        name: 'Success Stories', 
        fields: [
          { name: 'title', type: 'text', label: 'Section Title' },
        ]
      },
      { 
        key: 'ratings', 
        name: 'Ratings', 
        fields: [
          { name: 'title', type: 'text', label: 'Section Title' },
          { name: 'averageRating', type: 'number', label: 'Average Rating' },
          { name: 'totalReviews', type: 'number', label: 'Total Reviews' },
        ]
      },
      { 
        key: 'feedback', 
        name: 'Feedback', 
        fields: [
          { name: 'title', type: 'text', label: 'Section Title' },
        ]
      },
    ]
  },
  '5': {
    name: 'Contact',
    route: '/contact',
    sections: [
      { 
        key: 'form', 
        name: 'Form', 
        fields: [
          { name: 'title', type: 'text', label: 'Section Title' },
          { name: 'description', type: 'textarea', label: 'Description' },
          { name: 'submitText', type: 'text', label: 'Submit Button Text' },
        ]
      },
      { 
        key: 'map', 
        name: 'Map', 
        fields: [
          { name: 'title', type: 'text', label: 'Section Title' },
          { name: 'address', type: 'textarea', label: 'Address' },
          { name: 'image', type: 'image', label: 'Map Image' },
        ]
      },
      { 
        key: 'faq', 
        name: 'FAQ', 
        fields: [
          { name: 'title', type: 'text', label: 'Section Title' },
        ]
      },
    ]
  },
  '6': {
    name: 'What You Get',
    route: '/what-you-get',
    sections: [
      { 
        key: 'offers', 
        name: 'Offers', 
        fields: [
          { name: 'title', type: 'text', label: 'Section Title' },
        ]
      },
      { 
        key: 'benefits', 
        name: 'Benefits', 
        fields: [
          { name: 'title', type: 'text', label: 'Section Title' },
        ]
      },
      { 
        key: 'pricing', 
        name: 'Pricing', 
        fields: [
          { name: 'title', type: 'text', label: 'Section Title' },
        ]
      },
    ]
  },
};

interface SectionDef {
  key: string;
  name: string;
  fields: FieldDef[];
}

interface FieldDef {
  name: string;
  type: 'text' | 'textarea' | 'image' | 'number';
  label: string;
}

export default function ContentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;
  const pageDef = pageDefinitions[pageId];

  const [content, setContent] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('');
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    if (!pageId) return;
    try {
      const res = await fetch(`/api/admin/content?pageId=${pageId}`);
      if (res.ok) {
        const data = await res.json();
        setContent(data.content || {});
        if (pageDef?.sections.length > 0) {
          setActiveSection(pageDef.sections[0].key);
        }
      }
    } catch (err) {
      console.error('Failed to fetch content:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  }, [pageId, pageDef]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleFieldChange = (sectionKey: string, fieldName: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] || {}),
        [fieldName]: value,
      },
    }));
    setSaved(false);
  };

  const handleImageUpload = async (sectionKey: string, fieldName: string, file: File) => {
    const uploadKey = `${sectionKey}.${fieldName}`;
    setUploadingField(uploadKey);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'content');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      
      if (data.url) {
        handleFieldChange(sectionKey, fieldName, data.url);
      } else {
        setError('Failed to upload image');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload image');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, content }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError('Failed to save content');
      }
    } catch (err) {
      console.error('Save failed:', err);
      setError('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  if (!pageDef) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Page Not Found</h1>
          <Link href="/admin/content" className="text-brand-400 hover:underline">
            Back to Content Management
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/content" className="text-white/60 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-white">{pageDef.name}</h1>
                <p className="text-white/60 text-xs">{pageDef.route}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={pageDef.route}
                target="_blank"
                className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <Eye className="w-4 h-4" /> Preview
              </Link>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saved ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/20 border-b border-red-500/30 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-300 hover:text-red-100">×</button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Section Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Sections</h2>
                <nav className="space-y-2">
                  {pageDef.sections.map((section) => (
                    <button
                      key={section.key}
                      onClick={() => setActiveSection(section.key)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        activeSection === section.key
                          ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="font-medium">{section.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content Editor */}
            <div className="lg:col-span-3">
              {pageDef.sections
                .filter((section) => section.key === activeSection)
                .map((section) => (
                  <motion.div
                    key={section.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-6"
                  >
                    <h3 className="text-xl font-bold text-white mb-6">{section.name}</h3>
                    
                    <div className="space-y-6">
                      {section.fields.map((field) => (
                        <div key={field.name}>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            {field.label}
                          </label>

                          {field.type === 'text' && (
                            <div className="relative">
                              <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                              <input
                                type="text"
                                value={(content[section.key]?.[field.name] as string) || ''}
                                onChange={(e) => handleFieldChange(section.key, field.name, e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                              />
                            </div>
                          )}

                          {field.type === 'number' && (
                            <input
                              type="number"
                              value={(content[section.key]?.[field.name] as string) || ''}
                              onChange={(e) => handleFieldChange(section.key, field.name, e.target.value)}
                              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                            />
                          )}

                          {field.type === 'textarea' && (
                            <div className="relative">
                              <FileText className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                              <textarea
                                value={(content[section.key]?.[field.name] as string) || ''}
                                onChange={(e) => handleFieldChange(section.key, field.name, e.target.value)}
                                rows={4}
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all resize-none"
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                              />
                            </div>
                          )}

                          {field.type === 'image' && (
                            <div className="space-y-3">
                              {content[section.key]?.[field.name] && (
                                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-white/10">
                                  <Image
                                    src={content[section.key]?.[field.name] || ''}
                                    alt={field.label}
                                    fill
                                    className="object-cover"
                                  />
                                  <button
                                    onClick={() => handleFieldChange(section.key, field.name, '')}
                                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                    title="Remove image"
                                    aria-label="Remove image"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                              
                              <label 
                                className={`flex items-center justify-center gap-3 px-4 py-4 rounded-lg border-2 border-dashed border-white/20 text-white/60 hover:border-brand-500 hover:text-brand-400 cursor-pointer transition-colors ${
                                  uploadingField === `${section.key}.${field.name}` ? 'opacity-50 pointer-events-none' : ''
                                }`}
                              >
                                {uploadingField === `${section.key}.${field.name}` ? (
                                  <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Uploading...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-5 h-5" />
                                    <span>{content[section.key]?.[field.name] ? 'Replace Image' : 'Upload Image'}</span>
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(section.key, field.name, file);
                                  }}
                                  className="hidden"
                                />
                              </label>

                              {/* Or enter URL */}
                              <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                  type="text"
                                  value={(content[section.key]?.[field.name] as string) || ''}
                                  onChange={(e) => handleFieldChange(section.key, field.name, e.target.value)}
                                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm"
                                  placeholder="Or enter image URL"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
