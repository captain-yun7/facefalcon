import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: '이용 가이드 | Who\'s Your Papa?',
  description: 'AI 가족 닮음 분석 서비스 사용법과 최적의 결과를 얻는 방법, 자주 묻는 질문들을 안내합니다.',
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 섹션 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              이용 가이드
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Who's Your Papa? 서비스를 효과적으로 이용하는 방법과 
              정확한 분석 결과를 얻는 팁을 알려드립니다.
            </p>
          </div>

          {/* 빠른 시작 가이드 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              빠른 시작 가이드
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">1단계: 사진 준비</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>정면 사진:</strong> 얼굴이 정면을 향한 사진을 준비하세요</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>고화질:</strong> 최소 200x200 픽셀 이상의 선명한 사진</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>밝은 조명:</strong> 얼굴이 잘 보이는 밝은 환경에서 촬영</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">2단계: 분석 실행</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>부모 사진을 첫 번째 영역에 업로드</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>자녀 사진을 두 번째 영역에 업로드</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>"분석 시작" 버튼을 클릭하고 5초간 대기</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 최적의 사진 촬영 팁 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              최적의 사진 촬영 팁
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">✅ 좋은 사진의 조건</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• 정면을 바라보는 자연스러운 표정</li>
                    <li>• 머리카락이 얼굴을 가리지 않는 상태</li>
                    <li>• 선글라스나 모자 없이 촬영</li>
                    <li>• 자연광 또는 밝은 실내조명</li>
                    <li>• 단색 배경 (흰색, 회색 권장)</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">❌ 피해야 할 사진</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• 측면이나 비스듬한 각도</li>
                    <li>• 너무 어둡거나 역광인 상태</li>
                    <li>• 얼굴이 너무 작거나 흐릿한 사진</li>
                    <li>• 여러 명이 함께 있는 사진</li>
                    <li>• 과도한 화장이나 필터 적용</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 분석 결과 이해하기 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              분석 결과 이해하기
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">종합 유사도 점수</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
                    <div className="text-2xl font-bold text-red-600 mb-1">0-30%</div>
                    <div className="text-sm text-red-700">유사도 낮음</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-200">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">31-70%</div>
                    <div className="text-sm text-yellow-700">보통 유사도</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                    <div className="text-2xl font-bold text-green-600 mb-1">71-100%</div>
                    <div className="text-sm text-green-700">높은 유사도</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">부위별 분석</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium text-blue-900">눈 모양</span>
                      <span className="text-sm text-blue-700">눈꼬리, 쌍꺼풀, 눈 크기</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium text-green-900">코 형태</span>
                      <span className="text-sm text-green-700">콧대, 콧볼, 코끝</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium text-purple-900">입 모양</span>
                      <span className="text-sm text-purple-700">입술 두께, 입 크기</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium text-orange-900">얼굴형</span>
                      <span className="text-sm text-orange-700">윤곽, 턱선, 이마</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ 섹션 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              자주 묻는 질문 (FAQ)
            </h2>

            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Q. 분석 결과가 정확한가요?
                </h3>
                <p className="text-gray-700">
                  AI는 95% 이상의 정확도를 가지고 있지만, 조명, 각도, 표정 등에 따라 결과가 달라질 수 있습니다. 
                  참고용으로 활용해주시고, 의학적 또는 법적 근거로는 사용하지 마세요.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Q. 업로드한 사진이 저장되나요?
                </h3>
                <p className="text-gray-700">
                  아니요. 업로드된 사진은 분석 완료 즉시 자동으로 삭제되며, 
                  어떠한 형태로도 저장되지 않습니다. 개인정보 보호를 최우선으로 합니다.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Q. 어떤 파일 형식을 지원하나요?
                </h3>
                <p className="text-gray-700">
                  JPG, PNG, JPEG 형식을 지원합니다. 파일 크기는 최대 10MB까지 가능하며, 
                  최적의 분석을 위해 1-5MB 정도의 고화질 이미지를 권장합니다.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Q. 여러 명이 함께 있는 사진도 가능한가요?
                </h3>
                <p className="text-gray-700">
                  현재는 한 사람의 얼굴만 있는 사진에서 최적의 결과를 제공합니다. 
                  여러 명이 있는 경우 얼굴이 겹치거나 부정확한 결과가 나올 수 있습니다.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Q. 분석에 실패했어요. 어떻게 해야 하나요?
                </h3>
                <p className="text-gray-700">
                  얼굴이 선명하게 보이는 정면 사진인지 확인해주세요. 
                  그래도 안 되면 다른 사진으로 다시 시도하거나, 
                  <a href="mailto:jslovejs182@gmail.com" className="text-blue-600 hover:underline">jslovejs182@gmail.com</a>으로 문의해주세요.
                </p>
              </div>
            </div>
          </div>

          {/* 문제 해결 가이드 */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              문제 해결 가이드
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">업로드 문제</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• 파일 크기가 10MB를 초과하지 않는지 확인</li>
                  <li>• JPG, PNG, JPEG 형식인지 확인</li>
                  <li>• 인터넷 연결 상태 확인</li>
                  <li>• 브라우저 새로고침 후 재시도</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">분석 오류</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• 얼굴이 정면을 향하는지 확인</li>
                  <li>• 이미지가 너무 어둡지 않은지 확인</li>
                  <li>• 얼굴이 충분히 큰지 확인</li>
                  <li>• 다른 브라우저에서 시도</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA 섹션 */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">준비되셨나요?</h2>
              <p className="text-blue-100 mb-6">
                가이드를 참고하여 정확한 분석 결과를 확인해보세요
              </p>
              <Link 
                href="/"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                분석 시작하기 →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}