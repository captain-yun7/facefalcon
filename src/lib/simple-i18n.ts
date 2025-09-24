'use client';

import { useState, useEffect } from 'react';

export type Locale = 'ko' | 'en';

// 전역 상태 관리를 위한 변수들
let globalLocale: Locale | null = null;
let globalTranslations: any = null;
let globalLoading = true;
let listeners: Set<() => void> = new Set();

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

// 전역 상태 변경 알림
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// 번역 파일 로드
const loadTranslations = async (locale: Locale) => {
  try {
    globalLoading = true;
    notifyListeners();
    
    const response = await fetch(`/locales/${locale}/common.json`);
    const data = await response.json();
    
    globalTranslations = data;
    globalLoading = false;
    notifyListeners();
  } catch (err) {
    console.error('Translation loading failed:', err);
    globalLoading = false;
    notifyListeners();
  }
};

// 언어 변경 함수
const changeGlobalLocale = (newLocale: Locale) => {
  if (typeof window !== 'undefined' && globalLocale !== newLocale) {
    localStorage.setItem('locale', newLocale);
    globalLocale = newLocale;
    loadTranslations(newLocale);
  }
};

// 간단한 번역 훅
export function useTranslations() {
  const [, forceUpdate] = useState({});
  
  // 초기 설정
  useEffect(() => {
    if (globalLocale === null) {
      globalLocale = getInitialLocale();
      loadTranslations(globalLocale);
    }
  }, []);

  // 리스너 등록
  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.add(listener);
    
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const t = (key: string, params?: Record<string, string | number>): string => {
    if (!globalTranslations) {
      return key; // 로딩 중이면 키 반환
    }
    
    const keys = key.split('.');
    let value: any = globalTranslations;
    
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

  return {
    locale: globalLocale || 'ko',
    t,
    changeLocale: changeGlobalLocale,
    loading: globalLoading
  };
}