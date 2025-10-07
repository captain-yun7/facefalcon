'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnalysisCTA from '@/components/AnalysisCTA';
import { useTranslations } from '@/components/TranslationsProvider';
import { useState, useEffect } from 'react';
import { BlogPostMeta } from '@/lib/blog';

export default function BlogPage() {
  const { t, locale } = useTranslations();
  const [posts, setPosts] = useState<BlogPostMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 언어에 따른 블로그 포스트 로드
    const loadPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/blog?locale=${locale}`);
        if (response.ok) {
          const blogPosts = await response.json();
          setPosts(blogPosts);
        } else {
          console.error('Failed to fetch blog posts');
          setPosts([]);
        }
      } catch (error) {
        console.error('Failed to load blog posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    if (locale) {
      loadPosts();
    }
  }, [locale]);

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
                {t('blog.title')}
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
                {t('blog.subtitle')}
              </p>
            </div>
          </div>

          {/* 로딩 상태 */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading blog posts...</p>
            </div>
          )}

          {/* 아티클 리스트 */}
          {!loading && (
            <div className="grid gap-10 mb-16">
              {posts.length > 0 ? (
                posts.map((post, index) => (
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
                          <span className="text-slate-500 text-sm font-medium bg-slate-100 px-3 py-1 rounded-full">
                            {post.readTime} {locale === 'en' ? '' : ''}
                          </span>
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
                            {t('blog.readMore')} 
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
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    {locale === 'en' ? 'No blog posts available.' : '블로그 포스트가 없습니다.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* CTA 섹션 */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl transform rotate-1"></div>
            <AnalysisCTA 
              title={t('blog.cta.title')}
              description={t('blog.cta.description')}
              variant="gradient"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}