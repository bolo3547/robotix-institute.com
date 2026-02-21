import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

// Default content for each page
const defaultPageContent: Record<string, object> = {
  homepage: {
    hero: {
      title: 'Building Tomorrow\'s Innovators Today',
      subtitle: 'Empowering young minds with robotics, coding, and AI education',
      ctaText: 'Start Learning',
      ctaLink: '/programs',
      heroImage: '/robotix3.jpg',
      heroImageSecondary: '/students2.jpg',
      backgroundImage: '/images/hero-bg.jpg',
    },
    programs: {
      title: 'Our Programs',
      description: 'Explore our diverse range of STEM education programs',
      items: [],
    },
    testimonials: {
      title: 'What Parents Say',
      items: [],
    },
    cta: {
      title: 'Ready to Start Your Journey?',
      description: 'Join thousands of students already learning with us',
      buttonText: 'Enroll Now',
      buttonLink: '/contact',
      backgroundImage: '',
    },
  },
  about: {
    mission: {
      title: 'Our Mission',
      description: 'To inspire and educate the next generation of innovators through hands-on STEM learning experiences.',
      image: '/images/mission.jpg',
    },
    team: {
      title: 'Meet Our Team',
      members: [],
    },
    journey: {
      title: 'Our Journey',
      milestones: [],
    },
    values: {
      title: 'Our Values',
      items: [],
    },
  },
  programs: {
    grid: {
      title: 'All Programs',
      description: 'Find the perfect program for your child',
      programs: [],
    },
    details: {
      title: 'Program Details',
      content: '',
    },
    pricing: {
      title: 'Pricing Plans',
      plans: [],
    },
  },
  testimonials: {
    stories: {
      title: 'Success Stories',
      items: [],
    },
    ratings: {
      title: 'Student Ratings',
      averageRating: 4.9,
      totalReviews: 250,
    },
    feedback: {
      title: 'Parent Feedback',
      items: [],
    },
  },
  contact: {
    form: {
      title: 'Get in Touch',
      description: 'Have questions? We\'d love to hear from you.',
      submitText: 'Send Message',
    },
    map: {
      title: 'Visit Us',
      address: '123 Innovation Drive, Lusaka, Zambia',
      coordinates: { lat: -15.3875, lng: 28.3228 },
      image: '/images/map.jpg',
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [],
    },
  },
  'what-you-get': {
    offers: {
      title: 'What We Offer',
      items: [],
    },
    benefits: {
      title: 'Benefits',
      items: [],
    },
    pricing: {
      title: 'Investment in Your Child\'s Future',
      plans: [],
    },
  },
};

// Map page IDs to internal page names
const pageIdMap: Record<string, string> = {
  '1': 'homepage',
  '2': 'about',
  '3': 'programs',
  '4': 'testimonials',
  '5': 'contact',
  '6': 'what-you-get',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    if (pageId) {
      const pageName = pageIdMap[pageId] || pageId;
      
      const content = await prisma.pageContent.findUnique({
        where: { pageId: pageName },
      });

      if (content) {
        return NextResponse.json({
          pageId: pageName,
          content: JSON.parse(content.content),
          updatedAt: content.updatedAt,
        });
      }

      // Return default content if not found
      return NextResponse.json({
        pageId: pageName,
        content: defaultPageContent[pageName] || {},
        updatedAt: null,
        isDefault: true,
      });
    }

    // Return all page contents
    const allContent = await prisma.pageContent.findMany();
    const contentMap: Record<string, object> = {};
    
    for (const item of allContent) {
      contentMap[item.pageId] = JSON.parse(item.content);
    }

    // Merge with defaults
    const result = Object.keys(defaultPageContent).map((key) => ({
      pageId: key,
      content: contentMap[key] || defaultPageContent[key],
      hasCustomContent: !!contentMap[key],
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch page content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { pageId, content } = body;

    if (!pageId || !content) {
      return NextResponse.json({ error: 'pageId and content are required' }, { status: 400 });
    }

    const pageName = pageIdMap[pageId] || pageId;

    const saved = await prisma.pageContent.upsert({
      where: { pageId: pageName },
      update: { content: JSON.stringify(content) },
      create: { pageId: pageName, content: JSON.stringify(content) },
    });

    return NextResponse.json({
      success: true,
      pageId: pageName,
      updatedAt: saved.updatedAt,
    });
  } catch (error) {
    console.error('Failed to save page content:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
