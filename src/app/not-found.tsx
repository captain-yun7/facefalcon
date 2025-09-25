import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다 | Who\'s your papa',
  description: '요청하신 페이지를 찾을 수 없습니다. 홈페이지로 돌아가서 AI 얼굴 분석을 체험해보세요.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* 404 일러스트 */}
        <div className="mb-8">
          <div className="text-9xl mb-4">🔍</div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            <br />
            아래 링크를 통해 다른 페이지로 이동해보세요.
          </p>
        </div>

        {/* 네비게이션 링크들 */}
        <div className="space-y-4 mb-8">
          <Link
            href="/"
            className="inline-block w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            홈페이지로 돌아가기
          </Link>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/analyze"
              className="px-6 py-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              AI 분석하기
            </Link>
            <Link
              href="/guide"
              className="px-6 py-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              이용 가이드
            </Link>
            <Link
              href="/service"
              className="px-6 py-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              서비스 소개
            </Link>
          </div>
        </div>

        {/* 추가 도움말 */}
        <div className="text-sm text-gray-500 max-w-lg mx-auto">
          <p className="mb-2">자주 찾는 페이지:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-gray-100 rounded-full">친자 확인 분석</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">가족 닮음 분석</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">연예인 닮은꼴</span>
          </div>
        </div>
      </div>
    </div>
  )
}