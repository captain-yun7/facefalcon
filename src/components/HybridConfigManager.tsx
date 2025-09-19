'use client';

import React, { useState, useEffect } from 'react';

interface ProviderStatus {
  aws: { available: boolean; error?: string };
  python: { available: boolean; error?: string };
  current: string;
}

interface HybridConfig {
  provider: 'aws' | 'python' | 'hybrid';
  primaryProvider?: 'aws' | 'python';
  fallbackEnabled: boolean;
  usePythonForBatch: boolean;
  awsBudgetLimit: number;
  pythonTimeout: number;
}

interface HybridStatus {
  providers: ProviderStatus;
  config: HybridConfig;
  recommendations: string[];
}

export default function HybridConfigManager() {
  const [status, setStatus] = useState<HybridStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [config, setConfig] = useState<HybridConfig | null>(null);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/hybrid/status');
      const data = await response.json();
      
      if (data.success) {
        setStatus(data.data);
        setConfig(data.data.config);
      }
    } catch (error) {
      console.error('Failed to fetch hybrid status:', error);
    } finally {
      setLoading(false);
    }
  };

  const testProviders = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/hybrid/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-providers' }),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchStatus(); // 상태 새로고침
      }
    } catch (error) {
      console.error('Failed to test providers:', error);
    } finally {
      setTesting(false);
    }
  };

  const updateConfig = async (newConfig: Partial<HybridConfig>) => {
    try {
      const response = await fetch('/api/hybrid/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'update-config', 
          config: { ...config, ...newConfig } 
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setConfig(data.data.newConfig);
        await fetchStatus(); // 상태 새로고침
      }
    } catch (error) {
      console.error('Failed to update config:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!status || !config) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-800">하이브리드 상태를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 현재 상태 */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            🔗 하이브리드 얼굴 분석 상태
          </h3>
          <button
            onClick={testProviders}
            disabled={testing}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {testing ? '테스트 중...' : '상태 확인'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* AWS 상태 */}
          <div className={`p-4 rounded border-2 ${
            status.providers.aws.available 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center space-x-2">
              <span className="text-lg">☁️</span>
              <div>
                <h4 className="font-medium">AWS Rekognition</h4>
                <p className={`text-sm ${
                  status.providers.aws.available ? 'text-green-700' : 'text-red-700'
                }`}>
                  {status.providers.aws.available ? '사용 가능' : '사용 불가'}
                </p>
                {status.providers.aws.error && (
                  <p className="text-xs text-red-600 mt-1">
                    {status.providers.aws.error}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Python API 상태 */}
          <div className={`p-4 rounded border-2 ${
            status.providers.python.available 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🐍</span>
              <div>
                <h4 className="font-medium">Python API</h4>
                <p className={`text-sm ${
                  status.providers.python.available ? 'text-green-700' : 'text-red-700'
                }`}>
                  {status.providers.python.available ? '사용 가능' : '사용 불가'}
                </p>
                {status.providers.python.error && (
                  <p className="text-xs text-red-600 mt-1">
                    {status.providers.python.error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 추천 사항 */}
        {status.recommendations.length > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="font-medium text-yellow-800 mb-2">💡 추천 사항</h4>
            <ul className="space-y-1">
              {status.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-yellow-700">
                  • {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 설정 패널 */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          ⚙️ 하이브리드 설정
        </h3>

        <div className="space-y-4">
          {/* Provider 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              얼굴 분석 공급자
            </label>
            <select
              value={config.provider}
              onChange={(e) => updateConfig({ 
                provider: e.target.value as 'aws' | 'python' | 'hybrid' 
              })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="aws">AWS Rekognition만 사용</option>
              <option value="python">Python API만 사용</option>
              <option value="hybrid">하이브리드 모드</option>
            </select>
          </div>

          {/* 하이브리드 모드 설정 */}
          {config.provider === 'hybrid' && (
            <div className="pl-4 border-l-2 border-blue-200 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주 공급자
                </label>
                <select
                  value={config.primaryProvider}
                  onChange={(e) => updateConfig({ 
                    primaryProvider: e.target.value as 'aws' | 'python' 
                  })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="python">Python API 우선</option>
                  <option value="aws">AWS Rekognition 우선</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="fallback"
                  checked={config.fallbackEnabled}
                  onChange={(e) => updateConfig({ fallbackEnabled: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="fallback" className="text-sm text-gray-700">
                  장애 시 대체 공급자 사용
                </label>
              </div>
            </div>
          )}

          {/* 배치 처리 설정 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="batch"
              checked={config.usePythonForBatch}
              onChange={(e) => updateConfig({ usePythonForBatch: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="batch" className="text-sm text-gray-700">
              배치 작업에 Python API 우선 사용 (비용 절약)
            </label>
          </div>

          {/* 현재 설정 요약 */}
          <div className="p-3 bg-gray-50 rounded text-sm">
            <strong>현재 설정:</strong> {config.provider === 'hybrid' 
              ? `하이브리드 (${config.primaryProvider} 우선)` 
              : config.provider === 'aws' 
                ? 'AWS Rekognition' 
                : 'Python API'}
            {config.fallbackEnabled && ' + 장애조치'}
            {config.usePythonForBatch && ' + 배치 최적화'}
          </div>
        </div>
      </div>
    </div>
  );
}