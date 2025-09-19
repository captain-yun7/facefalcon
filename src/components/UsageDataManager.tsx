'use client';

import React, { useState } from 'react';

interface Stats {
  totalRecords: number;
  oldestRecord: string | null;
  newestRecord: string | null;
  fileSize: number;
}

export default function UsageDataManager() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/monitoring/usage?action=stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const addTestData = async (days: number) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`/api/monitoring/usage?action=add-test-data&days=${days}`);
      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ ${days}일간의 테스트 데이터가 추가되었습니다.`);
        await fetchStats();
      } else {
        setMessage('❌ 테스트 데이터 추가에 실패했습니다.');
      }
    } catch (error) {
      setMessage('❌ 오류가 발생했습니다.');
      console.error('Failed to add test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('ko-KR');
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">📊 사용량 데이터 관리</h3>
      
      {/* 통계 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold text-gray-700 mb-2">저장된 데이터</h4>
          <p className="text-2xl font-bold text-blue-600">
            {stats ? stats.totalRecords.toLocaleString() : '-'}
          </p>
          <p className="text-sm text-gray-500">총 API 호출 기록</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold text-gray-700 mb-2">파일 크기</h4>
          <p className="text-2xl font-bold text-green-600">
            {stats ? formatFileSize(stats.fileSize) : '-'}
          </p>
          <p className="text-sm text-gray-500">디스크 사용량</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold text-gray-700 mb-2">가장 오래된 기록</h4>
          <p className="text-sm text-gray-600">
            {formatDate(stats?.oldestRecord || null)}
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold text-gray-700 mb-2">가장 최근 기록</h4>
          <p className="text-sm text-gray-600">
            {formatDate(stats?.newestRecord || null)}
          </p>
        </div>
      </div>

      {/* 테스트 데이터 추가 */}
      <div className="border-t pt-6">
        <h4 className="font-semibold mb-4">🔧 테스트 데이터 추가</h4>
        <p className="text-sm text-gray-600 mb-4">
          과거 사용량 데이터가 없다면 테스트 데이터를 추가하여 대시보드를 확인할 수 있습니다.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => addTestData(3)}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition"
          >
            3일 데이터 추가
          </button>
          <button
            onClick={() => addTestData(7)}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition"
          >
            7일 데이터 추가
          </button>
          <button
            onClick={() => addTestData(30)}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 transition"
          >
            30일 데이터 추가
          </button>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition"
          >
            🔄 새로고침
          </button>
        </div>

        {loading && (
          <div className="flex items-center text-blue-600 mb-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            테스트 데이터 생성 중...
          </div>
        )}

        {message && (
          <div className="p-3 rounded bg-gray-100 text-sm">
            {message}
          </div>
        )}
      </div>

      {/* 주의사항 */}
      <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <div className="flex">
          <div className="flex-shrink-0">⚠️</div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>주의:</strong> 테스트 데이터는 실제 API 호출이 아닌 가상의 데이터입니다. 
              실제 사용량은 Rekognition API를 호출할 때마다 자동으로 기록됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}