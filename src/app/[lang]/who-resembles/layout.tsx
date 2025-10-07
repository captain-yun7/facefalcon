import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "누구를 더 닮았을까? - 엄마 vs 아빠 닮음 분석",
  description: "아이가 엄마와 아빠 중 누구를 더 닮았는지 AI가 정확하게 분석해드립니다. 가족 구성원간의 유사도를 비교하고 닮은 부분을 상세하게 확인해보세요. 무료 가족 닮음 분석!",
  keywords: ["엄마 아빠 닮음", "가족 닮음 비교", "부모 자녀 유사도", "누구 닮았나", "가족 유사성", "AI 가족 분석"],
  openGraph: {
    title: "누구를 더 닮았을까? - 엄마 vs 아빠 닮음 분석",
    description: "아이가 엄마와 아빠 중 누구를 더 닮았는지 AI가 정확하게 분석해드립니다. 무료 가족 닮음 분석!",
    url: '/who-resembles',
    images: [
      {
        url: '/who-resembles-og.jpg',
        width: 1200,
        height: 630,
        alt: '엄마 vs 아빠 닮음 분석 - AI 가족 유사도 비교',
      },
    ],
  },
  twitter: {
    title: "누구를 더 닮았을까? - AI 가족 닮음 분석",
    description: "엄마와 아빠 중 누구를 더 닮았는지 AI로 알아보세요!",
  },
};

export default function WhoResemblesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}