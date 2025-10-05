'use client';

import React from 'react';
import Image from 'next/image';
import { UploadedImage } from '@/lib/types';

interface AgeEstimationResultProps {
  image: UploadedImage;
  age: number;
  ageRange: string;
  confidence: number;
}

export default function AgeEstimationResult({
  image,
  age,
  ageRange,
  confidence
}: AgeEstimationResultProps) {
  // 나이에 따른 색상 결정
  const getAgeColor = (age: number) => {
    if (age < 20) return 'text-green-600 border-green-500 bg-green-50';
    if (age < 30) return 'text-blue-600 border-blue-500 bg-blue-50';
    if (age < 40) return 'text-purple-600 border-purple-500 bg-purple-50';
    if (age < 50) return 'text-orange-600 border-orange-500 bg-orange-50';
    return 'text-red-600 border-red-500 bg-red-50';
  };

  const colorClass = getAgeColor(age);

  return (
    <>
      {/* 분석된 이미지 */}
      <div className="mb-6">
        <div className="relative w-48 h-48 mx-auto">
          <Image
            src={image.preview}
            alt="분석된 사진"
            fill
            className="object-contain rounded-xl border-2 border-gray-200 bg-gray-50"
          />
        </div>
      </div>

      {/* 나이 결과 */}
      <div className={`max-w-md mx-auto mb-6 p-8 rounded-xl border-3 ${colorClass}`}>
        <div className="text-6xl font-bold mb-2">
          {age}세
        </div>
        <div className="text-xl font-semibold mb-4">
          {ageRange}
        </div>
        
        {/* 신뢰도 표시 */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2 whitespace-nowrap">
            <span className="text-sm text-gray-600 whitespace-nowrap">AI 신뢰도</span>
            <span className="text-sm font-bold whitespace-nowrap">{(confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-600 h-2 rounded-full"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>

      </div>

    </>
  );
}