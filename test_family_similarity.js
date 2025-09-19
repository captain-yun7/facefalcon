// 가족 유사도 분석 테스트
const testFamilySimilarity = async () => {
  console.log('🔬 가족 유사도 분석 테스트 시작...');
  
  // 테스트용 더미 이미지 데이터 (작은 검은색 이미지)
  const dummyImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9hxGHmQAAAABJRU5ErkJggg==';
  
  try {
    console.log('🐍 Python API 직접 테스트...');
    
    const pythonResponse = await fetch('http://localhost:8000/compare-family-faces', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent_image: dummyImageBase64,
        child_image: dummyImageBase64,
        parent_age: 35,
        child_age: 8
      })
    });
    
    const pythonResult = await pythonResponse.json();
    console.log('✅ Python API 응답:', JSON.stringify(pythonResult, null, 2));
    
    console.log('🌐 Next.js API 테스트...');
    
    const nextResponse = await fetch('http://localhost:3000/api/family-similarity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parentImage: dummyImageBase64,
        childImage: dummyImageBase64,
        parentAge: 35,
        childAge: 8
      })
    });
    
    const nextResult = await nextResponse.json();
    console.log('✅ Next.js API 응답:', JSON.stringify(nextResult, null, 2));
    
  } catch (error) {
    console.error('❌ 테스트 실패:', error);
  }
};

// Node.js 환경에서 실행
if (typeof window === 'undefined') {
  // fetch polyfill for Node.js
  const fetch = require('node-fetch');
  global.fetch = fetch;
  
  testFamilySimilarity().then(() => {
    console.log('🎯 테스트 완료!');
  });
}

module.exports = testFamilySimilarity;