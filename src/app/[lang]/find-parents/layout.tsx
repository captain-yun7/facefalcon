import type { Metadata } from "next";
import { Locale } from "@/lib/i18n-server";

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const { lang } = await params;

  const metadataByLang = {
    ko: {
      title: "부모 찾기 게임 - AI가 찾는 진짜 부모는?",
      description: "재미있는 AI 부모 찾기 게임! 여러 후보자 중에서 아이와 가장 닮은 진짜 부모를 AI가 찾아드립니다. 가족 모임에서 즐기는 재미있는 얼굴 분석 게임을 무료로 체험하세요!",
      keywords: ["부모 찾기 게임", "가족 게임", "AI 얼굴 게임", "닮은꼴 게임", "가족 놀이", "얼굴 분석 게임", "재미있는 AI"],
      ogDescription: "재미있는 AI 부모 찾기 게임! 여러 후보자 중에서 진짜 부모를 AI가 찾아드립니다. 무료 가족 게임!",
      twitterDescription: "재미있는 AI 게임으로 가족의 닮음을 알아보세요!",
    },
    en: {
      title: "Find Parents Game - AI Finds the Real Parents",
      description: "Fun AI parent finding game! AI identifies the real parents among multiple candidates who most resemble the child. Try this fun family face analysis game for free at family gatherings!",
      keywords: ["find parents game", "family game", "AI face game", "similarity game", "family fun", "face analysis game", "fun AI"],
      ogDescription: "Fun AI parent finding game! AI finds the real parents among candidates. Free family game!",
      twitterDescription: "Discover family resemblances with a fun AI game!",
    },
  };

  const meta = metadataByLang[lang];

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.ogDescription,
      url: `/${lang}/find-parents`,
      images: [
        {
          url: '/find-parents-og.jpg',
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      title: meta.title,
      description: meta.twitterDescription,
    },
  };
}

export default function FindParentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}