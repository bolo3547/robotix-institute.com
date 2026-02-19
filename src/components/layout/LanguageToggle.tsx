'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, languages } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

export default function LanguageToggle() {
  const { language, setLanguage, currentLanguageInfo } = useLanguage();
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors ${
          isDark
            ? 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700'
            : 'text-gray-600 hover:text-brand-600 bg-gray-100 hover:bg-gray-200 border-gray-200'
        }`}
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLanguageInfo.flag}</span>
        <span className="hidden md:inline text-xs">{currentLanguageInfo.code.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 mt-2 w-52 rounded-xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto ${
              isDark
                ? 'bg-slate-800 border border-slate-700 shadow-black/30'
                : 'bg-white border border-gray-200 shadow-black/10'
            }`}
          >
            <div className="py-1">
              <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'text-slate-500' : 'text-gray-400'
              }`}>
                Zambian Languages
              </div>
              {languages.filter(l => ['en', 'bem', 'nya', 'ton', 'loz'].includes(l.code)).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    language === lang.code
                      ? isDark ? 'bg-brand-600/20 text-brand-400' : 'bg-brand-50 text-brand-600'
                      : isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{lang.name}</div>
                    <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{lang.nativeName}</div>
                  </div>
                  {language === lang.code && <Check className="w-4 h-4 text-brand-500" />}
                </button>
              ))}
              
              <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider border-t ${
                isDark ? 'text-slate-500 border-slate-700' : 'text-gray-400 border-gray-100'
              }`}>
                International
              </div>
              {languages.filter(l => ['fr', 'pt', 'sw'].includes(l.code)).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    language === lang.code
                      ? isDark ? 'bg-brand-600/20 text-brand-400' : 'bg-brand-50 text-brand-600'
                      : isDark ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{lang.name}</div>
                    <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{lang.nativeName}</div>
                  </div>
                  {language === lang.code && <Check className="w-4 h-4 text-brand-500" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
