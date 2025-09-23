'use client';

import { useState, useEffect } from 'react';

export type Locale = 'ko' | 'en';

// 간단한 번역 훅
export function useTranslations() {
  const [locale, setCurrentLocale] = useState<Locale>('ko');
  const [translations, setTranslations] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 브라우저 언어 감지
    const browserLang = typeof window !== 'undefined' ? navigator.language.toLowerCase() : 'ko';
    const detectedLocale: Locale = browserLang.startsWith('en') ? 'en' : 'ko';
    
    // 저장된 언어 우선
    const storedLocale = typeof window !== 'undefined' ? localStorage.getItem('locale') : null;
    const currentLocale: Locale = (storedLocale === 'en' || storedLocale === 'ko') ? storedLocale as Locale : detectedLocale;
    
    setCurrentLocale(currentLocale);
    
    // 번역 파일 로드
    fetch(`/locales/${currentLocale}/common.json`)
      .then(res => res.json())
      .then(data => {
        setTranslations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Translation loading failed:', err);
        setLoading(false);
      });
  }, []);

  const t = (key: string, params?: Record<string, string | number>): string => {
    if (!translations) {
      return key; // 로딩 중이면 키 반환
    }
    
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // 키를 찾을 수 없으면 키 반환
      }
    }
    
    if (typeof value !== 'string') {
      return key;
    }
    
    // 파라미터 치환
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }
    
    return value;
  };

  const changeLocale = (newLocale: Locale) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
      window.location.reload();
    }
  };

  return {
    locale,
    t,
    changeLocale,
    loading
  };
}