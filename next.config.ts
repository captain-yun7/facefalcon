import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 서버사이드에서만 사용할 환경변수
  serverRuntimeConfig: {
    PYTHON_API_URL: process.env.PYTHON_API_URL || 'http://localhost:8000',
    PYTHON_API_TIMEOUT: process.env.PYTHON_API_TIMEOUT || '30000',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  },
  // 클라이언트와 서버 모두에서 사용할 환경변수
  publicRuntimeConfig: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
};

export default nextConfig;
