import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://whos-your-papa.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/monitoring/',
          '/_next/',
          '/static/',
          '/.well-known/',
          '/admin/',
          '/temp/',
          '*.json$',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/monitoring/',
          '/admin/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/monitoring/',
          '/admin/',
        ],
      },
      // 네이버 검색 봇
      {
        userAgent: 'NaverBot',
        allow: '/',
        disallow: [
          '/api/',
          '/monitoring/',
          '/admin/',
        ],
      },
      // 다음 검색 봇
      {
        userAgent: 'DaumCrawler',
        allow: '/',
        disallow: [
          '/api/',
          '/monitoring/',
          '/admin/',
        ],
      },
      // 소셜 미디어 봇들
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      {
        userAgent: 'Twitterbot',
        allow: '/',
      },
      {
        userAgent: 'LinkedInBot',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}