import { RekognitionClient, CompareFacesCommand, DetectFacesCommand } from '@aws-sdk/client-rekognition';
import { FaceComparisonResult, FaceDetails, ApiResponse } from '@/lib/types';

console.log('AWS Configuration:', {
  region: process.env.AWS_REGION,
  hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyPrefix: process.env.AWS_ACCESS_KEY_ID?.substring(0, 4),
});

const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function compareFaces(
  sourceImageBase64: string,
  targetImageBase64: string,
  similarityThreshold: number = 1
): Promise<ApiResponse<FaceComparisonResult>> {
  try {
    console.log('=== compareFaces function called ===');
    console.log('similarityThreshold:', similarityThreshold);
    
    const sourceImage = Buffer.from(sourceImageBase64.replace(/^data:image\/[a-z]+;base64,/, ''), 'base64');
    const targetImage = Buffer.from(targetImageBase64.replace(/^data:image\/[a-z]+;base64,/, ''), 'base64');

    console.log('Source image buffer size:', sourceImage.length);
    console.log('Target image buffer size:', targetImage.length);

    const command = new CompareFacesCommand({
      SourceImage: { Bytes: sourceImage },
      TargetImage: { Bytes: targetImage },
      SimilarityThreshold: similarityThreshold,
    });

    console.log('Sending request to AWS Rekognition...');
    const response = await rekognitionClient.send(command);
    console.log('Raw AWS response:', JSON.stringify(response, null, 2));
    
    // 사용량 추적 (서버사이드에서는 DB나 파일에 저장하도록 수정 필요)
    if (typeof window === 'undefined') {
      // 서버사이드: 로그로만 기록
      console.log('[Usage Tracking] compareFaces API called');
    }

    const result: FaceComparisonResult = {
      similarity: response.FaceMatches?.[0]?.Similarity || 0,
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
    };

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error comparing faces:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function detectFaces(imageBase64: string): Promise<ApiResponse<FaceDetails[]>> {
  try {
    const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/[a-z]+;base64,/, ''), 'base64');

    const command = new DetectFacesCommand({
      Image: { Bytes: imageBuffer },
      Attributes: ['ALL'],
    });

    const response = await rekognitionClient.send(command);

    const faceDetails: FaceDetails[] = response.FaceDetails?.map(face => ({
      ageRange: {
        low: face.AgeRange?.Low || 0,
        high: face.AgeRange?.High || 0,
      },
      gender: {
        value: face.Gender?.Value || 'Unknown',
        confidence: face.Gender?.Confidence || 0,
      },
      emotions: face.Emotions?.map(emotion => ({
        type: emotion.Type || 'Unknown',
        confidence: emotion.Confidence || 0,
      })) || [],
      smile: {
        value: face.Smile?.Value || false,
        confidence: face.Smile?.Confidence || 0,
      },
      eyeglasses: {
        value: face.Eyeglasses?.Value || false,
        confidence: face.Eyeglasses?.Confidence || 0,
      },
      sunglasses: {
        value: face.Sunglasses?.Value || false,
        confidence: face.Sunglasses?.Confidence || 0,
      },
      beard: {
        value: face.Beard?.Value || false,
        confidence: face.Beard?.Confidence || 0,
      },
      mustache: {
        value: face.Mustache?.Value || false,
        confidence: face.Mustache?.Confidence || 0,
      },
      eyesOpen: {
        value: face.EyesOpen?.Value || false,
        confidence: face.EyesOpen?.Confidence || 0,
      },
      mouthOpen: {
        value: face.MouthOpen?.Value || false,
        confidence: face.MouthOpen?.Confidence || 0,
      },
      boundingBox: {
        width: face.BoundingBox?.Width || 0,
        height: face.BoundingBox?.Height || 0,
        left: face.BoundingBox?.Left || 0,
        top: face.BoundingBox?.Top || 0,
      },
      landmarks: face.Landmarks?.map(landmark => ({
        type: landmark.Type || '',
        x: landmark.X || 0,
        y: landmark.Y || 0,
      })) || [],
      pose: {
        roll: face.Pose?.Roll || 0,
        yaw: face.Pose?.Yaw || 0,
        pitch: face.Pose?.Pitch || 0,
      },
      quality: {
        brightness: face.Quality?.Brightness || 0,
        sharpness: face.Quality?.Sharpness || 0,
      },
      confidence: face.Confidence || 0,
    })) || [];

    return {
      success: true,
      data: faceDetails,
    };
  } catch (error) {
    console.error('Error detecting faces:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function findSimilarFaces(
  sourceImageBase64: string,
  targetImagesBase64: string[]
): Promise<ApiResponse<{ matches: Array<{ imageIndex: number; similarity: number; faceDetails?: FaceDetails }> }>> {
  try {
    const matches = [];

    for (let i = 0; i < targetImagesBase64.length; i++) {
      const comparisonResult = await compareFaces(sourceImageBase64, targetImagesBase64[i]);
      
      if (comparisonResult.success && comparisonResult.data) {
        const similarity = comparisonResult.data.similarity;
        
        // Get face details for the target image
        const faceDetailsResult = await detectFaces(targetImagesBase64[i]);
        const faceDetails = faceDetailsResult.success && faceDetailsResult.data ? faceDetailsResult.data[0] : undefined;
        
        matches.push({
          imageIndex: i,
          similarity,
          faceDetails,
        });
      }
    }

    // Sort by similarity (highest first)
    matches.sort((a, b) => b.similarity - a.similarity);

    return {
      success: true,
      data: { matches },
    };
  } catch (error) {
    console.error('Error finding similar faces:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}