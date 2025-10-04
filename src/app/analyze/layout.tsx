import type { Metadata } from "next";

// layout.tsx에서는 searchParams를 받을 수 없으므로 기본 메타데이터만 설정
export const metadata: Metadata = {
  title: "AI 얼굴 분석하기 - 다양한 얼굴 분석 도구",
  description: "🤖 AI가 당신의 얼굴을 분석해드려요! 닮은꼴 찾기, 나이 맞히기, 스타일 분석까지 무료로 체험해보세요 ✨",
  keywords: ["AI 얼굴 분석", "얼굴 닮은꼴", "닮은꼴 테스트", "나이 맞히기", "에겐남", "테토남", "에겐녀", "테토녀", "얼굴 유사도", "부모 찾기"],
  openGraph: {
    title: "🔥 AI 얼굴 분석 - 나는 누구와 닮았을까? | FaceFalcon",
    description: "🤖 AI가 당신의 얼굴을 분석해드려요! 닮은꼴 찾기, 나이 맞히기, 스타일 분석까지 무료로 체험해보세요 ✨",
    url: '/analyze',
    images: [
      {
        url: '/og/og-similarity.png',
        width: 1200,
        height: 630,
        alt: 'FaceFalcon AI 얼굴 분석',
      },
    ],
    type: 'website',
    siteName: 'FaceFalcon',
  },
  twitter: {
    card: 'summary_large_image',
    title: "🔥 AI 얼굴 분석 - 나는 누구와 닮았을까? | FaceFalcon",
    description: "🤖 AI가 당신의 얼굴을 분석해드려요! 닮은꼴 찾기, 나이 맞히기, 스타일 분석까지 무료로 체험해보세요 ✨",
    images: ['/og/og-similarity.png'],
  },
}

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
