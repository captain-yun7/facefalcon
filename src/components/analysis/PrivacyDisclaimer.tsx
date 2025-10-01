'use client';

import React from 'react';

export default function PrivacyDisclaimer() {
  return (
    <div className="max-w-3xl mx-auto mb-12">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-medium text-gray-700">안내사항</h3>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600 pl-8">
          <div className="flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            <span>업로드된 사진은 서버에 저장되지 않으며, 분석 직후 즉시 삭제됩니다</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            <span>개인정보는 일체 수집하지 않습니다</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            <span>본 서비스는 재미와 흥미를 위한 것으로, 결과는 참고용으로만 활용해 주세요</span>
          </div>
        </div>
      </div>
    </div>
  );
}