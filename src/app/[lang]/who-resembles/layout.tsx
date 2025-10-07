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
      title: "누구를 더 닮았을까? - 엄마 vs 아빠 닮음 분석",
      description: "아이가 엄마와 아빠 중 누구를 더 닮았는지 AI가 정확하게 분석해드립니다. 가족 구성원간의 유사도를 비교하고 닮은 부분을 상세하게 확인해보세요. 무료 가족 닮음 분석!",
      keywords: ["엄마 아빠 닮음", "가족 닮음 비교", "부모 자녀 유사도", "누구 닮았나", "가족 유사성", "AI 가족 분석"],
      ogDescription: "아이가 엄마와 아빠 중 누구를 더 닮았는지 AI가 정확하게 분석해드립니다. 무료 가족 닮음 분석!",
      ogAlt: "엄마 vs 아빠 닮음 분석 - AI 가족 유사도 비교",
      twitterTitle: "누구를 더 닮았을까? - AI 가족 닮음 분석",
      twitterDescription: "엄마와 아빠 중 누구를 더 닮았는지 AI로 알아보세요!",
    },
    en: {
      title: "Who Do You Resemble More? - Mom vs Dad Similarity Analysis",
      description: "AI accurately analyzes whether a child resembles their mother or father more. Compare similarity between family members and check detailed features. Free family resemblance analysis!",
      keywords: ["mom dad resemblance", "family similarity comparison", "parent child similarity", "who do I look like", "family resemblance", "AI family analysis"],
      ogDescription: "AI accurately analyzes whether a child resembles their mother or father more. Free family resemblance analysis!",
      ogAlt: "Mom vs Dad Similarity Analysis - AI Family Resemblance Comparison",
      twitterTitle: "Who Do You Resemble More? - AI Family Similarity Analysis",
      twitterDescription: "Find out whether you resemble your mom or dad more with AI!",
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
      url: `/${lang}/who-resembles`,
      images: [
        {
          url: '/who-resembles-og.jpg',
          width: 1200,
          height: 630,
          alt: meta.ogAlt,
        },
      ],
    },
    twitter: {
      title: meta.twitterTitle,
      description: meta.twitterDescription,
    },
  };
}

export default function WhoResemblesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}