import { Metadata } from 'next';
import AnalyzePage from '@/components/AnalyzePage';
import { getDictionary, Locale } from '@/lib/i18n-server';

const metadataMap = {
  // 새로운 URL 쿼리 형식
  'egen-teto': {
    image: '/og/og-gender.png',
    titleKey: 'metadata.analyze.gender.title',
    descriptionKey: 'metadata.analyze.gender.description'
  },
  'age': {
    image: '/og/og-age.png',
    titleKey: 'metadata.analyze.age.title',
    descriptionKey: 'metadata.analyze.age.description'
  },
  'similarity': {
    image: '/og/og-similarity.png',
    titleKey: 'metadata.analyze.parentChild.title',
    descriptionKey: 'metadata.analyze.parentChild.description'
  },
  'find-most-similar': {
    image: '/og/og-similarity.png',
    titleKey: 'metadata.analyze.whoMostSimilar.title',
    descriptionKey: 'metadata.analyze.whoMostSimilar.description'
  },
  // 하위 호환성 유지 (기존 URL)
  'style': {
    image: '/og/og-gender.png',
    titleKey: 'metadata.analyze.gender.title',
    descriptionKey: 'metadata.analyze.gender.description'
  },
  'gender': {
    image: '/og/og-gender.png',
    titleKey: 'metadata.analyze.gender.title',
    descriptionKey: 'metadata.analyze.gender.description'
  },
  'parent-child': {
    image: '/og/og-similarity.png',
    titleKey: 'metadata.analyze.parentChild.title',
    descriptionKey: 'metadata.analyze.parentChild.description'
  },
  'find-similar': {
    image: '/og/og-similarity.png',
    titleKey: 'metadata.analyze.whoMostSimilar.title',
    descriptionKey: 'metadata.analyze.whoMostSimilar.description'
  },
  'find-parents': {
    image: '/og/og-similarity.png',
    titleKey: 'metadata.analyze.whoMostSimilar.title',
    descriptionKey: 'metadata.analyze.whoMostSimilar.description'
  }
};

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ type?: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { type = 'similarity' } = await searchParams;

  // 번역 데이터 로드
  const dict = await getDictionary(lang);
  const meta = metadataMap[type as keyof typeof metadataMap] || metadataMap['similarity'];

  // 번역 키에서 값 가져오기
  const getTranslation = (key: string, fallback: string) => {
    const keys = key.split('.');
    let value: any = dict;
    for (const k of keys) {
      value = value?.[k];
    }
    return typeof value === 'string' ? value : fallback;
  };

  const title = getTranslation(meta.titleKey,
    type === 'egen-teto' || type === 'style' || type === 'gender' ? '에겐남/테토남 AI 분석 결과' :
    type === 'age' ? 'AI 나이 분석 결과' :
    'AI 얼굴 닮은꼴 테스트 결과'
  );
  const description = getTranslation(meta.descriptionKey, 'AI가 분석한 결과를 확인해보세요');
  const commonDescription = getTranslation('metadata.analyze.common.description', 'AI로 닮은꼴 찾기, 나이 맞히기, 에겐/테토 분석까지 무료로 체험해보세요');
  const keywords = getTranslation('metadata.analyze.keywords', 'AI 얼굴 분석,얼굴 닮은꼴,닮은꼴 테스트,나이 맞히기,에겐남,테토남,에겐녀,테토녀,얼굴 유사도,부모 찾기').split(',');

  return {
    title: `${title} | FaceFalcon`,
    description: `🤖 ${description} ${commonDescription} ✨`,
    keywords,
    openGraph: {
      title: `🔥 ${title} | FaceFalcon`,
      description: `🤖 ${description} ${commonDescription} ✨`,
      url: `/${lang}/analyze${type !== 'similarity' ? `?type=${type}` : ''}`,
      images: [
        {
          url: meta.image,
          width: 1200,
          height: 630,
          alt: `FaceFalcon ${title}`,
        },
      ],
      type: 'website',
      siteName: 'FaceFalcon',
    },
    twitter: {
      card: 'summary_large_image',
      title: `🔥 ${title} | FaceFalcon`,
      description: `🤖 ${description} ${commonDescription} ✨`,
      images: [meta.image],
    },
  };
}

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ type?: string }>;
}) {
  // Await params to comply with Next.js 15
  await params;
  await searchParams;

  return <AnalyzePage />;
}
