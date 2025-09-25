'use client';

import AnalysisResultDisplay from './AnalysisResultDisplay';

interface ResultImageComponentProps {
  parentImageUrl: string;
  childImageUrl: string;
  similarity: number;
  confidence: number;
  displayPercent: number;
  locale?: 'ko' | 'en';
}

export default function ResultImageComponent({
  parentImageUrl,
  childImageUrl,
  displayPercent,
  locale = 'ko'
}: ResultImageComponentProps) {
  // ResultImageComponent는 다운로드용이므로 기본 props를 맞춰서 전달
  const mockParentImage = { preview: parentImageUrl };
  const mockChildImage = { preview: childImageUrl };
  const mockFamilyResult = {
    similarity: displayPercent / 100,
    confidence: 0.9,
    parent_face: { age: undefined },
    child_face: { age: undefined }
  };

  return (
    <AnalysisResultDisplay
      parentImage={mockParentImage}
      childImage={mockChildImage}
      familyResult={mockFamilyResult}
      displayPercent={displayPercent}
      locale={locale}
      displayMode="download"
      showActions={false}
    />
  );
}