import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import CookieConsent from '@/components/layout/CookieConsent';
import BackToTop from '@/components/layout/BackToTop';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import PageTransition from '@/components/layout/PageTransition';
import PromotionalBanner from '@/components/landing/PromotionalBanner';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ToastProvider } from '@/components/ui/Toast';
import { LanguageProvider } from '@/hooks/useLanguage';
import { ThemeProvider } from '@/hooks/useTheme';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'ROBOTIX INSTITUTE - Robotics & Coding Education for Children in Zambia',
  description:
    'World-class robotics and coding education for children aged 6-18. Trusted by 2,500+ students and their families. Safe, engaging, and proven learning outcomes.',
  keywords: [
    'robotics',
    'coding',
    'education',
    'Zambia',
    'children',
    'STEM',
    'programming',
    'kids education',
  ],
  authors: [{ name: 'ROBOTIX INSTITUTE' }],
  creator: 'ROBOTIX INSTITUTE',
  publisher: 'ROBOTIX INSTITUTE',
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_ZM',
    url: 'https://www.robotixinstitute.io',
    title: 'ROBOTIX INSTITUTE - Robotics & Coding Education',
    description: 'World-class robotics and coding education for children in Zambia',
    siteName: 'ROBOTIX INSTITUTE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ROBOTIX INSTITUTE',
    description: 'World-class robotics and coding education for children in Zambia',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
};

// JSON-LD Structured Data for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'ROBOTIX INSTITUTE',
  description: 'Transforming lives one line of code at a time. Robotics and coding education for children in Zambia.',
  url: 'https://www.robotixinstitute.io',
  logo: 'https://www.robotixinstitute.io/assets/uploads/media-uploader/logo1731411618.png',
  sameAs: [
    'https://facebook.com/robotixinstitute',
    'https://instagram.com/robotixinstitute',
    'https://linkedin.com/company/robotixinstitute',
    'https://youtube.com/@robotixinstitute',
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'No. 7 Mistry Court, Great East Road',
    addressLocality: 'Lusaka',
    addressCountry: 'ZM',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+260-956-355-117',
    email: 'info@robotixinstitute.io',
    contactType: 'customer service',
    availableLanguage: ['English'],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '450',
    bestRating: '5',
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'ZMW',
    lowPrice: '2000',
    highPrice: '4000',
    offerCount: '6',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="canonical" href="https://www.robotixinstitute.io" />
        <meta name="theme-color" content="#2563eb" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white text-gray-900">
        {/* Skip Navigation Link for Accessibility */}
        <a
          href="#main-content"
          className="skip-to-content"
        >
          Skip to main content
        </a>
        
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <ToastProvider>
                <PromotionalBanner position="top" />
                <Header />
                <Breadcrumbs />
                <main id="main-content">
                  <PageTransition>{children}</PageTransition>
                </main>
                <Footer />
                <WhatsAppButton />
                <BackToTop />
                <CookieConsent />
              </ToastProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
