import axios from "axios";
import { instance } from "./axiosInstance";

export interface PresignedUrlParams {
  directory: string;
  entityId: string;
  originFileName: string;
  contentType: string;
}

export interface SignupPresignedUrlParams {
  email: string;
  originFileName: string;
  contentType: string;
}

/**
 * 전용 파일 서비스(file-service)를 통해 S3 Presigned URL을 획득하고 파일을 직접 업로드합니다.
 */
export const uploadFileToS3 = async (file: File, directory: string, entityId: string = Date.now().toString()) => {
  try {
    // Content-Type 검증 및 기본값 설정
    const contentType = file.type || 'application/octet-stream';

    // 1. Presigned URL 요청
    const { data } = await instance.post("/file/files/presigned-url", {
      directory,
      entityId,
      originFileName: file.name,
      contentType,
    });

    const { uploadUrl, fileUrl } = data;

    // 2. S3로 직접 업로드 (PUT 요청)
    // instance 대신 순수 axios를 사용하여 Authorization 헤더 충돌을 방지합니다. (S3는 해당 헤더를 거부할 수 있음)
    try {
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": contentType },
      });
    } catch (s3Error) {
      console.error("S3 업로드 실패:", s3Error);
      throw new Error(`파일을 S3에 업로드하는 중 오류가 발생했습니다. 파일 크기나 네트워크 상태를 확인해 주세요.`);
    }

    return fileUrl; // 최종적으로 성공 시 저장된 S3 URL 반환
  } catch (error) {
    // Presigned URL 요청 실패 또는 기타 에러
    if (error instanceof Error && error.message.includes("S3에 업로드")) {
      throw error; // S3 업로드 에러는 그대로 전파
    }
    console.error("Presigned URL 요청 실패:", error);
    throw new Error("파일 업로드 URL을 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }
};

/**
 * 회원가입 전용 S3 업로드 (JWT 없이 호출 가능)
 * - /api/file/files/signup/presigned-url 엔드포인트 사용
 * - email을 entityId로 사용
 */
export const uploadFileToS3ForSignup = async (file: File, email: string) => {
  try {
    const contentType = file.type || 'application/octet-stream';

    // 1. 회원가입 전용 Presigned URL 요청 (JWT 불필요)
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL || "https://api.be-bee.link"}/file/files/signup/presigned-url`,
      {
        email,
        originFileName: file.name,
        contentType,
      }
    );

    const { uploadUrl, fileUrl } = data;

    // 2. S3로 직접 업로드 (PUT 요청)
    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": contentType },
    });

    return fileUrl;
  } catch (error) {
    console.error("회원가입 파일 업로드 실패:", error);
    throw new Error("파일 업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }
};
