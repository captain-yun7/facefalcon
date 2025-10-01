'use client';

import React from 'react';
import Image from 'next/image';
import { UploadedImage } from '@/lib/types';

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
}

export default function GenderStyleResult({
  image,
  classification,
  adjustedScore,
  age
}: GenderStyleResultProps) {
  return (
    <>
      {/* 분석된 이미지 */}
      <div className="mb-6">
        <div className="relative w-48 h-48 mx-auto">
          <Image
            src={image.preview}
            alt="분석된 사진"
            fill
            className="object-cover rounded-xl border-2 border-gray-200"
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
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative h-12 bg-gradient-to-r from-blue-400 via-blue-200 to-purple-600 rounded-full overflow-hidden">
          {/* 중앙선 - 2.5점이 정확히 중앙 */}
          <div className="absolute top-0 h-full w-0.5 bg-gray-400 left-1/2 transform -translate-x-1/2" />
          
          {/* 현재 위치 표시 */}
          <div 
            className="absolute top-0 h-full w-2 bg-white shadow-lg"
            style={{
              left: `${Math.max(5, Math.min(95, (adjustedScore / 5) * 100))}%`,
              transform: 'translateX(-50%)'
            }}
          />
          <div 
            className="absolute top-1/2 bg-white rounded-full px-3 py-1 text-sm font-bold shadow-md border-2 border-gray-300 whitespace-nowrap flex items-center justify-center"
            style={{
              left: `${Math.max(5, Math.min(95, (adjustedScore / 5) * 100))}%`,
              transform: 'translateX(-50%) translateY(-50%)',
              whiteSpace: 'nowrap',
              minWidth: 'fit-content'
            }}
          >
            {adjustedScore < 2.5 ? '에겐남' : '테토남'}
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span className="text-blue-600 font-semibold">← 강한 에겐남</span>
          <span className="text-gray-500">|</span>
          <span className="text-purple-600 font-semibold">강한 테토남 →</span>
        </div>
      </div>

      {/* 추가 정보 */}
      {age && age < 20 && (
        <div className="bg-orange-50 rounded-lg p-3 mb-6">
          <p className="text-xs text-orange-600">
            ⚠️ 아직 성장기이므로 추후 변화 가능성이 높습니다
          </p>
        </div>
      )}
    </>
  );
}