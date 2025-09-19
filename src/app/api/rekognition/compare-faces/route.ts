import { NextRequest, NextResponse } from 'next/server';
import { hybridFaceAnalysis } from '@/lib/hybrid-face-analysis';

export async function POST(request: NextRequest) {
  try {
    const { sourceImage, targetImage, similarityThreshold = 1 } = await request.json();

    console.log('=== Compare Faces API Called ===');
    console.log('Source image length:', sourceImage?.length);
    console.log('Target image length:', targetImage?.length);
    console.log('Similarity threshold:', similarityThreshold);

    if (!sourceImage || !targetImage) {
      return NextResponse.json(
        { success: false, error: 'Both source and target images are required' },
        { status: 400 }
      );
    }

    // Use images as-is (already compressed on client side)
    console.log('Calling Hybrid Face Analysis...');
    const result = await hybridFaceAnalysis.compareFaces(
      sourceImage,
      targetImage,
      similarityThreshold
    );

    console.log('Hybrid Face Analysis result:', JSON.stringify(result, null, 2));

    // 사용량 추적
    if (result.success) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/monitoring/usage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operation: 'compareFaces' }),
        });
      } catch (trackingError) {
        console.warn('Failed to track usage:', trackingError);
      }
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in compare-faces API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}