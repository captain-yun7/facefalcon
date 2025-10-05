'use client';

import React from 'react';
import Image from 'next/image';
import { UploadedImage } from '@/lib/types';
import { useTranslations } from '@/lib/simple-i18n';

interface GenderStyleResultProps {
  image: UploadedImage;
  classification: {
    type: 'teto' | 'egen' | 'feminine';
    level: string;
    emoji: string;
    description: string;
  };
  adjustedScore: number;
  age?: number;
  gender?: 'male' | 'female';
}

export default function GenderStyleResult({
  image,
  classification,
  adjustedScore,
  age,
  gender = 'male'
}: GenderStyleResultProps) {
  const { t } = useTranslations();
  return (
    <>
      {/* 분석된 이미지 */}
      <div className="mb-6">
        <div className="relative w-48 h-48 mx-auto">
          <Image
            src={image.preview}
            alt={t('results.analyzedPhoto')}
            fill
            className="object-contain rounded-xl border-2 border-gray-200 bg-gray-50"
          />
        </div>
      </div>

      {/* 메인 결과 카드 */}
      <div className={`max-w-md mx-auto mb-6 p-6 rounded-xl border-3 ${
        classification.type === 'teto' ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100' :
        classification.type === 'egen' ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100' :
        'border-pink-500 bg-gradient-to-br from-pink-50 to-pink-100'
      }`}>
        <div className="text-6xl mb-3">{classification.emoji}</div>
        <h3 className={`text-2xl font-bold mb-2 ${
          classification.type === 'teto' ? 'text-purple-900' :
          classification.type === 'egen' ? 'text-blue-900' :
          'text-pink-900'
        }`}>
          {classification.level}
        </h3>
        <p className="text-lg text-gray-700">{classification.description}</p>
      </div>

      {/* 점수 바 시각화 */}
      <div className="max-w-2xl mx-auto mb-6 px-12">
        <div className={`relative h-12 rounded-full overflow-visible ${
          gender === 'female' 
            ? 'bg-gradient-to-r from-pink-400 via-pink-200 to-purple-600'
            : 'bg-gradient-to-r from-blue-400 via-blue-200 to-purple-600'
        }`}>
          {/* 중앙선 - 남성은 3.0, 여성은 3.5 기준 */}
          <div className="absolute top-0 h-full w-0.5 bg-gray-400 left-1/2 transform -translate-x-1/2" />
          
          {/* 현재 위치 표시 */}
          <div 
            className="absolute top-0 h-full w-2 bg-white shadow-lg"
            style={{
              left: gender === 'female'
                ? `${Math.max(0, Math.min(100, 100 - ((adjustedScore / 7) * 100)))}%`  // 여성: 반전 (높을수록 왼쪽)
                : `${Math.max(0, Math.min(100, (adjustedScore / 6) * 100))}%`,  // 남성: 0-6 범위, 3.0이 중앙(50%)
              transform: 'translateX(-50%)'
            }}
          />
          <div 
            className="absolute top-1/2 bg-white rounded-full px-3 py-1 text-sm font-bold shadow-md border-2 border-gray-300 whitespace-nowrap flex items-center justify-center z-10"
            style={{
              left: gender === 'female'
                ? `${Math.max(0, Math.min(100, 100 - ((adjustedScore / 7) * 100)))}%`  // 여성: 반전 (높을수록 왼쪽)
                : `${Math.max(0, Math.min(100, (adjustedScore / 6) * 100))}%`,  // 남성: 0-6 범위, 3.0이 중앙(50%)
              transform: 'translateX(-50%) translateY(-50%)',
              whiteSpace: 'nowrap',
              minWidth: 'fit-content'
            }}
          >
            {gender === 'female'
              ? (adjustedScore >= 3.5 ? t('analysis.genderLevels.female.egen') : t('analysis.genderLevels.female.teto'))
              : (adjustedScore < 3.0 ? t('analysis.genderLevels.male.egen') : t('analysis.genderLevels.male.teto'))
            }
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          {gender === 'female' ? (
            <>
              <span className="text-pink-600 font-semibold">← {t('analysis.genderLevels.female.strongEgen')}</span>
              <span className="text-gray-500">|</span>
              <span className="text-purple-600 font-semibold">{t('analysis.genderLevels.female.strongTeto')} →</span>
            </>
          ) : (
            <>
              <span className="text-blue-600 font-semibold">← {t('analysis.genderLevels.male.strongEgen')}</span>
              <span className="text-gray-500">|</span>
              <span className="text-purple-600 font-semibold">{t('analysis.genderLevels.male.strongTeto')} →</span>
            </>
          )}
        </div>
      </div>

      {/* 추가 정보 */}
      {age && age < 20 && (
        <div className="bg-orange-50 rounded-lg p-3 mb-6">
          <p className="text-xs text-orange-600">
            ⚠️ {t('results.growthPeriodWarning')}
          </p>
        </div>
      )}
    </>
  );
}