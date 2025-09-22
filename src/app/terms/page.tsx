import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: '이용약관 | Who\'s Your Papa?',
  description: 'Who\'s Your Papa? 서비스 이용에 관한 약관과 조건을 안내합니다.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              이용약관
            </h1>
            <p className="text-gray-600">
              Who's Your Papa? 서비스 이용에 관한 약관과 조건
            </p>
            <div className="mt-2 text-sm text-gray-500">
              최종 업데이트: {new Date().toLocaleDateString('ko-KR')}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <div className="prose prose-gray max-w-none">
              
              <h2 className="text-xl font-bold text-gray-900 mb-4">제1조 (목적)</h2>
              <p className="text-gray-700 mb-6">
                본 약관은 Who's Your Papa?(이하 "회사")가 제공하는 AI 얼굴 유사도 분석 서비스(이하 "서비스")의 
                이용조건 및 절차, 회사와 이용자 간의 권리, 의무, 책임사항 및 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">제2조 (용어의 정의)</h2>
              <ul className="list-disc ml-6 mb-6 text-gray-700">
                <li><strong>"서비스"</strong>: 회사가 제공하는 AI 기반 얼굴 유사도 분석 서비스</li>
                <li><strong>"이용자"</strong>: 본 약관에 따라 서비스를 이용하는 개인 또는 법인</li>
                <li><strong>"콘텐츠"</strong>: 서비스를 통해 제공되는 모든 정보, 데이터, 분석 결과</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mb-4">제3조 (약관의 효력 및 변경)</h2>
              <p className="text-gray-700 mb-4">
                1. 본 약관은 서비스를 이용하는 모든 이용자에게 적용됩니다.
              </p>
              <p className="text-gray-700 mb-6">
                2. 회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 
                변경된 약관은 웹사이트에 공지함으로써 효력을 발생합니다.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">제4조 (서비스의 제공)</h2>
              <p className="text-gray-700 mb-4">
                1. 회사는 다음과 같은 서비스를 제공합니다:
              </p>
              <ul className="list-disc ml-6 mb-4 text-gray-700">
                <li>부모-자녀 얼굴 유사도 분석</li>
                <li>여러 인물 간 유사도 비교</li>
                <li>분석 결과 이미지 생성 및 다운로드</li>
              </ul>
              <p className="text-gray-700 mb-6">
                2. 서비스는 24시간 제공을 원칙으로 하나, 시스템 점검, 기술적 문제 등으로 인해 
                일시적으로 중단될 수 있습니다.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">제5조 (서비스 이용)</h2>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">⚠️ 중요한 면책 조항</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 본 서비스의 분석 결과는 <strong>참고용</strong>으로만 사용되어야 합니다.</li>
                  <li>• AI 분석 결과는 <strong>의학적, 법적 판단의 근거가 될 수 없습니다.</strong></li>
                  <li>• 분석 정확도는 이미지 품질, 각도, 조명 등에 따라 달라질 수 있습니다.</li>
                </ul>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-4">제6조 (이용자의 의무)</h2>
              <p className="text-gray-700 mb-4">이용자는 다음 행위를 하여서는 안 됩니다:</p>
              <ul className="list-disc ml-6 mb-6 text-gray-700">
                <li>타인의 개인정보를 무단으로 수집, 저장, 공개하는 행위</li>
                <li>저작권 등 타인의 지적재산권을 침해하는 행위</li>
                <li>서비스의 안정적 운영을 방해하는 행위</li>
                <li>음란물, 폭력적 이미지 등 부적절한 콘텐츠 업로드</li>
                <li>상업적 목적으로 서비스를 무단 이용하는 행위</li>
                <li>서비스를 역공학, 복제, 수정하는 행위</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mb-4">제7조 (지적재산권)</h2>
              <p className="text-gray-700 mb-4">
                1. 서비스에 사용된 소프트웨어, 알고리즘, 디자인 등의 지적재산권은 회사에 귀속됩니다.
              </p>
              <p className="text-gray-700 mb-6">
                2. 이용자가 업로드한 이미지의 저작권은 이용자에게 있으며, 
                회사는 서비스 제공 목적으로만 해당 이미지를 사용합니다.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">제8조 (개인정보 보호)</h2>
              <p className="text-gray-700 mb-6">
                회사는 관련 법령에 따라 이용자의 개인정보를 보호하며, 
                개인정보의 수집, 이용, 제공 등에 대해서는 별도의 개인정보처리방침을 따릅니다.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">제9조 (면책조항)</h2>
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-red-800 mb-2">면책 사항</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• 회사는 AI 분석 결과의 정확성을 보장하지 않습니다.</li>
                  <li>• 천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 책임지지 않습니다.</li>
                  <li>• 이용자가 서비스를 통해 얻은 정보의 신뢰성에 대해 책임지지 않습니다.</li>
                  <li>• 이용자 간 또는 이용자와 제3자 간에 발생한 분쟁에 대해 개입하지 않습니다.</li>
                </ul>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-4">제10조 (손해배상)</h2>
              <p className="text-gray-700 mb-6">
                회사의 고의 또는 중대한 과실로 인하여 이용자에게 손해가 발생한 경우, 
                회사는 관련 법령에 따라 손해를 배상할 책임이 있습니다. 
                다만, 배상 범위는 통상손해에 한정되며, 특별손해나 간접손해는 제외됩니다.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">제11조 (서비스의 변경 및 중단)</h2>
              <p className="text-gray-700 mb-4">
                1. 회사는 운영상, 기술상의 필요에 따라 서비스를 변경하거나 중단할 수 있습니다.
              </p>
              <p className="text-gray-700 mb-6">
                2. 서비스 중단 시 사전에 웹사이트를 통해 공지하되, 
                긴급한 경우에는 사후에 공지할 수 있습니다.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">제12조 (분쟁해결)</h2>
              <p className="text-gray-700 mb-6">
                1. 서비스 이용과 관련한 분쟁은 대한민국 법령에 따라 해결합니다.
                <br />
                2. 소송이 필요한 경우 회사의 주소지를 관할하는 법원을 전속관할법원으로 합니다.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">제13조 (고객지원)</h2>
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">문의 및 신고</h4>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li><strong>이메일:</strong> jslovejs182@gmail.com</li>
                  <li><strong>처리시간:</strong> 평일 9:00-18:00 (주말, 공휴일 제외)</li>
                  <li><strong>응답시간:</strong> 접수 후 1-2 영업일 내</li>
                </ul>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg mt-8">
                <p className="text-sm text-gray-600 text-center">
                  본 이용약관은 {new Date().toLocaleDateString('ko-KR')}부터 적용됩니다.
                  <br />
                  서비스를 이용함으로써 본 약관에 동의한 것으로 간주됩니다.
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
              href="/privacy"
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              개인정보처리방침 보기 →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}