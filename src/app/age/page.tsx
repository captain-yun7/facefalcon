import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "AI 나이 맞히기 - 정확한 연령 예측",
  description: "🎂 AI가 당신의 나이를 맞춰보겠습니다! 과연 몇 살로 보일까요? 친구들과 함께 재미있는 나이 맞히기 게임을 해보세요! 📸",
  keywords: ["AI 나이 맞히기", "나이 예측", "나이 테스트", "얼굴 나이", "AI face age"],
  openGraph: {
    title: "🎯 AI 나이 맞히기 - 나는 몇 살로 보일까? | FaceFalcon",
    description: "🎂 AI가 당신의 나이를 맞춰보겠습니다! 과연 몇 살로 보일까요? 친구들과 함께 재미있는 나이 맞히기 게임을 해보세요! 📸",
    url: '/age',
    images: [
      {
        url: '/og/og-age.png',
        width: 1200,
        height: 630,
        alt: 'AI 나이 맞히기',
      },
    ],
    type: 'website',
    siteName: 'FaceFalcon',
  },
  twitter: {
    card: 'summary_large_image',
    title: "🎯 AI 나이 맞히기 - 나는 몇 살로 보일까? | FaceFalcon",
    description: "🎂 AI가 당신의 나이를 맞춰보겠습니다! 과연 몇 살로 보일까요? 친구들과 함께 재미있는 나이 맞히기 게임을 해보세요! 📸",
    images: ['/og/og-age.png'],
  },
}

export default function AgePage() {
  redirect('/analyze?type=age')
}
