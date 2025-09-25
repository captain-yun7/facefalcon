// 환경변수 검증 및 타입 안전성 제공

interface EnvConfig {
  // Next.js 설정
  NODE_ENV: 'development' | 'production' | 'test'
  NEXT_PUBLIC_APP_URL: string
  
  // Google Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID?: string
  
  // AWS 설정 (서버사이드에서만)
  AWS_ACCESS_KEY_ID?: string
  AWS_SECRET_ACCESS_KEY?: string
  AWS_REGION?: string
  AWS_S3_BUCKET?: string
  
  // Python API 설정 (서버사이드에서만)
  PYTHON_API_URL?: string
  PYTHON_API_TIMEOUT?: string
}

// 환경변수 검증 함수
function validateEnv(): EnvConfig {
  const env = process.env as any

  // 필수 환경변수 체크
  const requiredEnvs = [
    'NODE_ENV',
    'NEXT_PUBLIC_APP_URL'
  ]

  for (const envVar of requiredEnvs) {
    if (!env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`)
    }
  }

  // 서버사이드에서만 필요한 환경변수 체크
  if (typeof window === 'undefined') {
    const serverRequiredEnvs = [
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY', 
      'AWS_REGION',
      'AWS_S3_BUCKET'
    ]

    for (const envVar of serverRequiredEnvs) {
      if (!env[envVar]) {
        console.warn(`Warning: Missing server environment variable: ${envVar}`)
      }
    }
  }

  // NODE_ENV 검증
  if (!['development', 'production', 'test'].includes(env.NODE_ENV)) {
    throw new Error(`Invalid NODE_ENV: ${env.NODE_ENV}. Must be 'development', 'production', or 'test'`)
  }

  // URL 검증
  try {
    new URL(env.NEXT_PUBLIC_APP_URL)
  } catch {
    throw new Error(`Invalid NEXT_PUBLIC_APP_URL: ${env.NEXT_PUBLIC_APP_URL}`)
  }

  return {
    NODE_ENV: env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: env.AWS_REGION || 'ap-northeast-2',
    AWS_S3_BUCKET: env.AWS_S3_BUCKET,
    PYTHON_API_URL: env.PYTHON_API_URL || 'http://localhost:8000',
    PYTHON_API_TIMEOUT: env.PYTHON_API_TIMEOUT || '30000',
  }
}

// 검증된 환경변수 export
export const env = validateEnv()

// 유틸리티 함수들
export const isProd = env.NODE_ENV === 'production'
export const isDev = env.NODE_ENV === 'development'
export const isTest = env.NODE_ENV === 'test'

// 클라이언트에서 안전하게 사용 가능한 환경변수들만
export const clientEnv = {
  NODE_ENV: env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
}

// 서버에서만 사용 가능한 환경변수들
export const serverEnv = {
  AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: env.AWS_REGION,
  AWS_S3_BUCKET: env.AWS_S3_BUCKET,
  PYTHON_API_URL: env.PYTHON_API_URL,
  PYTHON_API_TIMEOUT: env.PYTHON_API_TIMEOUT,
}