import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // 보안 헤더 설정
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // CSP (Content Security Policy) 설정 - 개발/프로덕션 구분
  const isDev = process.env.NODE_ENV === 'development'
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https: http:",
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://region1.analytics.google.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ]
  
  if (isDev) {
    csp.push("script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com")
  }
  
  response.headers.set('Content-Security-Policy', csp.join('; '))

  // 봇/크롤러 감지 및 특별 처리
  const userAgent = request.headers.get('user-agent') || ''
  const isBot = /bot|crawler|spider|crawling/i.test(userAgent)
  
  if (isBot) {
    // 봇에게는 간소화된 응답 제공 (선택사항)
    response.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate')
  }

  // API 라우트에 대한 CORS 설정
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    // OPTIONS 요청 처리
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers })
    }
  }

  // 레거시 경로 리다이렉트 (필요한 경우)
  if (request.nextUrl.pathname === '/old-path') {
    return NextResponse.redirect(new URL('/new-path', request.url))
  }

  // www 서브도메인 리다이렉트 (프로덕션에서)
  if (request.nextUrl.hostname.startsWith('www.')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.hostname = redirectUrl.hostname.replace('www.', '')
    return NextResponse.redirect(redirectUrl, 301)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files) 
     * - favicon.ico (favicon file)
     * - public files (sitemap.xml, robots.txt, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.webp$|.*\\.woff2?$|.*\\.ttf$|.*\\.eot$).*)',
  ],
}