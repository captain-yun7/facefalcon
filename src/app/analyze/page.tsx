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

type AnalysisType = 'parent-child' | 'who-most-similar' | '';

export default function AnalyzePage() {
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
      title: '부모-자녀 닮음 분석',
      description: '부모와 자녀 사진을 비교해서 닮은 정도를 분석합니다',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      ),
      color: 'blue'
    },
    {
      value: 'who-most-similar' as AnalysisType,
      title: '부모 찾기',
      description: '아이와 여러 후보자를 비교해서 가장 닮은 사람을 찾습니다',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      ),
      color: 'green'
    },
    {
      value: '' as AnalysisType,
      title: '연예인 닮은꼴',
      description: '곧 출시될 예정입니다',
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

    console.log('🚀 가족 분석 시작');
    const startTime = Date.now();
    
    // Track analysis start
    analytics.trackAnalysisStart('parent-child');
    
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
      
      // Track successful analysis
      const processingTime = Date.now() - startTime;
      analytics.trackAnalysisComplete(
        'parent-child',
        data.data?.similarity,
        data.data?.confidence ? data.data.confidence * 100 : undefined,
        processingTime
      );
    } catch (err) {
      console.error('❌ 에러 발생:', err);
      setPendingAnalysisError(err);
      
      // Track analysis error
      const errorMessage = err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.';
      analytics.trackAnalysisError('parent-child', 'api_error', errorMessage);
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
      
      // Track result download
      analytics.trackResultShare('download', 'parent-child');
    } catch (error) {
      console.error('이미지 생성 실패:', error);
      alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
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
        const shareText = `우리 아이 닮음 분석 결과: ${familyMessage.displayPercent}% 닮았네요! 😊\nwhos-your-papa.com에서 분석해보세요`;
        const copied = await copyToClipboard(shareText);
        
        if (copied) {
          alert('공유 텍스트가 클립보드에 복사되었습니다!\n메신저나 SNS에 붙여넣기 해주세요.');
          analytics.trackResultShare('clipboard', 'parent-child');
        } else {
          alert('이 브라우저에서는 직접 공유가 지원되지 않습니다.\n"이미지 다운로드" 버튼을 사용해주세요.');
        }
      } else {
        analytics.trackResultShare('web_share', 'parent-child');
      }
    } catch (error) {
      console.error('공유 실패:', error);
      alert('공유에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleComparisonAnalyze = async () => {
    console.log('🔍 비교 분석 시작');
    console.log('대상 아이 이미지:', targetChildImage ? '있음' : '없음');
    console.log('후보자 수:', candidateImages.length);
    
    if (!targetChildImage?.base64 || candidateImages.length < 2) {
      console.log('❌ 조건 미충족 - 대상 이미지:', !!targetChildImage?.base64, '후보자 수:', candidateImages.length);
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
      console.log('📤 API 요청 준비 - 후보자 이미지 수:', targetImages.length);
      
      // 이미지 데이터 유효성 검사
      console.log('🔍 이미지 데이터 검증:');
      const sourceSize = targetChildImage.base64?.length || 0;
      const targetSizes = targetImages.map((img, i) => ({ index: i, size: img?.length || 0 }));
      
      console.log('- 대상 아이 이미지 크기:', sourceSize);
      console.log('- 후보자 이미지들 크기:', targetSizes);
      
      // 이미지 크기 제한 확인 (5MB = 약 6.7MB base64)
      const MAX_IMAGE_SIZE = 6700000; // base64로 인코딩하면 약 33% 증가
      const MAX_TOTAL_SIZE = 20000000; // 전체 요청 크기 제한
      
      if (sourceSize > MAX_IMAGE_SIZE) {
        throw new Error('대상 아이 이미지가 너무 큽니다. 5MB 이하의 이미지를 사용해주세요.');
      }
      
      for (const { index, size } of targetSizes) {
        if (size > MAX_IMAGE_SIZE) {
          throw new Error(`후보자 ${index + 1}번 이미지가 너무 큽니다. 5MB 이하의 이미지를 사용해주세요.`);
        }
      }
      
      const totalSize = sourceSize + targetSizes.reduce((sum, img) => sum + img.size, 0);
      console.log('📊 전체 요청 크기:', totalSize, 'bytes (', Math.round(totalSize / 1024 / 1024 * 100) / 100, 'MB)');
      
      if (totalSize > MAX_TOTAL_SIZE) {
        throw new Error('전체 이미지 크기가 너무 큽니다. 이미지를 줄이거나 후보자 수를 줄여주세요.');
      }
      
      // base64 헤더 확인
      const sourceHasHeader = targetChildImage.base64?.startsWith('data:');
      const targetHasHeaders = targetImages.map(img => img?.startsWith('data:'));
      console.log('- 대상 이미지 data URI 헤더:', sourceHasHeader);
      console.log('- 후보자 이미지들 data URI 헤더:', targetHasHeaders);
      
      const requestData = {
        childImage: targetChildImage.base64,
        parentImages: targetImages,
        useFamilyAnalysis: false, // 기본 분석 사용
      };
      
      console.log('🌐 API 호출 시작: /api/family/find-parent (Python 백엔드)');
      console.log('📦 요청 데이터 크기:', JSON.stringify(requestData).length, 'bytes');
      
      let response;
      try {
        response = await fetch('/api/family/find-parent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        console.log('📡 응답 상태:', response.status, response.statusText);
      } catch (networkError) {
        console.error('🌐 네트워크 에러:', networkError);
        throw new Error(`네트워크 연결 실패: ${networkError instanceof Error ? networkError.message : String(networkError)}`);
      }

      let data;
      try {
        const responseText = await response.text();
        console.log('📄 응답 텍스트 길이:', responseText.length);
        console.log('📄 응답 텍스트 시작 부분:', responseText.substring(0, 200));
        
        if (!responseText.trim()) {
          throw new Error('서버에서 빈 응답을 받았습니다.');
        }
        
        data = JSON.parse(responseText);
        console.log('📋 파싱된 응답 데이터:', data);
      } catch (parseError) {
        console.error('📋 JSON 파싱 에러:', parseError);
        if (response.status >= 500) {
          throw new Error('서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else if (response.status === 413) {
          throw new Error('업로드한 이미지가 너무 큽니다. 더 작은 이미지를 사용해주세요.');
        } else if (response.status === 404) {
          throw new Error('분석 서비스를 찾을 수 없습니다. 페이지를 새로고침해주세요.');
        } else {
          throw new Error(`서버 응답 오류 (${response.status}): 잠시 후 다시 시도해주세요.`);
        }
      }

      if (!data.success) {
        console.log('❌ API 오류:', data.error);
        throw new Error(data.error || 'Analysis failed');
      }

      const matches = data.data?.matches || [];
      console.log('✅ 매치 결과:', matches.length, '개');
      console.log('매치 상세:', matches);
      
      // 결과가 없는 경우에만 에러 표시
      if (matches.length === 0) {
        const errorMsg = '분석할 수 있는 얼굴을 찾지 못했습니다. 얼굴이 선명하게 보이는 정면 사진을 사용해주세요.';
        setPendingAnalysisError(new Error(errorMsg));
        analytics.trackAnalysisError('who-most-similar', 'no_faces_detected', errorMsg);
      } else {
        // 0% 유사도도 정상적인 결과로 처리 (얼굴은 감지되었지만 닮지 않은 경우)
        console.log('✅ 유효한 매치 결과 확인:', matches.map((m: any) => ({ index: m.imageIndex, similarity: m.similarity })));
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
      console.error('❌ 비교 분석 에러:', err);
      setPendingAnalysisError(err);
      
      // Track analysis error
      const errorMessage = err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.';
      analytics.trackAnalysisError('who-most-similar', 'api_error', errorMessage);
    }

    // 광고 화면 표시
    setShowAdScreen(true);
  };

  const handleComparisonAdComplete = () => {
    setShowAdScreen(false);
    setIsAnalyzing(false);
    
    if (pendingAnalysisError) {
      setError(pendingAnalysisError instanceof Error ? pendingAnalysisError.message : '분석 중 오류가 발생했습니다.');
    } else if (pendingAnalysisResult) {
      setComparisonResults(pendingAnalysisResult);
      setShowComparisonResults(true);
      console.log('🎯 결과 화면 표시 완료');
    }
    
    console.log('🏁 비교 분석 종료');
  };

  const handleAddCandidate = (image: UploadedImage) => {
    console.log('👥 후보자 추가:', {
      현재수: candidateImages.length,
      최대수: 6,
      이미지유효: !!image.base64
    });
    if (candidateImages.length < 6) {
      setCandidateImages(prev => [...prev, image]);
      analytics.trackImageUpload('candidate', image.file.size, image.file.type);
      console.log('✅ 후보자 추가 완료, 총', candidateImages.length + 1, '명');
    } else {
      console.log('❌ 후보자 최대 수 초과');
    }
  };

  const handleRemoveCandidate = (index: number) => {
    console.log('🗑️ 후보자 제거:', index, '번째');
    setCandidateImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      console.log('✅ 후보자 제거 완료, 남은 수:', updated.length);
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              AI 얼굴 분석 도구
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              원하시는 분석 유형을 선택하고 바로 시작해보세요
            </p>
          </div>

          {/* Analysis Type Selector */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                어떤 분석을 원하시나요?
              </h2>
              <p className="text-gray-600">
                원하는 분석 유형을 선택해주세요
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
                    <div className="text-gray-500 font-medium">분석 유형을 선택하세요</div>
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
                            준비중
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
                          부모 사진
                        </h3>
                      </div>
                      <ImageUploader
                        onImageUpload={(image) => {
                          setParentImage(image);
                          analytics.trackImageUpload('parent', image.file.size, image.file.type);
                        }}
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
                        onImageUpload={(image) => {
                          setChildImage(image);
                          analytics.trackImageUpload('child', image.file.size, image.file.type);
                        }}
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

              {/* 광고 화면 */}
              {!familyResult && showAdScreen && (
                <div className="mb-8">
                  <AnalyzingAdScreen onComplete={handleAdComplete} />
                </div>
              )}

              {/* Family Results Section */}
              {familyResult && familyMessage && (
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
                      onClick={handleDownloadResult}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      이미지 다운로드
                    </button>
                    <button
                      onClick={handleShareResult}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      결과 공유하기
                    </button>
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
                      아이 사진을 업로드하세요
                    </h3>
                    <div className="max-w-sm mx-auto">
                      <ImageUploader
                        onImageUpload={(image) => {
                          setTargetChildImage(image);
                          analytics.trackImageUpload('child', image.file.size, image.file.type);
                        }}
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
                      <span className="font-medium">분석 완료</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      부모 찾기 분석 결과
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
                            alt="아이"
                            fill
                            className="object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                          />
                        </div>
                        <span className="text-sm text-gray-600 font-medium">아이</span>
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

                      {/* 가장 닮은 사람 사진 */}
                      {bestMatch && (
                        <div className="text-center">
                          <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-2">
                            <Image
                              src={candidateImages[bestMatch.imageIndex]?.preview || ''}
                              alt="가장 닮은 사람"
                              fill
                              className="object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                            />
                          </div>
                          <span className="text-sm text-gray-600 font-medium">가장 닮은 사람</span>
                        </div>
                      )}
                    </div>
                  </div>


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
                      다시 분석하기
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
                  <h3 className="text-red-800 font-semibold mb-1">분석 오류</h3>
                  <p className="text-red-700 text-sm leading-relaxed">{error}</p>
                  <p className="text-red-600 text-xs mt-2">
                    문제가 계속되면 페이지를 새로고침하거나 이미지를 다시 업로드해보세요.
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