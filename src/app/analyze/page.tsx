'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ImageUploader from '@/components/ImageUploader';
import Navbar from '@/components/Navbar';
import SimilarityGauge from '@/components/SimilarityGauge';
import AnalyzingAdScreen from '@/components/AnalyzingAdScreen';
import Footer from '@/components/Footer';
import { UploadedImage, SimilarityResult } from '@/lib/types';
import { PythonFamilySimilarityData } from '@/lib/python-api/client';
import { getFamilySimilarityMessage } from '@/lib/utils/family-messages';
import { generateResultImage, downloadImage, shareResultImage, copyToClipboard, ResultImageData } from '@/lib/utils/image-generator';
import { analytics } from '@/components/GoogleAnalytics';
import { useTranslations } from '@/lib/simple-i18n';

type AnalysisType = 'parent-child' | 'who-most-similar' | '';

export default function AnalyzePage() {
  const { t, locale } = useTranslations();
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisType>('parent-child');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
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

  const handleAnalysisChange = (value: AnalysisType) => {
    // Track analysis type change
    if (selectedAnalysis !== value) {
      analytics.trackAnalysisTypeChange(selectedAnalysis, value);
    }
    
    setSelectedAnalysis(value);
    setIsDropdownOpen(false);
    handleReset();
  };

  const analysisOptions = [
    {
      value: 'parent-child' as AnalysisType,
      title: t('analysisSelector.parentChild.title'),
      description: t('analysisSelector.parentChild.description'),
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      ),
      color: 'blue'
    },
    {
      value: 'who-most-similar' as AnalysisType,
      title: t('analysisSelector.whoMostSimilar.title'),
      description: t('analysisSelector.whoMostSimilar.description'),
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      ),
      color: 'green'
    },
    {
      value: '' as AnalysisType,
      title: t('analysisSelector.celebrity.title'),
      description: t('analysisSelector.celebrity.description'),
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5C14.8 4.1 13.6 3 12 3C10.4 3 9.2 4.1 9 5.5L3 7V9L9 7.5V10.5C9 12.4 9.6 14.1 10.6 15.4L9 16V18H11V16.5C11.3 16.8 11.6 17 12 17C12.4 17 12.7 16.8 13 16.5V18H15V16L13.4 15.4C14.4 14.1 15 12.4 15 10.5V7.5L21 9Z"/>
        </svg>
      ),
      color: 'gray',
      disabled: true
    }
  ];

  const selectedOption = analysisOptions.find(opt => opt.value === selectedAnalysis);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFamilyAnalyze = async () => {
    if (!parentImage?.base64 || !childImage?.base64) return;

    console.log('🚀 Family analysis started');
    const startTime = Date.now();
    
    // Track analysis start
    analytics.trackAnalysisStart('parent-child');
    
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
      
      // Track successful analysis
      const processingTime = Date.now() - startTime;
      analytics.trackAnalysisComplete(
        'parent-child',
        data.data?.similarity,
        data.data?.confidence ? data.data.confidence * 100 : undefined,
        processingTime
      );
    } catch (err) {
      console.error('❌ Error occurred:', err);
      setPendingAnalysisError(err);
      
      // Track analysis error
      const errorMessage = err instanceof Error ? err.message : t('errors.analysisFailure');
      analytics.trackAnalysisError('parent-child', 'api_error', errorMessage);
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

    console.log('🎨 Download function - current locale:', locale);
    console.log('🎨 useTranslations hook - locale:', locale);
    
    try {
      const resultData: ResultImageData = {
        parentImageUrl: parentImage.preview,
        childImageUrl: childImage.preview,
        similarity: familyResult.similarity,
        confidence: familyResult.confidence * 100,
        displayPercent: familyMessage.displayPercent,
        locale
      };

      console.log('🎨 ResultImageData:', resultData);
      console.log('🎨 About to call generateResultImage with locale:', resultData.locale);
      const imageDataUrl = await generateResultImage(resultData);
      console.log('🎨 About to call downloadImage with locale:', locale);
      downloadImage(imageDataUrl, undefined, locale);
      
      // Track result download
      analytics.trackResultShare('download', 'parent-child');
    } catch (error) {
      console.error('Image generation failed:', error);
      alert(t('errors.imageGenerationFailed'));
    }
  };

  const handleShareResult = async () => {
    if (!familyResult || !parentImage || !childImage || !familyMessage) {
      return;
    }

    console.log('📤 Share function - current locale:', locale);

    try {
      const resultData: ResultImageData = {
        parentImageUrl: parentImage.preview,
        childImageUrl: childImage.preview,
        similarity: familyResult.similarity,
        confidence: familyResult.confidence * 100,
        displayPercent: familyMessage.displayPercent,
        locale
      };

      console.log('📤 ResultImageData locale:', resultData.locale);
      const imageDataUrl = await generateResultImage(resultData);
      const shared = await shareResultImage(imageDataUrl, familyMessage.displayPercent, locale);
      
      if (!shared) {
        // Web Share API 미지원 시 폴백: 클립보드에 텍스트 복사
        const shareText = t('share.resultText', { percent: familyMessage.displayPercent });
        const copied = await copyToClipboard(shareText, locale);
        
        if (copied) {
          alert(t('share.clipboardCopied'));
          analytics.trackResultShare('clipboard', 'parent-child');
        } else {
          alert(t('share.shareNotSupported'));
        }
      } else {
        analytics.trackResultShare('web_share', 'parent-child');
      }
    } catch (error) {
      console.error('Share failed:', error);
      alert(t('errors.shareFailed'));
    }
  };

  const handleComparisonAnalyze = async () => {
    console.log('🔍 Comparison analysis started');
    console.log('Target child image:', targetChildImage ? 'available' : 'missing');
    console.log('Candidate count:', candidateImages.length);
    
    if (!targetChildImage?.base64 || candidateImages.length < 2) {
      console.log('❌ Conditions not met - target image:', !!targetChildImage?.base64, 'candidate count:', candidateImages.length);
      return;
    }

    const startTime = Date.now();
    
    // Track analysis start
    analytics.trackAnalysisStart('who-most-similar');

    setIsAnalyzing(true);
    setError("");
    setPendingAnalysisResult(null);
    setPendingAnalysisError(null);

    try {
      const targetImages = candidateImages.map(img => img.base64!);
      console.log('📤 API request prepared - candidate images count:', targetImages.length);
      
      // 이미지 데이터 유효성 검사
      console.log('🔍 Image data validation:');
      const sourceSize = targetChildImage.base64?.length || 0;
      const targetSizes = targetImages.map((img, i) => ({ index: i, size: img?.length || 0 }));
      
      console.log('- Target child image size:', sourceSize);
      console.log('- Candidate images sizes:', targetSizes);
      
      // 이미지 크기 제한 확인 (5MB = 약 6.7MB base64)
      const MAX_IMAGE_SIZE = 6700000; // base64로 인코딩하면 약 33% 증가
      const MAX_TOTAL_SIZE = 20000000; // 전체 요청 크기 제한
      
      if (sourceSize > MAX_IMAGE_SIZE) {
        throw new Error('Target child image is too large. Please use an image under 5MB.');
      }
      
      for (const { index, size } of targetSizes) {
        if (size > MAX_IMAGE_SIZE) {
          throw new Error(`Candidate ${index + 1} image is too large. Please use an image under 5MB.`);
        }
      }
      
      const totalSize = sourceSize + targetSizes.reduce((sum, img) => sum + img.size, 0);
      console.log('📊 Total request size:', totalSize, 'bytes (', Math.round(totalSize / 1024 / 1024 * 100) / 100, 'MB)');
      
      if (totalSize > MAX_TOTAL_SIZE) {
        throw new Error('Total image size is too large. Please reduce image sizes or candidate count.');
      }
      
      // base64 헤더 확인
      const sourceHasHeader = targetChildImage.base64?.startsWith('data:');
      const targetHasHeaders = targetImages.map(img => img?.startsWith('data:'));
      console.log('- Target image data URI header:', sourceHasHeader);
      console.log('- Candidate images data URI headers:', targetHasHeaders);
      
      const requestData = {
        childImage: targetChildImage.base64,
        parentImages: targetImages,
        useFamilyAnalysis: false, // 기본 분석 사용
      };
      
      console.log('🌐 API call started: /api/family/find-parent (Python backend)');
      console.log('📦 Request data size:', JSON.stringify(requestData).length, 'bytes');
      
      let response;
      try {
        response = await fetch('/api/family/find-parent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        console.log('📡 Response status:', response.status, response.statusText);
      } catch (networkError) {
        console.error('🌐 Network error:', networkError);
        throw new Error(`Network connection failed: ${networkError instanceof Error ? networkError.message : String(networkError)}`);
      }

      let data;
      try {
        const responseText = await response.text();
        console.log('📄 Response text length:', responseText.length);
        console.log('📄 Response text start:', responseText.substring(0, 200));
        
        if (!responseText.trim()) {
          throw new Error('Received empty response from server.');
        }
        
        data = JSON.parse(responseText);
        console.log('📋 Parsed response data:', data);
      } catch (parseError) {
        console.error('📋 JSON parsing error:', parseError);
        if (response.status >= 500) {
          throw new Error('Server internal error occurred. Please try again later.');
        } else if (response.status === 413) {
          throw new Error('Uploaded images are too large. Please use smaller images.');
        } else if (response.status === 404) {
          throw new Error('Analysis service not found. Please refresh the page.');
        } else {
          throw new Error(`Server response error (${response.status}): Please try again later.`);
        }
      }

      if (!data.success) {
        console.log('❌ API error:', data.error);
        throw new Error(data.error || 'Analysis failed');
      }

      const matches = data.data?.matches || [];
      console.log('✅ Match results:', matches.length, 'items');
      console.log('Match details:', matches);
      
      // 결과가 없는 경우에만 에러 표시
      if (matches.length === 0) {
        const errorMsg = t('errors.noFacesDetected');
        setPendingAnalysisError(new Error(errorMsg));
        analytics.trackAnalysisError('who-most-similar', 'no_faces_detected', errorMsg);
      } else {
        // 0% 유사도도 정상적인 결과로 처리 (얼굴은 감지되었지만 닮지 않은 경우)
        console.log('✅ Valid match results confirmed:', matches.map((m: any) => ({ index: m.imageIndex, similarity: m.similarity })));
        setPendingAnalysisResult(matches);
        
        // Track successful analysis
        const processingTime = Date.now() - startTime;
        const bestMatch = matches[0];
        analytics.trackAnalysisComplete(
          'who-most-similar',
          bestMatch?.similarity,
          bestMatch?.faceDetails?.confidence ? bestMatch.faceDetails.confidence * 100 : undefined,
          processingTime
        );
      }
    } catch (err) {
      console.error('❌ Comparison analysis error:', err);
      setPendingAnalysisError(err);
      
      // Track analysis error
      const errorMessage = err instanceof Error ? err.message : t('errors.analysisFailure');
      analytics.trackAnalysisError('who-most-similar', 'api_error', errorMessage);
    }

    // 광고 화면 표시
    setShowAdScreen(true);
  };

  const handleComparisonAdComplete = () => {
    setShowAdScreen(false);
    setIsAnalyzing(false);
    
    if (pendingAnalysisError) {
      setError(pendingAnalysisError instanceof Error ? pendingAnalysisError.message : t('errors.analysisFailure'));
    } else if (pendingAnalysisResult) {
      setComparisonResults(pendingAnalysisResult);
      setShowComparisonResults(true);
      console.log('🎯 Results display completed');
    }
    
    console.log('🏁 Comparison analysis completed');
  };

  const handleAddCandidate = (image: UploadedImage) => {
    console.log('👥 Adding candidate:', {
      currentCount: candidateImages.length,
      maxCount: 6,
      imageValid: !!image.base64
    });
    if (candidateImages.length < 6) {
      setCandidateImages(prev => [...prev, image]);
      analytics.trackImageUpload('candidate', image.file.size, image.file.type);
      console.log('✅ Candidate added successfully, total', candidateImages.length + 1, 'people');
    } else {
      console.log('❌ Maximum candidate count exceeded');
    }
  };

  const handleRemoveCandidate = (index: number) => {
    console.log('🗑️ Removing candidate:', index, 'th');
    setCandidateImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      console.log('✅ Candidate removed successfully, remaining count:', updated.length);
      return updated;
    });
  };

  const handleReset = () => {
    setParentImage(null);
    setChildImage(null);
    setFamilyResult(null);
    setTargetChildImage(null);
    setCandidateImages([]);
    setComparisonResults([]);
    setShowComparisonResults(false);
    setError("");
  };

  // 연령 정보 추출 (Python API에서 제공하는 경우)
  const parentAge = familyResult?.parent_face?.age;
  const childAge = familyResult?.child_face?.age;
  
  // 스마트 점수 보정 시스템 적용 (연령 정보 포함)
  const familyMessage = familyResult ? getFamilySimilarityMessage(familyResult.similarity, parentAge, childAge) : null;
  const displayConfidence = familyResult ? (familyResult.confidence * 100).toFixed(1) : "0";
  
  // Comparison mode data
  const bestMatch = comparisonResults.length > 0 ? comparisonResults[0] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-gray-900 relative inline-block pb-4">
              {t('hero.title')}
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
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Analysis Type Selector */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('analysisSelector.title')}
              </h2>
              <p className="text-gray-600">
                {t('analysisSelector.subtitle')}
              </p>
            </div>
            
            {/* Custom Dropdown */}
            <div ref={dropdownRef} className="relative max-w-2xl mx-auto">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full p-4 border-2 border-gray-300 rounded-xl text-left bg-white hover:border-blue-400 focus:border-blue-500 focus:outline-none transition-colors"
              >
                <div className="flex items-center justify-between">
                  {selectedOption ? (
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center
                        ${selectedOption.color === 'blue' ? 'bg-blue-500 text-white' : 
                          selectedOption.color === 'green' ? 'bg-green-500 text-white' : 
                          'bg-gray-200 text-gray-600'}
                      `}>
                        {selectedOption.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{selectedOption.title}</div>
                        <div className="text-sm text-gray-600">{selectedOption.description}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 font-medium">{t('analysisSelector.placeholder')}</div>
                  )}
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Dropdown Options */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                  {analysisOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !option.disabled && handleAnalysisChange(option.value)}
                      disabled={option.disabled}
                      className={`
                        w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0
                        ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        ${selectedAnalysis === option.value ? 'bg-blue-50' : ''}
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                          ${option.color === 'blue' ? 'bg-blue-500 text-white' : 
                            option.color === 'green' ? 'bg-green-500 text-white' : 
                            'bg-gray-200 text-gray-600'}
                        `}>
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 mb-1">{option.title}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                        {option.disabled && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                            {t('analysisSelector.celebrity.status')}
                          </span>
                        )}
                        {selectedAnalysis === option.value && !option.disabled && (
                          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Analysis Content */}
          {selectedAnalysis === 'parent-child' && (
            <>
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
                          {t('pages.analyze.parentPhoto')}
                        </h3>
                      </div>
                      <ImageUploader
                        onImageUpload={(image) => {
                          setParentImage(image);
                          analytics.trackImageUpload('parent', image.file.size, image.file.type);
                        }}
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
                          {t('pages.analyze.childPhoto')}
                        </h3>
                      </div>
                      <ImageUploader
                        onImageUpload={(image) => {
                          setChildImage(image);
                          analytics.trackImageUpload('child', image.file.size, image.file.type);
                        }}
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
                          {t('pages.analyze.analyzing')}
                        </span>
                      ) : (
                        t('pages.analyze.startAnalysis')
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* 광고 화면 */}
              {!familyResult && showAdScreen && (
                <div className="mb-8">
                  <AnalyzingAdScreen onComplete={handleAdComplete} />
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
                      {selectedOption?.title || t('analysisSelector.parentChild.title')}
                    </h2>
                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Whos your papa AI {locale === 'en' ? 'Analysis Result' : '분석 결과'}</span>
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
                            <span className="text-sm font-semibold text-blue-700">{t('pages.analyze.parent')}</span>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl transform group-hover:scale-110 transition-transform duration-500"></div>
                          <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-3xl border border-white/40 overflow-hidden shadow-2xl shadow-blue-500/20 group-hover:shadow-3xl group-hover:shadow-blue-500/30 transition-all duration-500 backdrop-blur-sm bg-white/10">
                            <Image
                              src={parentImage?.preview || ''}
                              alt={t('pages.analyze.parent')}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 연결 요소 - 하트 */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-4xl">
                          ❤️
                        </div>
                      </div>
                      
                      {/* 자녀 사진 - 모던 디자인 */}
                      <div className="group text-center">
                        <div className="mb-6">
                          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-full border border-purple-200/30 backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span className="text-sm font-semibold text-purple-700">{t('pages.analyze.child')}</span>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-3xl blur-xl transform group-hover:scale-110 transition-transform duration-500"></div>
                          <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-3xl border border-white/40 overflow-hidden shadow-2xl shadow-purple-500/20 group-hover:shadow-3xl group-hover:shadow-purple-500/30 transition-all duration-500 backdrop-blur-sm bg-white/10">
                            <Image
                              src={childImage?.preview || ''}
                              alt={t('pages.analyze.child')}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Ultra Modern Similarity Result */}
                    <div className="relative bg-gradient-to-br from-white/80 to-blue-50/50 rounded-2xl p-6 mb-4 border border-white/60 shadow-xl shadow-blue-500/10 backdrop-blur-sm">
                      <SimilarityGauge 
                        percentage={familyMessage.displayPercent} 
                        isAnimating={true}
                      />
                    </div>
                  </div>
                  
                  {/* Modern Actions Bar */}
                  <div className="relative z-20 p-4 bg-gradient-to-r from-white/90 via-blue-50/50 to-purple-50/40 backdrop-blur-sm rounded-b-[2rem]">
                    <div className="flex items-center justify-center gap-4">
                      {/* 다시 분석 버튼 */}
                      <button
                        onClick={handleReset}
                        className="group relative px-6 py-4 bg-gradient-to-r from-slate-500 to-slate-600 text-white font-semibold rounded-2xl shadow-lg shadow-slate-500/20 hover:shadow-xl hover:shadow-slate-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <svg className="relative z-10 w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="relative z-10 text-sm">{t('pages.analyze.tryAgainButton')}</span>
                        <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                      </button>

                      {/* 다운로드 버튼 */}
                      <button
                        onClick={handleDownloadResult}
                        className="group relative px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <svg className="relative z-10 w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="relative z-10 text-sm">{t('pages.analyze.downloadImage')}</span>
                        <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                      </button>

                      {/* 공유 버튼 */}
                      <button
                        onClick={handleShareResult}
                        className="group relative px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <svg className="relative z-10 w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        <span className="relative z-10 text-sm">{t('pages.analyze.shareResult')}</span>
                        <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {selectedAnalysis === 'who-most-similar' && (
            <>
              {!showComparisonResults && !showAdScreen && (
                <>
                  {/* Child Image Upload */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
                      {t('whoMostSimilarAnalysis.uploadChild')}
                    </h3>
                    <div className="max-w-sm mx-auto">
                      <ImageUploader
                        onImageUpload={(image) => {
                          setTargetChildImage(image);
                          analytics.trackImageUpload('child', image.file.size, image.file.type);
                        }}
                        onImageRemove={() => setTargetChildImage(null)}
                        uploadedImage={targetChildImage || undefined}
                        label={t('whoMostSimilarAnalysis.uploadChildLabel')}
                      />
                    </div>
                  </div>

                  {/* Candidate Images */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
                      {t('whoMostSimilarAnalysis.uploadCandidates')}
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
                          <p className="text-sm text-gray-600 text-center mt-2">{t('whoMostSimilarAnalysis.candidate', { number: index + 1 })}</p>
                        </div>
                      ))}
                      
                      {candidateImages.length < 6 && (
                        <div className="aspect-square">
                          <ImageUploader
                            onImageUpload={handleAddCandidate}
                            label={t('whoMostSimilarAnalysis.candidate', { number: candidateImages.length + 1 })}
                            className="h-full"
                          />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-center text-sm text-gray-600">
                      {t('whoMostSimilarAnalysis.candidateCount', { count: candidateImages.length })}
                      {candidateImages.length < 2 && t('whoMostSimilarAnalysis.candidateMinRequired')}
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
                          {t('pages.analyze.findingParent')}
                        </span>
                      ) : (
                        t('pages.analyze.startFindingParent')
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* 광고 화면 */}
              {!showComparisonResults && showAdScreen && (
                <div className="mb-8">
                  <AnalyzingAdScreen onComplete={handleComparisonAdComplete} />
                </div>
              )}

              {/* Comparison Results Section */}
              {showComparisonResults && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-full mb-4">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">{t('pages.analyze.analysisCompleted')}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {t('pages.analyze.parentFindingResult')}
                    </h2>                    
                  </div>

                  {/* 분석 대상 사진들 */}
                  <div className="mb-8">
                    <div className="flex items-center justify-center gap-6 mb-6">
                      {/* 아이 사진 */}
                      <div className="text-center">
                        <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-2">
                          <Image
                            src={targetChildImage?.preview || ''}
                            alt={t('pages.analyze.childLabel')}
                            fill
                            className="object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                          />
                        </div>
                        <span className="text-sm text-gray-600 font-medium">{t('pages.analyze.childLabel')}</span>
                      </div>

                      {/* 하트 아이콘 */}
                      <div className="flex flex-col items-center">
                        <div className="text-2xl mb-1">
                          ❤️
                        </div>
                        <span className="text-xs text-gray-500">{t('pages.analyze.similarity')}</span>
                      </div>

                      {/* 가장 닮은 사람 사진 */}
                      {bestMatch && (
                        <div className="text-center">
                          <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-2">
                            <Image
                              src={candidateImages[bestMatch.imageIndex]?.preview || ''}
                              alt={t('pages.analyze.mostSimilarPerson')}
                              fill
                              className="object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                            />
                          </div>
                          <span className="text-sm text-gray-600 font-medium">{t('pages.analyze.mostSimilarPerson')}</span>
                        </div>
                      )}
                    </div>
                  </div>


                  {/* All Results Ranking */}
                  <div className="mb-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                      {t('pages.analyze.overallRanking')}
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
                                {t('pages.analyze.rank', { rank: index + 1 })}
                              </div>
                              <div className="relative aspect-square w-32 mx-auto mb-3">
                                <Image
                                  src={candidateImage.preview}
                                  alt={`Candidate ${result.imageIndex + 1}`}
                                  fill
                                  className="object-cover rounded-lg"
                                />
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
                      {t('pages.analyze.tryAgainButton')}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-red-800 font-semibold mb-1">{t('errors.analysisError')}</h3>
                  <p className="text-red-700 text-sm leading-relaxed">{error}</p>
                  <p className="text-red-600 text-xs mt-2">
                    {t('errors.tryRefresh')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}