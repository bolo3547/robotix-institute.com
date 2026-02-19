'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  ArrowLeft, 
  Save,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Code,

  Target,
  Eye
} from 'lucide-react';

interface TrackingConfig {
  googleAnalyticsId: string;
  googleAdsId: string;
  googleAdsConversionLabel: string;
  facebookPixelId: string;
  tiktokPixelId: string;
  linkedinPartnerId: string;
  hotjarId: string;
  customHeadScript: string;
  customBodyScript: string;
}

const defaultConfig: TrackingConfig = {
  googleAnalyticsId: '',
  googleAdsId: '',
  googleAdsConversionLabel: '',
  facebookPixelId: '',
  tiktokPixelId: '',
  linkedinPartnerId: '',
  hotjarId: '',
  customHeadScript: '',
  customBodyScript: '',
};

export default function AdTrackingPage() {
  const [config, setConfig] = useState<TrackingConfig>(defaultConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    // Save tracking configuration
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSaving(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const trackingServices = [
    {
      id: 'googleAnalytics',
      name: 'Google Analytics 4',
      icon: '📊',
      description: 'Track website traffic, user behavior, and conversions',
      fields: [
        { key: 'googleAnalyticsId', label: 'Measurement ID', placeholder: 'G-XXXXXXXXXX' },
      ],
      helpUrl: 'https://analytics.google.com/',
      color: 'bg-orange-100',
    },
    {
      id: 'googleAds',
      name: 'Google Ads',
      icon: '🎯',
      description: 'Track Google Ads conversions and remarketing',
      fields: [
        { key: 'googleAdsId', label: 'Conversion ID', placeholder: 'AW-XXXXXXXXX' },
        { key: 'googleAdsConversionLabel', label: 'Conversion Label', placeholder: 'AbCdEfGhIjKlMnOp' },
      ],
      helpUrl: 'https://ads.google.com/',
      color: 'bg-blue-100',
    },
    {
      id: 'facebookPixel',
      name: 'Meta (Facebook) Pixel',
      icon: '📘',
      description: 'Track Facebook & Instagram ad performance',
      fields: [
        { key: 'facebookPixelId', label: 'Pixel ID', placeholder: '123456789012345' },
      ],
      helpUrl: 'https://business.facebook.com/events_manager',
      color: 'bg-blue-100',
    },
    {
      id: 'tiktok',
      name: 'TikTok Pixel',
      icon: '🎵',
      description: 'Track TikTok ad campaigns and conversions',
      fields: [
        { key: 'tiktokPixelId', label: 'Pixel ID', placeholder: 'CXXXXXXXXXXXXXXXXXX' },
      ],
      helpUrl: 'https://ads.tiktok.com/',
      color: 'bg-gray-900 text-white',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Insight Tag',
      icon: '💼',
      description: 'Track LinkedIn ad conversions and website demographics',
      fields: [
        { key: 'linkedinPartnerId', label: 'Partner ID', placeholder: '123456' },
      ],
      helpUrl: 'https://www.linkedin.com/campaignmanager/',
      color: 'bg-blue-700 text-white',
    },
    {
      id: 'hotjar',
      name: 'Hotjar',
      icon: '🔥',
      description: 'Heatmaps, session recordings, and user feedback',
      fields: [
        { key: 'hotjarId', label: 'Site ID', placeholder: '1234567' },
      ],
      helpUrl: 'https://www.hotjar.com/',
      color: 'bg-red-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/settings" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ad Tracking & Analytics</h1>
                <p className="text-sm text-gray-500">Configure tracking pixels and analytics</p>
              </div>
            </div>
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                'Saving...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Success Notice */}
      {savedNotice && (
        <div className="fixed top-20 right-4 z-50">
          <div className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg shadow-lg">
            <CheckCircle className="w-5 h-5" />
            Settings saved successfully!
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>How it works:</strong> Enter your tracking IDs below. The tracking scripts will automatically 
                  be added to your website. Make sure to test conversions after saving.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Services */}
        <div className="space-y-6">
          {trackingServices.map(service => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${service.color}`}>
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-500">{service.description}</p>
                    </div>
                  </div>
                  <a
                    href={service.helpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    Setup Guide
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {service.fields.map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={config[field.key as keyof TrackingConfig]}
                        onChange={e => setConfig(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 font-mono text-sm"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>

                {/* Status indicator */}
                {config[service.fields[0].key as keyof TrackingConfig] && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Configured
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Scripts */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Custom Scripts</h3>
                <p className="text-sm text-gray-500">Add custom tracking code or third-party scripts</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Head Scripts (before &lt;/head&gt;)
                </label>
                <textarea
                  value={config.customHeadScript}
                  onChange={e => setConfig(prev => ({ ...prev, customHeadScript: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 font-mono text-sm"
                  placeholder="<!-- Paste your custom head scripts here -->"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Body Scripts (before &lt;/body&gt;)
                </label>
                <textarea
                  value={config.customBodyScript}
                  onChange={e => setConfig(prev => ({ ...prev, customBodyScript: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 font-mono text-sm"
                  placeholder="<!-- Paste your custom body scripts here -->"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Events Guide */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-600" />
              Recommended Conversion Events
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Track these key events to measure your ad performance:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { event: 'Quote Request', description: 'When a parent submits a quote request', page: '/request-quote' },
                { event: 'Sign Up', description: 'When a new user creates an account', page: '/auth/signup' },
                { event: 'Contact Form', description: 'When someone submits the contact form', page: '/contact' },
                { event: 'Program View', description: 'When a user views program details', page: '/programs/*' },
              ].map(item => (
                <div key={item.event} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 text-sm">{item.event}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                  <p className="text-xs text-gray-400 mt-1 font-mono">{item.page}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Testing Instructions */}
        <Card className="mt-8 border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Testing Your Pixels
            </h3>
            <ul className="text-sm text-yellow-700 space-y-2">
              <li>• <strong>Google Tag Assistant:</strong> Install the browser extension to verify Google tags</li>
              <li>• <strong>Meta Pixel Helper:</strong> Chrome extension to verify Facebook Pixel</li>
              <li>• <strong>TikTok Pixel Helper:</strong> Verify TikTok pixel events</li>
              <li>• <strong>Test Mode:</strong> Use platform test/debug modes before going live</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
