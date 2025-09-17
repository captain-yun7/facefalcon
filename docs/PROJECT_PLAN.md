# 👨‍👩‍👧‍👦 Who's Your Papa - 프로젝트 구현 계획

## 📌 프로젝트 개요
AWS Rekognition을 활용한 가족 얼굴 유사도 분석 웹 서비스

### 핵심 기능
1. **얼굴 일치율 분석** - 부모와 아이의 얼굴 유사도 측정
2. **부모 찾기 게임** - 여러 사람 중에서 진짜 부모 찾기
3. **닮은꼴 분석** - 엄마와 아빠 중 누구를 더 닮았는지 비교
4. **가족 유사도 매트릭스** - 가족 구성원 간 전체 유사도 분석

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Image Processing**: react-dropzone, sharp

### Backend (Next.js API Routes)
- **AWS Services**:
  - Rekognition (얼굴 인식 및 비교)
  - S3 (임시 이미지 저장)
- **Authentication**: NextAuth (선택사항)
- **Database**: PostgreSQL with Prisma (결과 저장용)

### DevOps
- **Deployment**: Vercel
- **Monitoring**: Vercel Analytics
- **CI/CD**: GitHub Actions

## 📁 프로젝트 구조

```
whos-your-papa/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── face-match/
│   │   └── page.tsx
│   ├── find-parents/
│   │   └── page.tsx
│   ├── who-resembles/
│   │   └── page.tsx
│   └── api/
│       ├── rekognition/
│       │   ├── compare-faces/route.ts
│       │   ├── detect-faces/route.ts
│       │   └── find-similar/route.ts
│       └── upload/route.ts
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── progress.tsx
│   ├── ImageUploader.tsx
│   ├── FaceComparison.tsx
│   ├── ResultDisplay.tsx
│   └── SimilarityChart.tsx
├── lib/
│   ├── aws/
│   │   ├── rekognition.ts
│   │   └── s3.ts
│   ├── utils/
│   │   ├── image-processing.ts
│   │   └── similarity-calculator.ts
│   └── types.ts
├── hooks/
│   ├── useImageUpload.ts
│   └── useFaceComparison.ts
└── styles/
    └── globals.css
```

## 🔧 구현 단계

### Phase 1: 프로젝트 초기화
- [ ] Next.js 14 프로젝트 생성
- [ ] TypeScript, Tailwind CSS 설정
- [ ] ESLint, Prettier 설정
- [ ] 필수 패키지 설치
  - `@aws-sdk/client-rekognition`
  - `@aws-sdk/client-s3`
  - `react-dropzone`
  - `sharp`
  - `recharts` (차트용)
  - `zustand`

### Phase 2: AWS 인프라 설정
- [ ] AWS 계정 설정
- [ ] IAM 권한 설정
- [ ] S3 버킷 생성 (임시 이미지 저장용)
- [ ] 환경 변수 설정
  ```env
  AWS_ACCESS_KEY_ID=
  AWS_SECRET_ACCESS_KEY=
  AWS_REGION=
  AWS_S3_BUCKET=
  ```

### Phase 3: 핵심 기능 구현

#### 3.1 이미지 업로드 시스템
```typescript
// 구현 내용
- 드래그 앤 드롭 업로드
- 이미지 미리보기
- 이미지 압축 및 최적화
- S3 업로드
```

#### 3.2 얼굴 비교 API
```typescript
// API 엔드포인트
POST /api/rekognition/compare-faces
- 두 얼굴 이미지 비교
- 유사도 점수 반환
- 얼굴 특징점 분석

POST /api/rekognition/detect-faces
- 얼굴 감지 및 특성 분석
- 나이, 성별, 감정 등 추출

POST /api/rekognition/find-similar
- 여러 얼굴 중 가장 유사한 얼굴 찾기
```

#### 3.3 결과 시각화
- 유사도 퍼센트 표시
- 얼굴 특징 비교 차트
- 애니메이션 효과

### Phase 4: UI/UX 개발

#### 4.1 메인 페이지
- 서비스 소개
- 기능 선택 카드
- 사용 가이드

#### 4.2 얼굴 비교 페이지
- 두 개의 이미지 업로드 영역
- 실시간 비교 결과
- 상세 분석 보기

#### 4.3 부모 찾기 게임 페이지
- 아이 사진 업로드
- 여러 후보 사진 업로드
- 게임 형식의 결과 발표

#### 4.4 닮은꼴 분석 페이지
- 아이, 엄마, 아빠 사진 업로드
- 비교 분석 결과
- 시각적 그래프

### Phase 5: 고급 기능
- [ ] 결과 공유 기능 (SNS)
- [ ] 결과 저장 및 히스토리
- [ ] 가족 그룹 생성
- [ ] 다국어 지원

### Phase 6: 최적화 및 배포
- [ ] 성능 최적화
  - 이미지 lazy loading
  - API 응답 캐싱
  - 번들 사이즈 최적화
- [ ] 에러 처리 및 로깅
- [ ] 보안 강화
  - Rate limiting
  - Input validation
- [ ] Vercel 배포
- [ ] 도메인 연결

## 📊 API 명세

### 1. 얼굴 비교 API
```typescript
POST /api/rekognition/compare-faces
Request Body: {
  sourceImage: string (base64),
  targetImage: string (base64)
}
Response: {
  similarity: number (0-100),
  faceMatches: Array<{
    similarity: number,
    face: {
      boundingBox: object,
      confidence: number
    }
  }>,
  sourceImageFace: object,
  unmatchedFaces: Array
}
```

### 2. 얼굴 감지 API
```typescript
POST /api/rekognition/detect-faces
Request Body: {
  image: string (base64)
}
Response: {
  faceDetails: Array<{
    ageRange: { low: number, high: number },
    gender: { value: string, confidence: number },
    emotions: Array<{ type: string, confidence: number }>,
    smile: { value: boolean, confidence: number },
    eyeglasses: { value: boolean, confidence: number },
    boundingBox: object
  }>
}
```

### 3. 유사 얼굴 찾기 API
```typescript
POST /api/rekognition/find-similar
Request Body: {
  sourceImage: string (base64),
  targetImages: Array<string> (base64)
}
Response: {
  matches: Array<{
    imageIndex: number,
    similarity: number,
    faceDetails: object
  }>,
  bestMatch: {
    imageIndex: number,
    similarity: number
  }
}
```

## 🎨 UI/UX 디자인 원칙

1. **직관적인 인터페이스**
   - 드래그 앤 드롭 중심
   - 명확한 CTA 버튼
   - 단계별 가이드

2. **재미있는 경험**
   - 게임화 요소
   - 애니메이션 효과
   - 인터랙티브한 결과 표시

3. **반응형 디자인**
   - 모바일 최적화
   - 터치 제스처 지원
   - 다양한 화면 크기 대응

4. **접근성**
   - 키보드 네비게이션
   - 스크린 리더 지원
   - 고대비 모드

## 🔐 보안 고려사항

1. **이미지 처리**
   - 클라이언트 사이드 이미지 압축
   - 서버 사이드 검증
   - 임시 저장 후 자동 삭제

2. **API 보안**
   - Rate limiting
   - CORS 설정
   - API 키 암호화

3. **개인정보 보호**
   - 이미지 즉시 삭제 옵션
   - GDPR 준수
   - 개인정보 처리 방침

## 📈 확장 계획

### 단기 (1-2개월)
- 사용자 계정 시스템
- 결과 저장 기능
- 소셜 공유 기능

### 중기 (3-6개월)
- 모바일 앱 개발 (React Native)
- AI 모델 고도화
- 프리미엄 기능

### 장기 (6개월+)
- B2B 서비스 (이벤트, 파티용)
- API 서비스 제공
- 글로벌 확장

## 📝 참고 자료

- [AWS Rekognition Documentation](https://docs.aws.amazon.com/rekognition/)
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 🚀 시작하기

```bash
# 프로젝트 클론
git clone https://github.com/yourusername/whos-your-papa.git

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local

# 개발 서버 실행
npm run dev
```

---

**작성일**: 2025-09-17
**버전**: 1.0.0