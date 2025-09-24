export interface ResultImageData {
  parentImageUrl: string;
  childImageUrl: string;
  similarity: number;
  confidence: number;
  displayPercent: number;
  locale?: 'ko' | 'en';
}

export async function generateResultImage(data: ResultImageData): Promise<string> {
  console.log('🖼️ generateResultImage - received data.locale:', data.locale);
  const isEnglish = data.locale === 'en';
  console.log('🖼️ generateResultImage - isEnglish:', isEnglish);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  // Canvas 크기 설정
  const width = 800;
  const height = 600;
  canvas.width = width;
  canvas.height = height;

  // 배경 그라디언트
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#f0f9ff'); // blue-50
  gradient.addColorStop(1, '#e0e7ff'); // indigo-100
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 부모 이미지 로드 및 그리기
  const parentImg = await loadImage(data.parentImageUrl);
  const childImg = await loadImage(data.childImageUrl);

  // 이미지 크기 및 위치 계산
  const imgSize = 150;
  const imgY = 200;
  const parentX = width / 2 - imgSize - 50;
  const childX = width / 2 + 50;

  // 부모 이미지 그리기 (원형)
  ctx.save();
  drawCircularImage(ctx, parentImg, parentX, imgY, imgSize);
  ctx.restore();

  // 자녀 이미지 그리기 (원형)
  ctx.save();
  drawCircularImage(ctx, childImg, childX, imgY, imgSize);
  ctx.restore();

  // 하트 아이콘 (중앙)
  drawHeart(ctx, width / 2, imgY + imgSize / 2, 30);

  // 브랜딩 (상단)
  ctx.fillStyle = '#1e40af'; // blue-800
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Who\'s Your Papa?', width / 2, 80);
  
  ctx.fillStyle = '#64748b'; // slate-500
  ctx.font = '18px Arial, sans-serif';
  ctx.fillText(isEnglish ? 'AI Family Similarity Analysis' : 'AI 가족 닮음 분석', width / 2, 110);

  // 라벨 (부모, 자녀)
  ctx.fillStyle = '#374151'; // gray-700
  ctx.font = 'bold 16px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(isEnglish ? 'Parent' : '부모', parentX + imgSize / 2, imgY + imgSize + 30);
  ctx.fillText(isEnglish ? 'Child' : '자녀', childX + imgSize / 2, imgY + imgSize + 30);

  // 닮음 점수 (하단)
  ctx.fillStyle = '#1d4ed8'; // blue-700
  ctx.font = 'bold 48px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${data.displayPercent}%`, width / 2, 480);
  
  ctx.fillStyle = '#059669'; // emerald-600
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.fillText(isEnglish ? 'Similar!' : '닮았어요!', width / 2, 515);

  // 신뢰도
  ctx.fillStyle = '#6b7280'; // gray-500
  ctx.font = '16px Arial, sans-serif';
  ctx.fillText(
    isEnglish ? `Confidence: ${data.confidence.toFixed(1)}%` : `분석 신뢰도: ${data.confidence.toFixed(1)}%`, 
    width / 2, 550
  );

  // 사이트 링크 유도
  ctx.fillStyle = '#3b82f6'; // blue-500
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    isEnglish ? 'Try analysis at whos-your-papa.com!' : 'whos-your-papa.com에서 분석해보세요!', 
    width / 2, height - 40
  );

  // 날짜
  const now = new Date();
  const dateStr = isEnglish ? now.toLocaleDateString('en-US') : now.toLocaleDateString('ko-KR');
  ctx.fillStyle = '#9ca3af'; // gray-400
  ctx.font = '14px Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(dateStr, width - 20, height - 20);

  return canvas.toDataURL('image/png');
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCircularImage(
  ctx: CanvasRenderingContext2D, 
  img: HTMLImageElement, 
  x: number, 
  y: number, 
  size: number
) {
  const radius = size / 2;
  const centerX = x + radius;
  const centerY = y + radius;

  // 원형 클리핑 경로 생성
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 5, 0, Math.PI * 2);
  ctx.clip();

  // 이미지를 정사각형으로 크롭하여 그리기
  const minDimension = Math.min(img.width, img.height);
  const cropX = (img.width - minDimension) / 2;
  const cropY = (img.height - minDimension) / 2;

  ctx.drawImage(
    img,
    cropX, cropY, minDimension, minDimension,
    x + 5, y + 5, size - 10, size - 10
  );

  // 테두리 그리기
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2);
  ctx.strokeStyle = '#e5e7eb'; // gray-200
  ctx.lineWidth = 4;
  ctx.stroke();
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = '#ec4899'; // pink-500
  ctx.beginPath();
  
  const heartPath = new Path2D();
  const scale = size / 24; // 24는 원본 SVG 크기
  
  // 하트 모양 경로 (SVG path를 Canvas path로 변환)
  heartPath.moveTo((12 * scale) + x, (21.35 * scale) + y);
  heartPath.lineTo((10.55 * scale) + x, (20.03 * scale) + y);
  
  // 간단한 하트 모양으로 대체
  const heartSize = size * 0.8;
  const heartX = x - heartSize / 2;
  const heartY = y - heartSize / 2;
  
  ctx.fillStyle = '#ec4899';
  ctx.font = `${heartSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('💕', x, y);
}

export function downloadImage(dataUrl: string, filename?: string, locale?: 'ko' | 'en') {
  console.log('💾 downloadImage - received locale:', locale);
  const link = document.createElement('a');
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '_');
  
  const defaultFilename = locale === 'en' 
    ? `similarity_analysis_${timestamp}.png`
    : `닮음분석결과_${timestamp}.png`;
  
  console.log('💾 downloadImage - filename will be:', filename || defaultFilename);
  
  link.download = filename || defaultFilename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function shareResultImage(dataUrl: string, similarity: number, locale?: 'ko' | 'en'): Promise<boolean> {
  try {
    const isEnglish = locale === 'en';
    
    // 이미지를 Blob으로 변환
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const fileName = isEnglish ? 'similarity_analysis.png' : '닮음분석결과.png';
    const file = new File([blob], fileName, { type: 'image/png' });

    const title = isEnglish ? 'Similarity Analysis Result' : '우리 아이 닮음 분석 결과';
    const text = isEnglish 
      ? `${similarity}% similar! AI analysis result 😊`
      : `${similarity}% 닮았네요! AI가 분석한 결과에요 😊`;
    const shareText = isEnglish
      ? `${similarity}% similar! Try analysis at whos-your-papa.com 😊`
      : `${similarity}% 닮았네요! whos-your-papa.com에서 분석해보세요 😊`;

    // Web Share API 지원 확인 및 파일 공유 가능 여부 확인
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title,
        text
      });
      return true;
    } else if (navigator.share) {
      // 파일 공유는 안되지만 텍스트 공유는 가능한 경우
      await navigator.share({
        title,
        text: shareText,
        url: window.location.origin
      });
      return true;
    }
    
    return false; // Web Share API 미지원
  } catch (error) {
    console.error(locale === 'en' ? 'Share failed:' : '공유 실패:', error);
    return false;
  }
}

export async function copyToClipboard(text: string, locale?: 'ko' | 'en'): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error(locale === 'en' ? 'Clipboard copy failed:' : '클립보드 복사 실패:', error);
    return false;
  }
}