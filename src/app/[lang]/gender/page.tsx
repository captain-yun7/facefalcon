import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "에겐남/테토남 측정 - AI 성별 스타일 분석",
  description: "🧔 당신은 에겐남? 테토남? AI가 얼굴로 당신의 스타일을 분석해드려요! 친구들과 비교해보며 재미있게 즐겨보세요 😎",
  keywords: ["에겐남", "테토남", "에겐녀", "테토녀", "스타일 분석", "soft guy", "tough guy"],
  openGraph: {
    title: "🔥 에겐남 vs 테토남 테스트 - 나는 어떤 타입? | FaceFalcon",
    description: "🧔 당신은 에겐남? 테토남? AI가 얼굴로 당신의 스타일을 분석해드려요! 친구들과 비교해보며 재미있게 즐겨보세요 😎",
    url: '/gender',
    images: [
      {
        url: '/og/og-gender.png',
        width: 1200,
        height: 630,
        alt: '에겐남 테토남 테스트',
      },
    ],
    type: 'website',
    siteName: 'FaceFalcon',
  },
  twitter: {
    card: 'summary_large_image',
    title: "🔥 에겐남 vs 테토남 테스트 - 나는 어떤 타입? | FaceFalcon",
    description: "🧔 당신은 에겐남? 테토남? AI가 얼굴로 당신의 스타일을 분석해드려요! 친구들과 비교해보며 재미있게 즐겨보세요 😎",
    images: ['/og/og-gender.png'],
  },
}

export default function GenderPage() {
  redirect('/analyze?type=egen-teto')
}
