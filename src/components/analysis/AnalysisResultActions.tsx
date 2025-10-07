'use client';

import React from 'react';
import { useTranslations } from '@/components/TranslationsProvider';

interface AnalysisResultActionsProps {
  onReset: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onCopyLink?: () => void;
  showDownload?: boolean;
  showShare?: boolean;
  showCopyLink?: boolean;
  isLoading?: boolean;
  className?: string;
}

export default function AnalysisResultActions({
  onReset,
  onDownload,
  onShare,
  onCopyLink,
  showDownload = true,
  showShare = true,
  showCopyLink = true,
  isLoading = false,
  className = ''
}: AnalysisResultActionsProps) {
  const { t } = useTranslations();
  return (
    <div className={`flex flex-wrap justify-center gap-2 md:gap-3 mt-8 ${className}`}>
      {/* 다시 분석하기 버튼 */}
      <button
        onClick={onReset}
        disabled={isLoading}
        className="p-3 md:px-6 md:py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
        aria-label={t('results.tryAgain')}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="hidden md:inline">{t('results.tryAgain')}</span>
        </div>
      </button>

      {/* 이미지 다운로드 버튼 */}
      {showDownload && onDownload && (
        <button
          onClick={onDownload}
          disabled={isLoading}
          className="p-3 md:px-6 md:py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
          aria-label={t('results.downloadImage')}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden md:inline">{t('results.downloadImage')}</span>
          </div>
        </button>
      )}

      {/* 결과 공유하기 버튼 */}
      {showShare && onShare && (
        <button
          onClick={onShare}
          disabled={isLoading}
          className="p-3 md:px-6 md:py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
          aria-label={t('results.shareResult')}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
            </svg>
            <span className="hidden md:inline">{t('results.shareResult')}</span>
          </div>
        </button>
      )}

      {/* 링크 복사 버튼 */}
      {showCopyLink && onCopyLink && (
        <button
          onClick={onCopyLink}
          disabled={isLoading}
          className="p-3 md:px-6 md:py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-medium disabled:opacity-50"
          aria-label={t('actions.copyLink')}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="hidden md:inline">{t('actions.copyLink')}</span>
          </div>
        </button>
      )}
    </div>
  );
}