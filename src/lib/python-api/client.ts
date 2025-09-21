/**
 * Python Face Analysis API 클라이언트
 * InsightFace 기반 Python 서버와의 통신을 담당
 */

import { FaceComparisonResult, FaceDetails, ApiResponse } from '@/lib/types';
import { 
  normalizePythonFaceComparison, 
  normalizePythonFaceDetection,
  validateResponseData 
} from '@/lib/response-normalizer';

export interface PythonApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    processing_time_ms: number;
    model_version: string;
    request_id: string;
    timestamp: string;
  };
}

export interface PythonFaceDetail {
  bounding_box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  age?: number;
  gender?: {
    value: string;
    confidence: number;
  };
  landmarks?: Array<{
    x: number;
    y: number;
    type: string;
  }>;
  embedding?: number[];
}

export interface PythonComparisonData {
  similarity: number;
  confidence: number;
  face_matches: Array<{
    similarity: number;
    bounding_box: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    confidence: number;
    landmarks?: any;
  }>;
  source_face?: PythonFaceDetail;
  target_faces: PythonFaceDetail[];
}

export interface PythonDetectionData {
  faces: PythonFaceDetail[];
  face_count: number;
}

export interface PythonEmbeddingData {
  embedding: number[];
  bounding_box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  landmarks?: any;
}

export interface PythonFamilySimilarityData {
  similarity: number;         // 0.0-1.0 범위
  confidence: number;         // 0.0-1.0 범위
  parent_face: {
    bounding_box: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    confidence: number;
    age?: number;
  };
  child_face: {
    bounding_box: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    confidence: number;
    age?: number;
  };
}

class PythonApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = process.env.PYTHON_API_URL || 'http://localhost:8000';
    this.timeout = parseInt(process.env.PYTHON_API_TIMEOUT || '30000', 10);
  }

  private async makeRequest<T>(
    endpoint: string,
    body: any
  ): Promise<PythonApiResponse<T>> {
    try {
      console.log(`🐍 Python API: ${endpoint}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || 
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(`✅ Python API success: ${endpoint}`);
      return data;

    } catch (error) {
      console.error(`❌ Python API error: ${endpoint}`, error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Python API timeout');
      }
      
      throw error;
    }
  }

  async compareFaces(
    sourceImageBase64: string,
    targetImageBase64: string,
    similarityThreshold: number = 0.6
  ): Promise<ApiResponse<FaceComparisonResult>> {
    try {
      // base64 데이터를 data URI 형식으로 변환
      const sourceDataUri = sourceImageBase64.startsWith('data:') 
        ? sourceImageBase64 
        : `data:image/jpeg;base64,${sourceImageBase64}`;
      const targetDataUri = targetImageBase64.startsWith('data:') 
        ? targetImageBase64 
        : `data:image/jpeg;base64,${targetImageBase64}`;
        
      const response = await this.makeRequest<PythonComparisonData>('/compare-faces', {
        source_image: sourceDataUri,
        target_image: targetDataUri,
        similarity_threshold: similarityThreshold,
      });

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error?.message || 'Python API failed',
        };
      }

      // 응답 데이터 검증
      validateResponseData(response.data, 'python');

      // Python API 응답을 AWS Rekognition 호환 형식으로 정규화
      const result = normalizePythonFaceComparison(response.data);

      return {
        success: true,
        data: result,
      };

    } catch (error) {
      console.error('Python API compareFaces error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async detectFaces(imageBase64: string): Promise<ApiResponse<FaceDetails[]>> {
    try {
      // base64 데이터를 data URI 형식으로 변환
      const imageDataUri = imageBase64.startsWith('data:') 
        ? imageBase64 
        : `data:image/jpeg;base64,${imageBase64}`;
        
      const response = await this.makeRequest<PythonDetectionData>('/detect-faces', {
        image: imageDataUri,
        include_landmarks: true,
        include_attributes: true,
        max_faces: 10,
      });

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error?.message || 'Python API failed',
        };
      }

      // 응답 데이터 검증
      validateResponseData(response.data, 'python');

      // Python API 응답을 AWS Rekognition 호환 형식으로 정규화
      const faceDetails = normalizePythonFaceDetection(response.data.faces);

      return {
        success: true,
        data: faceDetails,
      };

    } catch (error) {
      console.error('Python API detectFaces error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async extractEmbedding(
    imageBase64: string,
    faceId: number = 0
  ): Promise<ApiResponse<{ embedding: number[]; confidence: number }>> {
    try {
      // base64 데이터를 data URI 형식으로 변환
      const imageDataUri = imageBase64.startsWith('data:') 
        ? imageBase64 
        : `data:image/jpeg;base64,${imageBase64}`;
        
      const response = await this.makeRequest<PythonEmbeddingData>('/extract-embedding', {
        image: imageDataUri,
        face_id: faceId,
        normalize: true,
      });

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error?.message || 'Python API failed',
        };
      }

      return {
        success: true,
        data: {
          embedding: response.data.embedding,
          // Python의 0.0-1.0 신뢰도를 AWS의 0-100 범위로 변환
          confidence: response.data.confidence * 100,
        },
      };

    } catch (error) {
      console.error('Python API extractEmbedding error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async compareFamilyFaces(
    parentImageBase64: string,
    childImageBase64: string,
    parentAge?: number,
    childAge?: number
  ): Promise<ApiResponse<PythonFamilySimilarityData>> {
    try {
      // base64 데이터를 data URI 형식으로 변환
      const parentDataUri = parentImageBase64.startsWith('data:') 
        ? parentImageBase64 
        : `data:image/jpeg;base64,${parentImageBase64}`;
      const childDataUri = childImageBase64.startsWith('data:') 
        ? childImageBase64 
        : `data:image/jpeg;base64,${childImageBase64}`;
        
      const response = await this.makeRequest<PythonFamilySimilarityData>('/compare-family-faces', {
        parent_image: parentDataUri,
        child_image: childDataUri,
        parent_age: parentAge,
        child_age: childAge,
      });

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error?.message || 'Python API failed',
        };
      }

      // Raw 데이터 그대로 반환 (0.0-1.0 범위 유지)
      return {
        success: true,
        data: response.data,
      };

    } catch (error) {
      console.error('Python API compareFamilyFaces error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5초 타임아웃
      });

      if (!response.ok) return false;

      const data = await response.json();
      return data.status === 'healthy' && data.model_loaded === true;

    } catch (error) {
      console.error('Python API health check failed:', error);
      return false;
    }
  }
}

export const pythonApiClient = new PythonApiClient();