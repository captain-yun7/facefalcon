import Link from 'next/link';
import { getDictionary } from '@/lib/i18n-server';

export default async function FaceMatchPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href={`/${lang}`} className="inline-block mb-4 text-blue-600 hover:text-blue-800">
            {t.faceMatch.backToHome}
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t.faceMatch.title}
          </h1>
          <p className="text-lg text-gray-600">
            {t.faceMatch.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Analysis Method Options */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Family Analysis */}
            <Link href={`/${lang}/family-analysis`} className="block">
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-indigo-200">
                <div className="text-center">
                  <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {t.faceMatch.familyAnalysis.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t.faceMatch.familyAnalysis.description}
                  </p>
                  <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                    <div className="text-sm text-indigo-800">
                      <div className="font-semibold mb-2">{t.faceMatch.familyAnalysis.features}</div>
                      <div>{t.faceMatch.familyAnalysis.feature1}</div>
                      <div>{t.faceMatch.familyAnalysis.feature2}</div>
                      <div>{t.faceMatch.familyAnalysis.feature3}</div>
                      <div>{t.faceMatch.familyAnalysis.feature4}</div>
                    </div>
                  </div>
                  <div className="text-indigo-600 font-semibold">
                    {t.faceMatch.familyAnalysis.optimized}
                  </div>
                </div>
              </div>
            </Link>

            {/* General Comparison */}
            <Link href={`/${lang}/general-comparison`} className="block">
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-orange-200">
                <div className="text-center">
                  <div className="text-6xl mb-4">⚡</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {t.faceMatch.generalComparison.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t.faceMatch.generalComparison.description}
                  </p>
                  <div className="bg-orange-50 rounded-lg p-4 mb-4">
                    <div className="text-sm text-orange-800">
                      <div className="font-semibold mb-2">{t.faceMatch.generalComparison.features}</div>
                      <div>{t.faceMatch.generalComparison.feature1}</div>
                      <div>{t.faceMatch.generalComparison.feature2}</div>
                      <div>{t.faceMatch.generalComparison.feature3}</div>
                      <div>{t.faceMatch.generalComparison.feature4}</div>
                    </div>
                  </div>
                  <div className="text-orange-600 font-semibold">
                    {t.faceMatch.generalComparison.optimized}
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Comparison Guide */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              {t.faceMatch.guide.title}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <h4 className="font-semibold text-indigo-700 mb-2">{t.faceMatch.guide.familyTitle}</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>{t.faceMatch.guide.familyUse1}</div>
                  <div>{t.faceMatch.guide.familyUse2}</div>
                  <div>{t.faceMatch.guide.familyUse3}</div>
                  <div>{t.faceMatch.guide.familyUse4}</div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-orange-700 mb-2">{t.faceMatch.guide.generalTitle}</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>{t.faceMatch.guide.generalUse1}</div>
                  <div>{t.faceMatch.guide.generalUse2}</div>
                  <div>{t.faceMatch.guide.generalUse3}</div>
                  <div>{t.faceMatch.guide.generalUse4}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}