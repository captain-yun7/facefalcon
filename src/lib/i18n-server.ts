import 'server-only';

export type Locale = 'ko' | 'en';

// Dictionary type for type safety
export type Dictionary = {
  [key: string]: string | Dictionary;
};

const dictionaries = {
  ko: () => import('../../public/locales/ko/common.json').then((module) => module.default),
  en: () => import('../../public/locales/en/common.json').then((module) => module.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

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
  return locale === 'ko' || locale === 'en';
}

// Get locale from Accept-Language header
export function getLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return 'ko';

  const browserLang = acceptLanguage.toLowerCase();
  if (browserLang.startsWith('en')) return 'en';
  if (browserLang.startsWith('ko')) return 'ko';

  return 'ko'; // default
}
