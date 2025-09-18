'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ImageUploader from '@/components/ImageUploader';
import Navbar from '@/components/Navbar';
import { UploadedImage } from '@/lib/types';
import { calculateFamilyResemblance, getSimilarityLevel, formatPercentage } from '@/lib/utils/similarity-calculator';

interface ComparisonResult {
  childMother: number;
  childFather: number;
}

export default function WhoResemblesPage() {
  const [childImage, setChildImage] = useState<UploadedImage | null>(null);
  const [motherImage, setMotherImage] = useState<UploadedImage | null>(null);
  const [fatherImage, setFatherImage] = useState<UploadedImage | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>("");

  const handleAnalyze = async () => {
    if (!childImage?.base64 || !motherImage?.base64 || !fatherImage?.base64) return;

    setIsAnalyzing(true);
    setError("");

    try {
      // Compare child with mother
      const motherResponse = await fetch('/api/rekognition/compare-faces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceImage: childImage.base64,
          targetImage: motherImage.base64,
          similarityThreshold: 1,
        }),
      });

      const motherData = await motherResponse.json();
      if (!motherData.success) {
        throw new Error(motherData.error || 'Mother comparison failed');
      }

      // Compare child with father
      const fatherResponse = await fetch('/api/rekognition/compare-faces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceImage: childImage.base64,
          targetImage: fatherImage.base64,
          similarityThreshold: 1,
        }),
      });

      const fatherData = await fatherResponse.json();
      if (!fatherData.success) {
        throw new Error(fatherData.error || 'Father comparison failed');
      }

      setResult({
        childMother: motherData.data.similarity,
        childFather: fatherData.data.similarity,
      });
    } catch (err) {
      console.error('Error analyzing faces:', err);
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setChildImage(null);
    setMotherImage(null);
    setFatherImage(null);
    setResult(null);
    setError("");
  };

  const familyAnalysis = result ? calculateFamilyResemblance(result.childMother, result.childFather) : null;

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

      <div className="min-h-screen bg-gradient-to-br from-white via-white/90 to-blue-50/30 relative z-10">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[100px]"></div>
        <div className="container mx-auto px-4 py-8 relative">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="font-playfair text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 bg-clip-text text-transparent drop-shadow-sm leading-tight">
              누굴 더 닮았나요
            </h1>
            <p className="font-roboto text-lg text-blue-800/80 max-w-2xl mx-auto font-light tracking-wide">
              엄마와 아빠 중 누구를 더 닮았는지 정확한 분석 결과를 확인하세요
            </p>
          </header>

        <div className="max-w-6xl mx-auto">
          {/* Image Upload Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Child */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-50">
              <h3 className="font-montserrat text-xl font-semibold text-blue-900 mb-6 text-center">
                아이
              </h3>
              <ImageUploader
                onImageUpload={setChildImage}
                onImageRemove={() => setChildImage(null)}
                uploadedImage={childImage || undefined}
                label="아이 사진 업로드"
              />
            </div>

            {/* Mother */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-50">
              <h3 className="font-montserrat text-xl font-semibold text-blue-900 mb-6 text-center">
                엄마
              </h3>
              <ImageUploader
                onImageUpload={setMotherImage}
                onImageRemove={() => setMotherImage(null)}
                uploadedImage={motherImage || undefined}
                label="엄마 사진 업로드"
              />
            </div>

            {/* Father */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-50">
              <h3 className="font-montserrat text-xl font-semibold text-blue-900 mb-6 text-center">
                아빠
              </h3>
              <ImageUploader
                onImageUpload={setFatherImage}
                onImageRemove={() => setFatherImage(null)}
                uploadedImage={fatherImage || undefined}
                label="아빠 사진 업로드"
              />
            </div>
          </div>

          {/* Analysis Button */}
          <div className="text-center mb-8">
            <button
              onClick={handleAnalyze}
              disabled={!childImage || !motherImage || !fatherImage || isAnalyzing}
              className={`
                font-montserrat px-8 py-4 rounded-full text-lg font-semibold transition-all tracking-wider
                ${!childImage || !motherImage || !fatherImage || isAnalyzing
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
                  닮은꼴 분석 중...
                </span>
              ) : (
                '닮은꼴 분석 시작'
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
          {result && familyAnalysis && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-50">
              <h2 className="font-playfair text-3xl font-bold text-center text-blue-900 mb-8">
                닮은꼴 분석 결과
              </h2>

              {/* Main Result */}
              <div className="text-center mb-12">
                {familyAnalysis.moreResembledParent === 'equal' ? (
                  <div>
                    <h3 className="font-montserrat text-3xl font-bold text-blue-600 mb-8">
                      엄마와 아빠를 똑같이 닮았어요!
                    </h3>
                    <p className="font-roboto text-xl text-blue-600/80 font-light">
                      놀라운 균형을 보여주는 완벽한 조화입니다!
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-montserrat text-3xl font-bold text-blue-600 mb-8">
                      {familyAnalysis.moreResembledParent === 'parent1' ? '엄마' : '아빠'}를 더 닮았어요!
                    </h3>
                    <p className="font-roboto text-xl text-blue-600/80 font-light">
                      {familyAnalysis.difference.toFixed(1)}% 차이로 {familyAnalysis.moreResembledParent === 'parent1' ? '엄마' : '아빠'} 쪽 유전자가 더 강해요!
                    </p>
                  </div>
                )}
              </div>

              {/* Detailed Comparison */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Mother Similarity */}
                <div className="text-center p-6 bg-pink-50 rounded-xl">
                  <h4 className="font-montserrat text-2xl font-bold text-blue-900 mb-6">엄마와의 유사도</h4>
                  <div className="text-5xl font-bold text-pink-600 mb-4">
                    {formatPercentage(result.childMother)}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div
                      className="h-4 bg-pink-500 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(result.childMother, 100)}%` }}
                    ></div>
                  </div>
                  <p className="font-roboto text-lg text-blue-600/80 font-light">
                    {getSimilarityLevel(result.childMother).description}
                  </p>
                  <div className="font-montserrat mt-4 text-xl font-semibold text-pink-600">
                    전체의 {familyAnalysis.percentage.parent1.toFixed(1)}%
                  </div>
                </div>

                {/* Father Similarity */}
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <h4 className="font-montserrat text-2xl font-bold text-blue-900 mb-6">아빠와의 유사도</h4>
                  <div className="text-5xl font-bold text-blue-600 mb-4">
                    {formatPercentage(result.childFather)}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div
                      className="h-4 bg-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(result.childFather, 100)}%` }}
                    ></div>
                  </div>
                  <p className="font-roboto text-lg text-blue-600/80 font-light">
                    {getSimilarityLevel(result.childFather).description}
                  </p>
                  <div className="font-montserrat mt-4 text-xl font-semibold text-blue-600">
                    전체의 {familyAnalysis.percentage.parent2.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Overall Similarity Bar */}
              <div className="mb-8">
                <h4 className="font-montserrat text-xl font-semibold text-blue-900 mb-4 text-center">
                  전체 유사도 비교
                </h4>
                <div className="flex h-8 rounded-full overflow-hidden">
                  <div 
                    className="bg-pink-500 flex items-center justify-center text-white font-semibold"
                    style={{ width: `${familyAnalysis.percentage.parent1}%` }}
                  >
                    {familyAnalysis.percentage.parent1 > 15 && '👩 엄마'}
                  </div>
                  <div 
                    className="bg-blue-500 flex items-center justify-center text-white font-semibold"
                    style={{ width: `${familyAnalysis.percentage.parent2}%` }}
                  >
                    {familyAnalysis.percentage.parent2 > 15 && '👨 아빠'}
                  </div>
                </div>
                <div className="font-roboto flex justify-between text-sm text-blue-500/70 mt-2">
                  <span>엄마 {familyAnalysis.percentage.parent1.toFixed(1)}%</span>
                  <span>아빠 {familyAnalysis.percentage.parent2.toFixed(1)}%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleReset}
                  className="font-montserrat px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold"
                >
                  다시 분석하기
                </button>
                <Link
                  href="/find-parents"
                  className="font-montserrat px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all font-semibold"
                >
                  부모 찾기 게임 →
                </Link>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  );
}