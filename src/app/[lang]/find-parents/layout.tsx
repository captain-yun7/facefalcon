import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "부모 찾기 게임 - AI가 찾는 진짜 부모는?",
  description: "재미있는 AI 부모 찾기 게임! 여러 후보자 중에서 아이와 가장 닮은 진짜 부모를 AI가 찾아드립니다. 가족 모임에서 즐기는 재미있는 얼굴 분석 게임을 무료로 체험하세요!",
  keywords: ["부모 찾기 게임", "가족 게임", "AI 얼굴 게임", "닮은꼴 게임", "가족 놀이", "얼굴 분석 게임", "재미있는 AI"],
  openGraph: {
    title: "부모 찾기 게임 - AI가 찾는 진짜 부모는?",
    description: "재미있는 AI 부모 찾기 게임! 여러 후보자 중에서 진짜 부모를 AI가 찾아드립니다. 무료 가족 게임!",
    url: '/find-parents',
    images: [
      {
        url: '/find-parents-og.jpg',
        width: 1200,
        height: 630,
        alt: 'AI 부모 찾기 게임 - 재미있는 가족 얼굴 분석',
      },
    ],
  },
  twitter: {
    title: "부모 찾기 게임 - AI가 찾는 진짜 부모는?",
    description: "재미있는 AI 게임으로 가족의 닮음을 알아보세요!",
  },
};

export default function FindParentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}