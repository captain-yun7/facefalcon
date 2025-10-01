'use client';

import React from 'react';
import { UploadedImage } from '@/lib/types';

export type AnalysisType = 'parent-child' | 'find-parents' | 'age' | 'gender';

interface AnalysisResultWrapperProps {
  type: AnalysisType;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function AnalysisResultWrapper({
  type,
  title,
  subtitle,
  children,
  className = ''
}: AnalysisResultWrapperProps) {
  // 분석 타입별 색상 테마
  const getThemeColors = () => {
    switch (type) {
      case 'parent-child':
        return 'border-blue-200 bg-gradient-to-br from-blue-50 to-white';
      case 'find-parents':
        return 'border-green-200 bg-gradient-to-br from-green-50 to-white';
      case 'age':
        return 'border-purple-200 bg-gradient-to-br from-purple-50 to-white';
      case 'gender':
        return 'border-orange-200 bg-gradient-to-br from-orange-50 to-white';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className={`analysis-result-wrapper bg-white rounded-xl border shadow-sm p-6 md:p-8 mb-8 ${className}`}>
      <div className="text-center">
        {/* 제목 섹션 */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-gray-600 mb-6">{subtitle}</p>
        )}
        
        {/* 컨텐츠 영역 */}
        <div className={`rounded-xl p-6 ${getThemeColors()}`}>
          {children}
        </div>
      </div>
    </div>
  );
}