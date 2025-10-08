import type { Metadata } from "next";
import { Locale } from "@/lib/i18n-server";

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const { lang } = await params;

  const metadataByLang: Record<Locale, {
    title: string;
    description: string;
    keywords: string[];
    ogDescription: string;
    ogAlt: string;
    twitterTitle: string;
    twitterDescription: string;
  }> = {
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
    ja: {
      title: "誰に似ている？ - ママ vs パパ 似ている度分析",
      description: "子供がママとパパのどちらに似ているかAIが正確に分析します。家族メンバー間の類似度を比較し、似ている部分を詳しく確認できます。無料家族類似度分析！",
      keywords: ["ママパパ似ている", "家族類似度比較", "親子類似度", "誰に似ている", "家族類似性", "AI家族分析"],
      ogDescription: "子供がママとパパのどちらに似ているかAIが正確に分析します。無料家族類似度分析！",
      ogAlt: "ママ vs パパ 似ている度分析 - AI家族類似度比較",
      twitterTitle: "誰に似ている？ - AI家族類似度分析",
      twitterDescription: "ママとパパのどちらに似ているかAIで確認！",
    },
    es: {
      title: "¿A quién se parece más? - Análisis de Parecido Mamá vs Papá",
      description: "La IA analiza con precisión si un niño se parece más a su mamá o papá. Compare la similitud entre miembros de la familia y verifique características detalladas. ¡Análisis gratuito de parecido familiar!",
      keywords: ["parecido mamá papá", "comparación similitud familiar", "similitud padre hijo", "a quién me parezco", "parecido familiar", "análisis IA familiar"],
      ogDescription: "La IA analiza con precisión si un niño se parece más a su mamá o papá. ¡Análisis gratuito de parecido familiar!",
      ogAlt: "Análisis de Parecido Mamá vs Papá - Comparación de Parecido Familiar IA",
      twitterTitle: "¿A quién se parece más? - Análisis de Similitud Familiar IA",
      twitterDescription: "¡Descubra si se parece más a su mamá o papá con IA!",
    },
    pt: {
      title: "A quem se parece mais? - Análise de Semelhança Mãe vs Pai",
      description: "A IA analisa com precisão se uma criança se parece mais com a mãe ou pai. Compare a similaridade entre membros da família e verifique características detalhadas. Análise gratuita de semelhança familiar!",
      keywords: ["semelhança mãe pai", "comparação similaridade familiar", "similaridade pai filho", "a quem me pareço", "semelhança familiar", "análise IA familiar"],
      ogDescription: "A IA analisa com precisão se uma criança se parece mais com a mãe ou pai. Análise gratuita de semelhança familiar!",
      ogAlt: "Análise de Semelhança Mãe vs Pai - Comparação de Semelhança Familiar IA",
      twitterTitle: "A quem se parece mais? - Análise de Similaridade Familiar IA",
      twitterDescription: "Descubra se se parece mais com a mãe ou pai com IA!",
    },
    de: {
      title: "Wem ähnelt man mehr? - Mama vs Papa Ähnlichkeitsanalyse",
      description: "KI analysiert genau, ob ein Kind mehr seiner Mama oder Papa ähnelt. Vergleichen Sie die Ähnlichkeit zwischen Familienmitgliedern und überprüfen Sie detaillierte Merkmale. Kostenlose Familienähnlichkeitsanalyse!",
      keywords: ["Mama Papa Ähnlichkeit", "Familienähnlichkeitsvergleich", "Eltern-Kind-Ähnlichkeit", "wem ähnele ich", "Familienähnlichkeit", "KI-Familienanalyse"],
      ogDescription: "KI analysiert genau, ob ein Kind mehr seiner Mama oder Papa ähnelt. Kostenlose Familienähnlichkeitsanalyse!",
      ogAlt: "Mama vs Papa Ähnlichkeitsanalyse - KI-Familienähnlichkeitsvergleich",
      twitterTitle: "Wem ähnelt man mehr? - KI-Familienähnlichkeitsanalyse",
      twitterDescription: "Finden Sie heraus, ob Sie mehr Ihrer Mama oder Papa ähneln mit KI!",
    },
    fr: {
      title: "À qui ressemble-t-on le plus ? - Analyse de Ressemblance Maman vs Papa",
      description: "L'IA analyse avec précision si un enfant ressemble plus à sa maman ou son papa. Comparez la similarité entre membres de la famille et vérifiez les caractéristiques détaillées. Analyse gratuite de ressemblance familiale !",
      keywords: ["ressemblance maman papa", "comparaison similarité familiale", "similarité parent enfant", "à qui je ressemble", "ressemblance familiale", "analyse IA familiale"],
      ogDescription: "L'IA analyse avec précision si un enfant ressemble plus à sa maman ou son papa. Analyse gratuite de ressemblance familiale !",
      ogAlt: "Analyse de Ressemblance Maman vs Papa - Comparaison de Ressemblance Familiale IA",
      twitterTitle: "À qui ressemble-t-on le plus ? - Analyse de Similarité Familiale IA",
      twitterDescription: "Découvrez si vous ressemblez plus à votre maman ou papa avec l'IA !",
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