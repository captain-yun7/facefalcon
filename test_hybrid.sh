#!/bin/bash

echo "🔗 하이브리드 얼굴 분석 시스템 통합 테스트"
echo ""

# 하이브리드 상태 테스트
echo "=== 하이브리드 상태 테스트 ==="
curl -s http://localhost:3000/api/hybrid/status | jq '.'
echo ""

# 간단한 얼굴 비교 테스트 (base64 없이)
echo "=== 얼굴 비교 API 구조 테스트 ==="
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"sourceImage": "test", "targetImage": "test"}' \
  http://localhost:3000/api/rekognition/compare-faces
echo ""
echo ""

# 설정 변경 테스트
echo "=== 공급자 설정 변경 테스트 ==="
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"action": "update-config", "config": {"provider": "python"}}' \
  http://localhost:3000/api/hybrid/status | jq '.data.newConfig.provider'

# 다시 하이브리드로 변경
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"action": "update-config", "config": {"provider": "hybrid", "primaryProvider": "python"}}' \
  http://localhost:3000/api/hybrid/status | jq '.data.newConfig'
echo ""

echo "✨ 하이브리드 통합 테스트 완료!"