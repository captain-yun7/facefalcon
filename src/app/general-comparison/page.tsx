'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageUploader from '@/components/ImageUploader';
import { UploadedImage, FaceComparisonResult } from '@/lib/types';

export default function GeneralComparisonPage() {
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
          sourceImageBase64: sourceImage.base64,
          targetImageBase64: targetImage.base64,
          similarityThreshold: 1
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'General comparison failed');
      }

      setResult(data.data);
    } catch (err) {
      console.error('Error analyzing face comparison:', err);
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

  // AWS는 이미 0-100 백분율로 제공
  const displaySimilarity = result ? result.similarity.toFixed(1) : "0";
  const displayConfidence = result?.sourceImageFace ? result.sourceImageFace.confidence.toFixed(1) : "0";

  // 유사도 레벨 계산
  const getSimilarityLevel = (similarity: number) => {
    if (similarity >= 90) return { level: '매우 높음', color: 'text-green-600', emoji: '🎯' };
    if (similarity >= 70) return { level: '높음', color: 'text-blue-600', emoji: '👍' };
    if (similarity >= 50) return { level: '보통', color: 'text-yellow-600', emoji: '🤔' };
    if (similarity >= 30) return { level: '낮음', color: 'text-orange-600', emoji: '🤷' };
    return { level: '매우 낮음', color: 'text-red-600', emoji: '❌' };
  };

  const similarityInfo = result ? getSimilarityLevel(result.similarity) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 text-blue-600 hover:text-blue-800">
            ← 홈으로 돌아가기
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            일반 얼굴 비교
          </h1>
          <p className="text-lg text-gray-600">
            빠르고 안정적인 기본 얼굴 유사도 측정
          </p>
          <div className="mt-2 text-sm text-orange-600 font-medium">
            AWS Rekognition 엔진 사용
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Image Upload Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                첫 번째 사진
              </h3>
              <ImageUploader
                onImageUpload={setSourceImage}
                onImageRemove={() => setSourceImage(null)}
                uploadedImage={sourceImage || undefined}
                label="첫 번째 사진 업로드"
              />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                두 번째 사진
              </h3>
              <ImageUploader
                onImageUpload={setTargetImage}
                onImageRemove={() => setTargetImage(null)}
                uploadedImage={targetImage || undefined}
                label="두 번째 사진 업로드"
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
                  : 'bg-orange-600 text-white hover:bg-orange-700 transform hover:scale-105'
                }
              `}
            >
              {isAnalyzing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  일반 비교 중...
                </span>
              ) : (
                '일반 얼굴 비교하기'
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
                일반 비교 결과
              </h2>

              {/* Main Result */}
              <div className="text-center mb-8">
                <div className="text-8xl mb-6">
                  {similarityInfo.emoji}
                </div>
                <div className="text-4xl font-bold mb-4 text-orange-700">
                  {displaySimilarity}% 유사
                </div>
                <div className={`text-2xl font-medium mb-2 ${similarityInfo.color}`}>
                  유사도: {similarityInfo.level}
                </div>
                <div className="text-lg text-gray-600">
                  분석 신뢰도: {displayConfidence}%
                </div>
              </div>

              {/* Match Details */}
              {result.faceMatches && result.faceMatches.length > 0 && (
                <div className="bg-orange-50 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-4">매칭된 얼굴 정보</h4>
                  <div className="grid gap-4">
                    {result.faceMatches.map((match, index) => (
                      <div key={index} className="bg-white rounded p-4">
                        <div className="text-sm text-gray-600">
                          <div>매칭 유사도: {match.similarity.toFixed(1)}%</div>
                          <div>얼굴 신뢰도: {match.face.confidence.toFixed(1)}%</div>
                          <div>
                            얼굴 크기: {(match.face.boundingBox.width * 100).toFixed(1)}% × {(match.face.boundingBox.height * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Source Face Info */}
              {result.sourceImageFace && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">원본 얼굴 정보</h4>
                  <div className="text-sm text-gray-600">
                    <div>감지 신뢰도: {result.sourceImageFace.confidence.toFixed(1)}%</div>
                    <div>
                      얼굴 크기: {(result.sourceImageFace.boundingBox.width * 100).toFixed(1)}% × {(result.sourceImageFace.boundingBox.height * 100).toFixed(1)}%
                    </div>
                    <div>
                      위치: ({(result.sourceImageFace.boundingBox.left * 100).toFixed(1)}%, {(result.sourceImageFace.boundingBox.top * 100).toFixed(1)}%)
                    </div>
                  </div>
                </div>
              )}

              {/* Unmatched Faces */}
              {result.unmatchedFaces && result.unmatchedFaces.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    매칭되지 않은 얼굴 ({result.unmatchedFaces.length}개)
                  </h4>
                  <div className="text-sm text-gray-600">
                    두 번째 사진에서 유사하지 않은 다른 얼굴들이 발견되었습니다.
                  </div>
                </div>
              )}

              {/* Analysis Method Info */}
              <div className="bg-orange-50 rounded-lg p-4 mb-8">
                <h4 className="font-semibold text-gray-800 mb-2">분석 방법</h4>
                <div className="text-sm text-gray-600">
                  <div>• AWS Rekognition 엔진 사용</div>
                  <div>• 머신러닝 기반 얼굴 특징 분석</div>
                  <div>• 실시간 처리 및 높은 안정성</div>
                  <div>• 일반적인 얼굴 비교에 최적화</div>
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
                  href="/family-analysis"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  가족 분석으로 분석하기 →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}