import { NextRequest, NextResponse } from 'next/server';
import { hybridFaceAnalysis } from '@/lib/hybrid-face-analysis';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking hybrid face analysis status...');

    const [providerStatus, config] = await Promise.all([
      hybridFaceAnalysis.getProviderStatus(),
      Promise.resolve(hybridFaceAnalysis.getConfig()),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        providers: providerStatus,
        config,
        recommendations: generateRecommendations(providerStatus, config),
      },
    });

  } catch (error) {
    console.error('Error getting hybrid status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get hybrid status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, config } = await request.json();

    if (action === 'update-config' && config) {
      hybridFaceAnalysis.updateConfig(config);
      
      return NextResponse.json({
        success: true,
        data: {
          message: 'Configuration updated successfully',
          newConfig: hybridFaceAnalysis.getConfig(),
        },
      });
    }

    if (action === 'test-providers') {
      const status = await hybridFaceAnalysis.getProviderStatus();
      
      return NextResponse.json({
        success: true,
        data: {
          message: 'Provider test completed',
          providers: status,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in hybrid status API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateRecommendations(providerStatus: any, config: any): string[] {
  const recommendations: string[] = [];

  // Python API 상태 기반 추천
  if (!providerStatus.python.available) {
    recommendations.push('Python API is not available. Consider starting the Python face analysis server.');
  } else if (config.provider === 'aws' && providerStatus.python.available) {
    recommendations.push('Python API is available and typically faster/cheaper for batch operations. Consider switching to hybrid mode.');
  }

  // AWS 상태 기반 추천
  if (!providerStatus.aws.available) {
    recommendations.push('AWS credentials are not configured. Set up AWS Rekognition for fallback support.');
  }

  // 비용 최적화 추천
  if (config.provider === 'aws' && !config.usePythonForBatch) {
    recommendations.push('Enable Python API for batch operations to reduce AWS costs.');
  }

  // 안정성 추천
  if (config.provider === 'python' && !config.fallbackEnabled && providerStatus.aws.available) {
    recommendations.push('Enable AWS fallback for improved reliability.');
  }

  // 성능 추천
  if (config.provider === 'hybrid' && config.primaryProvider === 'aws' && providerStatus.python.available) {
    recommendations.push('Consider using Python as primary provider for better performance in most cases.');
  }

  return recommendations;
}