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
    twitterDescription: string;
  }> = {
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
    ja: {
      title: "両親を探す - 誰が親かAIで分析",
      description: "複数の候補者の中から子供の実の親を見つけるAI分析サービス。顔の類似度を比較して最も似ている親候補を特定します。無料親子マッチングサービス！",
      keywords: ["親探し", "親子マッチング", "DNA代替", "顔類似度分析", "親確認", "AI親子分析"],
      ogDescription: "複数の候補者の中から子供の実の親を見つけるAI分析サービス。無料親子マッチングサービス！",
      twitterDescription: "AIで子供と最も似ている親候補を見つけましょう！",
    },
    es: {
      title: "Encontrar Padres - Análisis IA de Quién es el Padre",
      description: "Servicio de análisis IA para encontrar a los padres biológicos de un niño entre múltiples candidatos. Compare la similitud facial e identifique al candidato de padre más parecido. ¡Servicio gratuito de coincidencia padre-hijo!",
      keywords: ["encontrar padres", "coincidencia padre-hijo", "alternativa ADN", "análisis similitud facial", "confirmación paternidad", "análisis IA padre-hijo"],
      ogDescription: "Servicio de análisis IA para encontrar a los padres biológicos de un niño entre múltiples candidatos. ¡Servicio gratuito de coincidencia padre-hijo!",
      twitterDescription: "¡Encuentre al candidato de padre más parecido con IA!",
    },
    pt: {
      title: "Encontrar Pais - Análise IA de Quem é o Pai",
      description: "Serviço de análise IA para encontrar os pais biológicos de uma criança entre múltiplos candidatos. Compare a similaridade facial e identifique o candidato de pai mais parecido. Serviço gratuito de correspondência pai-filho!",
      keywords: ["encontrar pais", "correspondência pai-filho", "alternativa DNA", "análise similaridade facial", "confirmação paternidade", "análise IA pai-filho"],
      ogDescription: "Serviço de análise IA para encontrar os pais biológicos de uma criança entre múltiplos candidatos. Serviço gratuito de correspondência pai-filho!",
      twitterDescription: "Encontre o candidato de pai mais parecido com IA!",
    },
    de: {
      title: "Eltern finden - KI-Analyse Wer ist der Vater",
      description: "KI-Analysedienst zum Finden der leiblichen Eltern eines Kindes unter mehreren Kandidaten. Vergleichen Sie die Gesichtsähnlichkeit und identifizieren Sie den ähnlichsten Elternkandidaten. Kostenloser Eltern-Kind-Matching-Service!",
      keywords: ["Eltern finden", "Eltern-Kind-Matching", "DNA-Alternative", "Gesichtsähnlichkeitsanalyse", "Vaterschaftsbestätigung", "KI-Eltern-Kind-Analyse"],
      ogDescription: "KI-Analysedienst zum Finden der leiblichen Eltern eines Kindes unter mehreren Kandidaten. Kostenloser Eltern-Kind-Matching-Service!",
      twitterDescription: "Finden Sie den ähnlichsten Elternkandidaten mit KI!",
    },
    fr: {
      title: "Trouver les Parents - Analyse IA Qui est le Parent",
      description: "Service d'analyse IA pour trouver les parents biologiques d'un enfant parmi plusieurs candidats. Comparez la similarité faciale et identifiez le candidat parent le plus ressemblant. Service gratuit de correspondance parent-enfant !",
      keywords: ["trouver parents", "correspondance parent-enfant", "alternative ADN", "analyse similarité faciale", "confirmation paternité", "analyse IA parent-enfant"],
      ogDescription: "Service d'analyse IA pour trouver les parents biologiques d'un enfant parmi plusieurs candidats. Service gratuit de correspondance parent-enfant !",
      twitterDescription: "Trouvez le candidat parent le plus ressemblant avec l'IA !",
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