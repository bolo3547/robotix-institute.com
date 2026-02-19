'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { X, Sparkles, ArrowRight, Gift, Star } from 'lucide-react';

interface Promotion {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  ctaText?: string;
  ctaLink?: string;
  position: 'top' | 'bottom' | 'hero' | 'sidebar';
  style?: 'gradient' | 'animated' | 'minimal' | 'bold';
}

// Default fallback promotion (used when admin hasn't configured a banner)
const defaultPromotion: Promotion = {
  id: 'default-1',
  title: 'New Term Enrollment Now Open!',
  description: 'Join 2,500+ students at Zambia\'s leading robotics & coding institute. Bridging the digital divide.',
  backgroundColor: 'gradient',
  textColor: '#ffffff',
  ctaText: 'Request Quote',
  ctaLink: '/request-quote',
  position: 'top',
  style: 'animated',
};

interface PromotionalBannerProps {
  position?: 'top' | 'bottom' | 'hero' | 'sidebar';
}

export default function PromotionalBanner({ position = 'top' }: PromotionalBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [promotion, setPromotion] = useState<Promotion | null>(null);

  // Load banner settings from admin (localStorage) or fallback to default
  const loadBannerSettings = useCallback(() => {
    try {
      const stored = localStorage.getItem('robotix-banner-settings');
      if (stored) {
        const settings = JSON.parse(stored);
        // Admin has explicitly disabled the banner
        if (!settings.enabled) {
          setPromotion(null);
          return;
        }
        // Build promotion from admin settings
        const adminPromo: Promotion = {
          id: 'admin-banner',
          title: settings.title || defaultPromotion.title,
          description: settings.description || defaultPromotion.description,
          backgroundColor: 'gradient',
          textColor: '#ffffff',
          ctaText: settings.ctaText || defaultPromotion.ctaText,
          ctaLink: settings.ctaLink || defaultPromotion.ctaLink,
          position: position,
          style: settings.style || 'animated',
        };
        const dismissedBanners = JSON.parse(localStorage.getItem('dismissedBanners') || '[]');
        if (!dismissedBanners.includes(adminPromo.id)) {
          setPromotion(adminPromo);
          setIsVisible(true);
        }
      } else {
        // No admin settings — use default if not dismissed
        if (position === 'top') {
          const dismissedBanners = JSON.parse(localStorage.getItem('dismissedBanners') || '[]');
          if (!dismissedBanners.includes(defaultPromotion.id)) {
            setPromotion(defaultPromotion);
          }
        }
      }
    } catch {
      // Fallback to default on any error
      if (position === 'top') {
        setPromotion(defaultPromotion);
      }
    }
  }, [position]);

  useEffect(() => {
    loadBannerSettings();

    // Listen for real-time changes from admin settings page
    const handleSettingsChange = () => {
      loadBannerSettings();
    };
    window.addEventListener('banner-settings-changed', handleSettingsChange);
    // Also listen for storage events (cross-tab sync)
    window.addEventListener('storage', (e) => {
      if (e.key === 'robotix-banner-settings') {
        loadBannerSettings();
      }
    });
    return () => {
      window.removeEventListener('banner-settings-changed', handleSettingsChange);
    };
  }, [loadBannerSettings]);

  const handleDismiss = () => {
    if (promotion) {
      const dismissedBanners = JSON.parse(localStorage.getItem('dismissedBanners') || '[]');
      dismissedBanners.push(promotion.id);
      localStorage.setItem('dismissedBanners', JSON.stringify(dismissedBanners));
    }
    setIsVisible(false);
  };

  if (!isVisible || !promotion) return null;

  // Premium Top Banner with Animation
  if (position === 'top') {
    return (
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute -bottom-2 -right-4 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl animate-pulse delay-300" />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-pink-400/10 rounded-full blur-lg animate-bounce" style={{ animationDuration: '3s' }} />
        </div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" 
          style={{ 
            animation: 'shimmer 3s infinite',
            backgroundSize: '200% 100%',
          }} 
        />
        
        <div className="relative max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
            {/* Sparkle icon */}
            <div className="hidden sm:flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
            
            {/* Main content */}
            <div className="flex items-center gap-3 sm:gap-4 text-white">
              <Gift className="w-5 h-5 text-yellow-300 animate-bounce sm:block hidden" />
              <span className="font-bold text-sm sm:text-base tracking-wide">
                {promotion.title}
              </span>
            </div>
            
            {/* CTA Button */}
            {promotion.ctaText && promotion.ctaLink && (
              <Link
                href={promotion.ctaLink}
                className="group flex items-center gap-2 px-4 py-2 bg-white text-purple-700 rounded-full text-sm font-bold 
                  hover:bg-yellow-300 hover:text-purple-900 transition-all duration-300 
                  shadow-lg hover:shadow-yellow-300/50 hover:scale-105 transform"
              >
                <span>{promotion.ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white ml-2"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* CSS for shimmer animation */}
        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%) skewX(-12deg); }
            100% { transform: translateX(200%) skewX(-12deg); }
          }
          .animate-shimmer {
            animation: shimmer 3s infinite;
          }
        `}</style>
      </div>
    );
  }

  // Premium Bottom Banner (Floating)
  if (position === 'bottom') {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center">
        <div className="relative max-w-2xl w-full mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-2xl shadow-teal-500/30">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 blur-xl" />
            
            <div className="relative px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                </div>
                <div className="text-white">
                  <p className="font-bold text-lg">{promotion.title}</p>
                  <p className="text-sm text-white/80">{promotion.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {promotion.ctaText && promotion.ctaLink && (
                  <Link
                    href={promotion.ctaLink}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 rounded-xl text-sm font-bold 
                      hover:bg-yellow-300 hover:text-teal-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {promotion.ctaText}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                <button
                  onClick={handleDismiss}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
                  aria-label="Dismiss"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Premium Hero Banner
  if (position === 'hero') {
    return (
      <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
        
        <div className="relative p-8 text-center text-white">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Gift className="w-8 h-8 text-yellow-300" />
            </div>
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-bold mb-3">{promotion.title}</h3>
          <p className="text-white/90 mb-6 max-w-md mx-auto">{promotion.description}</p>
          
          {promotion.ctaText && promotion.ctaLink && (
            <Link
              href={promotion.ctaLink}
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-red-600 rounded-xl font-bold text-lg
                hover:bg-yellow-300 hover:text-red-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform"
            >
              {promotion.ctaText}
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Premium Sidebar Banner
  if (position === 'sidebar') {
    return (
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-400/30 rounded-full blur-2xl" />
        
        <div className="relative p-5 text-white">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </div>
          
          <p className="font-bold text-base mb-1">{promotion.title}</p>
          <p className="text-xs text-white/80 mb-4">{promotion.description}</p>
          
          {promotion.ctaText && promotion.ctaLink && (
            <Link
              href={promotion.ctaLink}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white text-indigo-700 rounded-lg text-sm font-bold
                hover:bg-yellow-300 hover:text-indigo-900 transition-all duration-300"
            >
              {promotion.ctaText}
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  return null;
}
