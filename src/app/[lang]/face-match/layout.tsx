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
    twitterDescription: string;
  }> = {
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
    ja: {
      title: "顔マッチング分析 - 二人はどれくらい似ている？",
      description: "AI技術で二人の顔の類似度を正確に測定・比較できます。友達、家族、有名人との似ている度合いをパーセントで確認できます。無料顔マッチングサービス！",
      keywords: ["顔マッチング", "顔比較", "類似度測定", "そっくり分析", "AI顔認識", "顔類似性"],
      ogDescription: "AI技術で二人の顔の類似度を正確に測定・比較できます。無料顔マッチングサービス！",
      ogAlt: "顔マッチング分析 - AI顔類似度測定",
      twitterDescription: "二人がどれくらい似ているかAIで正確に測定！",
    },
    es: {
      title: "Análisis de Coincidencia Facial - ¿Qué tan similares son dos personas?",
      description: "Mida y compare con precisión la similitud facial entre dos personas usando tecnología IA. Verifique el grado de parecido con amigos, familia o celebridades en porcentaje. ¡Servicio gratuito de coincidencia facial!",
      keywords: ["coincidencia facial", "comparación facial", "medición de similitud", "análisis de parecidos", "reconocimiento facial IA", "similitud facial"],
      ogDescription: "Mida y compare con precisión la similitud facial entre dos personas usando tecnología IA. ¡Servicio gratuito de coincidencia facial!",
      ogAlt: "Análisis de Coincidencia Facial - Medición de Similitud Facial con IA",
      twitterDescription: "¡Mida qué tan similares son dos personas con IA!",
    },
    pt: {
      title: "Análise de Correspondência Facial - Quão semelhantes são duas pessoas?",
      description: "Meça e compare com precisão a similaridade facial entre duas pessoas usando tecnologia IA. Verifique o grau de semelhança com amigos, família ou celebridades em porcentagem. Serviço gratuito de correspondência facial!",
      keywords: ["correspondência facial", "comparação facial", "medição de similaridade", "análise de sósias", "reconhecimento facial IA", "similaridade facial"],
      ogDescription: "Meça e compare com precisão a similaridade facial entre duas pessoas usando tecnologia IA. Serviço gratuito de correspondência facial!",
      ogAlt: "Análise de Correspondência Facial - Medição de Similaridade Facial com IA",
      twitterDescription: "Meça quão semelhantes são duas pessoas com IA!",
    },
    de: {
      title: "Gesichtsabgleich-Analyse - Wie ähnlich sind sich zwei Personen?",
      description: "Messen und vergleichen Sie präzise die Gesichtsähnlichkeit zwischen zwei Personen mit KI-Technologie. Überprüfen Sie den Ähnlichkeitsgrad mit Freunden, Familie oder Prominenten in Prozent. Kostenloser Gesichtsabgleich-Service!",
      keywords: ["Gesichtsabgleich", "Gesichtsvergleich", "Ähnlichkeitsmessung", "Doppelgänger-Analyse", "KI-Gesichtserkennung", "Gesichtsähnlichkeit"],
      ogDescription: "Messen und vergleichen Sie präzise die Gesichtsähnlichkeit zwischen zwei Personen mit KI-Technologie. Kostenloser Gesichtsabgleich-Service!",
      ogAlt: "Gesichtsabgleich-Analyse - KI-Gesichtsähnlichkeitsmessung",
      twitterDescription: "Messen Sie mit KI, wie ähnlich sich zwei Personen sind!",
    },
    fr: {
      title: "Analyse de Correspondance Faciale - À quel point deux personnes se ressemblent-elles ?",
      description: "Mesurez et comparez avec précision la similarité faciale entre deux personnes grâce à la technologie IA. Vérifiez le degré de ressemblance avec des amis, la famille ou des célébrités en pourcentage. Service gratuit de correspondance faciale !",
      keywords: ["correspondance faciale", "comparaison faciale", "mesure de similarité", "analyse de sosies", "reconnaissance faciale IA", "similarité faciale"],
      ogDescription: "Mesurez et comparez avec précision la similarité faciale entre deux personnes grâce à la technologie IA. Service gratuit de correspondance faciale !",
      ogAlt: "Analyse de Correspondance Faciale - Mesure de Similarité Faciale par IA",
      twitterDescription: "Mesurez à quel point deux personnes se ressemblent avec l'IA !",
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