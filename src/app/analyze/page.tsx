import { Metadata } from 'next';
import AnalyzePage from '@/components/AnalyzePage';

const metadataMap = {
  'gender': {
    image: '/og/og-gender.png',
    title: '에겐남/테토남 AI 분석 결과',
    description: 'AI가 분석한 당신의 에겐/테토 스타일을 확인해보세요'
  },
  'age': {
    image: '/og/og-age.png', 
    title: 'AI 나이 분석 결과',
    description: 'AI가 예측한 당신의 나이를 확인해보세요'
  },
  'parent-child': {
    image: '/og/og-similarity.png',
    title: 'AI 얼굴 닮은꼴 테스트 결과',
    description: 'AI가 분석한 두 사람의 닮음 정도를 확인해보세요'
  },
  'find-parents': {
    image: '/og/og-similarity.png',
    title: 'AI 얼굴 분석: 가장 닮은 사람 찾기', 
    description: '당신과 가장 닮은 사람을 찾아보세요'
  },
  'who-most-similar': {
    image: '/og/og-similarity.png',
    title: 'AI 얼굴 분석: 닮은꼴 테스트 결과',
    description: '닮은 사람들을 찾았습니다'
  }
};

export async function generateMetadata({ 
  searchParams 
}: { 
  searchParams: { type?: string } 
}): Promise<Metadata> {
  const type = searchParams.type || 'parent-child';
  const meta = metadataMap[type as keyof typeof metadataMap] || metadataMap['parent-child'];
  
  return {
    title: `${meta.title} | FaceFalcon`,
    description: `🤖 ${meta.description} AI로 닮은꼴 찾기, 나이 맞히기, 에겐/테토 분석까지 무료로 체험해보세요 ✨`,
    keywords: ["AI 얼굴 분석", "얼굴 닮은꼴", "닮은꼴 테스트", "나이 맞히기", "에겐남", "테토남", "에겐녀", "테토녀", "얼굴 유사도", "부모 찾기"],
    openGraph: {
      title: `🔥 ${meta.title} | FaceFalcon`,
      description: `🤖 ${meta.description} AI로 닮은꼴 찾기, 나이 맞히기, 에겐/테토 분석까지 무료로 체험해보세요 ✨`,
      url: `/analyze${type !== 'parent-child' ? `?type=${type}` : ''}?v=2`,
      images: [
        {
          url: meta.image,
          width: 1200,
          height: 630,
          alt: `FaceFalcon ${meta.title}`,
        },
      ],
      type: 'website',
      siteName: 'FaceFalcon',
    },
    twitter: {
      card: 'summary_large_image',
      title: `🔥 ${meta.title} | FaceFalcon`,
      description: `🤖 ${meta.description} AI로 닮은꼴 찾기, 나이 맞히기, 에겐/테토 분석까지 무료로 체험해보세요 ✨`,
      images: [meta.image],
    },
  };
}

export default function Page({ 
  searchParams 
}: { 
  searchParams: { type?: string } 
}) {
  return <AnalyzePage />;
}