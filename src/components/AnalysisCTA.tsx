import Link from 'next/link';

interface AnalysisCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  variant?: 'default' | 'minimal' | 'gradient';
}

export default function AnalysisCTA({
  title = "지금 시작해보세요",
  description = "AI 기술로 두 사람의 닮음 정도를 확인해보세요",
  buttonText = "무료로 분석하기",
  variant = 'default'
}: AnalysisCTAProps) {
  
  if (variant === 'minimal') {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 md:p-10">
        <div className="relative z-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{title}</h2>
          <p className="text-gray-300 mb-6 text-sm md:text-base">{description}</p>
          <Link 
            href="/analyze"
            className="inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {buttonText}
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }} />
        </div>
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-1">
        <div className="bg-gray-900 rounded-3xl p-8 md:p-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-gray-300 mb-8 text-base md:text-lg max-w-md mx-auto">
              {description}
            </p>
            <Link 
              href="/analyze"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1"
            >
              {buttonText}
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // default variant
  return (
    <div className="relative overflow-hidden">
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-3xl border border-gray-200 p-8 md:p-12 shadow-lg">
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-gray-600 mb-8 text-lg max-w-lg mx-auto">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/analyze"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
            >
              {buttonText}
              <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link 
              href="/guide"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold text-lg"
            >
              사용 가이드
              <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </Link>
          </div>
        </div>
        {/* 장식 요소 */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500 rounded-full opacity-10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-purple-500 rounded-full opacity-10 blur-xl"></div>
      </div>
    </div>
  );
}