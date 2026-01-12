import axios from "axios";
import { instance } from "./axiosInstance";

/**
 * 문서 분석 결과 타입
 */
export interface AnalyzeDocumentResult {
  exifScore: number;
  ocrScore: number;
  forgeryScore: number;
  systemFlag: "LOW" | "MID" | "HIGH";
}

/**
 * 회원가입 전 문서 분석 API (memberId 없이 호출)
 * - systemFlag만 반환 (DB 저장 X)
 */
export const analyzeDocument = async (fileUrl: string, role: string): Promise<AnalyzeDocumentResult> => {
  const params = new URLSearchParams();
  params.append("fileUrl", fileUrl);
  params.append("role", role);

  const response = await axios.post(
    `${import.meta.env.VITE_API_URL || "https://api.be-bee.link"}/api/members/documents/upload?${params.toString()}`
  );
  return response.data;
};

/**
 * 문서 업로드 API (S3 URL 방식 또는 직접 파일 전송 방식 지원)
 */
export const uploadDocument = async (memberId: string, file?: File, fileUrl?: string, documentId: number = 0) => {
  const params = new URLSearchParams();
  params.append("memberId", memberId);
  params.append("documentId", documentId.toString());
  if (fileUrl) {
    params.append("fileUrl", fileUrl);
  }

  // S3 URL이 있는 경우 전용 쿼리 파라미터로 전송
  if (fileUrl) {
    const response = await instance.post(`/member/documents/upload?${params.toString()}`);
    return response.data;
  }

  // 레거시: 파일을 직접 전송하는 경우 (로컬 환경 등)
  if (file) {
    const formData = new FormData();
    formData.append("memberId", memberId);
    formData.append("documentId", documentId.toString());
    formData.append("file", file);

    const response = await instance.post("/member/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  throw new Error("파일 또는 파일 URL이 필요합니다.");
};
