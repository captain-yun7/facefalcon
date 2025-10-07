'use client';

import { createContext, useContext } from 'react';
import type { Dictionary, Locale } from '@/lib/i18n-server';

type TranslationsContextType = {
  dict: Dictionary;
  locale: Locale;
};

const TranslationsContext = createContext<TranslationsContextType | null>(null);

export function TranslationsProvider({
  children,
  dict,
  locale,
}: {
  children: React.ReactNode;
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <TranslationsContext.Provider value={{ dict, locale }}>
      {children}
    </TranslationsContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(TranslationsContext);

  if (!context) {
    throw new Error('useTranslations must be used within TranslationsProvider');
  }

  const { dict, locale } = context;

  const t = (key: string, params?: Record<string, string | number>): string => {
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
  };

  return { t, locale };
}
