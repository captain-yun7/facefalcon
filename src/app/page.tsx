'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ImageUploader from '@/components/ImageUploader';
import Navbar from '@/components/Navbar';
import SimilarityGauge from '@/components/SimilarityGauge';
import AdBanner from '@/components/AdBanner';
import AnalyzingAdScreen from '@/components/AnalyzingAdScreen';
import Footer from '@/components/Footer';
import { UploadedImage, SimilarityResult } from '@/lib/types';
import { PythonFamilySimilarityData } from '@/lib/python-api/client';
import { getFamilySimilarityMessage } from '@/lib/utils/family-messages';
import { getSimilarityLevel, formatPercentage } from '@/lib/utils/similarity-calculator';
import { generateResultImage, downloadImage, shareResultImage, copyToClipboard, ResultImageData } from '@/lib/utils/image-generator';
import { useTranslations } from '@/lib/simple-i18n';

export default function Home() {
  const { t, locale } = useTranslations();
  
  // Family mode states
  const [parentImage, setParentImage] = useState<UploadedImage | null>(null);
  const [childImage, setChildImage] = useState<UploadedImage | null>(null);
  const [familyResult, setFamilyResult] = useState<PythonFamilySimilarityData | null>(null);
  
  
  // Common states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdScreen, setShowAdScreen] = useState(false);
  const [pendingAnalysisResult, setPendingAnalysisResult] = useState<any>(null);
  const [pendingAnalysisError, setPendingAnalysisError] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const handleFamilyAnalyze = async () => {
    if (!parentImage?.base64 || !childImage?.base64) return;

    console.log('🚀 Family analysis started');
    setIsAnalyzing(true);
    setError("");
    setPendingAnalysisResult(null);
    setPendingAnalysisError(null);

    try {
      console.log('📡 API call started');
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

      console.log('✅ API response received');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Family analysis failed');
      }

      setPendingAnalysisResult(data.data);
      console.log('✨ Analysis complete, showing ad screen');
    } catch (err) {
      console.error('❌ Error occurred:', err);
      setPendingAnalysisError(err);
    }

    // 광고 화면 표시
    setShowAdScreen(true);
  };

  const handleAdComplete = () => {
    setShowAdScreen(false);
    setIsAnalyzing(false);
    
    if (pendingAnalysisError) {
      setError(pendingAnalysisError instanceof Error ? pendingAnalysisError.message : t('errors.analysisFailure'));
    } else if (pendingAnalysisResult) {
      setFamilyResult(pendingAnalysisResult);
    }
    
    console.log('🏁 Family analysis completed');
  };

  const handleDownloadResult = async () => {
    if (!familyResult || !parentImage || !childImage || !familyMessage) {
      return;
    }

    try {
      const resultData: ResultImageData = {
        parentImageUrl: parentImage.preview,
        childImageUrl: childImage.preview,
        similarity: familyResult.similarity,
        confidence: familyResult.confidence * 100,
        displayPercent: familyMessage.displayPercent
      };

      const imageDataUrl = await generateResultImage(resultData);
      downloadImage(imageDataUrl);
    } catch (error) {
      console.error('Image generation failed:', error);
      alert(t('errors.imageGenerationFailed'));
    }
  };

  const handleShareResult = async () => {
    if (!familyResult || !parentImage || !childImage || !familyMessage) {
      return;
    }

    try {
      const resultData: ResultImageData = {
        parentImageUrl: parentImage.preview,
        childImageUrl: childImage.preview,
        similarity: familyResult.similarity,
        confidence: familyResult.confidence * 100,
        displayPercent: familyMessage.displayPercent
      };

      const imageDataUrl = await generateResultImage(resultData);
      const shared = await shareResultImage(imageDataUrl, familyMessage.displayPercent);
      
      if (!shared) {
        // Web Share API 미지원 시 폴백: 클립보드에 텍스트 복사
        const shareText = t('share.resultText', { percent: familyMessage.displayPercent });
        const copied = await copyToClipboard(shareText);
        
        if (copied) {
          alert(t('share.clipboardCopied'));
        } else {
          alert(t('share.shareNotSupported'));
        }
      }
    } catch (error) {
      console.error('Share failed:', error);
      alert(t('errors.shareFailed'));
    }
  };


  const handleReset = () => {
    setParentImage(null);
    setChildImage(null);
    setFamilyResult(null);
    setError("");
  };

  // 연령 정보 추출 (Python API에서 제공하는 경우)
  const parentAge = familyResult?.parent_face?.age;
  const childAge = familyResult?.child_face?.age;
  
  // 스마트 점수 보정 시스템 적용 (연령 정보 포함)
  const familyMessage = familyResult ? getFamilySimilarityMessage(familyResult.similarity, parentAge, childAge) : null;
  const displayConfidence = familyResult ? (familyResult.confidence * 100).toFixed(1) : "0";
  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="text-center mb-12">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold rounded-full shadow-lg mb-4">
              {t('home.hero.title')}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            {t('home.hero.subtitle')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('home.hero.description')}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            {t('home.hero.badge')}
          </div>
        </div>


        <div className="max-w-4xl mx-auto">
          {/* Family Analysis */}
          {!familyResult && !showAdScreen && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Parent Image */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {t('home.upload.parentPhoto')}
                    </h3>
                  </div>
                  <ImageUploader
                    onImageUpload={setParentImage}
                    onImageRemove={() => setParentImage(null)}
                    uploadedImage={parentImage || undefined}
                    label={t('parentChildAnalysis.uploadParent')}
                  />
                </div>

                {/* Child Image */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">2</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {t('home.upload.childPhoto')}
                    </h3>
                  </div>
                  <ImageUploader
                    onImageUpload={setChildImage}
                    onImageRemove={() => setChildImage(null)}
                    uploadedImage={childImage || undefined}
                    label={t('parentChildAnalysis.uploadChild')}
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
                      {t('home.upload.analyzing')}
                    </span>
                  ) : (
                    t('home.upload.startAnalysis')
                  )}
                </button>
              </div>
            </div>
          )}

          {/* 광고 화면 - 기존 업로드 섹션 자리에 표시 */}
          {!familyResult && showAdScreen && (
            <div className="mb-8">
              <AnalyzingAdScreen onComplete={handleAdComplete} />
            </div>
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

          {/* Family Results Section - Ultra Modern Design */}
          {familyResult && familyMessage && (
            <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/20 to-purple-50/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-2xl shadow-blue-500/10 hover:shadow-3xl hover:shadow-blue-500/20 transition-shadow duration-500 mb-12 animate-fade-in">
              {/* 글래스모피즘 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/40 to-transparent"></div>
              
              {/* 데코레이티브 요소들 */}
              <div className="absolute top-8 right-8 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl opacity-60"></div>
              <div className="absolute bottom-8 left-8 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-2xl opacity-40"></div>
              
              {/* Clean Modern Header */}
              <div className="relative z-20 text-center p-8 border-b border-white/20 backdrop-blur-sm">
                <div className="mb-6">
                  <span className="px-6 py-3 bg-gradient-to-r from-blue-500/15 to-purple-500/15 text-blue-700 text-sm font-semibold rounded-full border border-blue-200/40 backdrop-blur-sm inline-block">
                    AI 분석 완료
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 mb-4 leading-tight">
                  {t('analysisSelector.parentChild.title')}
                </h2>
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Whos your papa AI {t('home.results.analysisResult')}</span>
                </div>
              </div>
              
              {/* Ultra Modern Photo Grid */}
              <div className="relative z-20 p-6 md:p-10">
                <div className="flex items-center justify-center gap-8 md:gap-12 mb-6">
                  {/* 부모 사진 - 모던 디자인 */}
                  <div className="group text-center">
                    <div className="mb-6">
                      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-full border border-blue-200/30 backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-semibold text-blue-700">{t('home.results.parentLabel')}</span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl transform group-hover:scale-110 transition-transform duration-500"></div>
                      <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-3xl border border-white/40 overflow-hidden shadow-2xl shadow-blue-500/20 group-hover:shadow-3xl group-hover:shadow-blue-500/30 transition-all duration-500 backdrop-blur-sm bg-white/10">
                        <Image
                          src={parentImage?.preview || ''}
                          alt={t('home.results.parentLabel')}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 연결 요소 - DNA 스타일 */}
                  <div className="flex flex-col items-center justify-center px-6">
                    <div className="relative flex flex-col items-center space-y-2">
                      <div className="w-1 h-8 bg-gradient-to-b from-blue-400/60 to-purple-400/60 rounded-full"></div>
                      <div className="w-8 h-8 flex items-center justify-center text-2xl bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                        ✨
                      </div>
                      <div className="w-1 h-8 bg-gradient-to-b from-purple-400/60 to-pink-400/60 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* 자녀 사진 - 모던 디자인 */}
                  <div className="group text-center">
                    <div className="mb-6">
                      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full border border-purple-200/30 backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="text-sm font-semibold text-purple-700">{t('home.results.childLabel')}</span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-3xl blur-xl transform group-hover:scale-110 transition-transform duration-500"></div>
                      <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-3xl border border-white/40 overflow-hidden shadow-2xl shadow-purple-500/20 group-hover:shadow-3xl group-hover:shadow-purple-500/30 transition-all duration-500 backdrop-blur-sm bg-white/10">
                        <Image
                          src={childImage?.preview || ''}
                          alt={t('home.results.childLabel')}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Modern Similarity Results */}
                <div className="relative overflow-hidden bg-gradient-to-br from-white/90 via-blue-50/30 to-purple-50/20 backdrop-blur-sm rounded-3xl border border-white/40 shadow-xl p-6 md:p-8 mb-6">
                  {/* 장식 요소 */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full blur-xl"></div>
                  
                  <div className="relative z-10">
                    <SimilarityGauge 
                      percentage={familyMessage.displayPercent} 
                      isAnimating={true}
                    />
                  </div>
                </div>
              </div>
              
              {/* Modern Action Buttons */}
              <div className="relative z-10 bg-gradient-to-r from-white/80 via-blue-50/40 to-purple-50/30 backdrop-blur-sm border-t border-white/20">
                <div className="flex flex-wrap justify-center gap-3 p-6">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-6 py-3 bg-white/60 hover:bg-white/80 backdrop-blur-sm text-gray-700 font-medium rounded-xl border border-white/40 hover:border-gray-200/60 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {t('home.results.tryAgain')}
                  </button>
                  <button
                    onClick={handleDownloadResult}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/90 to-emerald-500/90 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {t('home.results.downloadImage')}
                  </button>
                  <button
                    onClick={handleShareResult}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/90 to-purple-500/90 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    {t('home.results.shareResult')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 더 많은 분석 CTA - 분석 컴포넌트 바로 아래 */}
          <div className="text-center mt-12 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('home.cta.moreAnalysis')}
              </h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                <span dangerouslySetInnerHTML={{ __html: t('home.cta.moreFeatures') }} />
              </p>
              <Link
                href="/analyze"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {t('home.cta.viewMore')}
              </Link>
            </div>
          </div>

          {/* Feature Cards - 결과가 없을 때만 표시 */}
          {!familyResult && (
            <>
              <div className="grid md:grid-cols-3 gap-6 mt-16">
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">{t('home.features.aiAnalysis.title')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('home.features.aiAnalysis.description')}
                  </p>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">{t('home.features.multipleMode.title')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('home.features.multipleMode.description')}
                  </p>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">{t('home.features.privacy.title')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('home.features.privacy.description')}
                  </p>
                </div>
              </div>

              {/* Bottom CTA - 개발자 소개 */}
              <div className="text-center mt-16 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {t('home.devCta.title')}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {t('home.devCta.description')}
                  </p>
                  <Link
                    href="/about"
                    className="px-6 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium border border-gray-200"
                  >
                    {t('home.devCta.link')}
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}