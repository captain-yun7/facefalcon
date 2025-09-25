import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 기본 헬스체크
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'unknown',
    }

    // 추가적인 서비스 상태 체크 (선택사항)
    const checks = []
    
    // AWS 연결 상태 체크 (환경변수만 확인)
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      checks.push({
        name: 'aws-credentials',
        status: 'available',
        message: 'AWS credentials configured'
      })
    } else {
      checks.push({
        name: 'aws-credentials', 
        status: 'unavailable',
        message: 'AWS credentials not configured'
      })
    }

    // Python API URL 체크
    if (process.env.PYTHON_API_URL) {
      checks.push({
        name: 'python-api-config',
        status: 'configured',
        url: process.env.PYTHON_API_URL
      })
    } else {
      checks.push({
        name: 'python-api-config',
        status: 'not-configured', 
        message: 'Python API URL not set'
      })
    }

    return NextResponse.json({
      ...health,
      checks
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache', 
        'Expires': '0'
      }
    })
  }
}

// HEAD 요청도 지원 (로드밸런서에서 자주 사용)
export async function HEAD() {
  return new Response(null, { status: 200 })
}