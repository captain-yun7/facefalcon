"use client";
import Link from "next/link";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function MenuPage() {
  useEffect(() => {
    // Component mounted
  }, []);

  return (
    <>
      <Navbar />
      
      {/* Floating Shapes Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-br from-blue-300/20 to-blue-200/20 blur-[80px] top-[15%] left-[15%] animate-float"></div>
        <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-br from-blue-400/20 to-blue-300/20 blur-[80px] bottom-[15%] right-[10%] animate-float animation-delay-2000"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-br from-blue-500/20 to-blue-400/20 blur-[80px] top-[45%] left-[45%] animate-float animation-delay-4000"></div>
        <div className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-br from-blue-100/30 to-gray-50/30 blur-[80px] top-[70%] left-[20%] animate-float animation-delay-6000"></div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-white via-white/90 to-blue-50/30 relative z-10">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[100px]"></div>
        <div className="container mx-auto px-4 py-8 relative">
          {/* Header */}
          <header className="text-center py-16">
            <h1 className="font-playfair text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 bg-clip-text text-transparent drop-shadow-sm leading-tight">
              FaceFalcon
            </h1>
            <p className="font-roboto text-xl lg:text-2xl text-blue-800/80 mb-8 max-w-2xl mx-auto font-light tracking-wide">
              인공지능이 만들어내는 놀라운 얼굴 분석과 이미지 생성
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-12">
              <span className="font-montserrat bg-white text-blue-700 px-6 py-2 rounded-full text-sm font-medium border-2 border-blue-100 shadow-sm hover:scale-105 transition-transform">
                초고속 처리
              </span>
              <span className="font-montserrat bg-white text-blue-700 px-6 py-2 rounded-full text-sm font-medium border-2 border-blue-100 shadow-sm hover:scale-105 transition-transform">
                99.9% 정확도
              </span>
              <span className="font-montserrat bg-white text-blue-700 px-6 py-2 rounded-full text-sm font-medium border-2 border-blue-100 shadow-sm hover:scale-105 transition-transform">
                완벽한 보안
              </span>
              <span className="font-montserrat bg-white text-blue-700 px-6 py-2 rounded-full text-sm font-medium border-2 border-blue-100 shadow-sm hover:scale-105 transition-transform">
                다양한 기능
              </span>
            </div>
          </header>

          {/* Feature Cards */}
          <main className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
            <Link href="/analyze" className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 border border-blue-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <h3 className="font-montserrat text-2xl font-semibold text-blue-900 mb-6">우리 아빠 맞나요</h3>
                  <p className="font-roboto text-blue-700/80 mb-6 font-light leading-relaxed">
                    AI가 얼굴의 특징을 자세히 분석하여 정확한 유사도를 측정합니다
                  </p>
                  <div className="inline-flex items-center gap-2 font-montserrat bg-gradient-to-r from-blue-700 to-blue-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold tracking-wider uppercase group-hover:gap-3 transition-all">
                    시작하기 <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/find-parents" className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 border border-blue-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <h3 className="font-montserrat text-2xl font-semibold text-blue-900 mb-6">부모 찾기</h3>
                  <p className="font-roboto text-blue-700/80 mb-6 font-light leading-relaxed">
                    두 얼굴의 닮은 정도를 정확하게 계산하고 비교합니다
                  </p>
                  <div className="inline-flex items-center gap-2 font-montserrat bg-gradient-to-r from-blue-700 to-blue-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold tracking-wider uppercase group-hover:gap-3 transition-all">
                    게임 시작 <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/who-resembles" className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 border border-blue-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <h3 className="font-montserrat text-2xl font-semibold text-blue-900 mb-6">누굴 더 닮았나요</h3>
                  <p className="font-roboto text-blue-700/80 mb-6 font-light leading-relaxed">
                    엄마와 아빠 중 누구를 더 닮았는지 분석해보세요
                  </p>
                  <div className="inline-flex items-center gap-2 font-montserrat bg-gradient-to-r from-blue-700 to-blue-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold tracking-wider uppercase group-hover:gap-3 transition-all">
                    분석하기 <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </main>

          {/* How it works */}
          <section className="mt-24 text-center">
            <h2 className="font-montserrat text-3xl font-semibold text-blue-900 mb-16">어떻게 작동하나요?</h2>
            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-5">
                  <span className="text-2xl font-bold text-blue-700">1</span>
                </div>
                <h4 className="font-montserrat font-semibold text-blue-900 mb-2">1. 사진 업로드</h4>
                <p className="font-roboto text-sm text-blue-700/70 font-light">비교할 사진들을 업로드하세요</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-5">
                  <span className="text-2xl font-bold text-blue-700">2</span>
                </div>
                <h4 className="font-montserrat font-semibold text-blue-900 mb-2">2. AI 분석</h4>
                <p className="font-roboto text-sm text-blue-700/70 font-light">AWS AI가 얼굴을 정밀 분석합니다</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-5">
                  <span className="text-2xl font-bold text-blue-700">3</span>
                </div>
                <h4 className="font-montserrat font-semibold text-blue-900 mb-2">3. 결과 계산</h4>
                <p className="font-roboto text-sm text-blue-700/70 font-light">유사도를 정확히 계산합니다</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-5">
                  <span className="text-2xl font-bold text-blue-700">4</span>
                </div>
                <h4 className="font-montserrat font-semibold text-blue-900 mb-2">4. 결과 확인</h4>
                <p className="font-roboto text-sm text-blue-700/70 font-light">재미있는 결과를 확인하고 공유하세요</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}