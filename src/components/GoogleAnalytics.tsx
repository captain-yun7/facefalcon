'use client';

import Script from 'next/script';
import { AnalyticsEvent } from '@/lib/types/analytics';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    // 개발 환경에서는 GA를 로드하지 않음
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  );
}

// Analytics helper functions
export const analytics = {
  // Track custom events
  trackEvent: (eventData: AnalyticsEvent) => {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
      console.log('Analytics (dev):', eventData);
      return;
    }

    if (typeof window !== 'undefined' && window.gtag) {
      const { event_name, ...parameters } = eventData;
      window.gtag('event', event_name, parameters);
    }
  },

  // Analysis tracking
  trackAnalysisStart: (analysisType: 'parent-child' | 'who-most-similar' | 'age-estimation' | 'gender-estimation') => {
    analytics.trackEvent({
      event_name: 'analysis_start',
      analysis_type: analysisType
    });
  },

  trackAnalysisComplete: (
    analysisType: 'parent-child' | 'who-most-similar' | 'age-estimation' | 'gender-estimation',
    similarityScore?: number,
    confidenceScore?: number,
    processingTime?: number
  ) => {
    analytics.trackEvent({
      event_name: 'analysis_complete',
      analysis_type: analysisType,
      similarity_score: similarityScore,
      confidence_score: confidenceScore,
      processing_time: processingTime
    });
  },

  trackAnalysisError: (
    analysisType: 'parent-child' | 'who-most-similar' | 'age-estimation' | 'gender-estimation',
    errorType: string,
    errorMessage: string
  ) => {
    analytics.trackEvent({
      event_name: 'analysis_error',
      analysis_type: analysisType,
      error_type: errorType,
      error_message: errorMessage
    });
  },

  // User interaction tracking
  trackAnalysisTypeChange: (
    fromType: 'parent-child' | 'who-most-similar' | '',
    toType: 'parent-child' | 'who-most-similar'
  ) => {
    analytics.trackEvent({
      event_name: 'analysis_type_change',
      from_type: fromType,
      to_type: toType
    });
  },

  trackImageUpload: (
    imageType: 'parent' | 'child' | 'candidate' | 'age' | 'gender',
    fileSize?: number,
    fileType?: string
  ) => {
    analytics.trackEvent({
      event_name: 'image_upload',
      image_type: imageType,
      file_size: fileSize,
      file_type: fileType
    });
  },

  trackResultShare: (
    shareMethod: 'download' | 'web_share' | 'clipboard',
    analysisType: 'parent-child' | 'who-most-similar'
  ) => {
    analytics.trackEvent({
      event_name: 'result_share',
      share_method: shareMethod,
      analysis_type: analysisType
    });
  }
};