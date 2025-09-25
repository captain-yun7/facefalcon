import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
export const alt = "Who's your papa AI - AI 얼굴 분석 서비스"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* 메인 헤드라인 */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: 'white',
            textAlign: 'center',
            marginBottom: 20,
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}
        >
          Who's your papa AI
        </div>
        
        {/* 서브 헤드라인 */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: '#f0f0f0',
            textAlign: 'center',
            marginBottom: 40,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          AI 얼굴 분석 | 가족 닮음 분석 서비스
        </div>
        
        {/* 기능 태그들 */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: 900,
          }}
        >
          {['친자 확인', '가족 닮음 분석', '연예인 닮은꼴', 'AI 얼굴 분석'].map((feature, index) => (
            <div
              key={index}
              style={{
                padding: '12px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '25px',
                fontSize: 24,
                fontWeight: 600,
                color: 'white',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              {feature}
            </div>
          ))}
        </div>
        
        {/* 하단 정보 */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 20,
            color: '#e0e0e0',
            textAlign: 'center',
          }}
        >
          무료 AI 얼굴 유사도 분석 • whos-your-papa.com
        </div>
        
        {/* 장식적 요소들 */}
        <div
          style={{
            position: 'absolute',
            top: 50,
            right: 50,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            left: 80,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(15px)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}