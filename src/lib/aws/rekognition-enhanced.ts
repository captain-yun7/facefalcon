import { RekognitionClient, CompareFacesCommand, DetectFacesCommand, QualityFilter } from '@aws-sdk/client-rekognition';
import { FaceComparisonResult, FaceDetails, ApiResponse } from '@/lib/types';

const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface EnhancedComparisonOptions {
  similarityThreshold?: number;
  qualityFilter?: QualityFilter;
  multipleAngles?: boolean;
}

interface EnhancedComparisonResult extends FaceComparisonResult {
  faceQuality: {
    sourceQuality: number;
    targetQuality: number;
  };
  confidence: {
    sourceConfidence: number;
    targetConfidence: number;
  };
  recommendedThreshold: number;
  analysisNotes: string[];
}

export async function enhancedCompareFaces(
  sourceImageBase64: string,
  targetImageBase64: string,
  options: EnhancedComparisonOptions = {}
): Promise<ApiResponse<EnhancedComparisonResult>> {
  try {
    const {
      similarityThreshold = 1, // 최소값으로 설정
      qualityFilter = QualityFilter.MEDIUM,
      multipleAngles = false
    } = options;

    console.log('=== Enhanced Face Comparison ===');
    console.log('Options:', { similarityThreshold, qualityFilter, multipleAngles });

    const sourceImage = Buffer.from(sourceImageBase64.replace(/^data:image\/[a-z]+;base64,/, ''), 'base64');
    const targetImage = Buffer.from(targetImageBase64.replace(/^data:image\/[a-z]+;base64,/, ''), 'base64');

    // 1. 얼굴 품질 분석 먼저 수행
    const [sourceQuality, targetQuality] = await Promise.all([
      analyzeFaceQuality(sourceImage),
      analyzeFaceQuality(targetImage)
    ]);

    console.log('Face quality analysis:', {
      source: sourceQuality,
      target: targetQuality
    });

    // 2. 품질 기반 임계값 조정
    const adjustedThreshold = adjustThresholdBasedOnQuality(
      similarityThreshold,
      sourceQuality.averageQuality,
      targetQuality.averageQuality
    );

    console.log('Adjusted threshold:', adjustedThreshold);

    // 3. 향상된 얼굴 비교
    const command = new CompareFacesCommand({
      SourceImage: { Bytes: sourceImage },
      TargetImage: { Bytes: targetImage },
      SimilarityThreshold: adjustedThreshold,
      QualityFilter: qualityFilter,
    });

    const response = await rekognitionClient.send(command);
    console.log('Enhanced comparison result:', response);

    // 4. 결과 분석 및 개선
    const analysisNotes: string[] = [];
    let finalSimilarity = response.FaceMatches?.[0]?.Similarity || 0;

    // 품질이 낮으면 경고 추가
    if (sourceQuality.averageQuality < 70) {
      analysisNotes.push('소스 이미지 품질이 낮아 정확도가 떨어질 수 있습니다.');
    }
    if (targetQuality.averageQuality < 70) {
      analysisNotes.push('타겟 이미지 품질이 낮아 정확도가 떨어질 수 있습니다.');
    }

    // 임계값 근처의 결과에 대한 추가 분석
    if (finalSimilarity > 0 && finalSimilarity < adjustedThreshold + 10) {
      analysisNotes.push('유사도가 임계값 근처입니다. 추가 검증을 권장합니다.');
    }

    // 품질 기반 신뢰도 계산
    const confidenceAdjustment = Math.min(sourceQuality.averageQuality, targetQuality.averageQuality) / 100;
    const adjustedConfidence = finalSimilarity * confidenceAdjustment;

    if (adjustedConfidence < finalSimilarity * 0.9) {
      analysisNotes.push('이미지 품질로 인해 실제 유사도는 더 높을 수 있습니다.');
    }

    const result: EnhancedComparisonResult = {
      similarity: finalSimilarity,
      faceMatches: response.FaceMatches?.map(match => ({
        similarity: match.Similarity || 0,
        face: {
          boundingBox: {
            width: match.Face?.BoundingBox?.Width || 0,
            height: match.Face?.BoundingBox?.Height || 0,
            left: match.Face?.BoundingBox?.Left || 0,
            top: match.Face?.BoundingBox?.Top || 0,
          },
          confidence: match.Face?.Confidence || 0,
        },
      })) || [],
      sourceImageFace: response.SourceImageFace ? {
        boundingBox: {
          width: response.SourceImageFace.BoundingBox?.Width || 0,
          height: response.SourceImageFace.BoundingBox?.Height || 0,
          left: response.SourceImageFace.BoundingBox?.Left || 0,
          top: response.SourceImageFace.BoundingBox?.Top || 0,
        },
        confidence: response.SourceImageFace.Confidence || 0,
      } : undefined,
      unmatchedFaces: response.UnmatchedFaces?.map(face => ({
        boundingBox: {
          width: face.BoundingBox?.Width || 0,
          height: face.BoundingBox?.Height || 0,
          left: face.BoundingBox?.Left || 0,
          top: face.BoundingBox?.Top || 0,
        },
        confidence: face.Confidence || 0,
      })) || [],
      faceQuality: {
        sourceQuality: sourceQuality.averageQuality,
        targetQuality: targetQuality.averageQuality,
      },
      confidence: {
        sourceConfidence: sourceQuality.faceConfidence,
        targetConfidence: targetQuality.faceConfidence,
      },
      recommendedThreshold: adjustedThreshold,
      analysisNotes,
    };

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error in enhanced face comparison:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

async function analyzeFaceQuality(imageBuffer: Buffer) {
  try {
    const command = new DetectFacesCommand({
      Image: { Bytes: imageBuffer },
      Attributes: ['ALL'],
    });

    const response = await rekognitionClient.send(command);
    const faceDetails = response.FaceDetails?.[0];

    if (!faceDetails) {
      return {
        averageQuality: 0,
        faceConfidence: 0,
        brightness: 0,
        sharpness: 0,
      };
    }

    const brightness = faceDetails.Quality?.Brightness || 0;
    const sharpness = faceDetails.Quality?.Sharpness || 0;
    const faceConfidence = faceDetails.Confidence || 0;

    // 품질 점수 계산 (0-100)
    const averageQuality = (brightness + sharpness + faceConfidence) / 3;

    return {
      averageQuality,
      faceConfidence,
      brightness,
      sharpness,
    };
  } catch (error) {
    console.error('Error analyzing face quality:', error);
    return {
      averageQuality: 50, // 기본값
      faceConfidence: 50,
      brightness: 50,
      sharpness: 50,
    };
  }
}

function adjustThresholdBasedOnQuality(
  originalThreshold: number,
  sourceQuality: number,
  targetQuality: number
): number {
  const avgQuality = (sourceQuality + targetQuality) / 2;
  
  // 품질이 높으면 임계값을 높이고, 낮으면 임계값을 낮춤
  if (avgQuality > 80) {
    return Math.min(originalThreshold + 10, 95);
  } else if (avgQuality < 60) {
    return Math.max(originalThreshold - 15, 30);
  }
  
  return originalThreshold;
}

// 다중 각도 비교 (향후 확장용)
export async function multiAngleComparison(
  sourceImages: string[],
  targetImages: string[]
): Promise<ApiResponse<{ averageSimilarity: number; individual: number[] }>> {
  try {
    const comparisons: number[] = [];
    
    for (const sourceImg of sourceImages) {
      for (const targetImg of targetImages) {
        const result = await enhancedCompareFaces(sourceImg, targetImg);
        if (result.success && result.data) {
          comparisons.push(result.data.similarity);
        }
      }
    }
    
    const averageSimilarity = comparisons.length > 0 
      ? comparisons.reduce((a, b) => a + b, 0) / comparisons.length 
      : 0;
    
    return {
      success: true,
      data: {
        averageSimilarity,
        individual: comparisons,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Multi-angle comparison failed',
    };
  }
}