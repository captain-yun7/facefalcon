'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from '@/components/TranslationsProvider';

interface AnalyzingAdScreenProps {
  onComplete: () => void;
  duration?: number; // seconds, defaults to 5
}

export default function AnalyzingAdScreen({ onComplete, duration = 5 }: AnalyzingAdScreenProps) {
  const { t } = useTranslations();
  const [countdown, setCountdown] = useState(duration);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 text-center">
        {/* 로딩 스피너 */}
        <div className="mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
        </div>

        {/* AI 분석 중 텍스트 */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('analyzing.title')}
        </h2>
        <p className="text-gray-600 mb-8">
          {t('analyzing.subtitle')}
        </p>

        {/* 카운트다운 */}
        <div className="text-sm text-gray-500">
          {t('analyzing.countdown', { seconds: countdown })}
        </div>
    </div>
  );
}