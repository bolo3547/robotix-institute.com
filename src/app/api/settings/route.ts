import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAdmin } from '@/lib/adminAuth';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'site-settings.json');

interface SiteSettings {
  logo: {
    url: string;
    updatedAt: string;
  };
  favicon: {
    url: string;
    updatedAt: string;
  };
  banner: {
    enabled: boolean;
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    backgroundColor: string;
    textColor: string;
    style: 'gradient' | 'animated' | 'minimal' | 'bold';
    showCountdown: boolean;
    countdownEndDate: string;
    updatedAt: string;
  };
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
}

const defaultSettings: SiteSettings = {
  logo: { url: '/logo.svg', updatedAt: '' },
  favicon: { url: '/favicon.ico', updatedAt: '' },
  banner: {
    enabled: true,
    title: 'New Term Enrollment Now Open!',
    description: 'Join 2,500+ students at Zambia\'s leading robotics & coding institute.',
    ctaText: 'Request Quote',
    ctaLink: '/request-quote',
    backgroundColor: 'gradient',
    textColor: '#ffffff',
    style: 'animated',
    showCountdown: true,
    countdownEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: '',
  },
  siteName: 'ROBOTIX Institute',
  tagline: 'Transforming STEM Education in Zambia',
  email: 'info@robotixinstitute.io',
  phone: '+260-956-355-117',
  address: 'No. 7 Mistry Court, Great East Road, Lusaka, Zambia',
};

async function getSettings(): Promise<SiteSettings> {
  try {
    const data = await readFile(SETTINGS_FILE, 'utf-8');
    return { ...defaultSettings, ...JSON.parse(data) };
  } catch {
    return defaultSettings;
  }
}

async function saveSettings(settings: SiteSettings): Promise<void> {
  const dir = path.dirname(SETTINGS_FILE);
  await mkdir(dir, { recursive: true });
  await writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
}

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const updates = await request.json();
    const current = await getSettings();
    const merged = { ...current, ...updates };

    // Handle nested objects
    if (updates.logo) merged.logo = { ...current.logo, ...updates.logo };
    if (updates.favicon) merged.favicon = { ...current.favicon, ...updates.favicon };
    if (updates.banner) merged.banner = { ...current.banner, ...updates.banner };

    await saveSettings(merged);
    return NextResponse.json({ success: true, settings: merged });
  } catch (error) {
    console.error('Settings save error:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
