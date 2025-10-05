'use client';

import React from 'react';
import Image from 'next/image';
import { UploadedImage, SimilarityResult } from '@/lib/types';
import { useTranslations } from '@/lib/simple-i18n';

interface FindParentsResultProps {
  childImage: UploadedImage;
  candidateImages: UploadedImage[];
  results: SimilarityResult[];
  bestMatch: SimilarityResult | null;
}

export default function FindParentsResult({
  childImage,
  candidateImages,
  results,
  bestMatch
}: FindParentsResultProps) {
  const { t } = useTranslations();
  return (
    <>
      {/* 최고 매치 표시 */}
      {bestMatch && (
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-full mb-4 whitespace-nowrap">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium whitespace-nowrap">{t('analysis.results.mostSimilarFound')}</span>
          </div>

          <div className="flex items-center justify-center gap-6">
            {/* 기준 사진 */}
            <div className="text-center">
              <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto mb-2">
                <Image
                  src={childImage.preview}
                  alt={t('analysis.results.referencePerson')}
                  fill
                  className="object-contain rounded-lg border-2 border-gray-200 shadow-sm bg-gray-50"
                />
              </div>
              <span className="text-sm text-gray-600 font-medium whitespace-nowrap">{t('analysis.results.referencePerson')}</span>
            </div>

            {/* 하트 아이콘 */}
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-1">❤️</div>
              <span className="text-xs text-gray-500">
                {bestMatch.similarity?.toFixed(1)}%
              </span>
            </div>

            {/* 가장 닮은 사람 사진 */}
            <div className="text-center">
              <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto mb-2">
                <Image
                  src={candidateImages[bestMatch.imageIndex]?.preview || ''}
                  alt={t('analysis.results.bestMatch')}
                  fill
                  className="object-contain rounded-lg border-3 border-green-500 shadow-lg bg-gray-50"
                />
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <span className="text-sm text-gray-600 font-medium whitespace-nowrap">{t('analysis.results.bestMatch')}</span>
            </div>
          </div>
        </div>
      )}

      {/* 전체 순위 리스트 */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center whitespace-nowrap">
          {t('analysis.results.overallRanking')}
        </h3>
        
        <div className="space-y-3 max-w-2xl mx-auto">
          {results.map((result, index) => {
            const isWinner = index === 0;
            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                  isWinner 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                {/* 순위 */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  isWinner ? 'bg-green-500 text-white' : 
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-400 text-white' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {index + 1}
                </div>

                {/* 이미지 */}
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={candidateImages[result.imageIndex]?.preview || ''}
                    alt={t('analysis.results.candidate', { number: result.imageIndex + 1 })}
                    fill
                    className="object-contain rounded-lg border-2 border-gray-200 bg-gray-50"
                  />
                </div>

                {/* 후보 정보 */}
                <div className="flex-grow">
                  <div className="font-medium text-gray-900 whitespace-nowrap">
                    {t('analysis.results.candidate', { number: result.imageIndex + 1 })}
                  </div>
                  <div className="text-sm text-gray-600 whitespace-nowrap">
                    {t('analysis.results.similarity')}: {result.similarity?.toFixed(1)}%
                  </div>
                </div>

                {/* 유사도 바 */}
                <div className="w-24">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        isWinner ? 'bg-green-500' : 'bg-blue-400'
                      }`}
                      style={{ width: `${result.similarity}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </>
  );
}