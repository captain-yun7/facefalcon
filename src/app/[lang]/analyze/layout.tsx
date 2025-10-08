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
      title: "AI 얼굴 분석 - 무료 얼굴 유사도·나이·성별 스타일 분석",
      description: "AI 기술로 얼굴을 종합 분석하는 서비스입니다. 얼굴 유사도 측정, 나이 추정, 성별 스타일 분석을 모두 무료로 제공합니다. 친구, 가족, 연예인과의 얼굴 비교를 지금 바로 시도해보세요!",
      keywords: ["AI 얼굴 분석", "얼굴 유사도 측정", "나이 추정", "성별 스타일 분석", "얼굴 인식 AI", "무료 얼굴 분석"],
      ogDescription: "AI 기술로 얼굴을 종합 분석하는 서비스입니다. 얼굴 유사도, 나이, 성별 스타일을 모두 무료로 분석합니다!",
      ogAlt: "AI 얼굴 분석 서비스 - 무료 얼굴 인식과 분석",
      twitterTitle: "AI 얼굴 분석 - 무료 얼굴 인식 서비스",
      twitterDescription: "AI로 얼굴을 종합 분석! 유사도, 나이, 성별 스타일을 무료로 확인",
    },
    en: {
      title: "AI Face Analysis - Free Face Similarity, Age, and Gender Style Analysis",
      description: "Comprehensive face analysis service using AI technology. We offer facial similarity measurement, age estimation, and gender style analysis, all for free. Try face comparison with friends, family, and celebrities now!",
      keywords: ["AI face analysis", "face similarity measurement", "age estimation", "gender style analysis", "face recognition AI", "free face analysis"],
      ogDescription: "Comprehensive face analysis service using AI technology. Analyze face similarity, age, and gender style all for free!",
      ogAlt: "AI Face Analysis Service - Free Face Recognition and Analysis",
      twitterTitle: "AI Face Analysis - Free Face Recognition Service",
      twitterDescription: "Comprehensive face analysis with AI! Check similarity, age, and gender style for free",
    },
    ja: {
      title: "AI顔分析 - 無料顔類似度・年齢・性別スタイル分析",
      description: "AI技術で顔を総合分析するサービス。顔の類似度測定、年齢推定、性別スタイル分析をすべて無料で提供します。友達、家族、有名人との顔比較を今すぐお試しください！",
      keywords: ["AI顔分析", "顔類似度測定", "年齢推定", "性別スタイル分析", "顔認識AI", "無料顔分析"],
      ogDescription: "AI技術で顔を総合分析するサービス。顔の類似度、年齢、性別スタイルをすべて無料で分析します！",
      ogAlt: "AI顔分析サービス - 無料顔認識と分析",
      twitterTitle: "AI顔分析 - 無料顔認識サービス",
      twitterDescription: "AIで顔を総合分析！類似度、年齢、性別スタイルを無料で確認",
    },
    es: {
      title: "Análisis Facial IA - Análisis Gratuito de Similitud Facial, Edad y Estilo de Género",
      description: "Servicio de análisis facial integral con tecnología IA. Ofrecemos medición de similitud facial, estimación de edad y análisis de estilo de género, todo gratis. ¡Pruebe la comparación facial con amigos, familia y celebridades ahora!",
      keywords: ["análisis facial IA", "medición similitud facial", "estimación edad", "análisis estilo género", "IA reconocimiento facial", "análisis facial gratis"],
      ogDescription: "Servicio de análisis facial integral con tecnología IA. ¡Analice similitud facial, edad y estilo de género gratis!",
      ogAlt: "Servicio de Análisis Facial IA - Reconocimiento y Análisis Facial Gratuito",
      twitterTitle: "Análisis Facial IA - Servicio Gratuito de Reconocimiento Facial",
      twitterDescription: "¡Análisis facial integral con IA! Verifique similitud, edad y estilo de género gratis",
    },
    pt: {
      title: "Análise Facial IA - Análise Gratuita de Similaridade Facial, Idade e Estilo de Gênero",
      description: "Serviço de análise facial integral com tecnologia IA. Oferecemos medição de similaridade facial, estimativa de idade e análise de estilo de gênero, tudo grátis. Experimente a comparação facial com amigos, família e celebridades agora!",
      keywords: ["análise facial IA", "medição similaridade facial", "estimativa idade", "análise estilo gênero", "IA reconhecimento facial", "análise facial grátis"],
      ogDescription: "Serviço de análise facial integral com tecnologia IA. Analise similaridade facial, idade e estilo de gênero grátis!",
      ogAlt: "Serviço de Análise Facial IA - Reconhecimento e Análise Facial Gratuito",
      twitterTitle: "Análise Facial IA - Serviço Gratuito de Reconhecimento Facial",
      twitterDescription: "Análise facial integral com IA! Verifique similaridade, idade e estilo de gênero grátis",
    },
    de: {
      title: "KI-Gesichtsanalyse - Kostenlose Gesichtsähnlichkeits-, Alters- und Geschlechtsstilanalyse",
      description: "Umfassender Gesichtsanalysedienst mit KI-Technologie. Wir bieten Gesichtsähnlichkeitsmessung, Altersschätzung und Geschlechtsstilanalyse, alles kostenlos. Probieren Sie jetzt den Gesichtsvergleich mit Freunden, Familie und Prominenten!",
      keywords: ["KI-Gesichtsanalyse", "Gesichtsähnlichkeitsmessung", "Altersschätzung", "Geschlechtsstilanalyse", "KI-Gesichtserkennung", "kostenlose Gesichtsanalyse"],
      ogDescription: "Umfassender Gesichtsanalysedienst mit KI-Technologie. Analysieren Sie Gesichtsähnlichkeit, Alter und Geschlechtsstil kostenlos!",
      ogAlt: "KI-Gesichtsanalysedienst - Kostenlose Gesichtserkennung und -analyse",
      twitterTitle: "KI-Gesichtsanalyse - Kostenloser Gesichtserkennungsdienst",
      twitterDescription: "Umfassende Gesichtsanalyse mit KI! Überprüfen Sie Ähnlichkeit, Alter und Geschlechtsstil kostenlos",
    },
    fr: {
      title: "Analyse Faciale IA - Analyse Gratuite de Similarité Faciale, Âge et Style de Genre",
      description: "Service d'analyse faciale complète avec technologie IA. Nous offrons la mesure de similarité faciale, l'estimation d'âge et l'analyse de style de genre, tout gratuitement. Essayez la comparaison faciale avec amis, famille et célébrités maintenant !",
      keywords: ["analyse faciale IA", "mesure similarité faciale", "estimation âge", "analyse style genre", "IA reconnaissance faciale", "analyse faciale gratuite"],
      ogDescription: "Service d'analyse faciale complète avec technologie IA. Analysez similarité faciale, âge et style de genre gratuitement !",
      ogAlt: "Service d'Analyse Faciale IA - Reconnaissance et Analyse Faciale Gratuites",
      twitterTitle: "Analyse Faciale IA - Service Gratuit de Reconnaissance Faciale",
      twitterDescription: "Analyse faciale complète avec IA ! Vérifiez similarité, âge et style de genre gratuitement",
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
      url: `/${lang}/analyze`,
      images: [
        {
          url: '/analyze-og.jpg',
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

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
