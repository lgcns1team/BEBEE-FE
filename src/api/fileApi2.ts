import axios from "axios";
import { instance } from "./axiosInstance";
import type {
  PresignedUrlRequest,
  PresignedUrlResponse,
  FileDirectory,
} from "../types/file.type";

/**
 * Presigned URL 생성 API
 * S3에 파일을 직접 업로드하기 위한 Presigned URL을 생성합니다.
 */
export const getPresignedUrl = async (
  params: PresignedUrlRequest
): Promise<PresignedUrlResponse> => {
  const response = await instance.post<PresignedUrlResponse>(
    "/api/file/files/presigned-url",
    params
  );
  return response.data;
};

/**
 * S3에 파일 직접 업로드
 * Presigned URL을 사용하여 S3에 파일을 직접 업로드합니다.
 */
export const uploadFileToS3 = async (
  uploadUrl: string,
  file: File,
  contentType: string
): Promise<void> => {
  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": contentType },
  });
};

/**
 * 파일 업로드 전체 프로세스
 * 1. Presigned URL 생성
 * 2. S3에 파일 직접 업로드
 * 3. fileUrl 반환
 */
export const uploadFile = async (
  file: File,
  directory: FileDirectory,
  entityId: string = Date.now().toString()
): Promise<string> => {
  const contentType = file.type || "image/jpeg";

  // 1. Presigned URL 생성
  const { uploadUrl, fileUrl } = await getPresignedUrl({
    directory,
    entityId,
    originFileName: file.name,
    contentType,
  });

  // 2. S3에 직접 업로드
  await uploadFileToS3(uploadUrl, file, contentType);

  // 3. fileUrl 반환 (게시글 작성 등에서 사용)
  return fileUrl;
};
