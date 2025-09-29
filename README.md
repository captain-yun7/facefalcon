# 👨‍👩‍👧‍👦 FaceFalcon

AWS Rekognition을 활용한 AI 얼굴 유사도 분석 웹 서비스입니다. 부모와 아이의 얼굴 유사도를 측정하고, 재미있는 가족 게임을 즐길 수 있습니다.

## ✨ 주요 기능

- **🔍 얼굴 일치율 분석**: 두 사진의 얼굴 유사도를 정확한 퍼센트로 측정
- **🕵️‍♂️ 부모 찾기 게임**: 여러 후보자 중에서 진짜 부모를 찾는 재미있는 게임
- **⚖️ 닮은꼴 분석**: 엄마와 아빠 중 누구를 더 닮았는지 상세 분석
- **📊 시각화된 결과**: 직관적인 차트와 그래프로 결과 표시

## 🛠 기술 스택

### Frontend
- **Next.js 14** - React 기반 풀스택 프레임워크
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크
- **React Dropzone** - 이미지 업로드

### Backend & AI
- **AWS Rekognition** - 얼굴 인식 및 비교 AI 서비스
- **AWS S3** - 이미지 임시 저장
- **Next.js API Routes** - 서버리스 API

### 개발 도구
- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅

## 🚀 빠른 시작

### 1. 저장소 클론

```bash
git clone https://github.com/yourusername/facefalcon.git
cd facefalcon
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=facefalcon-images

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. AWS 설정

1. **AWS 계정 생성** 및 로그인
2. **IAM 사용자 생성**:
   - Rekognition 및 S3 권한 부여
   - Access Key 및 Secret Key 발급
3. **S3 버킷 생성**:
   - 이미지 임시 저장용 버킷 생성
   - 퍼블릭 읽기 권한 설정

### 5. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 서비스를 확인할 수 있습니다.

## 📁 프로젝트 구조

```
facefalcon/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API 엔드포인트
│   │   │   └── rekognition/   # AWS Rekognition API
│   │   ├── face-match/        # 얼굴 비교 페이지
│   │   ├── find-parents/      # 부모 찾기 게임
│   │   ├── who-resembles/     # 닮은꼴 분석
│   │   ├── layout.tsx         # 공통 레이아웃
│   │   └── page.tsx           # 메인 페이지
│   ├── components/            # 재사용 가능한 컴포넌트
│   │   ├── ui/               # 기본 UI 컴포넌트
│   │   └── ImageUploader.tsx  # 이미지 업로드 컴포넌트
│   └── lib/                   # 유틸리티 및 라이브러리
│       ├── aws/              # AWS SDK 관련
│       ├── utils/            # 헬퍼 함수들
│       └── types.ts          # TypeScript 타입 정의
├── public/                    # 정적 파일
├── .env.local                # 환경 변수 (로컬)
├── .env.example              # 환경 변수 템플릿
└── README.md
```

## 🔧 주요 API 엔드포인트

### POST `/api/rekognition/compare-faces`
두 얼굴 이미지의 유사도를 비교합니다.

```json
{
  "sourceImage": "base64_string",
  "targetImage": "base64_string",
  "similarityThreshold": 70
}
```

### POST `/api/rekognition/detect-faces`
이미지에서 얼굴을 감지하고 특성을 분석합니다.

```json
{
  "image": "base64_string"
}
```

### POST `/api/rekognition/find-similar`
여러 이미지 중에서 가장 유사한 얼굴을 찾습니다.

```json
{
  "sourceImage": "base64_string",
  "targetImages": ["base64_string_1", "base64_string_2", ...]
}
```

## 🎨 사용 방법

### 1. 얼굴 일치율 분석
- 비교할 두 사진을 업로드
- AI가 얼굴 유사도를 퍼센트로 측정
- 상세한 분석 결과 확인

### 2. 부모 찾기 게임
- 아이 사진 1장과 후보자 사진 2-6장 업로드
- AI가 가장 유사한 사람을 찾아 순위 매김
- 재미있는 게임 형태로 결과 발표

### 3. 닮은꼴 분석
- 아이, 엄마, 아빠 사진을 각각 업로드
- 엄마와 아빠 중 누구를 더 닮았는지 분석
- 상세한 비교 결과와 비율 제공

## 🚀 배포

### Vercel 배포

1. **Vercel 계정 연결**:
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **프로젝트 배포**:
   ```bash
   vercel
   ```

3. **환경 변수 설정**:
   - Vercel 대시보드에서 환경 변수 추가
   - AWS 키와 설정값 입력

## 📊 성능 최적화

- **이미지 압축**: 클라이언트 사이드에서 이미지 자동 압축
- **캐싱**: API 응답 결과 캐싱으로 중복 요청 방지
- **지연 로딩**: 이미지 컴포넌트 지연 로딩
- **번들 최적화**: Next.js 자동 번들 분할

## 🔒 보안 고려사항

- **이미지 자동 삭제**: 업로드된 이미지는 24시간 후 자동 삭제
- **입력 검증**: 모든 API 입력값 검증
- **Rate Limiting**: API 호출 횟수 제한
- **CORS 설정**: 안전한 크로스 오리진 요청

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 문의

- **GitHub Issues**: [Issues 페이지](https://github.com/yourusername/facefalcon/issues)
- **Email**: your.email@example.com

## 🙏 감사의 말

- **AWS Rekognition**: 강력한 얼굴 인식 AI 서비스
- **Next.js 팀**: 훌륭한 React 프레임워크
- **Vercel**: 간편한 배포 플랫폼

---

**Made with ❤️ and AI in South Korea**
