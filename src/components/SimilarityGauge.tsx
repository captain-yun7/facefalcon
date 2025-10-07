'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from '@/components/TranslationsProvider';

interface SimilarityGaugeProps {
  percentage: number;
  isAnimating?: boolean;
}

export default function SimilarityGauge({ percentage, isAnimating = true }: SimilarityGaugeProps) {
  const { t, locale } = useTranslations();
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setAnimatedPercentage(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedPercentage(percentage);
    }
  }, [percentage, isAnimating]);

  // 구간별 색상 결정
  const getColor = (value: number) => {
    if (value >= 80) return '#3B82F6'; // 파랑
    if (value >= 60) return '#10B981'; // 초록
    if (value >= 40) return '#F59E0B'; // 노랑
    if (value >= 20) return '#F97316'; // 주황
    return '#EF4444'; // 빨강
  };

  // 구간별 해석
  const getInterpretation = (value: number) => {
    if (value >= 80) return t('similarity.interpretation.almostIdentical');
    if (value >= 60) return t('similarity.interpretation.definiteFamily');
    if (value >= 40) return t('similarity.interpretation.quiteSimilar');
    if (value >= 20) return t('similarity.interpretation.someResemblance');
    return t('similarity.interpretation.uniqueCharm');
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* 퍼센트 바 */}
      <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${animatedPercentage}%`,
            backgroundColor: getColor(animatedPercentage)
          }}
        />
      </div>
      
      {/* 퍼센트 표시 */}
      <div className="text-center mb-3">
        <span className="text-4xl md:text-5xl font-bold" style={{ color: getColor(animatedPercentage) }}>
          {Math.round(animatedPercentage)}%
        </span>
      </div>

      {/* 구간 해석 */}
      <div className="text-center">
        <span className="text-xl md:text-2xl text-gray-600 font-medium">
          {getInterpretation(animatedPercentage)}
        </span>
      </div>
    </div>
  );
}