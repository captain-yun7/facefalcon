import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { getDictionary, Locale } from "@/lib/i18n-server";
import { TranslationsProvider } from "@/components/TranslationsProvider";
import "./globals.css";

// Pretendard Variable 폰트 (로컬 파일)
const pretendard = localFont({
  src: "../../../public/fonts/PretendardVariable.woff2",
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

// Generate static params for supported locales
export async function generateStaticParams() {
  return [{ lang: 'ko' }, { lang: 'en' }];
}

// Generate dynamic metadata based on locale
export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://facefalcon.com';

  const metadataByLang = {
    ko: {
      title: {
        default: "FaceFalcon - AI 얼굴 분석 | 닮은꼴 테스트, 나이 맞히기, 에겐/테토 분석",
        template: "%s | FaceFalcon"
      },
      description: "AI 기술로 얼굴 닮은꼴 테스트, 나이 맞히기, 에겐남/테토남, 에겐녀/테토녀 분석을 제공하는 무료 온라인 서비스. 재미있는 AI 얼굴 분석을 지금 체험해보세요!",
      keywords: ["AI 얼굴 분석", "얼굴 닮은꼴 테스트", "나이 맞히기", "에겐남 테토남", "에겐녀 테토녀", "얼굴 유사도", "FaceFalcon", "얼굴 비교", "AI face analysis", "age prediction", "soft guy tough guy"],
      ogTitle: "FaceFalcon - AI 얼굴 분석 서비스",
      ogDescription: "AI 기술로 얼굴 닮은꼴 테스트, 나이 맞히기, 에겐/테토 스타일 분석을 제공하는 재미있는 무료 온라인 서비스!",
      twitterDescription: "AI로 얼굴 닮은꼴, 나이, 스타일을 분석하는 재미있는 서비스",
      locale: 'ko_KR' as const,
    },
    en: {
      title: {
        default: "FaceFalcon - AI Face Analysis | Similarity Test, Age Prediction, Style Analysis",
        template: "%s | FaceFalcon"
      },
      description: "Free online AI face analysis service featuring face similarity tests, age prediction, and style analysis. Try our fun AI-powered face analysis now!",
      keywords: ["AI face analysis", "face similarity test", "age prediction", "face comparison", "FaceFalcon", "soft guy tough guy", "facial features analysis"],
      ogTitle: "FaceFalcon - AI Face Analysis Service",
      ogDescription: "Fun and free online service providing AI-powered face similarity tests, age prediction, and style analysis!",
      twitterDescription: "Analyze face similarity, age, and style with AI",
      locale: 'en_US' as const,
    },
  };

  const meta = metadataByLang[params.lang];

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: "FaceFalcon Team" }],
    creator: "FaceFalcon",
    publisher: "FaceFalcon",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${params.lang}`,
      languages: {
        'ko': '/ko',
        'en': '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: meta.locale,
      url: `/${params.lang}`,
      title: meta.ogTitle,
      description: meta.ogDescription,
      siteName: "FaceFalcon",
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: meta.ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.ogTitle,
      description: meta.twitterDescription,
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
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  const dict = await getDictionary(params.lang);

  // JSON-LD structured data
  const structuredData = params.lang === 'ko' ? [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "FaceFalcon",
      "description": "AI 기술로 얼굴 닮은꼴 테스트, 나이 맞히기, 에겐/테토 분석 등 다양한 얼굴 분석을 제공하는 무료 온라인 서비스",
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
      "keywords": "AI 얼굴 분석, 얼굴 닮은꼴 테스트, 나이 맞히기, 에겐남 테토남, 에겐녀 테토녀, 얼굴 유사도",
      "featureList": [
        "AI 기반 얼굴 닮은꼴 테스트",
        "정확한 나이 예측 기능",
        "에겐남/테토남 스타일 분석",
        "에겐녀/테토녀 스타일 분석",
        "실시간 분석 결과 제공"
      ],
      "screenshot": "/og-image.jpg",
      "softwareVersion": "1.0",
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
      "inLanguage": "ko",
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
      "description": "AI 기술을 활용한 얼굴 닮은꼴, 나이 맞히기, 스타일 분석 서비스 제공 기업",
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
            "text": "AI 기술을 사용하여 업로드된 사진에서 얼굴을 인식하고, 닮은꼴 분석, 나이 예측, 에겐/테토 스타일 분석 등 다양한 결과를 제공합니다. 모든 분석은 실시간으로 처리됩니다."
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
  ] : [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "FaceFalcon",
      "description": "Free online AI face analysis service featuring face similarity tests, age prediction, and style analysis",
      "url": process.env.NEXT_PUBLIC_APP_URL || 'https://facefalcon.com',
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free AI face analysis service"
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
      "keywords": "AI face analysis, face similarity test, age prediction, style analysis, face comparison",
      "featureList": [
        "AI-powered face similarity test",
        "Accurate age prediction",
        "Style analysis",
        "Real-time analysis results"
      ],
      "screenshot": "/og-image.jpg",
      "softwareVersion": "1.0",
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
      "inLanguage": "en",
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
      "description": "AI-powered face analysis service provider specializing in similarity tests, age prediction, and style analysis",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Support",
        "areaServed": "Worldwide",
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
          "name": "How does FaceFalcon work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "FaceFalcon uses AI technology to detect faces in uploaded photos and provide various analysis results including similarity tests, age prediction, and style analysis. All analyses are processed in real-time."
          }
        },
        {
          "@type": "Question",
          "name": "Are my photos stored securely?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All uploaded photos are immediately deleted after analysis and are not stored on our servers. Privacy protection is our top priority."
          }
        },
        {
          "@type": "Question",
          "name": "Is there a fee?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "FaceFalcon is completely free. You can use all features without registration."
          }
        }
      ]
    }
  ];

  return (
    <html lang={params.lang}>
      <head>
        {/* hreflang tags for SEO */}
        <link rel="alternate" hrefLang="ko" href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://facefalcon.com'}/ko`} />
        <link rel="alternate" hrefLang="en" href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://facefalcon.com'}/en`} />
        <link rel="alternate" hrefLang="x-default" href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://facefalcon.com'}/ko`} />
      </head>
      <body
        className={`${pretendard.variable} ${inter.variable} font-sans antialiased`}
      >
        <GoogleAnalytics />
        <TranslationsProvider dict={dict} locale={params.lang}>
          {children}
        </TranslationsProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </body>
    </html>
  );
}
