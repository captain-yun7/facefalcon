'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from '@/components/TranslationsProvider';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Locale } from '@/lib/i18n-server';

interface Language {
  code: Locale;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'ko', name: '한국어', flag: '/flags/kr.svg' },
  { code: 'en', name: 'English', flag: '/flags/us.svg' },
  { code: 'ja', name: '日本語', flag: '/flags/jp.svg' },
  { code: 'es', name: 'Español', flag: '/flags/es.svg' },
  { code: 'pt', name: 'Português', flag: '/flags/pt.svg' },
  { code: 'de', name: 'Deutsch', flag: '/flags/de.svg' },
  { code: 'fr', name: 'Français', flag: '/flags/fr.svg' },
];

export default function LanguageSwitcher() {
  const { locale } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (langCode: Locale) => {
    // Replace current locale in pathname with new locale
    const segments = pathname.split('/');
    segments[1] = langCode; // Replace locale segment
    const newPath = segments.join('/');

    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-700 bg-white/80 backdrop-blur-sm hover:bg-blue-50 border border-blue-200/50 rounded-lg transition-all duration-200 hover:shadow-md hover:shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      >
        <div className="relative w-6 h-4 rounded overflow-hidden">
          <Image
            src={currentLanguage.flag}
            alt={`${currentLanguage.name} flag`}
            fill
            className="object-cover"
          />
        </div>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white/95 backdrop-blur-sm border border-blue-200/50 rounded-lg shadow-lg shadow-blue-500/10 z-50 overflow-hidden">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-blue-50 ${
                locale === language.code 
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-700 hover:text-blue-700'
              }`}
            >
              <div className="relative w-6 h-4 rounded overflow-hidden">
                <Image
                  src={language.flag}
                  alt={`${language.name} flag`}
                  fill
                  className="object-cover"
                />
              </div>
              <span>{language.name}</span>
              {locale === language.code && (
                <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}