/**
 * 가족 유사도 분석 API 엔드포인트
 * 부모-자녀 특화 얼굴 닮음 분석
 */

import { NextRequest, NextResponse } from 'next/server';
import { hybridFaceAnalysis } from '@/lib/hybrid-face-analysis';

export async function POST(request: NextRequest) {
  console.log('📥 [/api/family-similarity] Request received');
  
  try {
    const body = await request.json();
    console.log('📦 Request body keys:', Object.keys(body));
    
    const { parentImage, childImage, parentAge, childAge } = body;

    // 입력 데이터 검증 및 로깅
    console.log('🔍 Validating input data:', {
      parentImageLength: parentImage?.length || 0,
      childImageLength: childImage?.length || 0,
      parentImagePrefix: parentImage?.substring(0, 50),
      childImagePrefix: childImage?.substring(0, 50),
      parentAge,
      childAge
    });

    // 입력 검증
    if (!parentImage || !childImage) {
      console.error('❌ Missing required images');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Parent image and child image are required' 
        },
        { status: 400 }
      );
    }

    // 이미지 형식 검증
    const isParentBase64 = parentImage.includes('base64') || !parentImage.startsWith('data:');
    const isChildBase64 = childImage.includes('base64') || !childImage.startsWith('data:');
    console.log('📷 Image format check:', {
      parentIsBase64: isParentBase64,
      childIsBase64: isChildBase64
    });

    console.log('🚀 Calling hybridFaceAnalysis.compareFamilyFaces...');
    
    // 가족 유사도 분석 수행
    const result = await hybridFaceAnalysis.compareFamilyFaces(
      parentImage,
      childImage,
      parentAge,
      childAge
    );

    console.log('📊 Analysis result:', {
      success: result.success,
      hasData: !!result.data,
      error: result.error,
      dataKeys: result.data ? Object.keys(result.data) : [],
      similarity: result.data?.similarity,
      confidence: result.data?.confidence
    });

    if (!result.success) {
      console.error('❌ Analysis failed:', result.error);
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Family similarity analysis failed' 
        },
        { status: 500 }
      );
    }

    const response = {
      success: true,
      data: result.data,
      metadata: {
        provider: 'hybrid',
        analysis_type: 'family_similarity',
        timestamp: new Date().toISOString(),
      }
    };

    console.log('✅ Sending success response:', {
      success: response.success,
      dataKeys: Object.keys(response.data || {}),
      similarity: response.data?.similarity,
      confidence: response.data?.confidence
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('💥 Family similarity API error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/family-similarity',
    description: 'Family similarity analysis using hybrid AI system',
    methods: ['POST'],
    parameters: {
      parentImage: 'Base64 encoded parent image (required)',
      childImage: 'Base64 encoded child image (required)', 
      parentAge: 'Parent age in years (optional)',
      childAge: 'Child age in years (optional)'
    },
    response: {
      family_similarity: 'Overall family similarity score (0-100)',
      base_similarity: 'Basic face similarity score (0-100)',
      age_corrected_similarity: 'Age-adjusted similarity score (0-100)',
      feature_breakdown: 'Detailed feature-by-feature analysis',
      confidence: 'Analysis confidence score (0-100)',
      explanation: 'Human-readable explanations for each feature',
      similarity_level: 'Categorical similarity level'
    }
  });
}