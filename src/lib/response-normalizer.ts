/**
 * AWS Rekognition과 Python API 응답 형식 정규화
 * 두 API의 서로 다른 응답 구조를 통일된 형식으로 변환
 */

import { FaceComparisonResult, FaceDetails, BoundingBox } from '@/lib/types';

export interface NormalizedBoundingBox {
  x: number;      // 0.0-1.0 범위의 상대 좌표
  y: number;      // 0.0-1.0 범위의 상대 좌표  
  width: number;  // 0.0-1.0 범위의 상대 크기
  height: number; // 0.0-1.0 범위의 상대 크기
}

/**
 * Python API의 바운딩 박스를 AWS 형식으로 변환
 */
export function normalizePythonBoundingBox(pythonBox: {
  x: number;
  y: number;
  width: number;
  height: number;
}): BoundingBox {
  return {
    left: pythonBox.x,     // Python의 x → AWS의 left
    top: pythonBox.y,      // Python의 y → AWS의 top
    width: pythonBox.width,
    height: pythonBox.height,
  };
}

/**
 * AWS의 바운딩 박스를 정규화된 형식으로 변환
 */
export function normalizeAwsBoundingBox(awsBox: BoundingBox): NormalizedBoundingBox {
  return {
    x: awsBox.left,
    y: awsBox.top,
    width: awsBox.width,
    height: awsBox.height,
  };
}

/**
 * Python API의 신뢰도/유사도 값을 AWS 형식으로 변환 (0.0-1.0 → 0-100)
 */
export function normalizePythonConfidence(pythonValue: number): number {
  return Math.min(100, Math.max(0, pythonValue * 100));
}

/**
 * AWS의 신뢰도/유사도 값을 정규화 (이미 0-100 범위)
 */
export function normalizeAwsConfidence(awsValue: number): number {
  return Math.min(100, Math.max(0, awsValue));
}

/**
 * Python API의 얼굴 비교 응답을 AWS 호환 형식으로 변환
 */
export function normalizePythonFaceComparison(pythonResponse: {
  similarity: number;
  confidence: number;
  face_matches: Array<{
    similarity: number;
    bounding_box: { x: number; y: number; width: number; height: number };
    confidence: number;
  }>;
  source_face?: {
    bounding_box: { x: number; y: number; width: number; height: number };
    confidence: number;
  };
  target_faces: Array<{
    bounding_box: { x: number; y: number; width: number; height: number };
    confidence: number;
  }>;
}): FaceComparisonResult {
  return {
    similarity: normalizePythonConfidence(pythonResponse.similarity),
    faceMatches: pythonResponse.face_matches.map(match => ({
      similarity: normalizePythonConfidence(match.similarity),
      face: {
        boundingBox: normalizePythonBoundingBox(match.bounding_box),
        confidence: normalizePythonConfidence(match.confidence),
      },
    })),
    sourceImageFace: pythonResponse.source_face ? {
      boundingBox: normalizePythonBoundingBox(pythonResponse.source_face.bounding_box),
      confidence: normalizePythonConfidence(pythonResponse.source_face.confidence),
    } : undefined,
    unmatchedFaces: pythonResponse.target_faces
      .filter(face => !pythonResponse.face_matches.some(match => 
        Math.abs(match.bounding_box.x - face.bounding_box.x) < 0.01 &&
        Math.abs(match.bounding_box.y - face.bounding_box.y) < 0.01
      ))
      .map(face => ({
        boundingBox: normalizePythonBoundingBox(face.bounding_box),
        confidence: normalizePythonConfidence(face.confidence),
      })),
  };
}

/**
 * Python API의 얼굴 감지 응답을 AWS 호환 형식으로 변환
 */
export function normalizePythonFaceDetection(pythonFaces: Array<{
  bounding_box: { x: number; y: number; width: number; height: number };
  confidence: number;
  age?: number;
  gender?: { value: string; confidence: number };
  landmarks?: Array<{ x: number; y: number; type: string }>;
}>): FaceDetails[] {
  return pythonFaces.map(face => ({
    ageRange: {
      low: face.age ? Math.max(0, face.age - 5) : 0,
      high: face.age ? Math.min(120, face.age + 5) : 0,
    },
    gender: {
      value: face.gender?.value || 'Unknown',
      confidence: face.gender ? normalizePythonConfidence(face.gender.confidence) : 0,
    },
    emotions: [], // InsightFace는 기본적으로 감정을 제공하지 않음
    smile: { value: false, confidence: 0 },
    eyeglasses: { value: false, confidence: 0 },
    sunglasses: { value: false, confidence: 0 },
    beard: { value: false, confidence: 0 },
    mustache: { value: false, confidence: 0 },
    eyesOpen: { value: true, confidence: 90 },
    mouthOpen: { value: false, confidence: 0 },
    boundingBox: normalizePythonBoundingBox(face.bounding_box),
    landmarks: face.landmarks?.map(landmark => ({
      type: landmark.type,
      x: landmark.x,
      y: landmark.y,
    })) || [],
    pose: { roll: 0, yaw: 0, pitch: 0 },
    quality: { brightness: 75, sharpness: 75 },
    confidence: normalizePythonConfidence(face.confidence),
  }));
}

/**
 * AWS의 유사도 임계값을 Python API용으로 변환 (0-100 → 0.0-1.0)
 */
export function awsThresholdToPython(awsThreshold: number): number {
  return Math.min(1.0, Math.max(0.0, awsThreshold / 100));
}

/**
 * Python의 유사도 임계값을 AWS용으로 변환 (0.0-1.0 → 0-100)
 */
export function pythonThresholdToAws(pythonThreshold: number): number {
  return Math.min(100, Math.max(0, pythonThreshold * 100));
}

/**
 * 응답 데이터의 품질을 검증하고 로그 출력
 */
export function validateResponseData(data: any, source: 'aws' | 'python'): boolean {
  if (!data) {
    console.warn(`❌ ${source.toUpperCase()} response data is null/undefined`);
    return false;
  }

  // 기본 필드 검증
  if (typeof data.similarity !== 'undefined') {
    const validRange = source === 'aws' ? [0, 100] : [0, 1];
    if (data.similarity < validRange[0] || data.similarity > validRange[1]) {
      console.warn(`⚠️ ${source.toUpperCase()} similarity out of range: ${data.similarity}`);
    }
  }

  console.log(`✅ ${source.toUpperCase()} response data validated`);
  return true;
}

/**
 * 디버깅용 응답 비교 함수
 */
export function compareResponses(awsData: any, pythonData: any): void {
  console.log('🔍 Response Comparison:');
  console.log('AWS:', JSON.stringify(awsData, null, 2));
  console.log('Python (normalized):', JSON.stringify(pythonData, null, 2));
  
  if (awsData?.similarity && pythonData?.similarity) {
    const diff = Math.abs(awsData.similarity - pythonData.similarity);
    console.log(`📊 Similarity difference: ${diff.toFixed(2)}%`);
  }
}