import { NextResponse } from 'next/server';
import {
  getRekognitionMetrics,
  listRekognitionMetrics,
  getTodayAPICallCount,
  estimateRealTimeCost,
} from '@/lib/aws/cost-monitoring';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'list') {
      const metrics = await listRekognitionMetrics();
      return NextResponse.json({ metrics });
    }

    if (action === 'today') {
      const apiCallCount = await getTodayAPICallCount();
      const estimatedCost = estimateRealTimeCost(apiCallCount);
      return NextResponse.json({
        apiCallCount,
        estimatedCost,
      });
    }

    const metricName = searchParams.get('metricName') || 'SuccessfulAPIRequestCount';
    const hours = parseInt(searchParams.get('hours') || '24', 10);

    const metrics = await getRekognitionMetrics(metricName, hours);
    return NextResponse.json({ metrics });
  } catch (error) {
    console.error('Error in metrics API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics data' },
      { status: 500 }
    );
  }
}