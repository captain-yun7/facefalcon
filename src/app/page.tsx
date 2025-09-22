'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import Navbar from '@/components/Navbar';
import SimilarityGauge from '@/components/SimilarityGauge';
import { UploadedImage } from '@/lib/types';
import { PythonFamilySimilarityData } from '@/lib/python-api/client';
import { getFamilySimilarityMessage } from '@/lib/utils/family-messages';

export default function Home() {
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

  // 연령 정보 추출 (Python API에서 제공하는 경우)
  const parentAge = result?.parent_face?.age;
  const childAge = result?.child_face?.age;
  
  // 스마트 점수 보정 시스템 적용 (연령 정보 포함)
  const familyMessage = result ? getFamilySimilarityMessage(result.similarity, parentAge, childAge) : null;
  const displayConfidence = result ? (result.confidence * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            우리 아이, 누굴 닮았나?
          </h1>
          <p className="text-xl text-gray-600">
            부모님과 자녀의 사진을 업로드하여 닮은 정도를 AI로 분석해보세요
          </p>
          <div className="mt-2 text-sm text-indigo-600 font-medium">
            InsightFace 가족 특화 알고리즘 사용
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Image Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Parent Image */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  부모 사진
                </h3>
                <ImageUploader
                  onImageUpload={setParentImage}
                  onImageRemove={() => setParentImage(null)}
                  uploadedImage={parentImage || undefined}
                  label="부모 사진 선택"
                />
              </div>

              {/* Child Image */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  자녀 사진
                </h3>
                <ImageUploader
                  onImageUpload={setChildImage}
                  onImageRemove={() => setChildImage(null)}
                  uploadedImage={childImage || undefined}
                  label="자녀 사진 선택"
                />
              </div>
            </div>

            {/* Analysis Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleAnalyze}
                disabled={!parentImage || !childImage || isAnalyzing}
                className={`
                  px-8 py-3 rounded-full text-lg font-semibold transition-all
                  ${!parentImage || !childImage || isAnalyzing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transform hover:scale-105'
                  }
                `}
              >
                {isAnalyzing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    분석 중...
                  </span>
                ) : (
                  '닮은 정도 분석하기'
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* Results Section */}
          {result && familyMessage && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                분석 결과
              </h2>

              <div className="text-center mb-6">
                <div className="text-lg text-gray-600">
                  분석 신뢰도: {displayConfidence}%
                </div>
              </div>

              {/* Similarity Gauge */}
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
              </div>
            </div>
          )}

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-3">🔬</div>
              <h3 className="text-lg font-semibold mb-2">정확한 AI 분석</h3>
              <p className="text-gray-600 text-sm">
                최신 InsightFace 기술로 높은 정확도의 얼굴 유사도 분석
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-3">👨‍👩‍👧‍👦</div>
              <h3 className="text-lg font-semibold mb-2">가족 특화 분석</h3>
              <p className="text-gray-600 text-sm">
                부모-자녀 관계를 고려한 특별한 유사도 분석 알고리즘
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-lg font-semibold mb-2">개인정보 보호</h3>
              <p className="text-gray-600 text-sm">
                업로드된 이미지는 분석 후 즉시 삭제되어 안전합니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}