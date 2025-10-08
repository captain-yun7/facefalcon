import 'server-only';
import { cache } from 'react';

export type Locale = 'ko' | 'en' | 'ja' | 'es' | 'pt' | 'de' | 'fr';

// Dictionary type for type safety (supports nested objects and arrays)
export type Dictionary = {
  [key: string]: string | Dictionary | string[];
};

const dictionaries = {
  ko: () => import('../../public/locales/ko/common.json').then((module) => module.default),
  en: () => import('../../public/locales/en/common.json').then((module) => module.default),
  ja: () => import('../../public/locales/ja/common.json').then((module) => module.default),
  es: () => import('../../public/locales/es/common.json').then((module) => module.default),
  pt: () => import('../../public/locales/pt/common.json').then((module) => module.default),
  de: () => import('../../public/locales/de/common.json').then((module) => module.default),
  fr: () => import('../../public/locales/fr/common.json').then((module) => module.default),
};

// Global in-memory cache for dictionaries (persists across requests)
// This dramatically improves performance by loading translation files only once
const dictionaryCache = new Map<Locale, Dictionary>();

// Cache dictionary per request using React's cache function
// This prevents loading the same translation file multiple times within a single request
export const getDictionary = cache(async (locale: Locale): Promise<Dictionary> => {
  // Validate locale
  if (!isValidLocale(locale)) {
    console.warn(`Invalid locale: ${locale}, falling back to 'ko'`);
    locale = 'ko';
  }

  // Check global cache first
  if (dictionaryCache.has(locale)) {
    return dictionaryCache.get(locale)!;
  }

  // Load and cache the dictionary
  const loader = dictionaries[locale];
  if (typeof loader !== 'function') {
    throw new Error(`Dictionary loader for locale '${locale}' is not a function`);
  }

  const dict = await loader();
  dictionaryCache.set(locale, dict);

  return dict;
});

// Helper function to get nested translation value
export function getTranslation(
  dict: Dictionary,
  key: string,
  params?: Record<string, string | number>
): string {
  const keys = key.split('.');
  let value: any = dict;

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key; // Key not found, return key itself
    }
  }

  if (typeof value !== 'string') {
    return key;
  }

  // Parameter substitution
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }

  return value;
}

// Validate locale
export function isValidLocale(locale: string): locale is Locale {
  return locale === 'ko' || locale === 'en' || locale === 'ja' || locale === 'es' || locale === 'pt' || locale === 'de' || locale === 'fr';
}

// Get locale from Accept-Language header
export function getLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return 'ko';

  const browserLang = acceptLanguage.toLowerCase();
  if (browserLang.startsWith('en')) return 'en';
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('pt')) return 'pt';
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('ko')) return 'ko';

  return 'ko'; // default
}
