import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "얼굴 매칭 분석 - 두 사람이 얼마나 닮았을까?",
  description: "AI 기술로 두 사람의 얼굴 유사도를 정확하게 측정하고 비교해보세요. 친구, 가족, 연예인과의 닮음 정도를 퍼센트로 확인할 수 있습니다. 무료 얼굴 매칭 서비스!",
  keywords: ["얼굴 매칭", "얼굴 비교", "유사도 측정", "닮은꼴 분석", "AI 얼굴 인식", "얼굴 유사성"],
  openGraph: {
    title: "얼굴 매칭 분석 - 두 사람이 얼마나 닮았을까?",
    description: "AI 기술로 두 사람의 얼굴 유사도를 정확하게 측정하고 비교해보세요. 무료 얼굴 매칭 서비스!",
    url: '/face-match',
    images: [
      {
        url: '/face-match-og.jpg',
        width: 1200,
        height: 630,
        alt: '얼굴 매칭 분석 - AI 얼굴 유사도 측정',
      },
    ],
  },
  twitter: {
    title: "얼굴 매칭 분석 - AI 얼굴 유사도 측정",
    description: "두 사람이 얼마나 닮았는지 AI로 정확하게 측정해보세요!",
  },
};

export default function FaceMatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}