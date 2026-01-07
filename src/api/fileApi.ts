import axios from "axios";
import { instance } from "./axiosInstance";

export interface PresignedUrlParams {
  directory: string;
  entityId: string;
  originFileName: string;
  contentType: string;
}

/**
 * 전용 파일 서비스(file-service)를 통해 S3 Presigned URL을 획득하고 파일을 직접 업로드합니다.
 */
export const uploadFileToS3 = async (file: File, directory: string, entityId: string = Date.now().toString()) => {
  // 1. Presigned URL 요청
  const { data } = await instance.post("/files/presigned-url", {
    directory,
    entityId,
    originFileName: file.name,
    contentType: file.type,
  });

  const { uploadUrl, fileUrl } = data;

  // 2. S3로 직접 업로드 (PUT 요청)
  // instance 대신 순수 axios를 사용하여 Authorization 헤더 충돌을 방지합니다. (S3는 해당 헤더를 거부할 수 있음)
  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
  });

  return fileUrl; // 최종적으로 성공 시 저장된 S3 URL 반환
};
