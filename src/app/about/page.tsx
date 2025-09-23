'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-16 pb-8">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            개발자 소개
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            AI와 웹 기술을 활용한 재미있는 서비스를 만드는 개발자입니다
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Project Story */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                이 프로젝트는 어떻게 시작되었나요?
              </h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                "우리 아이가 누굴 더 닮았을까?" - 모든 부모들이 한 번쯤 궁금해하는 질문에서 시작되었습니다.
                단순한 호기심을 AI 기술로 해결해보고 싶었고, 가족들이 재미있게 사용할 수 있는 
                웹 서비스를 만들어보았습니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                개발 과정에서 다양한 얼굴 인식 API를 테스트하고, 사용자 경험을 고민하며 
                현재의 서비스가 완성되었습니다. 매일 많은 가족들이 사용해주시는 것을 보며 
                기술이 일상에 재미를 더할 수 있다는 것을 느끼고 있습니다.
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                사용된 기술 스택
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Frontend</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Next.js (React Framework)
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    TypeScript
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Tailwind CSS
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Canvas API
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Backend & AI</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    AWS Rekognition
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    InsightFace
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    FastAPI
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Serverless
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Developer Info */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                개발자 정보
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">전문 분야</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 풀스택 웹 개발</li>
                  <li>• AI/ML 서비스 개발</li>
                  <li>• AWS 클라우드 및 인프라 구축</li>
                  <li>• 서비스 아키텍처 디자인</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">관심 분야</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• AI 모델 분석 </li>
                  <li>• AI/ML 서비스 개발</li>
                  <li>• 자동화</li>                  
                </ul>
              </div>
            </div>
          </div>

          {/* Contact & Services */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8">
            <div className="flex items-center mb-6">
              {/* <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div> */}
              <h2 className="text-2xl font-bold text-gray-900">
                강의 & 외주 문의
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">제공 서비스</h3>
                </div>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• <strong>AI 서비스 개발</strong> </li>
                  <li>• <strong>홈페이지 및 웹/앱 애플리케이션 구축</strong></li>
                  <li>• <strong>클라우드 인프라 구축 및 운영</strong></li>
                  <li>• <strong>AI 개발 및 클라우드 강의</strong></li>                  
                  <li>• <strong>기술 멘토링</strong></li>                  
                </ul>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">문의하기</h3>
                </div>
                <div className="space-y-3">
                  <a 
                    href="mailto:your-email@example.com" 
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    jslovejs182@gmail.com
                  </a>                  
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link 
              href="/analyze"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              ← 닮음 분석하러 가기
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}