const fs = require('fs');
const { createCanvas } = require('canvas');

// 브랜드 컬러
const colors = {
    blue: '#3B82F6',
    purple: '#8B5CF6', 
    white: '#ffffff'
};

// 그라데이션 생성
function createGradient(ctx, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors.blue);
    gradient.addColorStop(1, colors.purple);
    return gradient;
}

// 아이콘 그리기
function drawIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // 그라데이션 배경 (라운드)
    ctx.fillStyle = createGradient(ctx, size, size);
    const borderRadius = size * 0.2;
    
    // 라운드 사각형 그리기
    ctx.beginPath();
    ctx.moveTo(borderRadius, 0);
    ctx.lineTo(size - borderRadius, 0);
    ctx.quadraticCurveTo(size, 0, size, borderRadius);
    ctx.lineTo(size, size - borderRadius);
    ctx.quadraticCurveTo(size, size, size - borderRadius, size);
    ctx.lineTo(borderRadius, size);
    ctx.quadraticCurveTo(0, size, 0, size - borderRadius);
    ctx.lineTo(0, borderRadius);
    ctx.quadraticCurveTo(0, 0, borderRadius, 0);
    ctx.closePath();
    ctx.fill();

    const centerX = size / 2;
    const centerY = size / 2;
    
    if (size <= 32) {
        // 작은 사이즈: 간단한 하트
        ctx.fillStyle = colors.white;
        ctx.font = `${size * 0.7}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('♥', centerX, centerY);
    } else {
        // 큰 사이즈: 부모-자녀 원 + 연결선
        const mainRadius = size * 0.12;
        const smallRadius = size * 0.08;
        
        ctx.fillStyle = colors.white;
        
        // 큰 원 (부모)
        ctx.beginPath();
        ctx.arc(centerX - size * 0.1, centerY - size * 0.05, mainRadius, 0, 2 * Math.PI);
        ctx.fill();
        
        // 작은 원 (자녀)
        ctx.beginPath();
        ctx.arc(centerX + size * 0.1, centerY + size * 0.05, smallRadius, 0, 2 * Math.PI);
        ctx.fill();
        
        // 연결 하트
        ctx.font = `${size * 0.15}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('♥', centerX, centerY + size * 0.02);
    }

    return canvas;
}

// OG 이미지 생성
function generateOGImage() {
    const canvas = createCanvas(1200, 630);
    const ctx = canvas.getContext('2d');
    
    // 그라데이션 배경
    ctx.fillStyle = createGradient(ctx, 1200, 630);
    ctx.fillRect(0, 0, 1200, 630);
    
    // 제목
    ctx.fillStyle = colors.white;
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("Who's your papa", 600, 220);
    
    // 부제목
    ctx.font = '44px Arial';
    ctx.fillText('AI 얼굴 분석 서비스', 600, 290);
    
    // 설명
    ctx.font = '28px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText('부모-자녀 닮음을 AI로 정확하게 분석하는 무료 서비스', 600, 360);
    
    // 아이콘들 (장식)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for(let i = 0; i < 7; i++) {
        const x = 150 + i * 150;
        const y = 480;
        
        ctx.beginPath();
        ctx.arc(x - 15, y, 12, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x + 15, y, 8, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // 브랜드 마크
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '18px Arial';
    ctx.fillText('친자 확인부터 연예인 닮은꼴까지', 600, 550);
    
    return canvas;
}

// SVG 생성
function generateSafariSVG() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="35" cy="45" r="12" fill="#000"/>
        <circle cx="65" cy="55" r="8" fill="#000"/>
        <text x="50" y="55" font-family="Arial" font-size="16" text-anchor="middle" fill="#000">♥</text>
    </svg>`;
}

// 파일 생성 및 저장
async function generateAllIcons() {
    const publicDir = '../public';
    
    // 아이콘 사이즈들
    const iconSizes = [
        { name: 'favicon-16x16', size: 16 },
        { name: 'favicon-32x32', size: 32 },
        { name: 'apple-touch-icon', size: 180 },
        { name: 'android-chrome-192x192', size: 192 },
        { name: 'android-chrome-512x512', size: 512 }
    ];

    // PNG 아이콘들 생성
    for (const {name, size} of iconSizes) {
        const canvas = drawIcon(size);
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(`${publicDir}/${name}.png`, buffer);
        console.log(`✓ Generated ${name}.png (${size}x${size})`);
    }
    
    // OG 이미지 생성
    const ogCanvas = generateOGImage();
    const ogBuffer = ogCanvas.toBuffer('image/jpeg', { quality: 0.9 });
    fs.writeFileSync(`${publicDir}/og-image.jpg`, ogBuffer);
    console.log('✓ Generated og-image.jpg (1200x630)');
    
    // Safari SVG 생성
    const svg = generateSafariSVG();
    fs.writeFileSync(`${publicDir}/safari-pinned-tab.svg`, svg);
    console.log('✓ Generated safari-pinned-tab.svg');
    
    console.log('\n🎉 All icons generated successfully!');
}

// Canvas 패키지가 없는 경우를 위한 대체
if (typeof createCanvas === 'undefined') {
    console.log('Canvas package not available. Using HTML generator instead.');
    console.log('Please open scripts/generate-icons.html in a browser.');
} else {
    generateAllIcons().catch(console.error);
}

module.exports = { generateAllIcons };