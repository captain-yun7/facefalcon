import { NextResponse } from 'next/server';
import { fileUsageStorage } from '@/lib/usage-storage';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'summary') {
      const days = parseInt(searchParams.get('days') || '30', 10);
      const summary = fileUsageStorage.getUsageSummary(days);
      return NextResponse.json(summary);
    }

    if (action === 'today') {
      const todayUsage = fileUsageStorage.getTodayUsage();
      return NextResponse.json({
        apiCallCount: todayUsage.totalCalls,
        estimatedCost: {
          compareFacesCost: todayUsage.estimatedCost.compareFaces,
          detectFacesCost: todayUsage.estimatedCost.detectFaces,
          totalEstimatedCost: todayUsage.estimatedCost.total,
        },
      });
    }

    if (action === 'hourly') {
      const hours = parseInt(searchParams.get('hours') || '24', 10);
      const hourlyData = fileUsageStorage.getHourlyUsage(hours);
      return NextResponse.json({ metrics: hourlyData });
    }

    if (action === 'stats') {
      const stats = fileUsageStorage.getStats();
      return NextResponse.json(stats);
    }

    if (action === 'add-test-data') {
      const days = parseInt(searchParams.get('days') || '7', 10);
      fileUsageStorage.addTestData(days);
      return NextResponse.json({ success: true, message: `Added test data for ${days} days` });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in usage API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { operation, metadata } = await request.json();
    
    if (!operation || !['compareFaces', 'detectFaces'].includes(operation)) {
      return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
    }

    fileUsageStorage.addRecord(operation, metadata);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking usage:', error);
    return NextResponse.json(
      { error: 'Failed to track usage' },
      { status: 500 }
    );
  }
}