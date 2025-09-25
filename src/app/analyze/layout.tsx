import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 얼굴 분석하기 - 고급 가족 닮음 분석",
  description: "다양한 AI 얼굴 분석 도구로 가족간의 유사도를 정밀하게 측정하세요. 부모-자녀 분석, 가장 닮은 사람 찾기, 다중 비교 분석까지 모든 기능을 한 곳에서!",
  keywords: ["AI 얼굴 분석", "고급 분석", "다중 얼굴 비교", "가족 유사도 측정", "정밀 분석", "얼굴 매칭"],
  openGraph: {
    title: "AI 얼굴 분석하기 - 고급 가족 닮음 분석 도구",
    description: "다양한 AI 얼굴 분석 도구로 가족간의 유사도를 정밀하게 측정하세요. 무료로 이용 가능한 고급 분석 기능!",
    url: '/analyze',
    images: [
      {
        url: '/analyze-og.jpg',
        width: 1200,
        height: 630,
        alt: 'AI 얼굴 분석 도구 - 고급 가족 닮음 분석',
      },
    ],
  },
  twitter: {
    title: "AI 얼굴 분석하기 - 고급 가족 닮음 분석",
    description: "다양한 AI 도구로 가족 유사도를 정밀 측정하세요!",
  },
};

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}