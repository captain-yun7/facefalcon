import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnalysisCTA from '@/components/AnalysisCTA';
import { getAllPosts } from '@/lib/blog';

export const metadata = {
  title: 'AI 기술 정보 | Who\'s Your Papa?',
  description: '얼굴 유사도 분석의 과학적 원리, 가족 닮음의 비밀, 완벽한 사진 촬영 가이드를 제공합니다.',
  keywords: ['얼굴 유사도', 'AI 얼굴 인식', '가족 닮음', '유전학', '사진 촬영 가이드'],
  openGraph: {
    title: 'AI 기술 정보 | Who\'s Your Papa?',
    description: '얼굴 유사도 분석의 과학적 원리와 가족 닮음의 유전학적 비밀을 알아보세요.',
    type: 'website',
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* 히어로 섹션 - 타이포그래피 중심 */}
          <div className="text-center mb-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl transform -skew-y-1"></div>
            <div className="relative py-16 px-8">
              <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-8 leading-tight">
                AI 기술 정보
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
                얼굴 유사도 분석의 원리와 가족 닮음의 과학,<br/>
                그리고 정확한 분석을 위한 실용적인 팁을 제공합니다.
              </p>
            </div>
          </div>

          {/* 아티클 리스트 */}
          <div className="grid gap-10 mb-16">
            {posts.map((post, index) => (
              <Link 
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-white/50 hover:shadow-2xl hover:border-blue-200/50 hover:bg-white/90 transition-all duration-500 group-hover:scale-[1.02] transform">
                  {/* 배경 그라데이션 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold rounded-full shadow-lg">
                        {post.category}
                      </span>
                      <span className="text-slate-500 text-sm font-medium bg-slate-100 px-3 py-1 rounded-full">{post.readTime} 읽기</span>
                      <time className="text-slate-500 text-sm">{post.date}</time>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                      {post.title}
                    </h2>
                    
                    <p className="text-lg text-slate-600 leading-relaxed mb-6 font-medium">
                      {post.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mb-6">
                      {post.keywords.slice(0, 4).map((keyword) => (
                        <span key={keyword} className="px-3 py-2 bg-slate-100 text-slate-600 text-sm rounded-xl font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors">
                          {keyword}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>{post.readTime}</span>
                      </div>
                      
                      <span className="text-blue-600 font-bold text-lg group-hover:translate-x-2 transition-transform duration-300 inline-flex items-center">
                        자세히 읽기 
                        <svg className="ml-3 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  
                  {/* 장식적 요소 */}
                  <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                </article>
              </Link>
            ))}
          </div>

          {/* CTA 섹션 */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl transform rotate-1"></div>
            <AnalysisCTA 
              title="궁금하신가요?"
              description="지금 바로 두 사람의 닮음 정도를 확인해보세요"
              variant="gradient"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}