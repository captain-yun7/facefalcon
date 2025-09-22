import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';

const articles = {
  '1': {
    title: "얼굴 인식 AI 기술의 발전사와 원리",
    category: "AI 기술",
    date: "2024-01-15",
    readTime: "5분",
    content: `
# 얼굴 인식 AI 기술의 발전사와 원리

얼굴 인식 기술은 1960년대부터 시작되어 현재의 딥러닝 기반 AI까지 놀라운 발전을 이뤄왔습니다. 이 글에서는 얼굴 인식 기술의 역사와 현재 사용되는 핵심 원리를 알아보겠습니다.

## 1960년대: 얼굴 인식의 시작

초기 얼굴 인식 연구는 1960년대 Woodrow Wilson Bledsoe의 연구에서 시작되었습니다. 당시에는 사람이 직접 얼굴의 특징점을 표시하고, 컴퓨터가 이를 분류하는 반자동 방식이었습니다.

### 주요 특징:
- 수동 특징점 표시
- 간단한 패턴 매칭
- 제한적인 데이터베이스

## 1990년대: 자동화의 시작

1990년대에 들어서면서 Eigenfaces, Fisherfaces 같은 통계적 방법이 도입되었습니다. 이는 얼굴을 수학적 벡터로 표현하는 첫 번째 시도였습니다.

### Eigenfaces의 원리:
1. 얼굴 이미지를 고차원 벡터로 변환
2. 주성분 분석(PCA)으로 차원 축소
3. 주요 특징(고유얼굴)으로 얼굴 표현

## 2000년대: 기계학습의 도입

Support Vector Machine(SVM), AdaBoost 같은 기계학습 알고리즘이 얼굴 인식에 적용되기 시작했습니다. 특히 Viola-Jones 알고리즘은 실시간 얼굴 검출을 가능하게 했습니다.

### Viola-Jones 알고리즘:
- Haar-like features 사용
- AdaBoost로 약한 분류기 결합
- Cascade 구조로 빠른 검출

## 2010년대: 딥러닝 혁명

딥러닝의 등장으로 얼굴 인식 기술이 획기적으로 발전했습니다. Convolutional Neural Networks(CNN)가 핵심 기술이 되었습니다.

### CNN의 장점:
- 자동 특징 학습
- 변형에 강한 robust한 표현
- 대량 데이터 처리 가능

## 현재: 최신 기술들

현재는 다음과 같은 최신 기술들이 사용됩니다:

### FaceNet
- Triplet Loss 사용
- 128차원 임베딩
- 높은 정확도

### ArcFace
- Angular Margin 도입
- 더 나은 class separation
- 상업적 활용 증가

### 3D 얼굴 인식
- 깊이 정보 활용
- 조명 변화에 강함
- 보안성 향상

## Who's Your Papa?에서 사용하는 기술

우리 서비스는 최신 딥러닝 모델을 기반으로:

1. **Multi-task CNN**: 얼굴 검출과 특징점 추출을 동시에
2. **Attention Mechanism**: 중요한 특징에 집중
3. **Ensemble Learning**: 여러 모델의 결과를 결합

## 미래 전망

얼굴 인식 기술은 계속 발전하고 있습니다:

- **Transformer 기반 모델**: NLP에서 성공한 Transformer가 Computer Vision에도 적용
- **Self-supervised Learning**: 라벨이 없는 데이터로도 학습 가능
- **Federated Learning**: 개인정보를 보호하면서 모델 개선

얼굴 인식 기술의 발전은 우리 일상생활에 많은 편의를 가져다주고 있으며, 앞으로도 계속해서 혁신적인 변화를 만들어낼 것입니다.
    `
  },
  '2': {
    title: "컴퓨터 비전과 얼굴 특징점 추출",
    category: "컴퓨터 비전",
    date: "2024-01-12",
    readTime: "7분",
    content: `
# 컴퓨터 비전과 얼굴 특징점 추출

컴퓨터 비전에서 얼굴 특징점 추출은 매우 중요한 기술입니다. 현재 468개의 랜드마크를 정확하게 추출할 수 있으며, 이는 다양한 응용 분야에서 활용되고 있습니다.

## 얼굴 특징점이란?

얼굴 특징점(Facial Landmarks)은 얼굴에서 중요한 위치를 나타내는 점들입니다. 주로 다음과 같은 부위에 위치합니다:

### 주요 특징점 영역:
- **눈**: 눈썹, 눈꺼풀, 눈동자 (총 12개 점 × 2)
- **코**: 콧대, 콧볼, 콧구멍 (총 9개 점)
- **입**: 입술 윤곽, 입꼬리 (총 20개 점)
- **턱선**: 얼굴 윤곽 (총 17개 점)
- **얼굴 전체**: 이마, 볼, 턱 등 (나머지 점들)

## MediaPipe Face Mesh

Google의 MediaPipe는 현재 가장 정확한 얼굴 특징점 추출 도구 중 하나입니다.

### 468개 랜드마크의 구성:
1. **얼굴 윤곽**: 턱선과 이마선
2. **좌/우 눈**: 각각 상세한 눈 모양
3. **좌/우 눈썹**: 눈썹의 형태
4. **코**: 3D 코 모양 정보
5. **입**: 상세한 입술 정보
6. **홍채**: 좌/우 홍채 중심점

## 특징점 추출 과정

### 1단계: 얼굴 검출
```python
# Pseudo code
face_detector = mediapipe.solutions.face_detection
results = face_detector.process(image)
```

### 2단계: 메쉬 생성
```python
face_mesh = mediapipe.solutions.face_mesh
mesh_results = face_mesh.process(image)
```

### 3단계: 랜드마크 추출
468개의 (x, y, z) 좌표를 추출합니다.

## 3D 좌표계

MediaPipe는 2D 이미지에서도 3D 정보를 추출할 수 있습니다:

- **X축**: 이미지의 좌에서 우로
- **Y축**: 이미지의 위에서 아래로  
- **Z축**: 카메라에서 얼굴로 (깊이)

### Z값의 의미:
- 음수: 얼굴이 더 가까운 부분 (코끝 등)
- 양수: 얼굴이 더 먼 부분 (귀 등)

## 특징점의 활용

### 얼굴 정렬 (Face Alignment)
특징점을 이용해 얼굴을 표준 위치로 정렬합니다:

1. 눈 중심을 수평으로 맞춤
2. 코끝을 중앙에 위치
3. 얼굴 크기를 표준화

### 얼굴 모핑 (Face Morphing)
두 얼굴 사이의 자연스러운 변환:

1. 각 얼굴의 특징점 추출
2. 중간 위치 계산
3. 텍스처 블렌딩

### 감정 인식
특징점의 변화로 감정을 파악:

- **기쁨**: 입꼬리 상승, 눈가 주름
- **슬픔**: 입꼬리 하강, 눈썹 하강
- **놀람**: 눈과 입이 크게 벌어짐

## 정확도에 영향을 주는 요인

### 조명
- **좋은 조명**: 균등한 정면 조명
- **나쁜 조명**: 강한 사이드 라이트, 역광

### 각도  
- **최적 각도**: 정면 ±15도
- **어려운 각도**: 45도 이상 회전

### 해상도
- **권장**: 최소 200×200 픽셀
- **최적**: 512×512 픽셀 이상

## 실시간 처리 최적화

### 모델 경량화
- **Quantization**: 32bit → 8bit 변환
- **Pruning**: 불필요한 연결 제거
- **Knowledge Distillation**: 작은 모델로 지식 전달

### 하드웨어 가속
- **GPU**: CUDA 활용
- **Mobile**: Core ML, TensorFlow Lite
- **Web**: WebGL, WASM

## Who's Your Papa?의 구현

우리 서비스에서는 다음과 같이 활용합니다:

### 전처리
1. 얼굴 검출 및 크롭핑
2. 표준 크기로 리사이즈
3. 조명 정규화

### 특징점 추출
1. 468개 랜드마크 추출
2. 중요 영역별 가중치 적용
3. 3D 정보를 2D로 투영

### 비교 분석
1. 부모-자녀 특징점 매칭
2. 유클리드 거리 계산
3. 가중 평균으로 최종 점수

얼굴 특징점 추출 기술은 계속해서 발전하고 있으며, 더욱 정확하고 빠른 실시간 처리가 가능해지고 있습니다.
    `
  }
};

export async function generateStaticParams() {
  return Object.keys(articles).map((id) => ({
    id: id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const article = articles[params.id as keyof typeof articles];
  
  if (!article) {
    return {
      title: '페이지를 찾을 수 없습니다 | Who\'s Your Papa?',
    };
  }

  return {
    title: `${article.title} | Who's Your Papa?`,
    description: article.content.slice(0, 150) + '...',
  };
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const article = articles[params.id as keyof typeof articles];

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <Link 
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
            >
              ← AI 기술 정보로 돌아가기
            </Link>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {article.category}
              </span>
              <span className="text-gray-500 text-sm">{article.readTime} 읽기</span>
              <span className="text-gray-500 text-sm">{article.date}</span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {article.title}
            </h1>
          </div>

          {/* 컨텐츠 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-700 leading-relaxed"
                style={{ whiteSpace: 'pre-line' }}
              >
                {article.content}
              </div>
            </div>
          </div>

          {/* 하단 네비게이션 */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between">
            <Link 
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              ← 목록으로 돌아가기
            </Link>
            
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              AI 분석 체험하기 →
            </Link>
          </div>

          {/* 관련 글 */}
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">관련 글</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(articles)
                .filter(([id]) => id !== params.id)
                .slice(0, 2)
                .map(([id, relatedArticle]) => (
                  <Link 
                    key={id}
                    href={`/blog/${id}`}
                    className="block p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {relatedArticle.category}
                      </span>
                      <span className="text-xs text-gray-500">{relatedArticle.readTime}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {relatedArticle.content.slice(0, 100)}...
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}