import { NextRequest, NextResponse } from 'next/server';
import { enhancedCompareFaces } from '@/lib/aws/rekognition-enhanced';
import { QualityFilter } from '@aws-sdk/client-rekognition';

export async function POST(request: NextRequest) {
  try {
    const { 
      sourceImage, 
      targetImage, 
      similarityThreshold = 1,
      qualityFilter = "MEDIUM",
      multipleAngles = false 
    } = await request.json();

    console.log('=== Enhanced Compare Faces API Called ===');
    console.log('Parameters:', {
      sourceImageLength: sourceImage?.length,
      targetImageLength: targetImage?.length,
      similarityThreshold,
      qualityFilter,
      multipleAngles
    });

    if (!sourceImage || !targetImage) {
      return NextResponse.json(
        { success: false, error: 'Both source and target images are required' },
        { status: 400 }
      );
    }

    // QualityFilter 유효성 검사
    const validQualityFilters = ["NONE", "AUTO", "LOW", "MEDIUM", "HIGH"];
    if (!validQualityFilters.includes(qualityFilter)) {
      return NextResponse.json(
        { success: false, error: 'Invalid quality filter. Must be one of: NONE, AUTO, LOW, MEDIUM, HIGH' },
        { status: 400 }
      );
    }

    const result = await enhancedCompareFaces(
      sourceImage,
      targetImage,
      {
        similarityThreshold,
        qualityFilter: qualityFilter as QualityFilter,
        multipleAngles
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // 결과에 추가 정보 포함
    return NextResponse.json({
      ...result,
      metadata: {
        apiVersion: 'enhanced',
        processingTime: new Date().toISOString(),
        qualityAnalysis: {
          sourceQuality: result.data?.faceQuality.sourceQuality,
          targetQuality: result.data?.faceQuality.targetQuality,
          recommendedThreshold: result.data?.recommendedThreshold,
        },
        tips: result.data?.analysisNotes || []
      }
    });
  } catch (error) {
    console.error('Error in enhanced compare-faces API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}