'use client';

import { useState, useEffect } from 'react';

export type Locale = 'ko' | 'en';

// 초기 locale을 즉시 계산하는 함수
const getInitialLocale = (): Locale => {
  if (typeof window === 'undefined') return 'ko';
  
  const storedLocale = localStorage.getItem('locale');
  if (storedLocale === 'en' || storedLocale === 'ko') {
    return storedLocale as Locale;
  }
  
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('en') ? 'en' : 'ko';
};

// 간단한 번역 훅
export function useTranslations() {
  const [locale, setCurrentLocale] = useState<Locale>(getInitialLocale);
  const [translations, setTranslations] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 번역 파일 로드
    fetch(`/locales/${locale}/common.json`)
      .then(res => res.json())
      .then(data => {
        setTranslations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Translation loading failed:', err);
        setLoading(false);
      });
  }, [locale]);

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
      setCurrentLocale(newLocale);
      
      // 번역 파일 다시 로드
      fetch(`/locales/${newLocale}/common.json`)
        .then(res => res.json())
        .then(data => {
          setTranslations(data);
        })
        .catch(err => {
          console.error('Translation loading failed:', err);
        });
    }
  };

  return {
    locale,
    t,
    changeLocale,
    loading
  };
}