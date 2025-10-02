/**
 * Python Face Analysis API 클라이언트
 * InsightFace 기반 Python 서버와의 통신을 담당
 */

import getConfig from 'next/config';
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
    // Next.js config에서 환경변수 가져오기
    const { serverRuntimeConfig } = getConfig() || {};
    
    // 다양한 소스에서 환경변수 읽기 시도
    this.baseUrl = serverRuntimeConfig?.PYTHON_API_URL || 
                   process.env.PYTHON_API_URL || 
                   'http://localhost:8000';
    
    this.timeout = parseInt(
      serverRuntimeConfig?.PYTHON_API_TIMEOUT || 
      process.env.PYTHON_API_TIMEOUT || 
      '30000', 
      10
    );
    
    console.log('🔧 Python API Configuration:', {
      url: this.baseUrl,
      timeout: this.timeout,
      source: serverRuntimeConfig?.PYTHON_API_URL ? 'serverRuntimeConfig' : 
              process.env.PYTHON_API_URL ? 'process.env' : 
              'default'
    });
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
        console.log('❌ Python API 에러 응답:', errorData);
        
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        // FastAPI 유효성 검사 에러 처리
        if (errorData.detail && Array.isArray(errorData.detail)) {
          const messages = errorData.detail.map((err: any) => err.msg || err.message || '알 수 없는 오류');
          errorMessage = messages.join(', ');
        }
        // 기존 에러 구조 처리
        else if (errorData.error) {
          if (typeof errorData.error === 'string') {
            errorMessage = errorData.error;
          } else if (errorData.error.message) {
            errorMessage = errorData.error.message;
          } else if (errorData.error.details?.original_error) {
            errorMessage = errorData.error.details.original_error;
          } else {
            errorMessage = JSON.stringify(errorData.error);
          }
        }
        // success: false 형태의 에러
        else if (errorData.success === false && errorData.error) {
          if (typeof errorData.error === 'object') {
            errorMessage = errorData.error.message || errorData.error.details?.original_error || JSON.stringify(errorData.error);
          } else {
            errorMessage = String(errorData.error);
          }
        }
        
        console.log('❌ 처리된 에러 메시지:', errorMessage);
        throw new Error(errorMessage);
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
      console.log('🐍 Python API compareFaces 시작');
      console.log('- sourceImage 길이:', sourceImageBase64?.length || 0);
      console.log('- targetImage 길이:', targetImageBase64?.length || 0);
      console.log('- similarityThreshold:', similarityThreshold);
      
      // base64 데이터를 data URI 형식으로 변환
      const sourceDataUri = sourceImageBase64.startsWith('data:') 
        ? sourceImageBase64 
        : `data:image/jpeg;base64,${sourceImageBase64}`;
      const targetDataUri = targetImageBase64.startsWith('data:') 
        ? targetImageBase64 
        : `data:image/jpeg;base64,${targetImageBase64}`;
        
      console.log('🔄 Data URI 변환 완료');
      console.log('- sourceDataUri 시작 부분:', sourceDataUri.substring(0, 50));
      console.log('- targetDataUri 시작 부분:', targetDataUri.substring(0, 50));
        
      const requestBody = {
        source_image: sourceDataUri,
        target_image: targetDataUri,
        similarity_threshold: similarityThreshold,
      };
      
      console.log('📡 Python API 요청 전송 중...');
      const response = await this.makeRequest<PythonComparisonData>('/compare-faces', requestBody);

      console.log('📊 Python API 응답:', {
        success: response.success,
        hasData: !!response.data,
        error: response.error,
        similarity: response.data?.similarity
      });

      if (!response.success || !response.data) {
        console.log('❌ Python API 실패:', response.error?.message);
        return {
          success: false,
          error: response.error?.message || 'Python API failed',
        };
      }

      // 응답 데이터 검증
      console.log('🔍 응답 데이터 검증 중...');
      validateResponseData(response.data, 'python');

      // Python API 응답을 AWS Rekognition 호환 형식으로 정규화
      console.log('🔄 응답 데이터 정규화 중...');
      const result = normalizePythonFaceComparison(response.data);
      
      console.log('✅ 정규화된 결과:', {
        similarity: result.similarity,
        faceMatchesCount: result.faceMatches?.length || 0
      });

      return {
        success: true,
        data: result,
      };

    } catch (error) {
      console.error('❌ Python API compareFaces 에러:', error);
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

  async findMostSimilarParent(
    childImageBase64: string,
    parentImagesBase64: string[],
    childAge?: number,
    useFamilyAnalysis: boolean = true
  ): Promise<ApiResponse<any>> {
    try {
      console.log('🐍 Python API findMostSimilarParent 호출 시작');
      console.log('📊 요청 파라미터:', {
        childImageLength: childImageBase64?.length || 0,
        parentImagesCount: parentImagesBase64?.length || 0,
        childAge,
        useFamilyAnalysis
      });
      
      // base64 데이터를 data URI 형식으로 변환
      const childDataUri = childImageBase64.startsWith('data:') 
        ? childImageBase64 
        : `data:image/jpeg;base64,${childImageBase64}`;
      
      const parentDataUris = parentImagesBase64.map(img => 
        img.startsWith('data:') ? img : `data:image/jpeg;base64,${img}`
      );
      
      console.log('🔄 Data URI 변환 완료');
      console.log('📡 Python API 요청 준비:', {
        endpoint: '/find-most-similar-parent',
        childDataUriLength: childDataUri.length,
        parentDataUrisCount: parentDataUris.length
      });
        
      const response = await this.makeRequest<any>('/find-most-similar-parent', {
        child_image: childDataUri,
        parent_images: parentDataUris,
        child_age: childAge,
        use_family_analysis: useFamilyAnalysis,
      });

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error?.message || 'Python API failed',
        };
      }

      // 결과를 Next.js가 기대하는 형태로 변환
      const matches = response.data.matches.map((match: any) => ({
        imageIndex: match.image_index,
        similarity: match.family_similarity || match.similarity, // 가족 유사도 우선
        faceDetails: undefined, // 필요시 추가
      }));

      return {
        success: true,
        data: {
          matches,
          bestMatch: matches.length > 0 ? {
            imageIndex: matches[0].imageIndex,
            similarity: matches[0].similarity,
          } : null,
        },
      };

    } catch (error) {
      console.error('Python API findMostSimilarParent error:', error);
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
        signal: AbortSignal.timeout(2000), // 2초 타임아웃으로 단축
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