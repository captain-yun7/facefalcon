export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* 로딩 애니메이션 */}
        <div className="mb-8">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            페이지를 불러오는 중...
          </h2>
          <p className="text-gray-600">
            잠시만 기다려주세요
          </p>
        </div>

        {/* 로딩 점들 */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* 브랜드 메시지 */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Who's your papa AI</p>
          <p className="text-xs">AI 기반 얼굴 분석 서비스</p>
        </div>
      </div>
    </div>
  )
}