'use client';

import React, { useState } from 'react';

export default function CostOptimizationGuide() {
  const [dailyCalls, setDailyCalls] = useState(100);
  
  const calculateCosts = (calls: number) => {
    const monthlyCallsEstimate = calls * 30;
    const costPer1000 = 1.00;
    const monthlyCost = (monthlyCallsEstimate / 1000) * costPer1000;
    const yearlyCost = monthlyCost * 12;
    
    return {
      monthlyCallsEstimate,
      monthlyCost,
      yearlyCost,
      costPerCall: costPer1000 / 1000,
    };
  };

  const costs = calculateCosts(dailyCalls);

  const optimizationStrategies = [
    {
      title: "📸 이미지 크기 최적화",
      description: "이미지를 압축하여 업로드 시간 단축 (비용은 동일하지만 성능 향상)",
      impact: "성능 향상",
      difficulty: "쉬움",
    },
    {
      title: "🎯 유사도 임계값 조정", 
      description: "SimilarityThreshold를 높여서 불필요한 매칭 줄이기",
      impact: "호출 수 10-20% 감소",
      difficulty: "쉬움",
    },
    {
      title: "💾 결과 캐싱",
      description: "동일한 이미지 조합의 결과를 캐시하여 중복 호출 방지",
      impact: "호출 수 30-50% 감소", 
      difficulty: "중간",
    },
    {
      title: "⏰ 배치 처리",
      description: "실시간 대신 배치로 처리하여 호출 수 최적화",
      impact: "호출 수 20-40% 감소",
      difficulty: "중간",
    },
    {
      title: "🔄 프리 티어 활용",
      description: "AWS 프리 티어: 월 5,000건까지 무료 (첫 12개월)",
      impact: "월 $5 절약",
      difficulty: "없음",
    },
    {
      title: "📊 사용량 모니터링",
      description: "실시간 모니터링으로 예상 비용 초과 방지",
      impact: "예산 관리",
      difficulty: "쉬움",
    },
  ];

  const costTiers = [
    { name: "개인/테스트", dailyCalls: 50, color: "green" },
    { name: "소규모 앱", dailyCalls: 500, color: "blue" },
    { name: "중간 규모", dailyCalls: 2000, color: "yellow" },
    { name: "대규모", dailyCalls: 10000, color: "orange" },
    { name: "엔터프라이즈", dailyCalls: 33333, color: "red" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">💰 AWS Rekognition 비용 최적화 가이드</h2>
      
      {/* 비용 계산기 */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">📊 비용 계산기</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            일일 API 호출 수
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="1"
              max="50000"
              value={dailyCalls}
              onChange={(e) => setDailyCalls(parseInt(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              value={dailyCalls}
              onChange={(e) => setDailyCalls(parseInt(e.target.value) || 0)}
              className="w-24 px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600">월 예상 호출</p>
            <p className="text-2xl font-bold text-blue-600">
              {costs.monthlyCallsEstimate.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600">호출당 비용</p>
            <p className="text-2xl font-bold text-green-600">
              ${costs.costPerCall.toFixed(4)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600">월 예상 비용</p>
            <p className="text-2xl font-bold text-orange-600">
              ${costs.monthlyCost.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              약 {(costs.monthlyCost * 1300).toLocaleString()}원
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600">연 예상 비용</p>
            <p className="text-2xl font-bold text-red-600">
              ${costs.yearlyCost.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              약 {(costs.yearlyCost * 1300).toLocaleString()}원
            </p>
          </div>
        </div>
      </div>

      {/* 비용 구간별 가이드 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">📈 서비스 규모별 비용 가이드</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {costTiers.map((tier) => {
            const tierCosts = calculateCosts(tier.dailyCalls);
            return (
              <div 
                key={tier.name}
                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                  Math.abs(dailyCalls - tier.dailyCalls) < 1000 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setDailyCalls(tier.dailyCalls)}
              >
                <div className={`w-3 h-3 rounded-full mb-2 bg-${tier.color}-500`}></div>
                <p className="font-medium text-sm">{tier.name}</p>
                <p className="text-xs text-gray-600">일 {tier.dailyCalls.toLocaleString()}회</p>
                <p className="text-sm font-bold">${tierCosts.monthlyCost.toFixed(0)}/월</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 최적화 전략 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">🎯 비용 최적화 전략</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {optimizationStrategies.map((strategy, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{strategy.title}</h4>
                <span className={`text-xs px-2 py-1 rounded ${
                  strategy.difficulty === '쉬움' ? 'bg-green-100 text-green-800' :
                  strategy.difficulty === '중간' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {strategy.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{strategy.description}</p>
              <p className="text-sm font-medium text-blue-600">{strategy.impact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 100만건 시나리오 */}
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <h4 className="font-semibold text-red-800 mb-2">🚨 100만건 호출 시 비용</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-red-700">
              <strong>총 비용:</strong> $1,000 (약 130만원)
            </p>
          </div>
          <div>
            <p className="text-red-700">
              <strong>일평균:</strong> 33,333회 호출 필요
            </p>
          </div>
          <div>
            <p className="text-red-700">
              <strong>대안:</strong> 캐싱으로 50% 절약 시 $500
            </p>
          </div>
        </div>
      </div>

      {/* 프리 티어 정보 */}
      <div className="mt-6 bg-green-50 border-l-4 border-green-400 p-4 rounded">
        <h4 className="font-semibold text-green-800 mb-2">🎁 AWS 프리 티어</h4>
        <p className="text-sm text-green-700">
          <strong>신규 계정:</strong> 첫 12개월 동안 월 5,000건까지 무료 ($5 상당)
        </p>
      </div>
    </div>
  );
}