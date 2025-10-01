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
            className="object-cover rounded-xl border-2 border-gray-200"
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
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">AI 신뢰도</span>
            <span className="text-sm font-bold">{(confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-600 h-2 rounded-full"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>

        {/* 재미있는 메시지 추가 */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">
            {age < 20 && "🌱 청춘의 빛이 나네요!"}
            {age >= 20 && age < 30 && "✨ 가장 빛나는 나이입니다!"}
            {age >= 30 && age < 40 && "🎯 인생의 황금기네요!"}
            {age >= 40 && age < 50 && "🍷 와인처럼 멋진 나이입니다!"}
            {age >= 50 && "👑 연륜의 품격이 느껴집니다!"}
          </p>
        </div>
      </div>

      {/* 나이대별 특징 */}
      <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
        <h4 className="font-semibold text-gray-900 mb-2">나이대 특징</h4>
        <p className="text-sm text-gray-600">
          {age < 20 && "활력과 순수함이 가득한 시기입니다. 무한한 가능성이 열려있죠!"}
          {age >= 20 && age < 30 && "열정과 도전정신이 넘치는 시기입니다. 세상을 바꿀 수 있는 나이죠!"}
          {age >= 30 && age < 40 && "경험과 에너지가 균형을 이루는 시기입니다. 커리어의 전성기를 맞이하고 있네요!"}
          {age >= 40 && age < 50 && "성숙함과 지혜가 빛나는 시기입니다. 인생의 깊이가 더해지는 나이죠!"}
          {age >= 50 && "인생의 지혜가 완성되는 시기입니다. 후배들의 멘토가 되어주세요!"}
        </p>
      </div>
    </>
  );
}