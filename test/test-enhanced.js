const { RekognitionClient, CompareFacesCommand, DetectFacesCommand, QualityFilter } = require('@aws-sdk/client-rekognition');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

console.log('=== Enhanced Rekognition Test ===');

const client = new RekognitionClient({
  region: process.env.AWS_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function testEnhancedComparison() {
  try {
    const image1Path = './whos-your-papa-images/000000022195.jpg';
    const image2Path = './whos-your-papa-images/2802e06e-cb4a-47e7-bc9b-db6a5cb42ec8.jpg';
    
    const sourceImage = fs.readFileSync(image1Path);
    const targetImage = fs.readFileSync(image2Path);
    
    console.log('\n🔍 Testing different quality filters...');
    
    const qualityFilters = ['NONE', 'LOW', 'MEDIUM', 'HIGH'];
    const thresholds = [30, 50, 70, 80];
    
    for (const qualityFilter of qualityFilters) {
      console.log(`\n--- Quality Filter: ${qualityFilter} ---`);
      
      for (const threshold of thresholds) {
        try {
          const command = new CompareFacesCommand({
            SourceImage: { Bytes: sourceImage },
            TargetImage: { Bytes: targetImage },
            SimilarityThreshold: threshold,
            QualityFilter: qualityFilter,
          });

          const response = await client.send(command);
          const similarity = response.FaceMatches?.[0]?.Similarity || 0;
          
          console.log(`  Threshold ${threshold}%: ${similarity.toFixed(2)}% similarity (${response.FaceMatches?.length || 0} matches)`);
        } catch (error) {
          console.log(`  Threshold ${threshold}%: Error - ${error.message}`);
        }
      }
    }
    
    // 얼굴 품질 분석
    console.log('\n🎯 Face Quality Analysis...');
    
    const detectCommand1 = new DetectFacesCommand({
      Image: { Bytes: sourceImage },
      Attributes: ['ALL'],
    });
    
    const detectCommand2 = new DetectFacesCommand({
      Image: { Bytes: targetImage },
      Attributes: ['ALL'],
    });
    
    const [detect1, detect2] = await Promise.all([
      client.send(detectCommand1),
      client.send(detectCommand2)
    ]);
    
    const face1 = detect1.FaceDetails?.[0];
    const face2 = detect2.FaceDetails?.[0];
    
    if (face1) {
      console.log('\nSource Image Quality:');
      console.log(`  Brightness: ${face1.Quality?.Brightness?.toFixed(2)}`);
      console.log(`  Sharpness: ${face1.Quality?.Sharpness?.toFixed(2)}`);
      console.log(`  Confidence: ${face1.Confidence?.toFixed(2)}%`);
      console.log(`  Age Range: ${face1.AgeRange?.Low}-${face1.AgeRange?.High}`);
      console.log(`  Gender: ${face1.Gender?.Value} (${face1.Gender?.Confidence?.toFixed(2)}%)`);
    }
    
    if (face2) {
      console.log('\nTarget Image Quality:');
      console.log(`  Brightness: ${face2.Quality?.Brightness?.toFixed(2)}`);
      console.log(`  Sharpness: ${face2.Quality?.Sharpness?.toFixed(2)}`);
      console.log(`  Confidence: ${face2.Confidence?.toFixed(2)}%`);
      console.log(`  Age Range: ${face2.AgeRange?.Low}-${face2.AgeRange?.High}`);
      console.log(`  Gender: ${face2.Gender?.Value} (${face2.Gender?.Confidence?.toFixed(2)}%)`);
    }
    
    // 권장사항
    console.log('\n💡 Recommendations:');
    
    const avgBrightness = ((face1?.Quality?.Brightness || 0) + (face2?.Quality?.Brightness || 0)) / 2;
    const avgSharpness = ((face1?.Quality?.Sharpness || 0) + (face2?.Quality?.Sharpness || 0)) / 2;
    
    if (avgBrightness < 50) {
      console.log('  ⚠️ Low brightness detected - consider using better lighting');
    }
    if (avgSharpness < 50) {
      console.log('  ⚠️ Low sharpness detected - consider using sharper images');
    }
    if (avgBrightness > 50 && avgSharpness > 50) {
      console.log('  ✅ Good image quality - results should be reliable');
    }
    
    // 가족용 최적 설정 추천
    console.log('\n🏠 Family Photo Recommendations:');
    console.log('  - Similarity Threshold: 40-60% for family members');
    console.log('  - Quality Filter: MEDIUM or HIGH');
    console.log('  - Multiple angles: Recommended for better accuracy');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testEnhancedComparison();