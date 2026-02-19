'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'bem' | 'nya';

interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'bem', name: 'Bemba', nativeName: 'Ichibemba', flag: '🇿🇲' },
  { code: 'nya', name: 'Nyanja', nativeName: 'Chinyanja', flag: '🇿🇲' },
];

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'nav.home': 'Home',
    'nav.programs': 'Programs',
    'nav.about': 'About',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    'nav.blog': 'Blog',
    'nav.gallery': 'Gallery',
    'nav.events': 'Events',
    'nav.faq': 'FAQ',
    'nav.instructors': 'Instructors',
    'nav.login': 'Login',
    'nav.enroll': 'Enroll Now',

    // Hero
    'hero.title': 'Building Tomorrow\'s Innovators Today',
    'hero.subtitle': 'Zambia\'s premier robotics and coding academy for children ages 6-18',
    'hero.cta.primary': 'Start Learning Today',
    'hero.cta.secondary': 'View Programs',

    // Common
    'common.learnMore': 'Learn More',
    'common.getStarted': 'Get Started',
    'common.enrollNow': 'Enroll Now',
    'common.contactUs': 'Contact Us',
    'common.viewAll': 'View All',
    'common.readMore': 'Read More',
    'common.download': 'Download',
    'common.share': 'Share',
    'common.bookNow': 'Book Now',
    'common.freeTrialClass': 'Book a Free Trial Class',

    // Footer
    'footer.rights': 'All rights reserved',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.followUs': 'Follow Us',
    'footer.quickLinks': 'Quick Links',
    'footer.contactInfo': 'Contact Info',
    'footer.newsletter': 'Newsletter',
    'footer.subscribe': 'Subscribe',
  },
  bem: {
    // Header
    'nav.home': 'Ku Ntanshi',
    'nav.programs': 'Amaprogramu',
    'nav.about': 'Pa Ifwe',
    'nav.pricing': 'Umutengo',
    'nav.contact': 'Twebe',
    'nav.blog': 'Imishebo',
    'nav.gallery': 'Amafoto',
    'nav.events': 'Ifyakuchitika',
    'nav.faq': 'Amepusho',
    'nav.instructors': 'Abasambilisha',
    'nav.login': 'Ingila',
    'nav.enroll': 'Ilemba Nomba',

    // Hero
    'hero.title': 'Tukuula Abalenga ba Mailo Lelo',
    'hero.subtitle': 'Ishikulu lya ma robotics ne coding iya bana ba myaka 6-18 mu Zambia',
    'hero.cta.primary': 'Tamba Ukusambilila Lelo',
    'hero.cta.secondary': 'Mona Amaprogramu',

    // Common
    'common.learnMore': 'Sambilila Ifingi',
    'common.getStarted': 'Tamba Nomba',
    'common.enrollNow': 'Ilemba Nomba',
    'common.contactUs': 'Twebe',
    'common.viewAll': 'Mona Fyonse',
    'common.readMore': 'Belengeni Ifingi',
    'common.download': 'Kopololeni',
    'common.share': 'Abikeni',
    'common.bookNow': 'Buuku Nomba',
    'common.freeTrialClass': 'Buuku Klasi ya Mahala',

    // Footer
    'footer.rights': 'Insambu shonse',
    'footer.privacy': 'Amafunde ya Bumfis',
    'footer.terms': 'Amafunde ya Nchito',
    'footer.followUs': 'Tukonkeni',
    'footer.quickLinks': 'Ama Links ya Bukwafi',
    'footer.contactInfo': 'Inkombe ya Kutweba',
    'footer.newsletter': 'Amapepala',
    'footer.subscribe': 'Ilemba',
  },
  nya: {
    // Header
    'nav.home': 'Kunyumba',
    'nav.programs': 'Mapulogramu',
    'nav.about': 'Za Ife',
    'nav.pricing': 'Mitengo',
    'nav.contact': 'Tilembereni',
    'nav.blog': 'Nkhani',
    'nav.gallery': 'Zithunzi',
    'nav.events': 'Zochitika',
    'nav.faq': 'Mafunso',
    'nav.instructors': 'Aphunzitsi',
    'nav.login': 'Lowani',
    'nav.enroll': 'Lembani Tsopano',

    // Hero
    'hero.title': 'Tikumanga Opanga Mawa Lero',
    'hero.subtitle': 'Sukulu yoyamba ya ma robotics ndi coding ya ana a zaka 6-18 ku Zambia',
    'hero.cta.primary': 'Yambani Kuphunzira Lero',
    'hero.cta.secondary': 'Onani Mapulogramu',

    // Common
    'common.learnMore': 'Phunzirani Zambiri',
    'common.getStarted': 'Yambani Tsopano',
    'common.enrollNow': 'Lembani Tsopano',
    'common.contactUs': 'Tilembereni',
    'common.viewAll': 'Onani Zonse',
    'common.readMore': 'Werengani Zambiri',
    'common.download': 'Tsitsani',
    'common.share': 'Gawani',
    'common.bookNow': 'Bukani Tsopano',
    'common.freeTrialClass': 'Bukani Klasi Yaulere',

    // Footer
    'footer.rights': 'Ufulu onse',
    'footer.privacy': 'Ndondomeko za Chinsinsi',
    'footer.terms': 'Ndondomeko za Ntchito',
    'footer.followUs': 'Titsatireni',
    'footer.quickLinks': 'Maulalo Achangu',
    'footer.contactInfo': 'Njira Yotilemberera',
    'footer.newsletter': 'Kalata',
    'footer.subscribe': 'Lembani',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  currentLanguageInfo: LanguageInfo;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('robotix-lang') as Language;
    if (saved && translations[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('robotix-lang', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const currentLanguageInfo = languages.find((l) => l.code === language) || languages[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLanguageInfo }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
