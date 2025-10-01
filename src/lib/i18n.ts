import { useState, useEffect } from 'react';

export type Locale = 'ko' | 'en';

// 번역 타입 정의
export interface Translations {
  appName: string;
  navigation: {
    home: string;
    analyze: string;
    blog: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  analysisSelector: {
    title: string;
    subtitle: string;
    placeholder: string;
    parentChild: {
      title: string;
      description: string;
    };
    whoMostSimilar: {
      title: string;
      description: string;
    };
    ageEstimation: {
      title: string;
      description: string;
    };
    genderEstimation: {
      title: string;
      description: string;
    };
    celebrity: {
      title: string;
      description: string;
      status: string;
    };
  };
  parentChildAnalysis: {
    title: string;
    parentPhoto: string;
    childPhoto: string;
    uploadParent: string;
    uploadChild: string;
    analyzeButton: string;
    analyzing: string;
  };
  whoMostSimilarAnalysis: {
    title: string;
    uploadChild: string;
    uploadChildLabel: string;
    uploadCandidates: string;
    candidateCount: string;
    candidateMinRequired: string;
    candidate: string;
    analyzeButton: string;
    analyzing: string;
  };
  results: {
    analysisComplete: string;
    similarityResult: string;
    parentFindingResult: string;
    confidence: string;
    parent: string;
    child: string;
    similarity: string;
    mostSimilar: string;
    ranking: string;
    rank: string;
    tryAgain: string;
    downloadImage: string;
    shareResult: string;
  };
  imageUpload: {
    label: string;
    dragDrop: string;
    dragActive: string;
    processing: string;
    formats: string;
    remove: string;
  };
  analyzing: {
    title: string;
    subtitle: string;
    countdown: string;
  };
  errors: {
    analysisError: string;
    tryRefresh: string;
    imageProcessingError: string;
    noFacesDetected: string;
    analysisFailure: string;
    imageGenerationFailed: string;
    shareFailed: string;
  };
  share: {
    clipboardCopied: string;
    shareNotSupported: string;
    resultText: string;
  };
  footer: {
    madeWith: string;
    copyright: string;
  };
}

// 번역 데이터 로드
async function loadTranslations(locale: Locale): Promise<any> {
  const response = await fetch(`/locales/${locale}/common.json`);
  return response.json();
}

// 현재 언어 가져오기
export function getLocale(): Locale {
  if (typeof window === 'undefined') return 'ko';
  
  const stored = localStorage.getItem('locale');
  if (stored && (stored === 'ko' || stored === 'en')) {
    return stored as Locale;
  }
  
  // 브라우저 언어 감지
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('en')) {
    return 'en';
  }
  
  return 'ko'; // 기본값
}

// 언어 설정
export function setLocale(locale: Locale) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('locale', locale);
    window.location.reload();
  }
}

// 번역 훅
export function useTranslations() {
  const [locale, setCurrentLocale] = useState<Locale>('ko');
  const [translations, setTranslations] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentLocale = getLocale();
    setCurrentLocale(currentLocale);
    
    loadTranslations(currentLocale)
      .then(setTranslations)
      .catch(() => {
        // 폴백으로 한국어 로드
        return loadTranslations('ko');
      })
      .then((fallback) => {
        if (!translations) {
          setTranslations(fallback);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const t = (key: string, params?: Record<string, string | number>): string => {
    if (!translations) {
      // 번역이 로드되지 않은 경우 현재 언어에 따른 기본값 반환
      const koDefaults: Record<string, string> = {
        'navigation.home': '홈',
        'navigation.analyze': '분석',
        'navigation.service': '서비스 소개',
        'navigation.guide': '이용 가이드',
        'navigation.blog': '블로그',
        'hero.title': 'AI 얼굴 분석 도구',
        'hero.subtitle': '원하시는 분석 유형을 선택하고 바로 시작해보세요',
        'analysisSelector.title': '어떤 분석을 원하시나요?',
        'analysisSelector.subtitle': '원하는 분석 유형을 선택해주세요',
        'analysisSelector.placeholder': '분석 유형을 선택하세요',
        'analysisSelector.parentChild.title': 'AI 얼굴 분석 : 친자 확인',
        'analysisSelector.parentChild.description': '부모와 자녀 사진을 비교해서 닮은 정도를 분석합니다',
        'analysisSelector.whoMostSimilar.title': 'AI 얼굴 분석 : 부모 찾기',
        'analysisSelector.whoMostSimilar.description': '아이와 여러 후보자를 비교해서 가장 닮은 사람을 찾습니다',
        'analysisSelector.ageEstimation.title': 'AI 얼굴 분석 : 나이 맞히기',
        'analysisSelector.ageEstimation.description': 'AI가 사진으로 나이를 예측합니다',
        'analysisSelector.genderEstimation.title': 'AI 얼굴 분석 : 에겐/테토 분석',
        'analysisSelector.genderEstimation.description': '성별 특징으로 스타일을 분석합니다',
        'analysisSelector.celebrity.title': 'AI 얼굴 분석 : 연예인 닮은꼴',
        'analysisSelector.celebrity.description': '곧 출시될 예정입니다',
        'analysisSelector.celebrity.status': '공개 예정',
        'parentChildAnalysis.analyzeButton': '닮은 정도 분석 시작',
        'whoMostSimilarAnalysis.analyzeButton': '부모 찾기 시작!'
      };
      
      const enDefaults: Record<string, string> = {
        'navigation.home': 'Home',
        'navigation.analyze': 'Analyze',
        'navigation.service': 'Service Info',
        'navigation.guide': 'User Guide',
        'navigation.blog': 'Blog',
        'hero.title': 'AI Face Analysis Tool',
        'hero.subtitle': 'Choose your preferred analysis type and get started right away',
        'analysisSelector.title': 'What kind of analysis do you want?',
        'analysisSelector.subtitle': 'Please select your preferred analysis type',
        'analysisSelector.placeholder': 'Select analysis type',
        'analysisSelector.parentChild.title': 'AI Face Analysis : Paternity Test',
        'analysisSelector.parentChild.description': 'Compare parent and child photos to analyze similarity',
        'analysisSelector.whoMostSimilar.title': 'AI Face Analysis : Find Parent',
        'analysisSelector.whoMostSimilar.description': 'Compare a child with multiple candidates to find the most similar person',
        'analysisSelector.ageEstimation.title': 'AI Face Analysis : Age Estimation',
        'analysisSelector.ageEstimation.description': 'AI predicts age from photos',
        'analysisSelector.genderEstimation.title': 'AI Face Analysis : Style Analysis',
        'analysisSelector.genderEstimation.description': 'Analyze style by gender features',
        'analysisSelector.celebrity.title': 'AI Face Analysis : Celebrity Match',
        'analysisSelector.celebrity.description': 'Coming soon',
        'analysisSelector.celebrity.status': 'Coming soon',
        'parentChildAnalysis.analyzeButton': 'Start Similarity Analysis',
        'whoMostSimilarAnalysis.analyzeButton': 'Start Finding Parent!'
      };
      
      const defaults = locale === 'en' ? enDefaults : koDefaults;
      return defaults[key] || key;
    }
    
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string') return key;
    
    // 파라미터 치환
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }
    
    return value;
  };

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  return {
    locale,
    t,
    changeLocale,
    loading
  };
}