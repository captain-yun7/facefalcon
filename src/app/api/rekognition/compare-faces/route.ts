import { NextRequest, NextResponse } from 'next/server';
import { compareFaces } from '@/lib/aws/rekognition';

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
    console.log('Calling AWS Rekognition...');
    const result = await compareFaces(
      sourceImage,
      targetImage,
      similarityThreshold
    );

    console.log('AWS Rekognition result:', JSON.stringify(result, null, 2));

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