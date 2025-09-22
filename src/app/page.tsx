'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageUploader from '@/components/ImageUploader';
import Navbar from '@/components/Navbar';
import SimilarityGauge from '@/components/SimilarityGauge';
import AdBanner from '@/components/AdBanner';
import AnalyzingAdScreen from '@/components/AnalyzingAdScreen';
import { UploadedImage, SimilarityResult } from '@/lib/types';
import { PythonFamilySimilarityData } from '@/lib/python-api/client';
import { getFamilySimilarityMessage } from '@/lib/utils/family-messages';
import { getSimilarityLevel, formatPercentage } from '@/lib/utils/similarity-calculator';

type AnalysisMode = 'family' | 'comparison';

export default function Home() {
  const [mode, setMode] = useState<AnalysisMode>('family');
  
  // Family mode states
  const [parentImage, setParentImage] = useState<UploadedImage | null>(null);
  const [childImage, setChildImage] = useState<UploadedImage | null>(null);
  const [familyResult, setFamilyResult] = useState<PythonFamilySimilarityData | null>(null);
  
  // Comparison mode states
  const [targetChildImage, setTargetChildImage] = useState<UploadedImage | null>(null);
  const [candidateImages, setCandidateImages] = useState<UploadedImage[]>([]);
  const [comparisonResults, setComparisonResults] = useState<SimilarityResult[]>([]);
  const [showComparisonResults, setShowComparisonResults] = useState(false);
  
  // Common states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdScreen, setShowAdScreen] = useState(false);
  const [pendingAnalysisResult, setPendingAnalysisResult] = useState<any>(null);
  const [pendingAnalysisError, setPendingAnalysisError] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const handleFamilyAnalyze = async () => {
    if (!parentImage?.base64 || !childImage?.base64) return;

    console.log('🚀 가족 분석 시작');
    setIsAnalyzing(true);
    setError("");
    setPendingAnalysisResult(null);
    setPendingAnalysisError(null);

    try {
      console.log('📡 API 호출 시작');
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

      setPendingAnalysisResult(data.data);
      console.log('✨ 분석 완료, 광고 화면 표시');
    } catch (err) {
      console.error('❌ 에러 발생:', err);
      setPendingAnalysisError(err);
    }

    // 광고 화면 표시
    setShowAdScreen(true);
  };

  const handleAdComplete = () => {
    setShowAdScreen(false);
    setIsAnalyzing(false);
    
    if (pendingAnalysisError) {
      setError(pendingAnalysisError instanceof Error ? pendingAnalysisError.message : '분석 중 오류가 발생했습니다.');
    } else if (pendingAnalysisResult) {
      setFamilyResult(pendingAnalysisResult);
    }
    
    console.log('🏁 가족 분석 종료');
  };

  const handleComparisonAnalyze = async () => {
    if (!targetChildImage?.base64 || candidateImages.length < 2) return;

    setIsAnalyzing(true);
    setError("");

    try {
      const targetImages = candidateImages.map(img => img.base64!);
      
      const response = await fetch('/api/rekognition/find-similar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceImage: targetChildImage.base64,
          targetImages,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      setComparisonResults(data.data.matches || []);
      setShowComparisonResults(true);
    } catch (err) {
      console.error('Error analyzing faces:', err);
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddCandidate = (image: UploadedImage) => {
    if (candidateImages.length < 6) {
      setCandidateImages(prev => [...prev, image]);
    }
  };

  const handleRemoveCandidate = (index: number) => {
    setCandidateImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    if (mode === 'family') {
      setParentImage(null);
      setChildImage(null);
      setFamilyResult(null);
    } else {
      setTargetChildImage(null);
      setCandidateImages([]);
      setComparisonResults([]);
      setShowComparisonResults(false);
    }
    setError("");
  };

  const handleModeChange = (newMode: AnalysisMode) => {
    setMode(newMode);
    handleReset();
  };

  // 연령 정보 추출 (Python API에서 제공하는 경우)
  const parentAge = familyResult?.parent_face?.age;
  const childAge = familyResult?.child_face?.age;
  
  // 스마트 점수 보정 시스템 적용 (연령 정보 포함)
  const familyMessage = familyResult ? getFamilySimilarityMessage(familyResult.similarity, parentAge, childAge) : null;
  const displayConfidence = familyResult ? (familyResult.confidence * 100).toFixed(1) : "0";
  
  // Comparison mode data
  const bestMatch = comparisonResults.length > 0 ? comparisonResults[0] : null;

  // Mode-specific content
  const getModeContent = () => {
    if (mode === 'family') {
      return {
        badge: "가족 분석",
        title: "우리 아이, 부모님 중 누굴 닮았나?",
        description: "부모님과 자녀의 사진을 업로드하여 닮은 정도를 정확하게 분석해드립니다"
      };
    } else {
      return {
        badge: "비교 분석", 
        title: "여러 사람 중 누굴 제일 닮았나?",
        description: "아이와 여러 후보자들의 사진을 비교하여 가장 닮은 사람을 찾아드립니다"
      };
    }
  };

  const modeContent = getModeContent();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="text-center mb-12">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
              {modeContent.badge}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            {modeContent.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {modeContent.description}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            InsightFace 기반 고정밀 분석 엔진
          </div>
        </div>

        {/* Mode Selection Tabs */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl border border-gray-200 p-2 inline-flex shadow-lg">
              <button
                onClick={() => handleModeChange('family')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 cursor-pointer transform ${
                  mode === 'family'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:scale-102'
                }`}
              >
                부모-자녀 닮음 분석
              </button>
              <button
                onClick={() => handleModeChange('comparison')}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 cursor-pointer transform ${
                  mode === 'comparison'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:scale-102'
                }`}
              >
                누굴 제일 닮았나요?
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Family Mode */}
          {mode === 'family' && !familyResult && !showAdScreen && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Parent Image */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      부모 사진
                    </h3>
                  </div>
                  <ImageUploader
                    onImageUpload={setParentImage}
                    onImageRemove={() => setParentImage(null)}
                    uploadedImage={parentImage || undefined}
                    label="부모 사진 업로드"
                  />
                </div>

                {/* Child Image */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">2</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      자녀 사진
                    </h3>
                  </div>
                  <ImageUploader
                    onImageUpload={setChildImage}
                    onImageRemove={() => setChildImage(null)}
                    uploadedImage={childImage || undefined}
                    label="자녀 사진 업로드"
                  />
                </div>
              </div>

              {/* Analysis Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleFamilyAnalyze}
                  disabled={!parentImage || !childImage || isAnalyzing}
                  className={`
                    w-full md:w-auto px-8 py-4 rounded-xl text-lg font-medium transition-all duration-200
                    ${!parentImage || !childImage || isAnalyzing
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    }
                  `}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      AI 분석 중...
                    </span>
                  ) : (
                    '닮은 정도 분석 시작'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* 광고 화면 - 기존 업로드 섹션 자리에 표시 */}
          {mode === 'family' && !familyResult && showAdScreen && (
            <div className="mb-8">
              <AnalyzingAdScreen onComplete={handleAdComplete} />
            </div>
          )}

          {/* Comparison Mode */}
          {mode === 'comparison' && !showComparisonResults && (
            <>
              {/* Child Image Upload */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
                  아이 사진을 업로드하세요
                </h3>
                <div className="max-w-sm mx-auto">
                  <ImageUploader
                    onImageUpload={setTargetChildImage}
                    onImageRemove={() => setTargetChildImage(null)}
                    uploadedImage={targetChildImage || undefined}
                    label="아이 사진 업로드"
                  />
                </div>
              </div>

              {/* Candidate Images */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
                  후보자들의 사진을 업로드하세요 (2-6명)
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                  {candidateImages.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="relative aspect-square w-full">
                        <Image
                          src={image.preview}
                          alt={`Candidate ${index + 1}`}
                          fill
                          className="object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          onClick={() => handleRemoveCandidate(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          aria-label="Remove candidate"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 text-center mt-2">후보자 {index + 1}</p>
                    </div>
                  ))}
                  
                  {candidateImages.length < 6 && (
                    <div className="aspect-square">
                      <ImageUploader
                        onImageUpload={handleAddCandidate}
                        label={`후보자 ${candidateImages.length + 1}`}
                        className="h-full"
                      />
                    </div>
                  )}
                </div>
                
                <p className="text-center text-sm text-gray-600">
                  현재 {candidateImages.length}명의 후보자가 등록되었습니다.
                  {candidateImages.length < 2 && " (최소 2명 필요)"}
                </p>
              </div>

              {/* Analysis Button */}
              <div className="text-center mb-8">
                <button
                  onClick={handleComparisonAnalyze}
                  disabled={!targetChildImage || candidateImages.length < 2 || isAnalyzing}
                  className={`
                    w-full md:w-auto px-8 py-4 rounded-xl text-lg font-medium transition-all duration-200
                    ${!targetChildImage || candidateImages.length < 2 || isAnalyzing
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    }
                  `}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      AI가 부모를 찾는 중...
                    </span>
                  ) : (
                    '부모 찾기 시작!'
                  )}
                </button>
              </div>
            </>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Family Results Section */}
          {mode === 'family' && familyResult && familyMessage && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-full mb-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">분석 완료</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  닮음 정도 결과
                </h2>
                <p className="text-gray-600">
                  분석 신뢰도: {displayConfidence}%
                </p>
              </div>

              {/* 분석 대상 사진들 */}
              <div className="mb-8">
                <div className="flex items-center justify-center gap-6 mb-6">
                  {/* 부모 사진 */}
                  <div className="text-center">
                    <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-2">
                      <Image
                        src={parentImage?.preview || ''}
                        alt="부모"
                        fill
                        className="object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                      />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">부모</span>
                  </div>

                  {/* 하트 아이콘 */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 text-pink-500 mb-1">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-500">닮음</span>
                  </div>

                  {/* 자녀 사진 */}
                  <div className="text-center">
                    <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-2">
                      <Image
                        src={childImage?.preview || ''}
                        alt="자녀"
                        fill
                        className="object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                      />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">자녀</span>
                  </div>
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
              <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  다시 분석하기
                </button>
                <button
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: '우리 아이 닮음 분석 결과',
                        text: `${familyMessage.displayPercent}% 닮았네요!`,
                        url: window.location.href
                      });
                    }
                  }}
                >
                  결과 공유하기
                </button>
              </div>
            </div>
          )}

          {/* Comparison Results Section */}
          {mode === 'comparison' && showComparisonResults && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
                부모 찾기 결과!
              </h2>

              {/* Winner */}
              {bestMatch && (
                <div className="text-center mb-12">
                  <h3 className="text-2xl font-bold text-blue-700 mb-8">
                    가장 가능성이 높은 부모님
                  </h3>
                  <div className="max-w-sm mx-auto mb-4">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={candidateImages[bestMatch.imageIndex]?.preview || ''}
                        alt="Best match"
                        fill
                        className="object-cover rounded-lg border-4 border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent mb-2">
                    {formatPercentage(bestMatch.similarity)}
                  </div>
                  <p className="text-lg text-blue-600">
                    {getSimilarityLevel(bestMatch.similarity).description}
                  </p>
                </div>
              )}

              {/* All Results Ranking */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                  전체 순위
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {comparisonResults.map((result, index) => {
                    const candidateImage = candidateImages[result.imageIndex];
                    if (!candidateImage) return null;
                    
                    return (
                      <div
                        key={result.imageIndex}
                        className={`
                          p-4 rounded-lg border-2 transition-all
                          ${index === 0 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-blue-200 bg-blue-50'
                          }
                        `}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2 font-bold text-blue-700">
                            {index + 1}위
                          </div>
                          <div className="relative aspect-square w-32 mx-auto mb-3">
                            <Image
                              src={candidateImage.preview}
                              alt={`Candidate ${result.imageIndex + 1}`}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="text-xl font-bold text-blue-900 mb-1">
                            {formatPercentage(result.similarity)}
                          </div>
                          <div className={`text-sm ${getSimilarityLevel(result.similarity).color}`}>
                            {getSimilarityLevel(result.similarity).level}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  다시 시도하기
                </button>
                <button
                  onClick={() => handleModeChange('family')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  부모-자녀 분석하기 →
                </button>
              </div>
            </div>
          )}

          {/* Feature Cards - 결과가 없을 때만 표시 */}
          {!familyResult && !showComparisonResults && (
            <>
              <div className="grid md:grid-cols-3 gap-6 mt-16">
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">정확한 AI 분석</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    최신 InsightFace 기술로 높은 정확도의 얼굴 유사도 분석을 제공합니다
                  </p>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">다양한 분석 모드</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    부모-자녀 닮음 분석부터 여러 후보자 중 가장 닮은 사람 찾기까지 지원합니다
                  </p>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">개인정보 보호</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    업로드된 이미지는 분석 후 즉시 삭제되어 개인정보를 안전하게 보호합니다
                  </p>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="text-center mt-16 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    놀라운 AI 기술을 무료로 체험해보세요!
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    몇 초 만에 결과를 확인할 수 있는 최첨단 얼굴 분석 기술
                  </p>
                  <button
                    onClick={() => {
                      document.querySelector('.container')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    지금 바로 시작하기
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}