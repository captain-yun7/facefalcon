import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center py-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            👨‍👩‍👧‍👦 Who's Your Papa?
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI 얼굴 분석으로 가족 유사도를 확인해보세요!
            <br />
            부모와 아이, 누구를 더 닮았는지 재미있게 알아보는 서비스입니다.
          </p>
        </header>

        {/* Feature Cards */}
        <main className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Link href="/face-match" className="group">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="text-6xl mb-4">👶➡️👨</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">얼굴 일치율</h3>
              <p className="text-gray-600 mb-4">
                부모와 아이의 얼굴이 얼마나 닮았는지 정확한 퍼센트로 확인해보세요.
              </p>
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                시작하기 →
              </div>
            </div>
          </Link>

          <Link href="/find-parents" className="group">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="text-6xl mb-4">🕵️‍♂️👨‍👩‍👧</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">부모 찾기</h3>
              <p className="text-gray-600 mb-4">
                여러 사람 중에서 진짜 부모님을 찾아보는 재미있는 게임입니다.
              </p>
              <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                게임 시작 →
              </div>
            </div>
          </Link>

          <Link href="/who-resembles" className="group">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="text-6xl mb-4">👨⚖️👩</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">닮은꼴 분석</h3>
              <p className="text-gray-600 mb-4">
                엄마와 아빠 중 누구를 더 닮았는지 정확한 분석 결과를 확인하세요.
              </p>
              <div className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                분석하기 →
              </div>
            </div>
          </Link>
        </main>

        {/* How it works */}
        <section className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">어떻게 작동하나요?</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📸</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">1. 사진 업로드</h4>
              <p className="text-sm text-gray-600">비교할 사진들을 업로드하세요</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">2. AI 분석</h4>
              <p className="text-sm text-gray-600">AWS AI가 얼굴을 정밀 분석합니다</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">3. 결과 계산</h4>
              <p className="text-sm text-gray-600">유사도를 정확히 계산합니다</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🎉</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">4. 결과 확인</h4>
              <p className="text-sm text-gray-600">재미있는 결과를 확인하고 공유하세요</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
