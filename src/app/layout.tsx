import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

// Pretendard Variable 폰트 (로컬 파일)
const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

// Inter 폰트 (폴백용)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Who's your papa - AI 얼굴 분석 서비스",
    template: "%s | Who's your papa AI"
  },
  description: "AI로 부모-자녀 얼굴 유사도를 정확 분석하는 무료 서비스. 친자 확인부터 연예인 닮은꼴까지!",
  keywords: ["AI 얼굴 분석", "가족 닮음 분석", "친자 확인", "부모 자녀 닮음", "얼굴 유사도", "연예인 닮은꼴", "Who's your papa", "얼굴 비교", "가족 유사도 측정", "AI face analysis"],
  authors: [{ name: "Who's your papa AI Team" }],
  creator: "Who's your papa AI",
  publisher: "Who's your papa AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://whos-your-papa-ai.com'),
  alternates: {
    canonical: "/",
    languages: {
      'ko': '/ko',
      'en': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    title: "Who's your papa - AI 얼굴 분석 서비스",
    description: "AI로 부모-자녀 얼굴 유사도를 정확 분석하는 무료 서비스. 친자 확인부터 연예인 닮은꼴까지!",
    siteName: "Who's your papa AI",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Who\'s your papa AI - AI 얼굴 분석 서비스',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Who's your papa - AI 얼굴 분석 서비스",
    description: "AI로 부모-자녀 얼굴 유사도를 정확 분석하는 무료 서비스. 친자 확인부터 연예인 닮은꼴까지!",
    images: ['/og-image.jpg'],
    creator: '@whosyourpapaai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    other: {
      "naver-site-verification": 'your-naver-verification-code',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body 
        className={`${pretendard.variable} ${inter.variable} font-sans antialiased`}
      >
        <GoogleAnalytics />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "Who's your papa AI",
                "description": "AI로 부모-자녀 얼굴 유사도를 정확 분석하는 무료 서비스. 친자 확인부터 연예인 닮은꼴까지!",
                "url": process.env.NEXT_PUBLIC_APP_URL || 'https://whos-your-papa-ai.com',
                "applicationCategory": "UtilitiesApplication",
                "operatingSystem": "Web Browser",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "KRW",
                  "description": "무료 AI 얼굴 분석 서비스"
                },
                "provider": {
                  "@type": "Organization",
                  "name": "Who's your papa AI",
                  "url": process.env.NEXT_PUBLIC_APP_URL || 'https://whos-your-papa-ai.com',
                  "logo": "/logo.png",
                  "sameAs": [
                    "https://www.facebook.com/whosyourpapaai",
                    "https://www.instagram.com/whosyourpapaai",
                    "https://twitter.com/whosyourpapaai"
                  ]
                },
                "keywords": "AI 얼굴 분석, 가족 닮음 분석, 친자 확인, 얼굴 유사도, 연예인 닮은꼴",
                "featureList": [
                  "AI 기반 얼굴 유사도 분석",
                  "부모-자녀 닮음 분석",
                  "가족 구성원간 유사도 비교",
                  "연예인 닮은꼴 찾기",
                  "실시간 분석 결과 제공"
                ],
                "screenshot": "/og-image.jpg",
                "softwareVersion": "1.0",
                "datePublished": "2024-01-01",
                "dateModified": new Date().toISOString().split('T')[0],
                "inLanguage": ["ko", "en"],
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "reviewCount": "1250",
                  "bestRating": "5",
                  "worstRating": "1"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Who's your papa AI",
                "url": process.env.NEXT_PUBLIC_APP_URL || 'https://whos-your-papa-ai.com',
                "logo": "/logo.png",
                "description": "AI 기술을 활용한 얼굴 분석 및 가족 닮음 분석 서비스 제공 기업",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "고객 지원",
                  "areaServed": "KR",
                  "availableLanguage": ["Korean", "English"]
                },
                "sameAs": [
                  "https://www.facebook.com/whosyourpapaai",
                  "https://www.instagram.com/whosyourpapaai",
                  "https://twitter.com/whosyourpapaai"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Who's your papa AI는 어떻게 작동하나요?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "AI 기술을 사용하여 업로드된 사진에서 얼굴을 인식하고, 두 얼굴 간의 유사도를 분석하여 퍼센트로 결과를 제공합니다. 모든 분석은 실시간으로 처리됩니다."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "사진은 안전하게 보관되나요?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "업로드된 모든 사진은 분석 후 즉시 삭제되며, 서버에 저장되지 않습니다. 개인정보 보호를 최우선으로 합니다."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "이용료가 있나요?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Who's your papa AI는 완전 무료 서비스입니다. 회원가입 없이도 모든 기능을 자유롭게 이용할 수 있습니다."
                    }
                  }
                ]
              }
            ])
          }}
        />
      </body>
    </html>
  );
}
