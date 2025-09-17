'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { validateImageFile, compressImage } from '@/lib/utils/image-processing';
import { UploadedImage } from '@/lib/types';

interface ImageUploaderProps {
  onImageUpload: (image: UploadedImage) => void;
  onImageRemove?: () => void;
  uploadedImage?: UploadedImage;
  label?: string;
  className?: string;
}

export default function ImageUploader({
  onImageUpload,
  onImageRemove,
  uploadedImage,
  label = "이미지 업로드",
  className = "",
}: ImageUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError("");
    setIsProcessing(true);

    try {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setError(validation.error || "Invalid file");
        setIsProcessing(false);
        return;
      }

      // Compress image
      const compressedBase64 = await compressImage(file, 800, 0.8);
      
      // Create preview URL
      const preview = URL.createObjectURL(file);

      const uploadedImage: UploadedImage = {
        file,
        preview,
        base64: compressedBase64,
      };

      onImageUpload(uploadedImage);
    } catch (err) {
      console.error('Error processing image:', err);
      setError("이미지 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleRemove = () => {
    if (uploadedImage?.preview) {
      URL.revokeObjectURL(uploadedImage.preview);
    }
    onImageRemove?.();
    setError("");
  };

  if (uploadedImage) {
    return (
      <div className={`relative ${className}`}>
        <div className="relative aspect-square w-full max-w-sm mx-auto">
          <Image
            src={uploadedImage.preview}
            alt="Uploaded image"
            fill
            className="object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            aria-label="Remove image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-600 text-center mt-2">{uploadedImage.file.name}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} disabled={isProcessing} />
        
        {isProcessing ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">이미지 처리 중...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-lg font-medium text-gray-700 mb-2">{label}</p>
            <p className="text-sm text-gray-500 mb-1">
              {isDragActive ? "여기에 이미지를 놓아주세요" : "이미지를 끌어다 놓거나 클릭하여 선택하세요"}
            </p>
            <p className="text-xs text-gray-400">JPEG, PNG, WebP (최대 10MB)</p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );
}