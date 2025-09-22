'use client';

import { useState, useEffect } from 'react';

interface AnalyzingAdScreenProps {
  onComplete: () => void;
}

export default function AnalyzingAdScreen({ onComplete }: AnalyzingAdScreenProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 text-center">
        {/* 로딩 스피너 */}
        <div className="mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
        </div>

        {/* AI 분석 중 텍스트 */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          AI가 열심히 분석 중입니다
        </h2>
        <p className="text-gray-600 mb-8">
          정확한 결과를 위해 잠시만 기다려주세요
        </p>

        {/* 카운트다운 */}
        <div className="text-sm text-gray-500">
          {countdown}초 후 결과가 나타납니다...
        </div>
    </div>
  );
}