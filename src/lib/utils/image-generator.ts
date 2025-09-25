export interface ResultImageData {
  parentImageUrl: string;
  childImageUrl: string;
  similarity: number;
  confidence: number;
  displayPercent: number;
  locale?: 'ko' | 'en';
}

export async function generateResultImage(data: ResultImageData): Promise<string> {
  // html-to-image를 사용하는 방식으로 변경
  return new Promise(async (resolve, reject) => {
    try {
      // React와 ReactDOM 동적 import
      const React = (await import('react')).default;
      const { createRoot } = await import('react-dom/client');
      const { default: ResultImageComponent } = await import('@/components/ResultImageComponent');
      const { toPng } = await import('html-to-image');

      // 임시 DOM 요소 생성
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      
      document.body.appendChild(tempDiv);

      // React 컴포넌트 렌더링
      const root = createRoot(tempDiv);
      
      // 컴포넌트 렌더링 완료를 기다리기 위한 Promise
      const renderPromise = new Promise<void>((resolveRender) => {
        const ComponentToRender = React.createElement(ResultImageComponent, {
          parentImageUrl: data.parentImageUrl,
          childImageUrl: data.childImageUrl,
          similarity: data.similarity,
          confidence: data.confidence,
          displayPercent: data.displayPercent,
          locale: data.locale
        });

        root.render(ComponentToRender);
        
        // 렌더링 완료 대기
        setTimeout(() => resolveRender(), 300);
      });

      await renderPromise;

      // 이미지 로드 대기
      const images = tempDiv.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve(true);
          } else {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true);
          }
        });
      }));

      // html-to-image로 이미지 생성
      setTimeout(async () => {
        try {
          const dataUrl = await toPng(tempDiv.firstElementChild as HTMLElement, {
            width: 800,
            height: 1000,
            style: {
              transform: 'scale(1)',
              transformOrigin: 'top left'
            },
            pixelRatio: 2,
            backgroundColor: '#ffffff'
          });

          // cleanup
          root.unmount();
          document.body.removeChild(tempDiv);
          resolve(dataUrl);
        } catch (error) {
          // cleanup on error
          root.unmount();
          document.body.removeChild(tempDiv);
          reject(error);
        }
      }, 500);

    } catch (error) {
      reject(error);
    }
  });
}


export function downloadImage(dataUrl: string, filename?: string, locale?: 'ko' | 'en') {
  console.log('💾 downloadImage - received locale:', locale);
  const link = document.createElement('a');
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '_');
  
  const defaultFilename = locale === 'en' 
    ? `WhosYourPapaAI_Analysis_${timestamp}.png`
    : `우리엄마아빠맞나요_AI분석결과_${timestamp}.png`;
  
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