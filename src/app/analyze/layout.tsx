import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const type = searchParams?.type as string;
  
  let title = "AI 얼굴 분석하기 - 고급 가족 닮음 분석";
  let description = "다양한 AI 얼굴 분석 도구로 가족간의 유사도를 정밀하게 측정하세요. 부모-자녀 분석, 가장 닮은 사람 찾기, 다중 비교 분석까지 모든 기능을 한 곳에서!";
  let ogTitle = "AI 얼굴 분석하기 - 고급 가족 닮음 분석 도구";
  
  switch(type) {
    case 'age':
      title = "AI 나이 맞히기 - 정확한 연령 예측";
      description = "AI가 사진으로 나이를 정확하게 예측합니다. 업로드한 사진으로 바로 확인해보세요!";
      ogTitle = "AI 나이 맞히기 - FaceFalcon";
      break;
    case 'gender':
      title = "에겐남/테토남 측정 - AI 성별 스타일 분석";
      description = "AI가 성별 특징으로 에겐남/테토남 스타일을 분석합니다. 재미있는 결과를 확인해보세요!";
      ogTitle = "에겐남/테토남 측정 - FaceFalcon";
      break;
    case 'find-parents':
      title = "부모 찾기 - 가장 닮은 사람 찾기";
      description = "여러 사람 중 누가 가장 닮았는지 AI가 찾아드립니다. 정확한 유사도 비교 분석!";
      ogTitle = "부모 찾기 AI 분석 - FaceFalcon";
      break;
    default:
      // parent-child or default
      break;
  }
  
  return {
    title,
    description,
    keywords: ["AI 얼굴 분석", "고급 분석", "다중 얼굴 비교", "가족 유사도 측정", "정밀 분석", "얼굴 매칭", "나이 예측", "에겐남", "테토남"],
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