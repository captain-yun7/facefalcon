import { NextResponse } from 'next/server';
import { getCostSummary, getRekognitionCosts } from '@/lib/aws/cost-monitoring';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);

    if (searchParams.get('summary') === 'true') {
      const summary = await getCostSummary();
      return NextResponse.json(summary);
    }

    const costs = await getRekognitionCosts(days);
    return NextResponse.json({ costs });
  } catch (error) {
    console.error('Error in costs API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cost data' },
      { status: 500 }
    );
  }
}