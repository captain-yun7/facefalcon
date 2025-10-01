'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ImageUploader from '@/components/ImageUploader';
import Navbar from '@/components/Navbar';
import SimilarityGauge from '@/components/SimilarityGauge';
import AdBanner from '@/components/AdBanner';
import AnalyzingAdScreen from '@/components/AnalyzingAdScreen';
import AnalysisResultDisplay from '@/components/AnalysisResultDisplay';
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
        displayPercent: familyMessage.displayPercent,
        locale
      };

      const imageDataUrl = await generateResultImage(resultData);
      downloadImage(imageDataUrl, undefined, locale);
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
        displayPercent: familyMessage.displayPercent,
        locale
      };

      const imageDataUrl = await generateResultImage(resultData);
      const shared = await shareResultImage(imageDataUrl, familyMessage.displayPercent, locale);
      
      if (!shared) {
        // Web Share API 미지원 시 폴백: 클립보드에 텍스트 복사
        const shareText = t('share.resultText', { percent: familyMessage.displayPercent });
        const copied = await copyToClipboard(shareText, locale);
        
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
      
      {/* Service Introduction */}
      <div className="container mx-auto px-4 pt-16 pb-24">
        <div className="relative py-16 px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-8 leading-tight break-keep">
            AI 얼굴 분석 서비스
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium mb-4 break-keep">
            얼굴 닮은꼴 테스트부터 나이 맞히기, 에겐/테토 분석까지
          </p>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto break-keep">
            사진만 올리면 AI가 분석해드립니다
          </p>
        </div>

        {/* Service Features Cards */}
        <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-3 gap-6 px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 break-keep">100% 무료 서비스</h3>
            <p className="text-sm text-gray-600 break-keep">유료 결제 없음, 과금 유도 없음<br/>모든 기능을 완전 무료로 이용하세요</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 break-keep">개인정보 보호</h3>
            <p className="text-sm text-gray-600 break-keep">개인정보 저장 안함<br/>회원가입 없이 바로 이용 가능</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 break-keep">사진 즉시 삭제</h3>
            <p className="text-sm text-gray-600 break-keep">분석 후 사진 자동 삭제<br/>어떤 이미지도 저장하지 않습니다</p>
          </div>
        </div>
      </div>

      {/* Hero Section - 대표 서비스 */}
      <div className="container mx-auto px-4 pb-8">
        <div className="text-center mb-12">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold rounded-full shadow-lg mb-4">
              {t('home.hero.title')}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 leading-tight relative inline-block pb-4">
            {t('home.hero.subtitle')}
            <svg className="absolute bottom-0 left-0 w-full h-2" viewBox="0 0 400 8" preserveAspectRatio="none">
              <defs>
                <linearGradient id="wavy-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              <path d="M0,4 Q50,1 100,4 T200,4 Q250,1 300,4 T400,4" stroke="url(#wavy-gradient)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            </svg>
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

          {/* Family Results Section - Using Common Component */}
          {familyResult && familyMessage && parentImage && childImage && (
            <AnalysisResultDisplay
              parentImage={parentImage}
              childImage={childImage}
              familyResult={familyResult}
              displayPercent={familyMessage.displayPercent}
              locale={locale}
              displayMode="web"
              showActions={true}
              onDownload={handleDownloadResult}
              onShare={handleShareResult}
              onReset={handleReset}
              className="mb-12"
            />
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
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 break-keep">{t('home.features.aiAnalysis.title')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed break-keep">
                    {t('home.features.aiAnalysis.description')}
                  </p>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 break-keep">{t('home.features.multipleMode.title')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed break-keep">
                    {t('home.features.multipleMode.description')}
                  </p>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 break-keep">{t('home.features.privacy.title')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed break-keep">
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