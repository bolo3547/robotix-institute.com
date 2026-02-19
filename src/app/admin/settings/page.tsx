'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import {
  ChevronLeft,
  Save,
  Settings2,
  Upload,
  ImageIcon,
  Eye,
  EyeOff,
  Megaphone,
  Globe,
  Link2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';

interface BannerSettings {
  enabled: boolean;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  style: 'gradient' | 'animated' | 'minimal' | 'bold';
  showCountdown: boolean;
  countdownEndDate: string;
}

interface SiteSettings {
  logo: { url: string; updatedAt: string };
  favicon: { url: string; updatedAt: string };
  banner: BannerSettings;
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  maintenanceMode: boolean;
  analyticsEnabled: boolean;
}

const defaultSettings: SiteSettings = {
  logo: { url: '/logo.svg', updatedAt: '' },
  favicon: { url: '/favicon.ico', updatedAt: '' },
  banner: {
    enabled: true,
    title: 'New Term Enrollment Now Open!',
    description: "Join 2,500+ students at Zambia's leading robotics & coding institute.",
    ctaText: 'Request Quote',
    ctaLink: '/request-quote',
    style: 'animated',
    showCountdown: true,
    countdownEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  siteName: 'ROBOTIX Institute',
  tagline: 'Transforming STEM Education in Zambia',
  email: 'info@robotixinstitute.io',
  phone: '+260-956-355-117',
  address: 'No. 7 Mistry Court, Great East Road, Lusaka, Zambia',
  facebookUrl: 'https://facebook.com/robotixinstitute',
  instagramUrl: 'https://instagram.com/robotixinstitute',
  linkedinUrl: 'https://linkedin.com/company/robotixinstitute',
  youtubeUrl: 'https://youtube.com/@robotixinstitute',
  maintenanceMode: false,
  analyticsEnabled: true,
};

/* ─── File Uploader Component ─── */
function FileUploader({
  label,
  currentUrl,
  onUpload,
  accept,
  type,
  previewType = 'image',
}: {
  label: string;
  currentUrl: string;
  onUpload: (url: string) => void;
  accept: string;
  type: string;
  previewType?: 'image' | 'icon';
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploadError('');
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onUpload(data.url);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-200">{label}</label>

      {/* Current Preview */}
      {currentUrl && (
        <div className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
          <div className={`relative overflow-hidden rounded-lg bg-white/10 flex items-center justify-center ${previewType === 'icon' ? 'w-12 h-12' : 'w-32 h-12'}`}>
            <Image src={currentUrl} alt={label} fill className="object-contain p-1" unoptimized />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-300 truncate">{currentUrl}</p>
            <p className="text-xs text-gray-500">Current {label.toLowerCase()}</p>
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
          isDragging ? 'border-purple-400 bg-purple-500/10' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" accept={accept} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="hidden" />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <p className="text-sm text-gray-400">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-300"><span className="text-purple-400 font-medium">Click to upload</span> or drag & drop</p>
            <p className="text-xs text-gray-500">PNG, JPG, SVG, WebP (max 5MB)</p>
          </div>
        )}
      </div>

      {uploadError && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" /> {uploadError}
        </motion.div>
      )}
    </div>
  );
}

/* ─── Banner Preview ─── */
function BannerPreview({ banner }: { banner: BannerSettings }) {
  if (!banner.enabled) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-600 p-6 text-center">
        <EyeOff className="w-8 h-8 text-gray-500 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Banner is currently hidden from visitors</p>
      </div>
    );
  }
  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute -bottom-2 -right-4 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
        </div>
        <div className="relative px-4 py-3">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="font-bold text-sm text-white">{banner.title || 'Banner Title'}</span>
            {banner.ctaText && <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white font-medium">{banner.ctaText}</span>}
            {banner.showCountdown && <span className="px-3 py-1.5 bg-white/15 rounded-lg text-xs text-white font-mono font-bold">23:59:59 left</span>}
            <X className="w-4 h-4 text-white/60" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Settings Page ─── */
export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'branding' | 'banner' | 'general' | 'social'>('branding');

  const inputClass = 'w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition';

  // Load settings
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setSettings((prev) => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      // Sync banner to localStorage for instant frontend update
      localStorage.setItem('robotix-banner-settings', JSON.stringify(settings.banner));
      window.dispatchEvent(new Event('banner-settings-changed'));
      // Sync site settings (logo, favicon) to localStorage for Header component
      localStorage.setItem('robotix-site-settings', JSON.stringify({
        logoUrl: settings.logo.url,
        faviconUrl: settings.favicon.url,
        siteName: settings.siteName,
        tagline: settings.tagline,
      }));
      window.dispatchEvent(new Event('site-settings-changed'));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateBanner = (updates: Partial<BannerSettings>) =>
    setSettings((prev) => ({ ...prev, banner: { ...prev.banner, ...updates } }));

  const tabs = [
    { id: 'branding' as const, label: 'Branding & Logo', icon: ImageIcon },
    { id: 'banner' as const, label: 'Banner Control', icon: Megaphone },
    { id: 'general' as const, label: 'General', icon: Settings2 },
    { id: 'social' as const, label: 'Social Media', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 hover:opacity-70 transition">
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold">Website Settings</h1>
          <Button variant="primary" onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save All'}
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Success Toast */}
        <AnimatePresence>
          {saved && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-green-600/90 backdrop-blur text-white p-4 rounded-lg mb-6 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Settings saved successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-gray-800 rounded-xl p-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── BRANDING TAB ── */}
        {activeTab === 'branding' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <Card className="bg-gray-800 border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Site Logo</h2>
                  <p className="text-sm text-gray-400">Upload your organization logo (SVG or PNG with transparent bg recommended)</p>
                </div>
              </div>
              <FileUploader
                label="Logo Image"
                currentUrl={settings.logo.url}
                onUpload={(url) => setSettings((p) => ({ ...p, logo: { url, updatedAt: new Date().toISOString() } }))}
                accept="image/png,image/svg+xml,image/webp,image/jpeg"
                type="logo"
              />
            </Card>

            <Card className="bg-gray-800 border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Favicon</h2>
                  <p className="text-sm text-gray-400">The small icon shown in browser tabs (32x32 ICO or PNG)</p>
                </div>
              </div>
              <FileUploader
                label="Favicon"
                currentUrl={settings.favicon.url}
                onUpload={(url) => setSettings((p) => ({ ...p, favicon: { url, updatedAt: new Date().toISOString() } }))}
                accept="image/png,image/x-icon,image/svg+xml"
                type="favicon"
                previewType="icon"
              />
            </Card>
          </motion.div>
        )}

        {/* ── BANNER TAB ── */}
        {activeTab === 'banner' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <Card className="bg-gray-800 border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Megaphone className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Promotional Banner</h2>
                    <p className="text-sm text-gray-400">Control the announcement banner shown at the top of every page</p>
                  </div>
                </div>
                {/* Toggle Switch */}
                <button
                  onClick={() => updateBanner({ enabled: !settings.banner.enabled })}
                  className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                    settings.banner.enabled ? 'bg-green-500 shadow-lg shadow-green-500/30' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                    animate={{ left: settings.banner.enabled ? '2.25rem' : '0.25rem' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Status */}
              <div className={`flex items-center gap-2 px-4 py-3 rounded-lg mb-6 ${
                settings.banner.enabled ? 'bg-green-500/10 border border-green-500/30' : 'bg-gray-700/50 border border-gray-600'
              }`}>
                {settings.banner.enabled ? (
                  <><Eye className="w-5 h-5 text-green-400" /><span className="text-green-300 font-medium">Banner is LIVE — visible to all visitors</span></>
                ) : (
                  <><EyeOff className="w-5 h-5 text-gray-400" /><span className="text-gray-400 font-medium">Banner is OFF — hidden from visitors</span></>
                )}
              </div>

              {/* Banner Fields */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Banner Title *</label>
                  <input type="text" value={settings.banner.title} onChange={(e) => updateBanner({ title: e.target.value })} placeholder="New Term Enrollment Now Open!" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                  <textarea value={settings.banner.description} onChange={(e) => updateBanner({ description: e.target.value })} rows={2} placeholder="Join 2,500+ students..." className={`${inputClass} resize-none`} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5"><Link2 className="w-3.5 h-3.5 inline mr-1" />CTA Button Text</label>
                    <input type="text" value={settings.banner.ctaText} onChange={(e) => updateBanner({ ctaText: e.target.value })} placeholder="Request Quote" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5"><Link2 className="w-3.5 h-3.5 inline mr-1" />CTA Link</label>
                    <input type="text" value={settings.banner.ctaLink} onChange={(e) => updateBanner({ ctaLink: e.target.value })} placeholder="/request-quote" className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Banner Style</label>
                    <select value={settings.banner.style} onChange={(e) => updateBanner({ style: e.target.value as BannerSettings['style'] })} className={inputClass}>
                      <option value="animated">Animated (Premium)</option>
                      <option value="gradient">Gradient</option>
                      <option value="bold">Bold</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer mt-7">
                      <input type="checkbox" checked={settings.banner.showCountdown} onChange={(e) => updateBanner({ showCountdown: e.target.checked })} className="w-4 h-4 rounded border-gray-500 text-purple-500 focus:ring-purple-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-300">Show Countdown Timer</span>
                        <p className="text-xs text-gray-500">Creates urgency for visitors</p>
                      </div>
                    </label>
                  </div>
                </div>
                {settings.banner.showCountdown && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5"><Clock className="w-3.5 h-3.5 inline mr-1" />Countdown End Date</label>
                    <input type="date" value={settings.banner.countdownEndDate} onChange={(e) => updateBanner({ countdownEndDate: e.target.value })} className={inputClass} />
                  </motion.div>
                )}
              </div>
            </Card>

            {/* Preview */}
            <Card className="bg-gray-800 border border-gray-700 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Eye className="w-5 h-5 text-purple-400" />Live Preview</h3>
              <BannerPreview banner={settings.banner} />
            </Card>
          </motion.div>
        )}

        {/* ── GENERAL TAB ── */}
        {activeTab === 'general' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <Card className="bg-gray-800 border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Settings2 className="w-5 h-5 text-orange-400" />
                </div>
                <h2 className="text-xl font-bold">General Settings</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Site Name</label>
                  <input type="text" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Tagline</label>
                  <input type="text" value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                  <input type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone</label>
                  <input type="tel" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className={inputClass} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Address</label>
                  <input type="text" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className={inputClass} />
                </div>
              </div>
            </Card>

            <Card className="bg-gray-800 border border-gray-700 p-6">
              <h2 className="text-xl font-bold mb-6">Site Features</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700/50 transition">
                  <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} className="w-4 h-4 rounded border-gray-500 text-purple-500" />
                  <div>
                    <span className="font-medium">Maintenance Mode</span>
                    <p className="text-sm text-gray-400">Hide website from visitors during updates</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700/50 transition">
                  <input type="checkbox" checked={settings.analyticsEnabled} onChange={(e) => setSettings({ ...settings, analyticsEnabled: e.target.checked })} className="w-4 h-4 rounded border-gray-500 text-purple-500" />
                  <div>
                    <span className="font-medium">Enable Analytics Tracking</span>
                    <p className="text-sm text-gray-400">Track visitor behavior and page views</p>
                  </div>
                </label>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ── SOCIAL TAB ── */}
        {activeTab === 'social' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-gray-800 border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold">Social Media Links</h2>
              </div>
              <div className="space-y-5">
                {[
                  { key: 'facebookUrl', label: 'Facebook', ph: 'https://facebook.com/...' },
                  { key: 'instagramUrl', label: 'Instagram', ph: 'https://instagram.com/...' },
                  { key: 'linkedinUrl', label: 'LinkedIn', ph: 'https://linkedin.com/company/...' },
                  { key: 'youtubeUrl', label: 'YouTube', ph: 'https://youtube.com/...' },
                ].map((s) => (
                  <div key={s.key}>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">{s.label}</label>
                    <input type="url" value={(settings as any)[s.key] || ''} onChange={(e) => setSettings({ ...settings, [s.key]: e.target.value })} className={inputClass} placeholder={s.ph} />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Bottom Save Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-950/90 backdrop-blur-sm border-t border-gray-800 py-4 px-4 z-20">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/admin"><Button variant="outline" className="border-gray-600 text-gray-300">Back to Dashboard</Button></Link>
            <Button variant="primary" onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-8">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? 'Saving...' : 'Save All Settings'}
            </Button>
          </div>
        </div>
        <div className="h-20" />
      </div>
    </div>
  );
}
