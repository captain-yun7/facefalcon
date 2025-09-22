import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'AI 기술 정보 | Who\'s Your Papa?',
  description: '얼굴 인식 AI 기술, 머신러닝, 딥러닝에 관한 유용한 정보와 최신 동향을 제공합니다.',
};

export default function BlogPage() {
  const articles = [
    {
      id: 1,
      title: "얼굴 인식 AI 기술의 발전사와 원리",
      excerpt: "1960년대부터 시작된 얼굴 인식 기술이 현재의 딥러닝 기반 AI까지 어떻게 발전해왔는지 알아봅니다.",
      readTime: "5분",
      category: "AI 기술",
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "컴퓨터 비전과 얼굴 특징점 추출",
      excerpt: "468개 얼굴 랜드마크를 어떻게 추출하고 분석하는지, 컴퓨터 비전의 핵심 원리를 설명합니다.",
      readTime: "7분",
      category: "컴퓨터 비전",
      date: "2024-01-12"
    },
    {
      id: 3,
      title: "딥러닝 모델이 얼굴을 인식하는 방법",
      excerpt: "CNN과 Transformer 기반의 얼굴 인식 모델이 어떻게 학습하고 예측하는지 쉽게 설명합니다.",
      readTime: "6분",
      category: "딥러닝",
      date: "2024-01-10"
    },
    {
      id: 4,
      title: "유전적 특징과 얼굴 유사도의 과학적 근거",
      excerpt: "부모와 자녀의 얼굴 유사성이 유전학적으로 어떻게 결정되는지, 과학적 연구 결과를 바탕으로 알아봅니다.",
      readTime: "8분",
      category: "유전학",
      date: "2024-01-08"
    },
    {
      id: 5,
      title: "AI 윤리와 얼굴 인식 기술의 책임감 있는 사용",
      excerpt: "얼굴 인식 기술의 윤리적 문제와 개인정보 보호, 편향성 문제에 대해 살펴봅니다.",
      readTime: "10분",
      category: "AI 윤리",
      date: "2024-01-05"
    },
    {
      id: 6,
      title: "실시간 얼굴 분석의 기술적 도전과 해결책",
      excerpt: "실시간으로 얼굴을 분석할 때 발생하는 성능 최적화와 정확도 문제, 그리고 해결 방안을 다룹니다.",
      readTime: "9분",
      category: "성능 최적화",
      date: "2024-01-03"
    },
    {
      id: 7,
      title: "모바일 기기에서의 AI 얼굴 인식 구현",
      excerpt: "제한된 리소스의 모바일 환경에서 효율적인 얼굴 인식을 구현하는 방법과 기술들을 소개합니다.",
      readTime: "7분",
      category: "모바일 AI",
      date: "2024-01-01"
    },
    {
      id: 8,
      title: "얼굴 분석에서 조명과 각도가 미치는 영향",
      excerpt: "사진의 조명, 각도, 표정이 AI 분석 결과에 어떤 영향을 미치는지 실험 데이터로 분석합니다.",
      readTime: "6분",
      category: "데이터 분석",
      date: "2023-12-28"
    }
  ];

  const categories = ["전체", "AI 기술", "컴퓨터 비전", "딥러닝", "유전학", "AI 윤리", "성능 최적화", "모바일 AI", "데이터 분석"];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 섹션 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI 기술 정보
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              얼굴 인식 AI, 머신러닝, 컴퓨터 비전에 관한 
              최신 기술 동향과 심층 분석을 제공합니다.
            </p>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${category === "전체" 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-200"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 주요 기사 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {articles.map((article) => (
              <article key={article.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {article.category}
                    </span>
                    <span className="text-sm text-gray-500">{article.readTime} 읽기</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                    {article.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{article.date}</span>
                    <Link 
                      href={`/blog/${article.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      자세히 읽기 →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* 기술 가이드 섹션 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              핵심 기술 가이드
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">딥러닝 기초</h3>
                <p className="text-sm text-gray-600">신경망과 딥러닝의 기본 개념</p>
              </div>

              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">컴퓨터 비전</h3>
                <p className="text-sm text-gray-600">이미지 처리와 패턴 인식</p>
              </div>

              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">머신러닝</h3>
                <p className="text-sm text-gray-600">학습 알고리즘과 데이터 분석</p>
              </div>

              <div className="text-center p-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI 윤리</h3>
                <p className="text-sm text-gray-600">책임감 있는 AI 개발</p>
              </div>
            </div>
          </div>

          {/* 최신 동향 섹션 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              2024 AI 기술 동향
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">멀티모달 AI</h3>
                <p className="text-sm text-gray-600 mb-3">
                  텍스트, 이미지, 음성을 동시에 처리하는 AI 모델의 발전
                </p>
                <div className="text-xs text-blue-600 font-medium">🔥 Hot Trend</div>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">경량화 모델</h3>
                <p className="text-sm text-gray-600 mb-3">
                  모바일과 엣지 디바이스를 위한 효율적인 AI 모델 개발
                </p>
                <div className="text-xs text-green-600 font-medium">📱 Mobile First</div>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">프라이버시 AI</h3>
                <p className="text-sm text-gray-600 mb-3">
                  개인정보 보호를 강화한 연합학습과 차분 프라이버시 기술
                </p>
                <div className="text-xs text-purple-600 font-medium">🔒 Privacy-First</div>
              </div>
            </div>
          </div>

          {/* 학습 리소스 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              추천 학습 리소스
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">온라인 강의</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-gray-900">Stanford CS231n</div>
                      <div className="text-sm text-gray-600">컴퓨터 비전을 위한 합성곱 신경망</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-gray-900">Deep Learning Specialization</div>
                      <div className="text-sm text-gray-600">Andrew Ng의 딥러닝 전문 과정</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-gray-900">Fast.ai Course</div>
                      <div className="text-sm text-gray-600">실용적인 딥러닝 프로그래밍</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">도구 및 라이브러리</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-gray-900">OpenCV</div>
                      <div className="text-sm text-gray-600">컴퓨터 비전 라이브러리</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-gray-900">TensorFlow / PyTorch</div>
                      <div className="text-sm text-gray-600">딥러닝 프레임워크</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-gray-900">MediaPipe</div>
                      <div className="text-sm text-gray-600">Google의 미디어 처리 플랫폼</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 뉴스레터 구독 섹션 */}
          <div className="text-center bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">AI 기술 소식을 놓치지 마세요</h2>
            <p className="text-gray-300 mb-6">
              최신 AI 기술 동향과 얼굴 인식 분야의 새로운 발전 소식을 정기적으로 받아보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="이메일 주소를 입력하세요"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
                구독하기
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              언제든지 구독을 취소할 수 있습니다. 개인정보는 안전하게 보호됩니다.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}