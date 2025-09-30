import { NextResponse } from 'next/server';

const FACE_AI_API_URL = process.env.FACE_AI_API_URL || 'http://localhost:8000';

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image is required' },
        { status: 400 }
      );
    }

    // Face AI 백엔드 API 호출
    const response = await fetch(`${FACE_AI_API_URL}/estimate-age`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: data.error || 'Age estimation failed' 
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      metadata: data.metadata,
    });

  } catch (error) {
    console.error('Age estimation API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}