'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageUploader from '@/components/ImageUploader';
import { UploadedImage } from '@/lib/types';
import { PythonFamilySimilarityData } from '@/lib/python-api/client';

export default function FamilyAnalysisPage() {
  const [parentImage, setParentImage] = useState<UploadedImage | null>(null);
  const [childImage, setChildImage] = useState<UploadedImage | null>(null);
  const [result, setResult] = useState<PythonFamilySimilarityData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>("");

  const handleAnalyze = async () => {
    if (!parentImage?.base64 || !childImage?.base64) return;

    setIsAnalyzing(true);
    setError("");

    try {
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

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Family analysis failed');
      }

      setResult(data.data);
    } catch (err) {
      console.error('Error analyzing family similarity:', err);
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setParentImage(null);
    setChildImage(null);
    setResult(null);
    setError("");
  };

  // 0.0-1.0 범위를 백분율로 변환하여 표시
  const displaySimilarity = result ? (result.similarity * 100).toFixed(1) : "0";
  const displayConfidence = result ? (result.confidence * 100).toFixed(1) : "0";

  // 유사도 레벨 계산
  const getSimilarityLevel = (similarity: number) => {
    const percentage = similarity * 100;
    if (percentage >= 60) return { level: '매우 높음', color: 'text-green-600', emoji: '🎯' };
    if (percentage >= 40) return { level: '높음', color: 'text-blue-600', emoji: '👍' };
    if (percentage >= 20) return { level: '보통', color: 'text-yellow-600', emoji: '🤔' };
    return { level: '낮음', color: 'text-red-600', emoji: '🤷' };
  };

  const similarityInfo = result ? getSimilarityLevel(result.similarity) : null;

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
          {result && similarityInfo && (
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                가족 분석 결과
              </h2>

              {/* Main Result */}
              <div className="text-center mb-8">
                <div className="text-8xl mb-6">
                  {similarityInfo.emoji}
                </div>
                <div className="text-4xl font-bold mb-4 text-indigo-700">
                  {displaySimilarity}% 닮음
                </div>
                <div className={`text-2xl font-medium mb-2 ${similarityInfo.color}`}>
                  유사도: {similarityInfo.level}
                </div>
                <div className="text-lg text-gray-600">
                  분석 신뢰도: {displayConfidence}%
                </div>
              </div>

              {/* Face Analysis Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">부모 얼굴 정보</h4>
                  <div className="text-sm text-gray-600">
                    <div>감지 신뢰도: {(result.parent_face.confidence * 100).toFixed(1)}%</div>
                    <div>
                      얼굴 영역: {result.parent_face.bounding_box.width.toFixed(0)} × {result.parent_face.bounding_box.height.toFixed(0)}px
                    </div>
                    {result.parent_face.age && (
                      <div>나이: {result.parent_face.age}세</div>
                    )}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">자녀 얼굴 정보</h4>
                  <div className="text-sm text-gray-600">
                    <div>감지 신뢰도: {(result.child_face.confidence * 100).toFixed(1)}%</div>
                    <div>
                      얼굴 영역: {result.child_face.bounding_box.width.toFixed(0)} × {result.child_face.bounding_box.height.toFixed(0)}px
                    </div>
                    {result.child_face.age && (
                      <div>나이: {result.child_face.age}세</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Analysis Method Info */}
              <div className="bg-indigo-50 rounded-lg p-4 mb-8">
                <h4 className="font-semibold text-gray-800 mb-2">분석 방법</h4>
                <div className="text-sm text-gray-600">
                  <div>• InsightFace Buffalo-L 모델 사용</div>
                  <div>• 512차원 얼굴 특징 벡터 분석</div>
                  <div>• 코사인 유사도 측정 (0.0-1.0 범위)</div>
                  <div>• 가족 관계 특화 알고리즘 적용</div>
                </div>
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