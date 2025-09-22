'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageUploader from '@/components/ImageUploader';
import SimilarityGauge from '@/components/SimilarityGauge';
import { UploadedImage } from '@/lib/types';
import { PythonFamilySimilarityData } from '@/lib/python-api/client';
import { getFamilySimilarityMessage } from '@/lib/utils/family-messages';

export default function FamilyAnalysisPage() {
  const [parentImage, setParentImage] = useState<UploadedImage | null>(null);
  const [childImage, setChildImage] = useState<UploadedImage | null>(null);
  const [result, setResult] = useState<PythonFamilySimilarityData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>("");

  const handleAnalyze = async () => {
    if (!parentImage?.base64 || !childImage?.base64) return;

    console.log('🚀 분석 시작');
    setIsAnalyzing(true);
    setError("");

    try {
      console.log('📡 API 호출 시작');
      // 먼저 API 호출을 실행
      const response = await fetch('/api/family-similarity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentImage: parentImage.base64,
          childImage: childImage.base64,
        }),
      });

      console.log('✅ API 응답 받음');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Family analysis failed');
      }

      console.log('⏱️ 5초 지연 시작');
      // API 호출 완료 후 광고용 5초 추가 지연
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log('⏱️ 5초 지연 완료');

      setResult(data.data);
      console.log('✨ 결과 설정 완료');
    } catch (err) {
      console.error('❌ 에러 발생:', err);
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
      
      // 에러가 발생해도 5초 지연
      console.log('⏱️ 에러 후 5초 지연 시작');
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log('⏱️ 에러 후 5초 지연 완료');
    } finally {
      console.log('🏁 분석 종료');
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setParentImage(null);
    setChildImage(null);
    setResult(null);
    setError("");
  };

  // 연령 정보 추출 (Python API에서 제공하는 경우)
  const parentAge = result?.parent_face?.age;
  const childAge = result?.child_face?.age;
  
  // 스마트 점수 보정 시스템 적용 (연령 정보 포함)
  const familyMessage = result ? getFamilySimilarityMessage(result.similarity, parentAge, childAge) : null;
  const displayConfidence = result ? (result.confidence * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 text-blue-600 hover:text-blue-800">
            ← 홈으로 돌아가기
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            가족 닮음 분석
          </h1>
          <p className="text-lg text-gray-600">
            부모-자녀 관계를 고려한 정밀한 유사도 분석
          </p>
          <div className="mt-2 text-sm text-indigo-600 font-medium">
            InsightFace 가족 특화 알고리즘 사용
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Image Upload Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                부모 사진
              </h3>
              <ImageUploader
                onImageUpload={setParentImage}
                onImageRemove={() => setParentImage(null)}
                uploadedImage={parentImage || undefined}
                label="부모 사진 업로드"
              />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                자녀 사진
              </h3>
              <ImageUploader
                onImageUpload={setChildImage}
                onImageRemove={() => setChildImage(null)}
                uploadedImage={childImage || undefined}
                label="자녀 사진 업로드"
              />
            </div>
          </div>

          {/* Analysis Button */}
          <div className="text-center mb-8">
            <button
              onClick={handleAnalyze}
              disabled={!parentImage || !childImage || isAnalyzing}
              className={`
                px-8 py-4 rounded-full text-lg font-semibold transition-all
                ${!parentImage || !childImage || isAnalyzing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 transform hover:scale-105'
                }
              `}
            >
              {isAnalyzing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  가족 분석 중...
                </span>
              ) : (
                '가족 닮음 분석하기'
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* Results */}
          {result && familyMessage && (
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                가족 분석 결과
              </h2>

              <div className="text-center mb-6">
                <div className="text-lg text-gray-600">
                  분석 신뢰도: {displayConfidence}%
                </div>
              </div>

              {/* 퍼센트 바 게이지 */}
              <div className="mb-8">
                <SimilarityGauge 
                  percentage={familyMessage.displayPercent} 
                  isAnimating={true}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  다시 분석하기
                </button>
                <Link
                  href="/general-comparison"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  일반 비교로 분석하기 →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}