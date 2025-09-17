'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageUploader from '@/components/ImageUploader';
import { UploadedImage, FaceComparisonResult } from '@/lib/types';
import { getSimilarityLevel, generateInsightMessage, formatPercentage } from '@/lib/utils/similarity-calculator';

export default function FaceMatchPage() {
  const [sourceImage, setSourceImage] = useState<UploadedImage | null>(null);
  const [targetImage, setTargetImage] = useState<UploadedImage | null>(null);
  const [result, setResult] = useState<FaceComparisonResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>("");

  const handleAnalyze = async () => {
    if (!sourceImage?.base64 || !targetImage?.base64) return;

    setIsAnalyzing(true);
    setError("");

    try {
      const response = await fetch('/api/rekognition/compare-faces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceImage: sourceImage.base64,
          targetImage: targetImage.base64,
          similarityThreshold: 1,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data.data);
    } catch (err) {
      console.error('Error analyzing faces:', err);
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSourceImage(null);
    setTargetImage(null);
    setResult(null);
    setError("");
  };

  const similarity = result?.similarity || 0;
  const similarityInfo = getSimilarityLevel(similarity);
  const insightMessage = generateInsightMessage(similarity, 'parent-child');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 text-blue-600 hover:text-blue-800">
            ← 홈으로 돌아가기
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            👶➡️👨 얼굴 일치율 분석
          </h1>
          <p className="text-lg text-gray-600">
            두 사진의 얼굴 유사도를 정확하게 측정해보세요
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Image Upload Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                첫 번째 사진 (부모)
              </h3>
              <ImageUploader
                onImageUpload={setSourceImage}
                onImageRemove={() => setSourceImage(null)}
                uploadedImage={sourceImage || undefined}
                label="부모 사진 업로드"
              />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                두 번째 사진 (아이)
              </h3>
              <ImageUploader
                onImageUpload={setTargetImage}
                onImageRemove={() => setTargetImage(null)}
                uploadedImage={targetImage || undefined}
                label="아이 사진 업로드"
              />
            </div>
          </div>

          {/* Analysis Button */}
          <div className="text-center mb-8">
            <button
              onClick={handleAnalyze}
              disabled={!sourceImage || !targetImage || isAnalyzing}
              className={`
                px-8 py-4 rounded-full text-lg font-semibold transition-all
                ${!sourceImage || !targetImage || isAnalyzing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                }
              `}
            >
              {isAnalyzing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI 분석 중...
                </span>
              ) : (
                '🤖 AI 분석 시작'
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
          {result && (
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                🎉 분석 결과
              </h2>

              {/* Similarity Score */}
              <div className="text-center mb-8">
                <div className="text-6xl font-bold mb-4" style={{ color: similarityInfo.color.replace('text-', '') }}>
                  {formatPercentage(similarity)}
                </div>
                <div className={`text-2xl font-semibold mb-2 ${similarityInfo.color}`}>
                  유사도: {similarityInfo.level}
                </div>
                <p className="text-lg text-gray-600 mb-4">
                  {similarityInfo.description}
                </p>
                <p className="text-xl font-medium text-purple-600">
                  {insightMessage}
                </p>
              </div>

              {/* Similarity Bar */}
              <div className="mb-8">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-1000 ${
                      similarity >= 80 ? 'bg-green-500' :
                      similarity >= 60 ? 'bg-blue-500' :
                      similarity >= 40 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(similarity, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
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
                  href="/who-resembles"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  닮은꼴 분석하기 →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}