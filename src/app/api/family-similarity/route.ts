/**
 * 가족 유사도 분석 API 엔드포인트
 * 부모-자녀 특화 얼굴 닮음 분석
 */

import { NextRequest, NextResponse } from 'next/server';
import { hybridFaceAnalysis } from '@/lib/hybrid-face-analysis';

export async function POST(request: NextRequest) {
  try {
    const { parentImage, childImage, parentAge, childAge } = await request.json();

    // 입력 검증
    if (!parentImage || !childImage) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Parent image and child image are required' 
        },
        { status: 400 }
      );
    }

    // 가족 유사도 분석 수행
    const result = await hybridFaceAnalysis.compareFamilyFaces(
      parentImage,
      childImage,
      parentAge,
      childAge
    );

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Family similarity analysis failed' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      metadata: {
        provider: 'hybrid',
        analysis_type: 'family_similarity',
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Family similarity API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
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