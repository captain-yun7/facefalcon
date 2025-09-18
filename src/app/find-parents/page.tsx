'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ImageUploader from '@/components/ImageUploader';
import Navbar from '@/components/Navbar';
import { UploadedImage, SimilarityResult } from '@/lib/types';
import { getSimilarityLevel, formatPercentage } from '@/lib/utils/similarity-calculator';

export default function FindParentsPage() {
  const [childImage, setChildImage] = useState<UploadedImage | null>(null);
  const [candidateImages, setCandidateImages] = useState<UploadedImage[]>([]);
  const [results, setResults] = useState<SimilarityResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>("");
  const [showResults, setShowResults] = useState(false);

  const handleAddCandidate = (image: UploadedImage) => {
    if (candidateImages.length < 6) {
      setCandidateImages(prev => [...prev, image]);
    }
  };

  const handleRemoveCandidate = (index: number) => {
    setCandidateImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!childImage?.base64 || candidateImages.length < 2) return;

    setIsAnalyzing(true);
    setError("");

    try {
      const targetImages = candidateImages.map(img => img.base64!);
      
      const response = await fetch('/api/rekognition/find-similar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceImage: childImage.base64,
          targetImages,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResults(data.data.matches || []);
      setShowResults(true);
    } catch (err) {
      console.error('Error analyzing faces:', err);
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setChildImage(null);
    setCandidateImages([]);
    setResults([]);
    setShowResults(false);
    setError("");
  };

  const bestMatch = results.length > 0 ? results[0] : null;

  return (
    <>
      <Navbar />
      
      {/* Floating Shapes Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-br from-blue-300/20 to-blue-200/20 blur-[80px] top-[15%] left-[15%] animate-float"></div>
        <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-br from-blue-400/20 to-blue-300/20 blur-[80px] bottom-[15%] right-[10%] animate-float animation-delay-2000"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-br from-blue-500/20 to-blue-400/20 blur-[80px] top-[45%] left-[45%] animate-float animation-delay-4000"></div>
        <div className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-br from-blue-100/30 to-gray-50/30 blur-[80px] top-[70%] left-[20%] animate-float animation-delay-6000"></div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-white via-white/90 to-blue-50/30 relative z-10">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[100px]"></div>
        <div className="container mx-auto px-4 py-8 relative">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="font-playfair text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 bg-clip-text text-transparent drop-shadow-sm leading-tight">
              부모 찾기
            </h1>
            <p className="font-roboto text-lg text-blue-800/80 max-w-2xl mx-auto font-light tracking-wide">
              여러 사람 중에서 누가 진짜 부모인지 AI가 찾아드려요!
            </p>
          </header>

        {!showResults ? (
          <div className="max-w-6xl mx-auto">
            {/* Child Image Upload */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-50 mb-8">
              <h3 className="font-montserrat text-xl font-semibold text-blue-900 mb-6 text-center">
                아이 사진을 업로드하세요
              </h3>
              <div className="max-w-sm mx-auto">
                <ImageUploader
                  onImageUpload={setChildImage}
                  onImageRemove={() => setChildImage(null)}
                  uploadedImage={childImage || undefined}
                  label="아이 사진 업로드"
                />
              </div>
            </div>

            {/* Candidate Images */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-50 mb-8">
              <h3 className="font-montserrat text-xl font-semibold text-blue-900 mb-6 text-center">
                후보자들의 사진을 업로드하세요 (2-6명)
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                {candidateImages.map((image, index) => (
                  <div key={index} className="relative">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={image.preview}
                        alt={`Candidate ${index + 1}`}
                        fill
                        className="object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        onClick={() => handleRemoveCandidate(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        aria-label="Remove candidate"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="font-roboto text-sm text-blue-700/70 text-center mt-2">후보자 {index + 1}</p>
                  </div>
                ))}
                
                {candidateImages.length < 6 && (
                  <div className="aspect-square">
                    <ImageUploader
                      onImageUpload={handleAddCandidate}
                      label={`후보자 ${candidateImages.length + 1}`}
                      className="h-full"
                    />
                  </div>
                )}
              </div>
              
              <p className="font-roboto text-center text-sm text-blue-600/70 font-light">
                현재 {candidateImages.length}명의 후보자가 등록되었습니다.
                {candidateImages.length < 2 && " (최소 2명 필요)"}
              </p>
            </div>

            {/* Analysis Button */}
            <div className="text-center mb-8">
              <button
                onClick={handleAnalyze}
                disabled={!childImage || candidateImages.length < 2 || isAnalyzing}
                className={`
                  font-montserrat px-8 py-4 rounded-full text-lg font-semibold transition-all tracking-wider
                  ${!childImage || candidateImages.length < 2 || isAnalyzing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-700 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/30 transform hover:scale-105'
                  }
                `}
              >
                {isAnalyzing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AI가 부모를 찾는 중...
                  </span>
                ) : (
                  '부모 찾기 시작!'
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <p className="font-roboto text-red-600 text-center">{error}</p>
              </div>
            )}
          </div>
        ) : (
          /* Results */
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-50">
              <h2 className="font-playfair text-3xl font-bold text-center text-blue-900 mb-8">
                부모 찾기 결과!
              </h2>

              {/* Winner */}
              {bestMatch && (
                <div className="text-center mb-12">
                  <h3 className="font-montserrat text-2xl font-bold text-blue-700 mb-8">
                    가장 가능성이 높은 부모님
                  </h3>
                  <div className="max-w-sm mx-auto mb-4">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={candidateImages[bestMatch.imageIndex]?.preview || ''}
                        alt="Best match"
                        fill
                        className="object-cover rounded-lg border-4 border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent mb-2">
                    {formatPercentage(bestMatch.similarity)}
                  </div>
                  <p className="font-roboto text-lg text-blue-600/80 font-light">
                    {getSimilarityLevel(bestMatch.similarity).description}
                  </p>
                </div>
              )}

              {/* All Results Ranking */}
              <div className="mb-8">
                <h4 className="font-montserrat text-xl font-semibold text-blue-900 mb-6 text-center">
                  전체 순위
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((result, index) => {
                    const candidateImage = candidateImages[result.imageIndex];
                    if (!candidateImage) return null;
                    
                    return (
                      <div
                        key={result.imageIndex}
                        className={`
                          p-4 rounded-lg border-2 transition-all
                          ${index === 0 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-blue-200 bg-blue-50'
                          }
                        `}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2 font-bold text-blue-700">
                            {index + 1}위
                          </div>
                          <div className="relative aspect-square w-32 mx-auto mb-3">
                            <Image
                              src={candidateImage.preview}
                              alt={`Candidate ${result.imageIndex + 1}`}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="font-montserrat text-xl font-bold text-blue-900 mb-1">
                            {formatPercentage(result.similarity)}
                          </div>
                          <div className={`text-sm ${getSimilarityLevel(result.similarity).color}`}>
                            {getSimilarityLevel(result.similarity).level}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleReset}
                  className="font-montserrat px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold"
                >
                  다시 시도하기
                </button>
                <Link
                  href="/who-resembles"
                  className="font-montserrat px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all font-semibold"
                >
                  닮은꼴 분석하기 →
                </Link>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
}