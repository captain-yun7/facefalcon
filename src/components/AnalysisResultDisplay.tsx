'use client';

import Image from 'next/image';
import SimilarityGauge from './SimilarityGauge';
import { PythonFamilySimilarityData } from '@/lib/python-api/client';

interface AnalysisResultDisplayProps {
  parentImage: { preview: string };
  childImage: { preview: string };
  familyResult: PythonFamilySimilarityData;
  displayPercent: number;
  locale: 'ko' | 'en';
  displayMode: 'web' | 'download';
  showActions?: boolean;
  onDownload?: () => void;
  onShare?: () => void;
  onReset?: () => void;
  className?: string;
}

export default function AnalysisResultDisplay({
  parentImage,
  childImage,
  familyResult,
  displayPercent,
  locale = 'ko',
  displayMode = 'web',
  showActions = true,
  onDownload,
  onShare,
  onReset,
  className = ''
}: AnalysisResultDisplayProps) {
  const isEnglish = locale === 'en';
  const isWebMode = displayMode === 'web';

  // 레이아웃 클래스 결정
  const photoGridLayoutClass = isWebMode 
    ? "grid md:grid-cols-2 gap-6 md:gap-8 mb-6"
    : "grid grid-cols-2 gap-8 mb-6";

  // 이미지 크기 클래스 결정 - 업로드 때와 동일한 크기로 설정 
  const imageContainerClass = "relative aspect-square w-full rounded-xl border border-gray-200 overflow-hidden shadow-lg";

  // 라벨 패딩 클래스
  const labelPadding = "px-3 py-2";
  const labelMargin = "mb-4";

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-white via-blue-50/20 to-purple-50/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-2xl shadow-blue-500/10 hover:shadow-3xl hover:shadow-blue-500/20 transition-shadow duration-500 animate-fade-in ${className}`}>
      {/* 글래스모피즘 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/40 to-transparent"></div>
      
      {/* 데코레이티브 요소들 */}
      <div className="absolute top-8 right-8 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-8 left-8 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-2xl opacity-40"></div>
      
      {/* Clean Modern Header */}
      <div className="relative z-20 text-center p-8 border-b border-white/20 backdrop-blur-sm">
        <div className="mb-6">
          <span className="px-6 py-3 bg-gradient-to-r from-blue-500/15 to-purple-500/15 text-blue-700 text-sm font-semibold rounded-full border border-blue-200/40 backdrop-blur-sm inline-block">
            {isEnglish ? 'AI Analysis Complete' : 'AI 분석 완료'}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 mb-4 leading-tight">
          {isEnglish ? 'Paternity Analysis' : '친자 확인 분석'}
        </h2>
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">FaceFalcon {isEnglish ? 'Analysis Result' : '분석 결과'}</span>
          </div>
          {familyResult && familyResult.confidence && (
            <div className="text-sm text-gray-500">
              {isEnglish ? 'Confidence' : '신뢰도'}: {(familyResult.confidence * 100).toFixed(1)}%
            </div>
          )}
        </div>
      </div>
      
      {/* Ultra Modern Photo Grid */}
      <div className={`relative z-20 ${isWebMode ? 'p-4 md:p-10' : 'p-6 md:p-10'}`}>
        <div className={photoGridLayoutClass}>
          {/* 부모 사진 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {isEnglish ? 'Parent Photo' : '부모 사진'}
              </h3>
            </div>
            <div className={imageContainerClass}>
              <Image
                src={parentImage.preview}
                alt={isEnglish ? 'Parent' : '부모'}
                fill
                className="object-contain bg-gray-50"
              />
            </div>
          </div>

          {/* 자녀 사진 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">2</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {isEnglish ? 'Child Photo' : '자녀 사진'}
              </h3>
            </div>
            <div className={imageContainerClass}>
              <Image
                src={childImage.preview}
                alt={isEnglish ? 'Child' : '자녀'}
                fill
                className="object-contain bg-gray-50"
              />
            </div>
          </div>
        </div>
        
        {/* Ultra Modern Similarity Result */}
        <div className="relative bg-gradient-to-br from-white/80 to-blue-50/50 rounded-2xl p-6 mb-4 border border-white/60 shadow-xl shadow-blue-500/10 backdrop-blur-sm">
          <SimilarityGauge 
            percentage={displayPercent} 
            isAnimating={true}
          />
        </div>

        {/* 다운로드용 워터마크 */}
        {!isWebMode && (
          <div className="text-center text-gray-500 text-sm">
            <div>facefalcon.com</div>
            <div className="mt-1">{new Date().toLocaleDateString(isEnglish ? 'en-US' : 'ko-KR')}</div>
          </div>
        )}
      </div>
      
      {/* Modern Actions Bar */}
      {isWebMode && showActions && (
        <div className="relative z-20 p-4 bg-gradient-to-r from-white/90 via-blue-50/50 to-purple-50/40 backdrop-blur-sm rounded-b-[2rem]">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {/* 다시 분석 버튼 */}
            {onReset && (
              <button
                onClick={onReset}
                className="group relative px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-slate-500 to-slate-600 text-white font-semibold rounded-2xl shadow-lg shadow-slate-500/20 hover:shadow-xl hover:shadow-slate-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 overflow-hidden"
                title={isEnglish ? 'Try Again' : '다시 분석하기'}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="relative z-10 w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="relative z-10 text-sm hidden sm:inline">{isEnglish ? 'Try Again' : '다시 분석하기'}</span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
            )}

            {/* 다운로드 버튼 */}
            {onDownload && (
              <button
                onClick={onDownload}
                className="group relative px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 overflow-hidden"
                title={isEnglish ? 'Download Image' : '이미지 다운로드'}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="relative z-10 w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="relative z-10 text-sm hidden sm:inline">{isEnglish ? 'Download Image' : '이미지 다운로드'}</span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
            )}

            {/* 공유 버튼 */}
            {onShare && (
              <button
                onClick={onShare}
                className="group relative px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 overflow-hidden"
                title={isEnglish ? 'Share Result' : '결과 공유하기'}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="relative z-10 w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="relative z-10 text-sm hidden sm:inline">{isEnglish ? 'Share Result' : '결과 공유하기'}</span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}