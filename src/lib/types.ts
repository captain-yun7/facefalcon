// Face comparison types
export interface FaceComparisonResult {
  similarity: number;
  faceMatches: FaceMatch[];
  sourceImageFace?: Face;
  unmatchedFaces: Face[];
}

export interface FaceMatch {
  similarity: number;
  face: Face;
}

export interface Face {
  boundingBox: BoundingBox;
  confidence: number;
  landmarks?: Landmark[];
  pose?: Pose;
  quality?: Quality;
}

export interface BoundingBox {
  width: number;
  height: number;
  left: number;
  top: number;
}

export interface Landmark {
  type: string;
  x: number;
  y: number;
}

export interface Pose {
  roll: number;
  yaw: number;
  pitch: number;
}

export interface Quality {
  brightness: number;
  sharpness: number;
}

// Face detection types
export interface FaceDetails {
  ageRange: { low: number; high: number };
  gender: { value: string; confidence: number };
  emotions: Array<{ type: string; confidence: number }>;
  smile: { value: boolean; confidence: number };
  eyeglasses: { value: boolean; confidence: number };
  sunglasses: { value: boolean; confidence: number };
  beard: { value: boolean; confidence: number };
  mustache: { value: boolean; confidence: number };
  eyesOpen: { value: boolean; confidence: number };
  mouthOpen: { value: boolean; confidence: number };
  boundingBox: BoundingBox;
  landmarks: Landmark[];
  pose: Pose;
  quality: Quality;
  confidence: number;
}

// Image upload types
export interface UploadedImage {
  file: File;
  preview: string;
  base64?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Application specific types
export interface FamilyMember {
  id: string;
  name: string;
  image: UploadedImage;
  role: 'parent' | 'child';
}

export interface SimilarityResult {
  imageIndex: number;
  similarity: number;
  faceDetails: FaceDetails;
}

export interface FindSimilarResponse {
  matches: SimilarityResult[];
  bestMatch: {
    imageIndex: number;
    similarity: number;
  };
}