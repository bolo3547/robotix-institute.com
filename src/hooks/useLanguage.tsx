'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'bem' | 'nya' | 'ton' | 'loz' | 'fr' | 'pt' | 'sw';

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
  { code: 'ton', name: 'Tonga', nativeName: 'Chitonga', flag: '🇿🇲' },
  { code: 'loz', name: 'Lozi', nativeName: 'Silozi', flag: '🇿🇲' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇹🇿' },
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
  ton: {
    // Header - Tonga
    'nav.home': 'Kumuzi',
    'nav.programs': 'Mapurogilamu',
    'nav.about': 'Atala Andiswe',
    'nav.pricing': 'Mitengo',
    'nav.contact': 'Amulembe',
    'nav.blog': 'Makani',
    'nav.gallery': 'Zifwanikiso',
    'nav.events': 'Zicitika',
    'nav.faq': 'Mibuzyo',
    'nav.instructors': 'Bayiisyi',
    'nav.login': 'Injila',
    'nav.enroll': 'Lemba Lino',

    // Hero
    'hero.title': 'Tuyaka Babumbi ba Jilo Sunu',
    'hero.subtitle': 'Cikolo cipati ca ma robotics a bana ba myaka 6-18 mu Zambia',
    'hero.cta.primary': 'Talika Kwiiya Sunu',
    'hero.cta.secondary': 'Bona Mapurogilamu',

    // Common
    'common.learnMore': 'Iiya Zyiingi',
    'common.getStarted': 'Talika Lino',
    'common.enrollNow': 'Lemba Lino',
    'common.contactUs': 'Amulembe',
    'common.viewAll': 'Bona Zyonse',
    'common.readMore': 'Bala Zyiingi',
    'common.download': 'Tamikizya',
    'common.share': 'Kopa',
    'common.bookNow': 'Buka Lino',
    'common.freeTrialClass': 'Buka Kilasi Yamahala',

    // Footer
    'footer.rights': 'Malwadilo onse',
    'footer.privacy': 'Milawo ya Cisisi',
    'footer.terms': 'Milawo ya Kubomba',
    'footer.followUs': 'Mutooobele',
    'footer.quickLinks': 'Tulinksi Twacimbulasime',
    'footer.contactInfo': 'Nzila ya Kutulemba',
    'footer.newsletter': 'Mapepala',
    'footer.subscribe': 'Lemba',
  },
  loz: {
    // Header - Lozi
    'nav.home': 'Kwa Ndu',
    'nav.programs': 'Lipulogilamu',
    'nav.about': 'Ka Zaluna',
    'nav.pricing': 'Lituwelo',
    'nav.contact': 'Luikalele',
    'nav.blog': 'Litaba',
    'nav.gallery': 'Maswaniso',
    'nav.events': 'Zeezahala',
    'nav.faq': 'Lipuzo',
    'nav.instructors': 'Baluti',
    'nav.login': 'Kena',
    'nav.enroll': 'Iñolisa Cwale',

    // Hero
    'hero.title': 'Luyaha Bapangi ba Kamuso Kacenu',
    'hero.subtitle': 'Sikolo sesituna sa ma robotics ni coding ya bana ba lilimo ze 6-18 mwa Zambia',
    'hero.cta.primary': 'Kalisa Kuituta Kacenu',
    'hero.cta.secondary': 'Bona Lipulogilamu',

    // Common
    'common.learnMore': 'Itute Zeñata',
    'common.getStarted': 'Kalisa Cwale',
    'common.enrollNow': 'Iñolisa Cwale',
    'common.contactUs': 'Luikalele',
    'common.viewAll': 'Bona Kaufela',
    'common.readMore': 'Bala Zeñata',
    'common.download': 'Otolola',
    'common.share': 'Abela',
    'common.bookNow': 'Buka Cwale',
    'common.freeTrialClass': 'Buka Kilasi Yamahala',

    // Footer
    'footer.rights': 'Litukelo kaufela',
    'footer.privacy': 'Milao ya Likunutu',
    'footer.terms': 'Milao ya Musebezi',
    'footer.followUs': 'Mulatelele',
    'footer.quickLinks': 'Lilinki Zekapili',
    'footer.contactInfo': 'Linzila za Kuluñolisa',
    'footer.newsletter': 'Mapampili',
    'footer.subscribe': 'Iñolisa',
  },
  fr: {
    // Header - French
    'nav.home': 'Accueil',
    'nav.programs': 'Programmes',
    'nav.about': 'À propos',
    'nav.pricing': 'Tarifs',
    'nav.contact': 'Contact',
    'nav.blog': 'Blog',
    'nav.gallery': 'Galerie',
    'nav.events': 'Événements',
    'nav.faq': 'FAQ',
    'nav.instructors': 'Instructeurs',
    'nav.login': 'Connexion',
    'nav.enroll': 'S\'inscrire',

    // Hero
    'hero.title': 'Construire les Innovateurs de Demain Aujourd\'hui',
    'hero.subtitle': 'La première académie de robotique et de programmation pour enfants de 6 à 18 ans en Zambie',
    'hero.cta.primary': 'Commencer Aujourd\'hui',
    'hero.cta.secondary': 'Voir les Programmes',

    // Common
    'common.learnMore': 'En savoir plus',
    'common.getStarted': 'Commencer',
    'common.enrollNow': 'S\'inscrire',
    'common.contactUs': 'Contactez-nous',
    'common.viewAll': 'Voir tout',
    'common.readMore': 'Lire plus',
    'common.download': 'Télécharger',
    'common.share': 'Partager',
    'common.bookNow': 'Réserver',
    'common.freeTrialClass': 'Réserver un cours d\'essai gratuit',

    // Footer
    'footer.rights': 'Tous droits réservés',
    'footer.privacy': 'Politique de confidentialité',
    'footer.terms': 'Conditions d\'utilisation',
    'footer.followUs': 'Suivez-nous',
    'footer.quickLinks': 'Liens rapides',
    'footer.contactInfo': 'Coordonnées',
    'footer.newsletter': 'Newsletter',
    'footer.subscribe': 'S\'abonner',
  },
  pt: {
    // Header - Portuguese
    'nav.home': 'Início',
    'nav.programs': 'Programas',
    'nav.about': 'Sobre',
    'nav.pricing': 'Preços',
    'nav.contact': 'Contato',
    'nav.blog': 'Blog',
    'nav.gallery': 'Galeria',
    'nav.events': 'Eventos',
    'nav.faq': 'FAQ',
    'nav.instructors': 'Instrutores',
    'nav.login': 'Entrar',
    'nav.enroll': 'Inscrever-se',

    // Hero
    'hero.title': 'Construindo os Inovadores de Amanhã Hoje',
    'hero.subtitle': 'A principal academia de robótica e programação para crianças de 6 a 18 anos na Zâmbia',
    'hero.cta.primary': 'Começar Hoje',
    'hero.cta.secondary': 'Ver Programas',

    // Common
    'common.learnMore': 'Saiba mais',
    'common.getStarted': 'Começar',
    'common.enrollNow': 'Inscrever-se',
    'common.contactUs': 'Contate-nos',
    'common.viewAll': 'Ver tudo',
    'common.readMore': 'Ler mais',
    'common.download': 'Baixar',
    'common.share': 'Compartilhar',
    'common.bookNow': 'Reservar',
    'common.freeTrialClass': 'Reservar aula experimental grátis',

    // Footer
    'footer.rights': 'Todos os direitos reservados',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos de Serviço',
    'footer.followUs': 'Siga-nos',
    'footer.quickLinks': 'Links Rápidos',
    'footer.contactInfo': 'Informações de Contato',
    'footer.newsletter': 'Boletim',
    'footer.subscribe': 'Inscrever-se',
  },
  sw: {
    // Header - Swahili
    'nav.home': 'Nyumbani',
    'nav.programs': 'Programu',
    'nav.about': 'Kuhusu',
    'nav.pricing': 'Bei',
    'nav.contact': 'Wasiliana',
    'nav.blog': 'Blogu',
    'nav.gallery': 'Picha',
    'nav.events': 'Matukio',
    'nav.faq': 'Maswali',
    'nav.instructors': 'Walimu',
    'nav.login': 'Ingia',
    'nav.enroll': 'Jiandikishe',

    // Hero
    'hero.title': 'Kujenga Wabunifu wa Kesho Leo',
    'hero.subtitle': 'Chuo bora cha robotiki na programu kwa watoto wenye umri wa miaka 6-18 nchini Zambia',
    'hero.cta.primary': 'Anza Kujifunza Leo',
    'hero.cta.secondary': 'Tazama Programu',

    // Common
    'common.learnMore': 'Jifunze Zaidi',
    'common.getStarted': 'Anza Sasa',
    'common.enrollNow': 'Jiandikishe Sasa',
    'common.contactUs': 'Wasiliana Nasi',
    'common.viewAll': 'Tazama Yote',
    'common.readMore': 'Soma Zaidi',
    'common.download': 'Pakua',
    'common.share': 'Shiriki',
    'common.bookNow': 'Weka Sasa',
    'common.freeTrialClass': 'Weka Darasa la Bure',

    // Footer
    'footer.rights': 'Haki zote zimehifadhiwa',
    'footer.privacy': 'Sera ya Faragha',
    'footer.terms': 'Masharti ya Huduma',
    'footer.followUs': 'Tufuate',
    'footer.quickLinks': 'Viungo vya Haraka',
    'footer.contactInfo': 'Mawasiliano',
    'footer.newsletter': 'Jarida',
    'footer.subscribe': 'Jiandikishe',
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
