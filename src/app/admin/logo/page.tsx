'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload, Image as ImageIcon, Check, RefreshCw, Trash2 } from 'lucide-react';

export default function AdminLogoPage() {
  const [currentLogo, setCurrentLogo] = useState<string>('/logo.svg');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchCurrentLogo = useCallback(async () => {
    try {
      const res = await fetch('/api/settings/logo');
      if (res.ok) {
        const data = await res.json();
        setCurrentLogo(data.logoUrl || '/logo.svg');
      }
    } catch (err) {
      console.error('Failed to fetch logo:', err);
    }
  }, []);

  useEffect(() => { fetchCurrentLogo(); }, [fetchCurrentLogo]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PNG, JPG, SVG, or WebP image');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Logo must be under 2MB');
      return;
    }

    setError('');
    // Show preview
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const input = document.getElementById('logo-input') as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'logo');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed');
        return;
      }

      // Logo is now stored in DB via the upload API
      setCurrentLogo(data.url);
      setPreviewUrl(null);
      setSuccess(true);

      // Reset file input
      input.value = '';

      // Notify Header component about the change
      if (typeof window !== 'undefined') {
        localStorage.setItem('robotix-site-settings', JSON.stringify({ logoUrl: data.url }));
        window.dispatchEvent(new Event('site-settings-changed'));
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const resetToDefault = async () => {
    if (!confirm('Reset to default logo?')) return;
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'logoUrl', value: '/logo.svg' }),
      });
      setCurrentLogo('/logo.svg');
      setPreviewUrl(null);

      if (typeof window !== 'undefined') {
        localStorage.setItem('robotix-site-settings', JSON.stringify({ logoUrl: '/logo.svg' }));
        window.dispatchEvent(new Event('site-settings-changed'));
      }
    } catch (err) {
      console.error('Reset failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Website Logo</h1>
            <p className="text-white/60 text-sm mt-1">Upload and manage the site logo</p>
          </div>
        </div>

        {/* Current Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-orange-400" />
            Current Logo
          </h2>
          <div className="bg-white rounded-xl p-8 flex items-center justify-center min-h-[120px]">
            <Image
              src={currentLogo}
              alt="Current Logo"
              width={280}
              height={80}
              className="h-16 w-auto object-contain"
              unoptimized
            />
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-white/40 text-xs truncate max-w-[300px]">
              {currentLogo.startsWith('data:') ? 'Custom uploaded logo (stored in database)' : currentLogo}
            </p>
            {currentLogo !== '/logo.svg' && (
              <button
                onClick={resetToDefault}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Reset to Default
              </button>
            )}
          </div>
        </motion.div>

        {/* Upload New Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-orange-400" />
            Upload New Logo
          </h2>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-orange-400/50 transition-colors">
            {previewUrl ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-6 inline-block">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={280}
                    height={80}
                    className="h-16 w-auto object-contain"
                    unoptimized
                  />
                </div>
                <p className="text-white/60 text-sm">Preview — click Upload to apply</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-orange-400" />
                </div>
                <p className="text-white/70">Click to select or drag and drop</p>
                <p className="text-white/40 text-xs">PNG, JPG, SVG, or WebP • Max 2MB</p>
              </div>
            )}
            <input
              id="logo-input"
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={handleFileSelect}
              className={previewUrl ? 'hidden' : 'absolute inset-0 w-full h-full opacity-0 cursor-pointer'}
              style={previewUrl ? {} : { position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 px-4 py-2.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mt-4 px-4 py-2.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              Logo updated successfully! It will appear across the site.
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            {previewUrl && (
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  const input = document.getElementById('logo-input') as HTMLInputElement;
                  if (input) input.value = '';
                }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Cancel
              </button>
            )}
            <button
              onClick={handleUpload}
              disabled={!previewUrl || uploading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 text-white font-medium hover:shadow-lg transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Logo
                </>
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
            <h3 className="text-sm font-medium text-white/70 mb-2">Tips for best results:</h3>
            <ul className="text-xs text-white/50 space-y-1">
              <li>• Use a transparent PNG or SVG for best integration</li>
              <li>• Recommended size: 280×80 pixels or similar aspect ratio</li>
              <li>• Keep file size under 2MB for fast loading</li>
              <li>• The logo appears in the header and is visible to all visitors</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
