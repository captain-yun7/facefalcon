import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* 사이트 정보 */}
          <div className="md:col-span-1">
            <h3 className="text-white text-lg font-bold mb-4">Who's Your Papa?</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              AI 기술을 활용한 가족 닮음 분석 서비스입니다. 
              부모와 자녀의 유사도를 정확하게 분석해드립니다.
            </p>
            <div className="flex items-center text-xs text-gray-500">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              SSL 보안 연결
            </div>
          </div>

          {/* 서비스 */}
          <div>
            <h4 className="text-white font-semibold mb-4">서비스</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-white transition-colors">
                  가족 닮음 분석
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm hover:text-white transition-colors">
                  여러 사람 비교
                </Link>
              </li>
            </ul>
          </div>

          {/* 고객 지원 */}
          <div>
            <h4 className="text-white font-semibold mb-4">고객 지원</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:jslovejs182@gmail.com" className="text-sm hover:text-white transition-colors">
                  이메일 문의
                </a>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-white transition-colors">
                  기술 지원
                </Link>
              </li>
            </ul>
          </div>

          {/* 법적 정보 */}
          <div>
            <h4 className="text-white font-semibold mb-4">법적 정보</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-white transition-colors">
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-4">
              <p>&copy; {currentYear} Who's Your Papa?. All rights reserved.</p>
              <p className="text-xs mt-1">
                본 서비스는 AI 기술을 활용한 참고용 분석 결과를 제공합니다.
              </p>
            </div>
          </div>

          {/* 추가 법적 고지 */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              본 웹사이트는 개인정보보호법 및 정보통신망 이용촉진 및 정보보호 등에 관한 법률을 준수합니다. 
              업로드된 이미지는 분석 후 즉시 삭제되며, 별도로 저장되지 않습니다. 
              서비스 이용 중 문제가 발생할 경우 
              <a href="mailto:jslovejs182@gmail.com" className="text-blue-400 hover:text-blue-300 ml-1">
                jslovejs182@gmail.com
              </a>
              으로 연락주시기 바랍니다.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}