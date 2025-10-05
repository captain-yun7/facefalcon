'use client';

import React from 'react';
import { useTranslations } from '@/lib/simple-i18n';

export default function PrivacyDisclaimer() {
  const { t, loading } = useTranslations();
  
  // Don't render anything while translations are loading
  if (loading) {
    return null;
  }
  return (
    <div className="max-w-3xl mx-auto mb-12">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-medium text-gray-700">{t('privacyDisclaimer.title')}</h3>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600 pl-8">
          <div className="flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            <span>{t('privacyDisclaimer.items.imageStorage')}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            <span>{t('privacyDisclaimer.items.noPersonalInfo')}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            <span>{t('privacyDisclaimer.items.forEntertainment')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}