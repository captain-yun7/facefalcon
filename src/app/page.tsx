'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import Navbar from '@/components/Navbar';
import { UploadedImage, FaceComparisonResult } from '@/lib/types';
import { getSimilarityLevel, generateInsightMessage, formatPercentage } from '@/lib/utils/similarity-calculator';
import { getFamilySimilarityMessage } from '@/lib/utils/family-messages';

export default function Home() {
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
      const response = await fetch('/api/family-similarity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentImage: sourceImage.base64,
          childImage: targetImage.base64,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      // 가족 유사도 데이터를 기존 형식에 맞게 변환
      setResult({
        similarity: data.data.family_similarity,
        faceMatches: [],
        sourceImageFace: undefined,
        unmatchedFaces: [],
        // 추가 가족 분석 데이터 저장
        familyData: data.data
      } as any);
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
  const familyData = (result as any)?.familyData;
  
  // 엔터테이닝 메시지 가져오기
  const entertainingMessage = getFamilySimilarityMessage(similarity);

  return (
    <>
      <Navbar />
      
      {/* Floating Shapes Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-br from-blue-300/20 to-blue-200/20 blur-[80px] top-[15%] left-[15%] animate-float"></div>
        <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-br from-blue-400/20 to-blue-300/20 blur-[80px] bottom-[15%] right-[10%] animate-float animation-delay-2000"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-br from-blue-500/20 to-blue-400/20 blur-[80px] top-[45%] left-[45%] animate-float animation-delay-4000"></div>
        <div className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-br from-blue-100/30 to-gray-50/30 blur-[80px] top-[70%] left-[20%] animate-float animation-delay-6000"></div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-white via-white/90 to-blue-50/30 relative z-10">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[100px]"></div>
        <div className="container mx-auto px-4 py-8 relative">
          
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="font-playfair text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 bg-clip-text text-transparent drop-shadow-sm leading-tight">
              우리 아빠 맞나요
            </h1>
            <p className="font-roboto text-lg text-blue-800/80 max-w-2xl mx-auto font-light tracking-wide">
              부모와 아이의 닮은 정도를 재미있게 분석해보세요
            </p>
          </header>

          <div className="max-w-6xl mx-auto">
            {/* Image Upload Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-50">
                <h3 className="font-montserrat text-xl font-semibold text-blue-900 mb-6 text-center">
                  첫 번째 사진 (부모)
                </h3>
                <ImageUploader
                  onImageUpload={setSourceImage}
                  onImageRemove={() => setSourceImage(null)}
                  uploadedImage={sourceImage || undefined}
                  label="부모 사진 업로드"
                />
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-50">
                <h3 className="font-montserrat text-xl font-semibold text-blue-900 mb-6 text-center">
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
                  font-montserrat px-8 py-4 rounded-full text-lg font-semibold transition-all tracking-wider
                  ${!sourceImage || !targetImage || isAnalyzing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-700 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/30 transform hover:scale-105'
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
                  'AI 분석하기'
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <p className="font-roboto text-red-600 text-center">{error}</p>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-50">
                <h2 className="font-playfair text-3xl font-bold text-center text-blue-900 mb-8">
                  분석 결과
                </h2>

                {/* Simple Entertaining Message */}
                <div className="text-center mb-8">
                  <div className="text-8xl mb-6">
                    {entertainingMessage.emoji}
                  </div>
                  <div className="font-playfair text-4xl font-bold mb-6 text-blue-800">
                    {entertainingMessage.title}
                  </div>
                  <p className="font-roboto text-2xl font-medium text-blue-700 leading-relaxed max-w-3xl mx-auto">
                    {entertainingMessage.message}
                  </p>
                  
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleReset}
                    className="font-montserrat px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold"
                  >
                    다시 분석하기
                  </button>
                  <a
                    href="/who-resembles"
                    className="font-montserrat px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all font-semibold"
                  >
                    닮은꼴 분석하기 →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
