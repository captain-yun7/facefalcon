/**
 * 하이브리드 얼굴 분석 클라이언트
 * AWS Rekognition과 Python API를 설정에 따라 선택적으로 사용
 */

import { FaceComparisonResult, FaceDetails, ApiResponse } from '@/lib/types';
import { compareFaces as awsCompareFaces, detectFaces as awsDetectFaces } from '@/lib/aws/rekognition';
import { pythonApiClient, PythonFamilySimilarityData } from '@/lib/python-api/client';
import { awsThresholdToPython, validateResponseData, compareResponses } from '@/lib/response-normalizer';

type Provider = 'aws' | 'python' | 'hybrid';

interface HybridConfig {
  provider: Provider;
  primaryProvider?: 'aws' | 'python';
  fallbackEnabled: boolean;
  usePythonForBatch: boolean;
  awsBudgetLimit: number;
  pythonTimeout: number;
}

class HybridFaceAnalysisClient {
  private config: HybridConfig;

  constructor() {
    this.config = {
      provider: (process.env.FACE_ANALYSIS_PROVIDER as Provider) || 'aws',
      primaryProvider: (process.env.HYBRID_PRIMARY_PROVIDER as 'aws' | 'python') || 'python',
      fallbackEnabled: process.env.HYBRID_FALLBACK_ENABLED === 'true',
      usePythonForBatch: process.env.USE_PYTHON_FOR_BATCH === 'true',
      awsBudgetLimit: parseFloat(process.env.AWS_MONTHLY_BUDGET_LIMIT || '100'),
      pythonTimeout: parseInt(process.env.PYTHON_API_TIMEOUT || '30000', 10),
    };

    console.log('🔗 Hybrid Face Analysis Config:', this.config);
  }

  private async selectProvider(operation: string, isBatch: boolean = false): Promise<'aws' | 'python'> {
    // 배치 작업 우선순위
    if (isBatch && this.config.usePythonForBatch) {
      const pythonHealthy = await pythonApiClient.isHealthy();
      if (pythonHealthy) {
        console.log(`Using Python for batch ${operation}`);
        return 'python';
      }
    }

    // Provider 설정에 따른 선택
    switch (this.config.provider) {
      case 'aws':
        console.log(`Using AWS for ${operation}`);
        return 'aws';
      
      case 'python':
        const pythonHealthy = await pythonApiClient.isHealthy();
        if (pythonHealthy) {
          console.log(`Using Python for ${operation}`);
          return 'python';
        } else if (this.config.fallbackEnabled) {
          console.log(`Python unavailable, falling back to AWS for ${operation}`);
          return 'aws';
        } else {
          throw new Error('Python API is unavailable and fallback is disabled');
        }
      
      case 'hybrid':
        // Primary provider 시도
        if (this.config.primaryProvider === 'python') {
          const pythonHealthy = await pythonApiClient.isHealthy();
          if (pythonHealthy) {
            console.log(`Using primary Python for ${operation}`);
            return 'python';
          } else if (this.config.fallbackEnabled) {
            console.log(`Primary Python unavailable, using fallback AWS for ${operation}`);
            return 'aws';
          }
        } else {
          // AWS가 primary인 경우 (비용 고려사항이 있을 수 있음)
          console.log(`☁️ Using primary AWS for ${operation}`);
          return 'aws';
        }
        break;
    }

    // 기본값
    return 'aws';
  }

  async compareFaces(
    sourceImageBase64: string,
    targetImageBase64: string,
    similarityThreshold: number = 1
  ): Promise<ApiResponse<FaceComparisonResult>> {
    try {
      const provider = await this.selectProvider('compareFaces');
      
      if (provider === 'python') {
        const result = await pythonApiClient.compareFaces(
          sourceImageBase64,
          targetImageBase64,
          awsThresholdToPython(similarityThreshold) // 정규화 함수 사용
        );

        // Python 성공시 응답 검증 후 반환
        if (result.success) {
          validateResponseData(result.data, 'python');
          return result;
        }

        // Python 실패시 AWS로 fallback (설정된 경우)
        if (this.config.fallbackEnabled) {
          console.log('🔄 Python failed, trying AWS fallback...');
          const awsResult = await awsCompareFaces(sourceImageBase64, targetImageBase64, similarityThreshold);
          
          if (awsResult.success) {
            validateResponseData(awsResult.data, 'aws');
          }
          
          return awsResult;
        }

        return result;
      } else {
        // AWS 사용
        const awsResult = await awsCompareFaces(sourceImageBase64, targetImageBase64, similarityThreshold);
        
        if (awsResult.success) {
          validateResponseData(awsResult.data, 'aws');
        }
        
        return awsResult;
      }

    } catch (error) {
      console.error('Hybrid compareFaces error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async detectFaces(imageBase64: string): Promise<ApiResponse<FaceDetails[]>> {
    try {
      const provider = await this.selectProvider('detectFaces');
      
      if (provider === 'python') {
        const result = await pythonApiClient.detectFaces(imageBase64);

        // Python 성공시 반환
        if (result.success) {
          return result;
        }

        // Python 실패시 AWS로 fallback (설정된 경우)
        if (this.config.fallbackEnabled) {
          console.log('🔄 Python failed, trying AWS fallback...');
          return await awsDetectFaces(imageBase64);
        }

        return result;
      } else {
        // AWS 사용
        return await awsDetectFaces(imageBase64);
      }

    } catch (error) {
      console.error('Hybrid detectFaces error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async findSimilarFaces(
    sourceImageBase64: string,
    targetImagesBase64: string[]
  ): Promise<ApiResponse<{ matches: Array<{ imageIndex: number; similarity: number; faceDetails?: FaceDetails }> }>> {
    try {
      const isBatch = targetImagesBase64.length > 1;
      const provider = await this.selectProvider('findSimilarFaces', isBatch);
      
      if (provider === 'python') {
        // Python API를 사용한 배치 처리
        const matches = [];

        for (let i = 0; i < targetImagesBase64.length; i++) {
          const comparisonResult = await pythonApiClient.compareFaces(
            sourceImageBase64,
            targetImagesBase64[i],
            0.01 // Python 0.0-1.0 범위에서 낮은 임계값
          );

          if (comparisonResult.success && comparisonResult.data) {
            // Python API 클라이언트에서 이미 백분율로 변환되어 돌아옴
            const similarity = comparisonResult.data.similarity;

            // 얼굴 세부정보 가져오기
            const faceDetailsResult = await pythonApiClient.detectFaces(targetImagesBase64[i]);
            const faceDetails = faceDetailsResult.success && faceDetailsResult.data 
              ? faceDetailsResult.data[0] 
              : undefined;

            matches.push({
              imageIndex: i,
              similarity,
              faceDetails,
            });
          }
        }

        // 유사도 기준 정렬 (높은 순)
        matches.sort((a, b) => b.similarity - a.similarity);

        return {
          success: true,
          data: { matches },
        };

      } else {
        // AWS Rekognition 사용 (기존 구현)
        const { findSimilarFaces } = await import('@/lib/aws/rekognition');
        return await findSimilarFaces(sourceImageBase64, targetImagesBase64);
      }

    } catch (error) {
      console.error('Hybrid findSimilarFaces error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getProviderStatus(): Promise<{
    aws: { available: boolean; error?: string };
    python: { available: boolean; error?: string };
    current: string;
  }> {
    const status = {
      aws: { available: false, error: undefined as string | undefined },
      python: { available: false, error: undefined as string | undefined },
      current: this.config.provider,
    };

    // AWS 상태 확인
    try {
      // AWS 자격 증명이 있는지 확인
      const hasAwsCredentials = !!(
        process.env.AWS_ACCESS_KEY_ID && 
        process.env.AWS_SECRET_ACCESS_KEY && 
        process.env.AWS_REGION
      );
      status.aws.available = hasAwsCredentials;
      if (!hasAwsCredentials) {
        status.aws.error = 'AWS credentials not configured';
      }
    } catch (error) {
      status.aws.error = error instanceof Error ? error.message : 'Unknown AWS error';
    }

    // Python API 상태 확인
    try {
      status.python.available = await pythonApiClient.isHealthy();
      if (!status.python.available) {
        status.python.error = 'Python API health check failed';
      }
    } catch (error) {
      status.python.error = error instanceof Error ? error.message : 'Python API unreachable';
    }

    return status;
  }

  getConfig(): HybridConfig {
    return { ...this.config };
  }

  async compareFamilyFaces(
    parentImageBase64: string,
    childImageBase64: string,
    parentAge?: number,
    childAge?: number
  ): Promise<ApiResponse<PythonFamilySimilarityData>> {
    try {
      const provider = await this.selectProvider('compareFamilyFaces');
      
      if (provider === 'python') {
        const result = await pythonApiClient.compareFamilyFaces(
          parentImageBase64,
          childImageBase64,
          parentAge,
          childAge
        );

        // Python 성공시 응답 반환
        if (result.success) {
          return result;
        }

        // Python 실패시 AWS로 fallback할 수 없음 (AWS는 가족 특화 분석 지원 안함)
        // 따라서 Python 실패시 오류 반환
        return result;
        
      } else {
        // AWS는 가족 특화 분석을 지원하지 않음
        return {
          success: false,
          error: 'AWS does not support family-specific analysis. Please use the family analysis page with Python API.',
        };
      }

    } catch (error) {
      console.error('Hybrid compareFamilyFaces error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  updateConfig(newConfig: Partial<HybridConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('Hybrid config updated:', this.config);
  }
}

export const hybridFaceAnalysis = new HybridFaceAnalysisClient();