'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, Plus, Trash2, Edit2, GripVertical, Eye, EyeOff,
  Upload, Check, X, ExternalLink, Building2, ArrowUp, ArrowDown,
} from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  subtitle: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  displayOrder: number;
  active: boolean;
}

type FormData = {
  name: string;
  subtitle: string;
  logoUrl: string;
  websiteUrl: string;
  active: boolean;
};

const emptyForm: FormData = { name: '', subtitle: '', logoUrl: '', websiteUrl: '', active: true };

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchPartners = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/partners');
      if (res.ok) {
        const data = await res.json();
        setPartners(data);
      }
    } catch (err) {
      console.error('Failed to fetch partners:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPartners(); }, [fetchPartners]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
    if (!allowed.includes(file.type)) return;
    if (file.size > 2 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const uploadLogo = async (): Promise<string | null> => {
    const input = document.getElementById('partner-logo-input') as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return null;

    // Client-side validation
    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: 4MB`);
      return null;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'partner');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) return data.url;
      alert(data.error || 'Upload failed');
      return null;
    } catch {
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      let logoUrl = form.logoUrl;
      if (previewUrl) {
        const uploaded = await uploadLogo();
        if (uploaded) logoUrl = uploaded;
      }
      const res = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, logoUrl }),
      });
      if (res.ok) {
        showSuccess('Partner added successfully!');
        setCreating(false);
        setForm(emptyForm);
        setPreviewUrl(null);
        fetchPartners();
      }
    } catch (err) {
      console.error('Create failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editing || !form.name.trim()) return;
    setSaving(true);
    try {
      let logoUrl = form.logoUrl;
      if (previewUrl) {
        const uploaded = await uploadLogo();
        if (uploaded) logoUrl = uploaded;
      }
      const res = await fetch(`/api/admin/partners/${editing}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, logoUrl }),
      });
      if (res.ok) {
        showSuccess('Partner updated!');
        setEditing(null);
        setForm(emptyForm);
        setPreviewUrl(null);
        fetchPartners();
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this partner?')) return;
    try {
      await fetch(`/api/admin/partners/${id}`, { method: 'DELETE' });
      showSuccess('Partner deleted');
      fetchPartners();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const toggleActive = async (partner: Partner) => {
    try {
      await fetch(`/api/admin/partners/${partner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !partner.active }),
      });
      fetchPartners();
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const movePartner = async (partner: Partner, direction: 'up' | 'down') => {
    const idx = partners.findIndex(p => p.id === partner.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= partners.length) return;

    const other = partners[swapIdx];
    try {
      await Promise.all([
        fetch(`/api/admin/partners/${partner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayOrder: other.displayOrder }),
        }),
        fetch(`/api/admin/partners/${other.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayOrder: partner.displayOrder }),
        }),
      ]);
      fetchPartners();
    } catch (err) {
      console.error('Move failed:', err);
    }
  };

  const startEdit = (partner: Partner) => {
    setCreating(false);
    setEditing(partner.id);
    setForm({
      name: partner.name,
      subtitle: partner.subtitle || '',
      logoUrl: partner.logoUrl || '',
      websiteUrl: partner.websiteUrl || '',
      active: partner.active,
    });
    setPreviewUrl(null);
  };

  const startCreate = () => {
    setEditing(null);
    setCreating(true);
    setForm(emptyForm);
    setPreviewUrl(null);
  };

  const cancelForm = () => {
    setEditing(null);
    setCreating(false);
    setForm(emptyForm);
    setPreviewUrl(null);
  };

  const isFormOpen = creating || editing !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Trusted Partners</h1>
              <p className="text-white/60 text-sm mt-1">Manage organization logos shown on the homepage</p>
            </div>
          </div>
          {!isFormOpen && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startCreate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Partner
            </motion.button>
          )}
        </div>

        {/* Success */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 px-4 py-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-orange-400" />
                  {creating ? 'Add New Partner' : 'Edit Partner'}
                </h2>
                <button onClick={cancelForm} className="p-2 text-gray-400 hover:text-white" title="Close form">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Organization Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. BongoHive"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Subtitle</label>
                  <input
                    type="text"
                    value={form.subtitle}
                    onChange={e => setForm({ ...form, subtitle: e.target.value })}
                    placeholder="e.g. Technology & Innovation Hub"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-white/70 mb-1.5">Website URL (optional)</label>
                  <input
                    type="url"
                    value={form.websiteUrl}
                    onChange={e => setForm({ ...form, websiteUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:border-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div className="mb-6">
                <label className="block text-sm text-white/70 mb-1.5">Partner Logo</label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-orange-400/50 transition-colors relative">
                  {(previewUrl || form.logoUrl) ? (
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-4 inline-block">
                        <Image
                          src={previewUrl || form.logoUrl}
                          alt="Logo preview"
                          width={160}
                          height={60}
                          className="h-12 w-auto object-contain"
                          unoptimized
                        />
                      </div>
                      <p className="text-white/50 text-xs">
                        {previewUrl ? 'New logo selected — save to apply' : 'Current logo'}
                      </p>
                      <button
                        onClick={() => { setPreviewUrl(null); setForm({ ...form, logoUrl: '' }); }}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Remove logo
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6 text-orange-400" />
                      </div>
                      <p className="text-white/60 text-sm">Click to upload partner logo</p>
                      <p className="text-white/40 text-xs">PNG, JPG, SVG, WebP • Max 2MB</p>
                    </div>
                  )}
                  <input
                    id="partner-logo-input"
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="Upload partner logo"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={cancelForm}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={creating ? handleCreate : handleUpdate}
                  disabled={saving || uploading || !form.name.trim()}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 text-white font-medium text-sm disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {saving || uploading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      {uploading ? 'Uploading...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {creating ? 'Add Partner' : 'Save Changes'}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Partners List */}
        {loading ? (
          <div className="text-center py-20 text-white/50">Loading partners...</div>
        ) : partners.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 rounded-2xl bg-white/5 border border-white/10"
          >
            <Building2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 mb-4">No partners added yet</p>
            <button
              onClick={startCreate}
              className="px-4 py-2 rounded-lg bg-orange-500/20 text-orange-400 text-sm hover:bg-orange-500/30 transition-colors"
            >
              Add your first partner
            </button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {partners.map((partner, idx) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`rounded-xl border backdrop-blur-xl p-4 sm:p-5 flex items-center gap-4 group transition-all ${
                  partner.active
                    ? 'bg-white/5 border-white/10 hover:border-white/20'
                    : 'bg-white/[0.02] border-white/5 opacity-60'
                }`}
              >
                {/* Reorder */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => movePartner(partner, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-white/30 hover:text-white disabled:opacity-20"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <GripVertical className="w-3.5 h-3.5 text-white/20" />
                  <button
                    onClick={() => movePartner(partner, 'down')}
                    disabled={idx === partners.length - 1}
                    className="p-1 text-white/30 hover:text-white disabled:opacity-20"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Logo / Avatar */}
                <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                  {partner.logoUrl ? (
                    <Image
                      src={partner.logoUrl}
                      alt={partner.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-contain p-1"
                      unoptimized
                    />
                  ) : (
                    <span className="text-sm font-bold text-brand-600">
                      {partner.name.slice(0, 3).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold truncate">{partner.name}</h3>
                    {!partner.active && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">Hidden</span>
                    )}
                  </div>
                  {partner.subtitle && (
                    <p className="text-white/50 text-sm truncate">{partner.subtitle}</p>
                  )}
                  {partner.websiteUrl && (
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-orange-400/70 hover:text-orange-400 flex items-center gap-1 mt-0.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {partner.websiteUrl.replace(/^https?:\/\//, '').slice(0, 30)}
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 sm:gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleActive(partner)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title={partner.active ? 'Hide from homepage' : 'Show on homepage'}
                  >
                    {partner.active ? (
                      <Eye className="w-4 h-4 text-green-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-yellow-400" />
                    )}
                  </button>
                  <button
                    onClick={() => startEdit(partner)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(partner.id)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Preview hint */}
        {partners.length > 0 && (
          <div className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10 text-center">
            <p className="text-white/40 text-xs">
              Active partners appear in the &quot;Trusted by Leading Organizations&quot; section on the homepage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
