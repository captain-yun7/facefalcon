'use client';

import Link from 'next/link';

export default function FaceMatchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 text-blue-600 hover:text-blue-800">
            ← 홈으로 돌아가기
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            얼굴 분석 방법 선택
          </h1>
          <p className="text-lg text-gray-600">
            분석 목적에 맞는 방법을 선택해주세요
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Analysis Method Options */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Family Analysis */}
            <Link href="/family-analysis" className="block">
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-indigo-200">
                <div className="text-center">
                  <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    가족 닮음 분석
                  </h3>
                  <p className="text-gray-600 mb-6">
                    부모-자녀 관계를 고려한 정밀한 유사도 분석
                  </p>
                  <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                    <div className="text-sm text-indigo-800">
                      <div className="font-semibold mb-2">특징:</div>
                      <div>• InsightFace 가족 특화 알고리즘</div>
                      <div>• 512차원 얼굴 특징 벡터 분석</div>
                      <div>• 정밀한 코사인 유사도 측정</div>
                      <div>• 얼굴 영역 및 신뢰도 정보 제공</div>
                    </div>
                  </div>
                  <div className="text-indigo-600 font-semibold">
                    가족 관계 확인에 최적화
                  </div>
                </div>
              </div>
            </Link>

            {/* General Comparison */}
            <Link href="/general-comparison" className="block">
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-orange-200">
                <div className="text-center">
                  <div className="text-6xl mb-4">⚡</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    일반 얼굴 비교
                  </h3>
                  <p className="text-gray-600 mb-6">
                    빠르고 안정적인 기본 얼굴 유사도 측정
                  </p>
                  <div className="bg-orange-50 rounded-lg p-4 mb-4">
                    <div className="text-sm text-orange-800">
                      <div className="font-semibold mb-2">특징:</div>
                      <div>• AWS Rekognition 엔진</div>
                      <div>• 머신러닝 기반 얼굴 분석</div>
                      <div>• 실시간 처리 및 높은 안정성</div>
                      <div>• 매칭/비매칭 얼굴 구분</div>
                    </div>
                  </div>
                  <div className="text-orange-600 font-semibold">
                    일반적인 얼굴 비교에 최적화
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Comparison Guide */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              언제 어떤 방법을 사용할까요?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <h4 className="font-semibold text-indigo-700 mb-2">가족 닮음 분석</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>✓ 부모와 자녀 관계 확인</div>
                  <div>✓ 가족 유사도 정밀 측정</div>
                  <div>✓ 세부 얼굴 정보 필요</div>
                  <div>✓ 높은 정확도 요구</div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-orange-700 mb-2">일반 얼굴 비교</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>✓ 닮은꼴 찾기</div>
                  <div>✓ 빠른 결과 필요</div>
                  <div>✓ 기본적인 유사도 측정</div>
                  <div>✓ 안정적인 처리 필요</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}