import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const type = searchParams?.type as string;
  
  let title = "AI 얼굴 분석하기 - 다양한 얼굴 분석 도구";
  let description = "🤖 AI가 당신의 얼굴을 분석해드려요! 닮은꼴 찾기, 나이 맞히기, 스타일 분석까지 무료로 체험해보세요 ✨";
  let ogTitle = "🔥 AI 얼굴 분석 - 나는 누구와 닮았을까? | FaceFalcon";
  
  switch(type) {
    case 'parent-child':
      title = "얼굴 닮은꼴 테스트 - AI 유사도 분석";
      description = "👨‍👩‍👧‍👦 우리는 얼마나 닮았을까? AI가 두 사람의 얼굴 유사도를 정확하게 분석해드려요! 커플, 가족, 친구와 함께 해보세요 💕";
      ogTitle = "💯 얼굴 닮은꼴 테스트 - 우리 닮았나? | FaceFalcon";
      break;
    case 'age':
      title = "AI 나이 맞히기 - 정확한 연령 예측";
      description = "🎂 AI가 당신의 나이를 맞춰보겠습니다! 과연 몇 살로 보일까요? 친구들과 함께 재미있는 나이 맞히기 게임을 해보세요! 📸";
      ogTitle = "🎯 AI 나이 맞히기 - 나는 몇 살로 보일까? | FaceFalcon";
      break;
    case 'gender':
      title = "에겐남/테토남 측정 - AI 성별 스타일 분석";
      description = "🧔 당신은 에겐남? 테토남? AI가 얼굴로 당신의 스타일을 분석해드려요! 친구들과 비교해보며 재미있게 즐겨보세요 😎";
      ogTitle = "🔥 에겐남 vs 테토남 테스트 - 나는 어떤 타입? | FaceFalcon";
      break;
    case 'find-parents':
      title = "부모 찾기 - 가장 닮은 사람 찾기";
      description = "👨‍👩‍👧‍👦 여러 사람 중 누구와 가장 닮았을까요? AI가 가족 중 가장 닮은 사람을 찾아드려요! 재미있는 가족 유사도 테스트 🎯";
      ogTitle = "🏆 AI 부모 찾기 - 누구와 가장 닮았을까? | FaceFalcon";
      break;
    default:
      // default case uses the general title/description above
      break;
  }
  
  return {
    title,
    description,
    keywords: ["AI 얼굴 분석", "얼굴 닮은꼴", "닮은꼴 테스트", "나이 맞히기", "에겐남", "테토남", "에겐녀", "테토녀", "얼굴 유사도", "부모 찾기"],
    openGraph: {
      title: ogTitle,
      description,
      url: '/analyze',
      images: [
        {
          url: '/analyze-og.jpg',
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      title: ogTitle,
      description,
    },
  }
}

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}