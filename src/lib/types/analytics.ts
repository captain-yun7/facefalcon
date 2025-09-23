// Google Analytics 4 Event Types

export interface GAEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}

// Analysis Events
export interface AnalysisStartEvent {
  event_name: 'analysis_start';
  analysis_type: 'parent-child' | 'who-most-similar';
}

export interface AnalysisCompleteEvent {
  event_name: 'analysis_complete';
  analysis_type: 'parent-child' | 'who-most-similar';
  similarity_score?: number;
  confidence_score?: number;
  processing_time?: number;
}

export interface AnalysisErrorEvent {
  event_name: 'analysis_error';
  analysis_type: 'parent-child' | 'who-most-similar';
  error_type: string;
  error_message: string;
}

// User Interaction Events
export interface AnalysisTypeChangeEvent {
  event_name: 'analysis_type_change';
  from_type: 'parent-child' | 'who-most-similar' | '';
  to_type: 'parent-child' | 'who-most-similar';
}

export interface ImageUploadEvent {
  event_name: 'image_upload';
  image_type: 'parent' | 'child' | 'candidate';
  file_size?: number;
  file_type?: string;
}

export interface ResultShareEvent {
  event_name: 'result_share';
  share_method: 'download' | 'web_share' | 'clipboard';
  analysis_type: 'parent-child' | 'who-most-similar';
}

// Union type for all events
export type AnalyticsEvent = 
  | AnalysisStartEvent 
  | AnalysisCompleteEvent 
  | AnalysisErrorEvent 
  | AnalysisTypeChangeEvent 
  | ImageUploadEvent 
  | ResultShareEvent;

// Google Analytics gtag types
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: any
    ) => void;
  }
}