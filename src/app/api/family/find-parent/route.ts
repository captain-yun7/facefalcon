/**
 * 가족 특화 부모 찾기 API 엔드포인트
 * 여러 부모 중 가장 닮은 부모를 가족 특화 분석으로 찾기
 */

import { NextRequest, NextResponse } from 'next/server';
import { hybridFaceAnalysis } from '@/lib/hybrid-face-analysis';

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { childImage, parentImages, childAge, useFamilyAnalysis } = requestData;

    // 입력 검증
    if (!childImage || !parentImages || !Array.isArray(parentImages)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Child image and parent images array are required' 
        },
        { status: 400 }
      );
    }

    if (parentImages.length < 2) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'At least 2 parent images are required' 
        },
        { status: 400 }
      );
    }

    if (parentImages.length > 10) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Maximum 10 parent images allowed' 
        },
        { status: 400 }
      );
    }

    const result = await hybridFaceAnalysis.findMostSimilarParentWithFamilyAnalysis(
      childImage,
      parentImages,
      childAge,
      useFamilyAnalysis
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    const matches = result.data?.matches || [];
    const bestMatch = matches.length > 0 ? matches[0] : null;

    const responseData = {
      success: true,
      data: {
        matches,
        bestMatch: bestMatch ? {
          imageIndex: bestMatch.imageIndex,
          similarity: bestMatch.similarity,
        } : null,
        analysis_type: useFamilyAnalysis ? 'family_similarity' : 'basic_similarity',
      },
      metadata: {
        provider: 'python',
        analysis_method: useFamilyAnalysis ? 'family_analysis' : 'basic_analysis',
        timestamp: new Date().toISOString(),
      }
    };
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('family/find-parent API error:', error);
    
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        errorMessage = '분석 시간이 초과되었습니다. 더 작은 이미지로 다시 시도해주세요.';
      } else if (error.message.includes('얼굴을 찾을 수 없습니다')) {
        errorMessage = '이미지에서 얼굴을 찾을 수 없습니다. 선명한 얼굴 사진을 사용해주세요.';
      }
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/family/find-parent',
    description: 'Find the most similar parent using family-specific analysis',
    methods: ['POST'],
    parameters: {
      childImage: 'Base64 encoded child image (required)',
      parentImages: 'Array of Base64 encoded parent images (2-10 required)',
      childAge: 'Child age in years (optional)'
    },
    response: {
      matches: 'Array of all parent matches sorted by family similarity',
      bestMatch: 'The most similar parent with highest family similarity score',
      analysis_type: 'Always "family_similarity" for this endpoint'
    }
  });
}