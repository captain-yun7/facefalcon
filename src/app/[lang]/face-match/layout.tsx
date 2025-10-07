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
      title: "얼굴 매칭 분석 - 두 사람이 얼마나 닮았을까?",
      description: "AI 기술로 두 사람의 얼굴 유사도를 정확하게 측정하고 비교해보세요. 친구, 가족, 연예인과의 닮음 정도를 퍼센트로 확인할 수 있습니다. 무료 얼굴 매칭 서비스!",
      keywords: ["얼굴 매칭", "얼굴 비교", "유사도 측정", "닮은꼴 분석", "AI 얼굴 인식", "얼굴 유사성"],
      ogDescription: "AI 기술로 두 사람의 얼굴 유사도를 정확하게 측정하고 비교해보세요. 무료 얼굴 매칭 서비스!",
      ogAlt: "얼굴 매칭 분석 - AI 얼굴 유사도 측정",
      twitterDescription: "두 사람이 얼마나 닮았는지 AI로 정확하게 측정해보세요!",
    },
    en: {
      title: "Face Matching Analysis - How Similar Are Two People?",
      description: "Accurately measure and compare facial similarity between two people using AI technology. Check the degree of resemblance with friends, family, or celebrities in percentage. Free face matching service!",
      keywords: ["face matching", "face comparison", "similarity measurement", "lookalike analysis", "AI face recognition", "facial similarity"],
      ogDescription: "Accurately measure and compare facial similarity between two people using AI technology. Free face matching service!",
      ogAlt: "Face Matching Analysis - AI Face Similarity Measurement",
      twitterDescription: "Measure how similar two people are with AI!",
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
      url: `/${lang}/face-match`,
      images: [
        {
          url: '/face-match-og.jpg',
          width: 1200,
          height: 630,
          alt: meta.ogAlt,
        },
      ],
    },
    twitter: {
      title: meta.title,
      description: meta.twitterDescription,
    },
  };
}

export default function FaceMatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}