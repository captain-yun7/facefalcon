import { NextRequest, NextResponse } from 'next/server';
import { hybridFaceAnalysis } from '@/lib/hybrid-face-analysis';

export async function POST(request: NextRequest) {
  try {
    const { sourceImage, targetImages } = await request.json();

    if (!sourceImage || !targetImages || !Array.isArray(targetImages)) {
      return NextResponse.json(
        { success: false, error: 'Source image and target images array are required' },
        { status: 400 }
      );
    }

    if (targetImages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one target image is required' },
        { status: 400 }
      );
    }

    if (targetImages.length > 10) {
      return NextResponse.json(
        { success: false, error: 'Maximum 10 target images allowed' },
        { status: 400 }
      );
    }

    // Use images as-is (already compressed on client side)
    const result = await hybridFaceAnalysis.findSimilarFaces(sourceImage, targetImages);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // Find the best match
    const matches = result.data?.matches || [];
    const bestMatch = matches.length > 0 ? matches[0] : null;

    return NextResponse.json({
      success: true,
      data: {
        matches,
        bestMatch: bestMatch ? {
          imageIndex: bestMatch.imageIndex,
          similarity: bestMatch.similarity,
        } : null,
      },
    });
  } catch (error) {
    console.error('Error in find-similar API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}