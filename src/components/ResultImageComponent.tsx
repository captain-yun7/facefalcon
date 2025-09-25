'use client';

import Image from 'next/image';
import SimilarityGauge from './SimilarityGauge';

interface ResultImageComponentProps {
  parentImageUrl: string;
  childImageUrl: string;
  similarity: number;
  confidence: number;
  displayPercent: number;
  locale?: 'ko' | 'en';
}

export default function ResultImageComponent({
  parentImageUrl,
  childImageUrl,
  displayPercent,
  locale = 'ko'
}: ResultImageComponentProps) {
  const isEnglish = locale === 'en';

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/20 to-purple-50/30 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-2xl shadow-blue-500/10 animate-fade-in">
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
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Who&apos;s your papa AI {isEnglish ? 'Analysis Result' : '분석 결과'}</span>
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
                <span className="text-sm font-semibold text-blue-700">{isEnglish ? 'Parent' : '부모'}</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl transform group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-3xl border border-white/40 overflow-hidden shadow-2xl shadow-blue-500/20 group-hover:shadow-3xl group-hover:shadow-blue-500/30 transition-all duration-500 backdrop-blur-sm bg-white/10">
                <Image
                  src={parentImageUrl}
                  alt={isEnglish ? 'Parent' : '부모'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
              </div>
            </div>
          </div>
          
          {/* 연결 요소 - 하트 */}
          <div className="flex flex-col items-center justify-center px-6">
            <div className="text-4xl">
              ❤️
            </div>
          </div>
          
          {/* 자녀 사진 - 모던 디자인 */}
          <div className="group text-center">
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full border border-purple-200/30 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-sm font-semibold text-purple-700">{isEnglish ? 'Child' : '자녀'}</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-3xl blur-xl transform group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-3xl border border-white/40 overflow-hidden shadow-2xl shadow-purple-500/20 group-hover:shadow-3xl group-hover:shadow-purple-500/30 transition-all duration-500 backdrop-blur-sm bg-white/10">
                <Image
                  src={childImageUrl}
                  alt={isEnglish ? 'Child' : '자녀'}
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
              percentage={displayPercent} 
              isAnimating={true}
            />
          </div>
        </div>
        
        {/* 하단 워터마크 */}
        <div className="text-center text-gray-500 text-sm">
          <div>whos-your-papa.com</div>
          <div className="mt-1">{new Date().toLocaleDateString(isEnglish ? 'en-US' : 'ko-KR')}</div>
        </div>
      </div>
    </div>
  );
}