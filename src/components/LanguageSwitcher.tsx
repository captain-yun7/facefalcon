'use client';

import { useTranslations, Locale } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { locale, changeLocale } = useTranslations();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLocale('ko')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          locale === 'ko'
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        한국어
      </button>
      <button
        onClick={() => changeLocale('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        English
      </button>
    </div>
  );
}