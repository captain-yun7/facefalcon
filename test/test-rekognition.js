const { RekognitionClient, CompareFacesCommand } = require('@aws-sdk/client-rekognition');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

console.log('=== AWS Rekognition Test Script ===');
console.log('Environment:', {
  region: process.env.AWS_REGION,
  hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyPrefix: process.env.AWS_ACCESS_KEY_ID?.substring(0, 10) + '...'
});

const client = new RekognitionClient({
  region: process.env.AWS_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function testCompareFaces() {
  try {
    // Load test images - try different combinations
    const image1Path = path.join(__dirname, 'whos-your-papa-images', '2802e06e-cb4a-47e7-bc9b-db6a5cb42ec8.jpg'); // 김주애
    const image2Path = path.join(__dirname, 'whos-your-papa-images', '000000022195.jpg'); // 김정은
    
    console.log('\nLoading images...');
    console.log('Image 1:', image1Path);
    console.log('Image 2:', image2Path);
    
    const sourceImage = fs.readFileSync(image1Path);
    const targetImage = fs.readFileSync(image2Path);
    
    console.log('Source image size:', sourceImage.length, 'bytes');
    console.log('Target image size:', targetImage.length, 'bytes');
    
    const command = new CompareFacesCommand({
      SourceImage: { Bytes: sourceImage },
      TargetImage: { Bytes: targetImage },
      SimilarityThreshold: 1,
    });

    console.log('\nSending request to AWS Rekognition...');
    const response = await client.send(command);
    
    console.log('\n=== AWS Response ===');
    console.log('Status:', response.$metadata.httpStatusCode);
    console.log('Request ID:', response.$metadata.requestId);
    
    if (response.FaceMatches && response.FaceMatches.length > 0) {
      console.log('\n✅ Face Matches Found:');
      response.FaceMatches.forEach((match, index) => {
        console.log(`  Match ${index + 1}: ${match.Similarity?.toFixed(2)}% similarity`);
      });
    } else {
      console.log('\n❌ No face matches found');
    }
    
    if (response.UnmatchedFaces && response.UnmatchedFaces.length > 0) {
      console.log(`\n⚠️ Unmatched faces in target: ${response.UnmatchedFaces.length}`);
    }
    
    if (response.SourceImageFace) {
      console.log('\n✅ Face detected in source image');
      console.log('  Confidence:', response.SourceImageFace.Confidence?.toFixed(2) + '%');
    } else {
      console.log('\n❌ No face detected in source image');
    }
    
    console.log('\nFull response:', JSON.stringify(response, null, 2));
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.name === 'CredentialsProviderError') {
      console.error('Check your AWS credentials in .env.local');
    }
    if (error.name === 'InvalidParameterException') {
      console.error('Invalid image format or no face detected');
    }
    console.error('\nFull error:', error);
  }
}

testCompareFaces();