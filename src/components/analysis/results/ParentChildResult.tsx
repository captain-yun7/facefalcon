'use client';

import React from 'react';
import Image from 'next/image';
import { UploadedImage } from '@/lib/types';
import SimilarityGauge from '@/components/SimilarityGauge';
import { useTranslations } from '@/lib/simple-i18n';

interface ParentChildResultProps {
  parentImage: UploadedImage;
  childImage: UploadedImage;
  similarity: number;
  confidence: number;
  displayPercent: string;
  message: string;
  locale?: string;
}

export default function ParentChildResult({
  parentImage,
  childImage,
  similarity,
  confidence,
  displayPercent,
  message,
  locale = 'ko'
}: ParentChildResultProps) {
  const { t } = useTranslations();
  return (
    <>
      {/* 이미지 비교 섹션 */}
      <div className="flex justify-center items-center gap-6 mb-8">
        {/* 첫 번째 이미지 */}
        <div className="text-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40 mb-2">
            <Image
              src={parentImage.preview}
              alt={t('results.firstPerson')}
              fill
              className="object-contain rounded-lg border-2 border-gray-200 shadow-sm bg-gray-50"
            />
          </div>
          <span className="text-sm text-gray-600 font-medium">{t('results.firstPerson')}</span>
        </div>

        {/* 하트 아이콘 */}
        <div className="text-3xl md:text-4xl">
          ❤️
        </div>

        {/* 두 번째 이미지 */}
        <div className="text-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40 mb-2">
            <Image
              src={childImage.preview}
              alt={t('results.secondPerson')}
              fill
              className="object-contain rounded-lg border-2 border-gray-200 shadow-sm bg-gray-50"
            />
          </div>
          <span className="text-sm text-gray-600 font-medium">{t('results.secondPerson')}</span>
        </div>
      </div>

      {/* 유사도 게이지 */}
      <div className="mb-8">
        <SimilarityGauge percentage={similarity} />
      </div>

      {/* 메시지 표시 */}
      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <div className="text-center">
          <p className="text-lg text-gray-700 font-medium">
            {message}
          </p>
        </div>
      </div>

      {/* AI 신뢰도 */}
      <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 whitespace-nowrap">{t('results.aiConfidence')}</span>
          <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
            {(confidence * 100).toFixed(1)}%
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
      </div>

      {/* 유사도 해석 가이드 */}
      <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 max-w-md mx-auto">
        <h4 className="font-semibold text-gray-900 mb-3 whitespace-nowrap">{t('results.similarityInterpretation')}</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
            <span className="text-gray-600 whitespace-nowrap">{t('results.veryHighSimilarity')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></div>
            <span className="text-gray-600 whitespace-nowrap">{t('results.highSimilarity')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0"></div>
            <span className="text-gray-600 whitespace-nowrap">{t('results.mediumSimilarity')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
            <span className="text-gray-600 whitespace-nowrap">{t('results.lowSimilarity')}</span>
          </div>
        </div>
      </div>
    </>
  );
}