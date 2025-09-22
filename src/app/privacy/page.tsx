import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: '개인정보처리방침 | Who\'s Your Papa?',
  description: 'Who\'s Your Papa? 서비스의 개인정보 수집 및 처리에 관한 방침을 안내합니다.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              개인정보처리방침
            </h1>
            <p className="text-gray-600">
              Who's Your Papa? 서비스의 개인정보 수집 및 처리 방침
            </p>
            <div className="mt-2 text-sm text-gray-500">
              최종 업데이트: {new Date().toLocaleDateString('ko-KR')}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <div className="prose prose-gray max-w-none">
              
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. 개인정보의 수집 및 이용 목적</h2>
              <p className="text-gray-700 mb-6">
                Who's Your Papa? 서비스(이하 "본 서비스")는 다음의 목적을 위하여 개인정보를 수집 및 이용합니다:
              </p>
              <ul className="list-disc ml-6 mb-6 text-gray-700">
                <li>얼굴 유사도 분석 서비스 제공</li>
                <li>서비스 개선 및 통계 분석</li>
                <li>기술적 문제 해결 및 고객 지원</li>
                <li>법적 의무 이행</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mb-4">2. 수집하는 개인정보의 항목</h2>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">가. 자동으로 수집되는 정보</h3>
                <ul className="list-disc ml-6 mb-4 text-gray-700">
                  <li><strong>IP 주소</strong>: 서비스 이용 기록 및 보안 목적</li>
                  <li><strong>접속 로그</strong>: 접속 일시, 이용 페이지</li>
                  <li><strong>브라우저 정보</strong>: User-Agent, 브라우저 종류</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">나. 사용자가 제공하는 정보</h3>
                <ul className="list-disc ml-6 mb-6 text-gray-700">
                  <li><strong>업로드 이미지</strong>: 얼굴 분석을 위해 임시로 처리되며 즉시 삭제</li>
                  <li><strong>문의 정보</strong>: 이메일 문의 시 제공되는 연락처 (선택사항)</li>
                </ul>
                
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">🔒 수집하지 않는 정보</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• 쿠키 또는 로컬 저장소 데이터</li>
                    <li>• 회원가입 정보 (회원제 서비스 아님)</li>
                    <li>• 결제 정보 (무료 서비스)</li>
                    <li>• 위치 정보</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-4">3. 개인정보의 보유 및 이용 기간</h2>
              <ul className="list-disc ml-6 mb-6 text-gray-700">
                <li><strong>업로드 이미지</strong>: 분석 완료 즉시 삭제 (저장되지 않음)</li>
                <li><strong>접속 로그</strong>: 수집일로부터 1개월 후 자동 삭제</li>
                <li><strong>IP 주소</strong>: 수집일로부터 1개월 후 자동 삭제</li>
                <li><strong>문의 기록</strong>: 문의 완료 후 6개월간 보관 후 삭제</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mb-4">4. 개인정보의 제3자 제공</h2>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">🛡️ 제3자 제공 없음</h4>
                <p className="text-blue-700 text-sm">
                  본 서비스는 <strong>어떠한 경우에도 개인정보를 제3자에게 제공하지 않습니다.</strong> 
                  법령에 의한 요구가 있는 경우에만 예외적으로 제공될 수 있습니다.
                </p>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-4">5. 개인정보 처리의 위탁</h2>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-green-800 mb-2">✅ 위탁 처리 없음</h4>
                <p className="text-green-700 text-sm">
                  본 서비스는 개인정보 처리업무를 외부 업체에 위탁하지 않습니다. 
                  모든 데이터 처리는 자체적으로 이루어지며, 제3자와 정보를 공유하지 않습니다.
                </p>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-4">6. 개인정보의 안전성 확보조치</h2>
              <ul className="list-disc ml-6 mb-6 text-gray-700">
                <li>개인정보에 대한 접근 권한의 제한</li>
                <li>접속기록의 보관 및 위변조 방지</li>
                <li>개인정보의 암호화</li>
                <li>해킹 등에 대비한 기술적 대책</li>
                <li>개인정보 취급 직원의 최소화 및 교육</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mb-4">7. 개인정보보호책임자 및 연락처</h2>
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">개인정보보호책임자</h4>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li><strong>담당자:</strong> 개발팀</li>
                  <li><strong>이메일:</strong> jslovejs182@gmail.com</li>
                  <li><strong>처리시간:</strong> 평일 9:00-18:00 (주말, 공휴일 제외)</li>
                </ul>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-4">8. 개인정보의 열람, 정정·삭제 요구</h2>
              <p className="text-gray-700 mb-6">
                사용자는 언제든지 등록되어 있는 자신의 개인정보에 대하여 열람, 정정·삭제를 요구할 수 있으며, 
                개인정보보호책임자에게 서면, 전화 또는 이메일로 연락하시면 지체 없이 조치하겠습니다.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">9. 개인정보처리방침의 변경</h2>
              <p className="text-gray-700 mb-6">
                본 방침은 법령이나 서비스의 변경사항을 반영하기 위한 목적 등으로 수정될 수 있습니다. 
                개인정보처리방침이 변경되는 경우 웹사이트를 통하여 변경사항을 공지하겠습니다.
              </p>

              <div className="bg-gray-100 p-6 rounded-lg mt-8">
                <p className="text-sm text-gray-600 text-center">
                  본 개인정보처리방침은 {new Date().toLocaleDateString('ko-KR')}부터 적용됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* 하단 네비게이션 */}
          <div className="mt-8 text-center">
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium mr-4"
            >
              ← 홈으로 돌아가기
            </Link>
            <Link 
              href="/terms"
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              이용약관 보기 →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}