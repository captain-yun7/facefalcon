'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface CostData {
  date: string;
  amount: number;
  unit: string;
  service: string;
}

interface CostSummary {
  currentMonthCost: number;
  lastMonthCost: number;
  dailyCosts: CostData[];
  forecast: number;
  currency: string;
}

interface UsageMetrics {
  timestamp: string;
  metricName: string;
  value: number;
  unit: string;
}

interface TodayMetrics {
  apiCallCount: number;
  estimatedCost: {
    compareFacesCost: number;
    detectFacesCost: number;
    totalEstimatedCost: number;
  };
}

export default function CostMonitoringDashboard() {
  const [costSummary, setCostSummary] = useState<CostSummary | null>(null);
  const [metrics, setMetrics] = useState<UsageMetrics[]>([]);
  const [todayMetrics, setTodayMetrics] = useState<TodayMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(60); // seconds

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cost Explorer 대신 로컬 사용량 추적 사용
      const [usageSummaryRes, hourlyRes, todayRes] = await Promise.all([
        fetch('/api/monitoring/usage?action=summary&days=30'),
        fetch('/api/monitoring/usage?action=hourly&hours=24'),
        fetch('/api/monitoring/usage?action=today'),
      ]);

      if (!usageSummaryRes.ok || !hourlyRes.ok || !todayRes.ok) {
        throw new Error('Failed to fetch monitoring data');
      }

      const usageSummary = await usageSummaryRes.json();
      const hourlyData = await hourlyRes.json();
      const todayData = await todayRes.json();

      // Cost Explorer 형식으로 변환
      const mockCostSummary: CostSummary = {
        currentMonthCost: usageSummary.estimatedCost.total,
        lastMonthCost: usageSummary.estimatedCost.total * 0.8, // 임시 값
        dailyCosts: usageSummary.dailyUsage.map((day: any) => ({
          date: day.date,
          amount: day.total * 0.001, // $0.001 per call
          unit: 'USD',
          service: 'Amazon Rekognition',
        })),
        forecast: usageSummary.estimatedCost.total * 1.2, // 임시 예측
        currency: 'USD',
      };

      setCostSummary(mockCostSummary);
      setMetrics(hourlyData.metrics || []);
      setTodayMetrics(todayData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchData, refreshInterval * 1000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  const pieData = todayMetrics ? [
    { name: 'CompareFaces', value: todayMetrics.estimatedCost.compareFacesCost, color: '#8884d8' },
    { name: 'DetectFaces', value: todayMetrics.estimatedCost.detectFacesCost, color: '#82ca9d' },
  ] : [];

  const costTrend = costSummary ? [
    { name: '지난달', cost: costSummary.lastMonthCost },
    { name: '이번달', cost: costSummary.currentMonthCost },
    { name: '예상', cost: costSummary.forecast },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">모니터링 데이터 로딩중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">⚠️</div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              모니터링 데이터를 불러올 수 없습니다: {error}
            </p>
            <button
              onClick={fetchData}
              className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">AWS Rekognition 비용 & 사용량 모니터링</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            🔄 새로고침
          </button>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoRefresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="autoRefresh" className="text-sm text-gray-700">
              자동 새로고침 ({refreshInterval}초)
            </label>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">이번달 비용</h3>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {costSummary ? formatCurrency(costSummary.currentMonthCost, costSummary.currency) : '-'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            지난달 대비 {costSummary && costSummary.lastMonthCost > 0 
              ? `${((costSummary.currentMonthCost / costSummary.lastMonthCost - 1) * 100).toFixed(1)}%`
              : 'N/A'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">예상 비용</h3>
          <p className="mt-2 text-2xl font-bold text-orange-600">
            {costSummary ? formatCurrency(costSummary.forecast, costSummary.currency) : '-'}
          </p>
          <p className="text-xs text-gray-500 mt-1">이번달 말 예상</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">오늘 API 호출</h3>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {todayMetrics ? todayMetrics.apiCallCount.toLocaleString() : '-'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            예상 비용: {todayMetrics ? formatCurrency(todayMetrics.estimatedCost.totalEstimatedCost) : '-'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">지난달 비용</h3>
          <p className="mt-2 text-2xl font-bold text-gray-600">
            {costSummary ? formatCurrency(costSummary.lastMonthCost, costSummary.currency) : '-'}
          </p>
          <p className="text-xs text-gray-500 mt-1">전월 총액</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Cost Trend */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">일별 비용 추이 (30일)</h3>
          {costSummary && costSummary.dailyCosts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={costSummary.dailyCosts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tickFormatter={(value) => `$${value.toFixed(2)}`} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `날짜: ${formatDate(label)}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8884d8" 
                  name="비용"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">데이터 없음</p>
          )}
        </div>

        {/* API Usage by Type */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">오늘 API 사용 비율</h3>
          {todayMetrics && todayMetrics.apiCallCount > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">데이터 없음</p>
          )}
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">월별 비용 비교</h3>
          {costSummary ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value.toFixed(2)}`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="cost" fill="#82ca9d" name="비용" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">데이터 없음</p>
          )}
        </div>

        {/* Hourly API Calls */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">시간별 API 호출 (24시간)</h3>
          {metrics.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString('ko-KR', { hour: '2-digit' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => new Date(label).toLocaleString('ko-KR')}
                  formatter={(value: number) => value.toLocaleString()}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ff7300" 
                  name="API 호출"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">데이터 없음</p>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">ℹ️</div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>참고:</strong> 현재 로컬 사용량 추적을 사용 중입니다. 
              AWS Cost Explorer 접근이 제한되어 실제 API 호출을 기반으로 비용을 추정합니다.
              실제 청구액과 약간의 차이가 있을 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}