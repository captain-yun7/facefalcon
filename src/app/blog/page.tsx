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
              얼굴 유사도 분석의 원리와 가족 닮음의 과학,
              그리고 정확한 분석을 위한 실용적인 팁을 제공합니다.
            </p>
          </div>

          {/* 아티클 리스트 */}
          <div className="grid gap-8 mb-12">
            {posts.map((post) => (
              <Link 
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <article className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                          {post.category}
                        </span>
                        <span className="text-gray-500 text-sm">{post.readTime} 읽기</span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {post.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.keywords.slice(0, 4).map((keyword) => (
                          <span key={keyword} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4">
                        <time className="text-sm text-gray-500">{post.date}</time>
                        <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                          자세히 읽기 
                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* CTA 섹션 */}
          <AnalysisCTA 
            title="궁금하신가요?"
            description="지금 바로 두 사람의 닮음 정도를 확인해보세요"
            variant="minimal"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}