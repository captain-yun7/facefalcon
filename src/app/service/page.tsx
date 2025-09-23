import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnalysisCTA from '@/components/AnalysisCTA';

export const metadata = {
  title: '서비스 소개 | Who\'s Your Papa?',
  description: 'AI 얼굴 인식 기술을 활용한 가족 닮음 분석 서비스의 작동 원리와 기술적 특징을 소개합니다.',
};

export default function ServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 섹션 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI 기술로 분석하는
              <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent block mt-2">
                얼굴 유사도 분석 서비스
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              최신 얼굴 인식 AI 기술을 통해 두 사람의 얼굴 유사도를 정확하게 분석하고 
              객관적인 수치로 제공하는 혁신적인 서비스입니다.
            </p>
          </div>

          {/* 기술 소개 섹션 */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">AI 얼굴 인식 기술</h2>
              </div>
              <p className="text-gray-700 mb-4">
                InsightFace의 최신 Buffalo 모델을 활용하여 얼굴의 주요 특징점을 
                정밀하게 추출하고 분석합니다.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• 68개 핵심 얼굴 랜드마크 검출</li>
                <li>• 고차원 얼굴 임베딩 벡터 생성</li>
                <li>• 3D 얼굴 구조 분석 지원</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">정확한 유사도 계산</h2>
              </div>
              <p className="text-gray-700 mb-4">
                추출된 얼굴 임베딩 벡터를 비교하여 두 얼굴 간의 
                유사도를 수치적으로 계산합니다.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• 벡터 거리 기반 정확한 유사도 측정</li>
                <li>• 연령 차이를 고려한 보정 알고리즘</li>
                <li>• 신뢰도 점수와 함께 결과 제공</li>
              </ul>
            </div>
          </div>

          {/* 작동 원리 섹션 */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">서비스 작동 원리</h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">이미지 업로드</h3>
                <p className="text-sm text-gray-600">
                  부모와 자녀의 정면 사진을 각각 업로드합니다.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI 분석</h3>
                <p className="text-sm text-gray-600">
                  InsightFace AI가 얼굴을 감지하고 특징을 추출합니다.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-yellow-600">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">유사도 계산</h3>
                <p className="text-sm text-gray-600">
                  얼굴 임베딩 벡터를 비교하여 유사도를 계산합니다.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">4</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">결과 제공</h3>
                <p className="text-sm text-gray-600">
                  종합 유사도와 신뢰도 점수를 함께 제공합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 기술적 특징 섹션 */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">프라이버시 보호</h3>
              <p className="text-gray-700">
                업로드된 이미지는 분석 완료 즉시 자동 삭제되며, 
                어떠한 형태로도 저장되지 않습니다.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">빠른 처리</h3>
              <p className="text-gray-700">
                최적화된 InsightFace 모델로 빠르게 
                분석 결과를 제공합니다.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">높은 정확도</h3>
              <p className="text-gray-700">
                대규모 데이터로 훈련된 InsightFace 모델이 
                높은 정확도의 분석 결과를 제공합니다.
              </p>
            </div>
          </div>

          {/* CTA 섹션 */}
          <AnalysisCTA variant="gradient" />
        </div>
      </div>

      <Footer />
    </div>
  );
}