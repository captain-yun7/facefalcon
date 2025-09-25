'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러를 콘솔에 로그
    console.error('Application error:', error)
    
    // 추후 에러 트래킹 서비스에 전송 가능
    // analytics.trackError(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 에러 일러스트 */}
        <div className="mb-8">
          <div className="text-8xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            문제가 발생했습니다
          </h1>
          <p className="text-gray-600 mb-6">
            예상치 못한 오류가 발생했습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </p>
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            다시 시도하기
          </button>
          
          <div className="flex gap-4">
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 px-6 py-2 text-blue-600 hover:text-blue-700 transition-colors border border-blue-200 rounded-xl"
            >
              홈으로 가기
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-6 py-2 text-gray-600 hover:text-gray-700 transition-colors border border-gray-200 rounded-xl"
            >
              새로고침
            </button>
          </div>
        </div>

        {/* 개발 환경에서만 에러 정보 표시 */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <summary className="cursor-pointer font-medium text-red-800 mb-2">
              개발자 정보 (개발 환경에서만 표시)
            </summary>
            <pre className="text-xs text-red-700 whitespace-pre-wrap overflow-auto">
              {error.message}
              {error.digest && (
                <>
                  {'\n'}
                  Digest: {error.digest}
                </>
              )}
            </pre>
          </details>
        )}

        {/* 도움말 */}
        <div className="mt-8 text-sm text-gray-500">
          <p>문제가 지속된다면:</p>
          <ul className="mt-2 space-y-1">
            <li>• 브라우저를 새로고침해보세요</li>
            <li>• 다른 브라우저를 사용해보세요</li>
            <li>• 인터넷 연결을 확인해보세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}