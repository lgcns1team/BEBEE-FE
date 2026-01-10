// Presigned URL 생성 요청
export interface PresignedUrlRequest {
  directory: string;
  entityId: string;
  originFileName: string;
  contentType: string;
}

// Presigned URL 생성 응답
export interface PresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
}

// 파일 디렉토리 타입
export type FileDirectory = "posts" | "profiles" | "chats" | "badge";

// 파일 업로드 상태
export interface FileUploadState {
  file: File;
  preview: string;
  uploadUrl?: string;
  fileUrl?: string;
  isUploading: boolean;
  isUploaded: boolean;
  error?: string;
}
