import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

type Locale = 'ko' | 'en'

// 블로그 포스트 메타데이터 추출
function getBlogPosts(locale: Locale) {
  const blogDir = path.join(process.cwd(), 'content', 'blog', locale === 'en' ? 'en' : '')

  try {
    if (!fs.existsSync(blogDir)) {
      return []
    }

    const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'))

    return files.map(file => {
      const filePath = path.join(blogDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(fileContent)
      const stats = fs.statSync(filePath)

      return {
        slug: data.slug || file.replace('.md', ''),
        lastModified: stats.mtime,
      }
    })
  } catch (error) {
    console.error(`Error reading blog posts for ${locale}:`, error)
    return []
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://facefalcon.com'
  const locales: Locale[] = ['ko', 'en']
  const currentDate = new Date()

  // 다국어 페이지 정의 (경로, 우선순위, 변경빈도)
  const pages = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/analyze', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/face-match', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/find-parents', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/who-resembles', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/family-analysis', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/general-comparison', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/service', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/guide', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.7, changeFrequency: 'daily' as const },
    { path: '/menu', priority: 0.4, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ]

  // 각 언어별로 모든 페이지 생성
  const multilingualPages = locales.flatMap(locale =>
    pages.map(page => ({
      url: `${baseUrl}/${locale}${page.path}`,
      lastModified: currentDate,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: {
          ko: `${baseUrl}/ko${page.path}`,
          en: `${baseUrl}/en${page.path}`,
        }
      }
    }))
  )

  // 블로그 포스트 추가 (각 언어별)
  const blogSitemapEntries = locales.flatMap(locale => {
    const posts = getBlogPosts(locale)
    return posts.map(post => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: post.lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      alternates: {
        languages: {
          ko: `${baseUrl}/ko/blog/${post.slug}`,
          en: `${baseUrl}/en/blog/${post.slug}`,
        }
      }
    }))
  })

  // 루트 경로는 한국어 기본값으로 리다이렉트
  const rootPage = {
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 1.0,
    alternates: {
      languages: {
        ko: `${baseUrl}/ko`,
        en: `${baseUrl}/en`,
      }
    }
  }

  return [
    rootPage,
    ...multilingualPages,
    ...blogSitemapEntries,
  ]
}