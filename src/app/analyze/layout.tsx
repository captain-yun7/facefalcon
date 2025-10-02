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
  let description = "AI로 얼굴 닮은꼴, 나이, 스타일을 분석하세요. 닮은꼴 테스트, 나이 맞히기, 에겐/테토 분석까지 모든 기능을 한 곳에서!";
  let ogTitle = "AI 얼굴 분석하기 - 재미있는 얼굴 분석 서비스";
  
  switch(type) {
    case 'parent-child':
      title = "얼굴 닮은꼴 테스트 - AI 유사도 분석";
      description = "부모와 자녀, 연인, 친구 등 두 사람의 얼굴 닮은 정도를 AI가 정밀하게 분석합니다!";
      ogTitle = "얼굴 닮은꼴 테스트 - FaceFalcon";
      break;
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