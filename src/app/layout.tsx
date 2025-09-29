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
    default: "FaceFalcon - AI 얼굴 분석 | 가족 닮음 분석 서비스",
    template: "%s | FaceFalcon"
  },
  description: "AI 기술로 부모와 자녀의 얼굴 유사도를 정확히 분석하는 무료 온라인 서비스. 친자 확인, 가족 닮음 분석, 연예인 닮은꼴 찾기까지 한 번에! 재미있는 AI 얼굴 분석을 지금 체험해보세요.",
  keywords: ["AI 얼굴 분석", "가족 닮음 분석", "친자 확인", "부모 자녀 닮음", "얼굴 유사도", "연예인 닮은꼴", "FaceFalcon", "얼굴 비교", "가족 유사도 측정", "AI face analysis"],
  authors: [{ name: "FaceFalcon Team" }],
  creator: "FaceFalcon",
  publisher: "FaceFalcon",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://facefalcon.com'),
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
    title: "FaceFalcon - AI 얼굴 분석 서비스",
    description: "AI 기술로 부모와 자녀의 얼굴 유사도를 정확히 분석하는 무료 온라인 서비스. 친자 확인부터 연예인 닮은꼴까지!",
    siteName: "FaceFalcon",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FaceFalcon - AI 얼굴 분석 서비스',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "FaceFalcon - AI 얼굴 분석 서비스",
    description: "AI로 가족 얼굴 유사도를 분석하는 재미있는 서비스",
    images: ['/og-image.jpg'],
    creator: '@facefalcon',
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
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#3B82F6',
      },
    ],
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
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
                "name": "FaceFalcon",
                "description": "AI 기술로 부모와 자녀의 얼굴 유사도를 정확히 분석하는 무료 온라인 서비스",
                "url": process.env.NEXT_PUBLIC_APP_URL || 'https://facefalcon.com',
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
                  "name": "FaceFalcon",
                  "url": process.env.NEXT_PUBLIC_APP_URL || 'https://facefalcon.com',
                  "logo": "/logo.png",
                  "sameAs": [
                    "https://www.facebook.com/facefalcon",
                    "https://www.instagram.com/facefalcon",
                    "https://twitter.com/facefalcon"
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
                "name": "FaceFalcon",
                "url": process.env.NEXT_PUBLIC_APP_URL || 'https://facefalcon.com',
                "logo": "/logo.png",
                "description": "AI 기술을 활용한 얼굴 분석 및 가족 닮음 분석 서비스 제공 기업",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "고객 지원",
                  "areaServed": "KR",
                  "availableLanguage": ["Korean", "English"]
                },
                "sameAs": [
                  "https://www.facebook.com/facefalcon",
                  "https://www.instagram.com/facefalcon",
                  "https://twitter.com/facefalcon"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "FaceFalcon은 어떻게 작동하나요?",
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
                      "text": "FaceFalcon은 완전 무료 서비스입니다. 회원가입 없이도 모든 기능을 자유롭게 이용할 수 있습니다."
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