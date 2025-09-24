'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnalysisCTA from '@/components/AnalysisCTA';
import { useTranslations } from '@/lib/simple-i18n';

export default function GuidePage() {
  const { t, locale } = useTranslations();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 섹션 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('guide.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('guide.subtitle')}
            </p>
          </div>

          {/* 빠른 시작 가이드 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              {t('guide.quickStart.title')}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('guide.quickStart.step1Title')}</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span dangerouslySetInnerHTML={{ __html: t('guide.quickStart.step1.item1').replace(/(.*?:)/, '<strong>$1</strong>') }} />
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span dangerouslySetInnerHTML={{ __html: t('guide.quickStart.step1.item2').replace(/(.*?:)/, '<strong>$1</strong>') }} />
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span dangerouslySetInnerHTML={{ __html: t('guide.quickStart.step1.item3').replace(/(.*?:)/, '<strong>$1</strong>') }} />
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('guide.quickStart.step2Title')}</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>{t('guide.quickStart.step2.item1')}</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>{t('guide.quickStart.step2.item2')}</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>{t('guide.quickStart.step2.item3')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 최적의 사진 촬영 팁 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              {t('guide.photoTips.title')}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">{t('guide.photoTips.goodPhoto.title')}</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    {(locale === 'en' ? [
                      'Natural expression looking forward',
                      'Hair not covering the face',
                      'Taken without sunglasses or hat',
                      'Natural light or bright indoor lighting',
                      'Solid background (white, gray recommended)'
                    ] : [
                      '정면을 바라보는 자연스러운 표정',
                      '머리카락이 얼굴을 가리지 않는 상태',
                      '선글라스나 모자 없이 촬영',
                      '자연광 또는 밝은 실내조명',
                      '단색 배경 (흰색, 회색 권장)'
                    ]).map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">{t('guide.photoTips.badPhoto.title')}</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {(locale === 'en' ? [
                      'Side or angled views',
                      'Too dark or backlit conditions',
                      'Face too small or blurry',
                      'Multiple people in the photo',
                      'Excessive makeup or filters applied'
                    ] : [
                      '측면이나 비스듬한 각도',
                      '너무 어둡거나 역광인 상태',
                      '얼굴이 너무 작거나 흐릿한 사진',
                      '여러 명이 함께 있는 사진',
                      '과도한 화장이나 필터 적용'
                    ]).map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 분석 결과 이해하기 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              {t('guide.understandResults.title')}
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('guide.understandResults.similarityScore.title')}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
                    <div className="text-2xl font-bold text-red-600 mb-1">{t('guide.understandResults.similarityScore.low.range')}</div>
                    <div className="text-sm text-red-700">{t('guide.understandResults.similarityScore.low.label')}</div>
                    <p className="text-xs text-gray-600 mt-1">{t('guide.understandResults.similarityScore.low.description')}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-200">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">{t('guide.understandResults.similarityScore.medium.range')}</div>
                    <div className="text-sm text-yellow-700">{t('guide.understandResults.similarityScore.medium.label')}</div>
                    <p className="text-xs text-gray-600 mt-1">{t('guide.understandResults.similarityScore.medium.description')}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                    <div className="text-2xl font-bold text-green-600 mb-1">{t('guide.understandResults.similarityScore.high.range')}</div>
                    <div className="text-sm text-green-700">{t('guide.understandResults.similarityScore.high.label')}</div>
                    <p className="text-xs text-gray-600 mt-1">{t('guide.understandResults.similarityScore.high.description')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('guide.understandResults.featureComparison.title')}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium text-blue-900">{t('guide.understandResults.featureComparison.eyes.label')}</span>
                      <span className="text-sm text-blue-700">{t('guide.understandResults.featureComparison.eyes.details')}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium text-green-900">{t('guide.understandResults.featureComparison.nose.label')}</span>
                      <span className="text-sm text-green-700">{t('guide.understandResults.featureComparison.nose.details')}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium text-purple-900">{t('guide.understandResults.featureComparison.mouth.label')}</span>
                      <span className="text-sm text-purple-700">{t('guide.understandResults.featureComparison.mouth.details')}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium text-orange-900">{t('guide.understandResults.featureComparison.faceShape.label')}</span>
                      <span className="text-sm text-orange-700">{t('guide.understandResults.featureComparison.faceShape.details')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ 섹션 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {t('guide.faq.title')}
            </h2>

            <div className="space-y-6">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t(`guide.faq.q${num}.question`)}
                  </h3>
                  <p className="text-gray-700">
                    {t(`guide.faq.q${num}.answer`)}
                    {num === 6 && (
                      <a href="mailto:jslovejs182@gmail.com" className="text-blue-600 hover:underline ml-1">
                        jslovejs182@gmail.com
                      </a>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 문제 해결 가이드 */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              {t('guide.troubleshooting.title')}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('guide.troubleshooting.uploadIssues.title')}</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  {(locale === 'en' ? [
                    'Check file size does not exceed 10MB',
                    'Verify it\'s JPG, PNG, or JPEG format',
                    'Check internet connection',
                    'Refresh browser and try again'
                  ] : [
                    '파일 크기가 10MB를 초과하지 않는지 확인',
                    'JPG, PNG, JPEG 형식인지 확인',
                    '인터넷 연결 상태 확인',
                    '브라우저 새로고침 후 재시도'
                  ]).map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('guide.troubleshooting.analysisErrors.title')}</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  {(locale === 'en' ? [
                    'Verify face is facing forward',
                    'Check image is not too dark',
                    'Ensure face is large enough',
                    'Try a different browser'
                  ] : [
                    '얼굴이 정면을 향하는지 확인',
                    '이미지가 너무 어둡지 않은지 확인',
                    '얼굴이 충분히 큰지 확인',
                    '다른 브라우저에서 시도'
                  ]).map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* CTA 섹션 */}
          <AnalysisCTA variant="minimal" />
        </div>
      </div>

      <Footer />
    </div>
  );
}