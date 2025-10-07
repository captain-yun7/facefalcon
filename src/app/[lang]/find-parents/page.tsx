import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "부모 찾기 - 가장 닮은 사람 찾기",
  description: "👨‍👩‍👧‍👦 여러 사람 중 누구와 가장 닮았을까요? AI가 가족 중 가장 닮은 사람을 찾아드려요! 재미있는 가족 유사도 테스트 🎯",
  keywords: ["부모 찾기", "닮은꼴 찾기", "가족 유사도", "AI 얼굴 비교"],
  openGraph: {
    title: "🏆 AI 부모 찾기 - 누구와 가장 닮았을까? | FaceFalcon",
    description: "👨‍👩‍👧‍👦 여러 사람 중 누구와 가장 닮았을까요? AI가 가족 중 가장 닮은 사람을 찾아드려요! 재미있는 가족 유사도 테스트 🎯",
    url: '/find-parents',
    images: [
      {
        url: '/og/og-similarity.png',
        width: 1200,
        height: 630,
        alt: 'AI 부모 찾기',
      },
    ],
    type: 'website',
    siteName: 'FaceFalcon',
  },
  twitter: {
    card: 'summary_large_image',
    title: "🏆 AI 부모 찾기 - 누구와 가장 닮았을까? | FaceFalcon",
    description: "👨‍👩‍👧‍👦 여러 사람 중 누구와 가장 닮았을까요? AI가 가족 중 가장 닮은 사람을 찾아드려요! 재미있는 가족 유사도 테스트 🎯",
    images: ['/og/og-similarity.png'],
  },
}

export default function FindParentsPage() {
  redirect('/analyze?type=find-most-similar')
}
