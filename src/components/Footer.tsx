'use client';

import LocalizedLink from '@/components/LocalizedLink';
import { useTranslations } from '@/components/TranslationsProvider';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, locale } = useTranslations();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* 사이트 정보 */}
          <div className="md:col-span-1">
            <h3 className="text-white text-lg font-bold mb-4">{t('footer.siteInfo.title')}</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {t('footer.siteInfo.description')}
            </p>
            <div className="flex items-center text-xs text-gray-500">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {t('footer.siteInfo.security')}
            </div>
          </div>

          {/* 서비스 */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.services.title')}</h4>
            <ul className="space-y-2">
              <li>
                <LocalizedLink href="/analyze?type=parent-child" className="text-sm hover:text-white transition-colors">
                  {t('footer.services.familyAnalysis')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/analyze?type=who-most-similar" className="text-sm hover:text-white transition-colors">
                  {t('footer.services.multipleComparison')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/analyze?type=age-estimation" className="text-sm hover:text-white transition-colors">
                  {t('footer.services.ageAnalysis')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/analyze?type=gender-estimation" className="text-sm hover:text-white transition-colors">
                  {t('footer.services.genderAnalysis')}
                </LocalizedLink>
              </li>
            </ul>
          </div>

          {/* 고객 지원 */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.support.title')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:jslovejs182@gmail.com" className="text-sm hover:text-white transition-colors">
                  {t('footer.support.emailInquiry')}
                </a>
              </li>
              <li>
                <LocalizedLink href="/about" className="text-sm hover:text-white transition-colors">
                  {t('footer.support.technicalSupport')}
                </LocalizedLink>
              </li>
            </ul>
          </div>

          {/* 법적 정보 */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.legal.title')}</h4>
            <ul className="space-y-2">
              <li>
                <LocalizedLink href="/privacy" className="text-sm hover:text-white transition-colors">
                  {t('footer.legal.privacy')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/terms" className="text-sm hover:text-white transition-colors">
                  {t('footer.legal.terms')}
                </LocalizedLink>
              </li>
            </ul>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-4">
              <p>{t('footer.copyright', { year: currentYear })}</p>
              <p className="text-xs mt-1">
                {t('footer.disclaimer')}
              </p>
            </div>
          </div>

          {/* 추가 법적 고지 */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              {t('footer.legalNotice')}
              <a href="mailto:jslovejs182@gmail.com" className="text-blue-400 hover:text-blue-300 ml-1">
                jslovejs182@gmail.com
              </a>
              {locale === 'ko' && '으로 연락주시기 바랍니다.'}
              {locale === 'en' && '.'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}