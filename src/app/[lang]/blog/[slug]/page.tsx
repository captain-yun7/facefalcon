'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import { useTranslations } from '@/components/TranslationsProvider';
import { useState, useEffect } from 'react';
interface BlogPost {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  date: string;
  readTime: string;
  author: string;
  content: string;
  excerpt: string;
}

interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  date: string;
  readTime: string;
  author: string;
  excerpt: string;
}

export default function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const { t, locale } = useTranslations();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!locale) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/blog/${params.slug}?locale=${locale}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
            return;
          }
          throw new Error('Failed to fetch post');
        }
        
        const data = await response.json();
        setPost(data.post);
        setRelatedPosts(data.relatedPosts);
      } catch (error) {
        console.error('Failed to load post:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [params.slug, locale]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="mb-12">
            <Link 
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 font-semibold text-lg group transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              {t('blog.backToList')}
            </Link>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold rounded-full shadow-lg">
                {post.category}
              </span>
              <span className="text-slate-500 text-sm font-medium bg-slate-100 px-3 py-1 rounded-full">{post.readTime} {locale === 'en' ? '' : '읽기'}</span>
              <time className="text-slate-500 text-sm">{post.date}</time>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-slate-800 leading-tight mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {post.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed font-medium">
              {post.description}
            </p>
            
            <div className="flex flex-wrap gap-3">
              {post.keywords.map((keyword) => (
                <span key={keyword} className="px-3 py-2 bg-white/60 backdrop-blur-sm text-slate-600 text-sm rounded-xl font-medium border border-slate-200/50 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* 컨텐츠 */}
          <article className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-10 md:p-16 mb-16 overflow-hidden">
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100/30 to-purple-100/20 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-100/30 to-blue-100/20 rounded-full blur-2xl translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10">
              <div 
                className="blog-content max-w-none text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </article>

          {/* 하단 네비게이션 */}
          <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-between">
            <Link 
              href="/blog"
              className="inline-flex items-center px-8 py-4 bg-white/70 backdrop-blur-sm text-slate-700 rounded-2xl hover:bg-white/90 hover:shadow-lg transition-all duration-300 font-semibold border border-slate-200/50 group"
            >
              <svg className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              {t('blog.backToList')}
            </Link>
            
            <Link 
              href="/analyze"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold group"
            >
              {t('blog.tryAnalysis')}
              <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* 관련 글 */}
          {relatedPosts.length > 0 && (
            <div className="mt-20 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl transform -rotate-1"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-white/50">
                <h2 className="text-3xl font-black text-slate-800 mb-8 text-center">{t('blog.relatedPosts')}</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {relatedPosts.map((relatedPost) => (
                    <Link 
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="group block p-6 bg-slate-50/70 backdrop-blur-sm rounded-2xl hover:bg-white/90 hover:shadow-lg transition-all duration-300 border border-slate-200/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold rounded-full">
                          {relatedPost.category}
                        </span>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{relatedPost.readTime}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors text-lg leading-snug">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {relatedPost.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}