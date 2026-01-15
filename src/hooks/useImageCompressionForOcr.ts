import { useCallback } from "react";
import imageCompression from "browser-image-compression";

type CompressionOptions = Parameters<typeof imageCompression>[1];

/**
 * OCR 업로드용 이미지 압축 훅
 * - 압축 실패 시 원본 파일로 폴백
 */
export const useImageCompressionForOcr = () => {
  const getCompressionOptions = useCallback(
    (fileSize: number): CompressionOptions => {
      const baseOptions = {
        useWebWorker: true,
        fileType: "image/png",
      } satisfies CompressionOptions;

      // 파일 크기에 따라 압축 옵션 조정
      if (fileSize > 5 * 1024 * 1024) {
        // 5MB 이상: 강한 압축
        return {
          ...baseOptions,
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1280,
          initialQuality: 0.7,
        };
      }
      if (fileSize > 2 * 1024 * 1024) {
        // 2MB 이상: 중간 압축
        return {
          ...baseOptions,
          maxSizeMB: 1,
          maxWidthOrHeight: 1600,
          initialQuality: 0.8,
        };
      }
      // 2MB 이하: 약한 압축
      return {
        ...baseOptions,
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        initialQuality: 0.85,
      };
    },
    []
  );

  const compressForOcr = useCallback(
    async (file: File): Promise<File> => {
      if (!file.type.startsWith("image/")) return file;

      try {
        const compressionOptions = getCompressionOptions(file.size);
        const compressed = await imageCompression(file, compressionOptions);

        console.log("이미지 압축 완료:", {
          원본크기: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
          압축크기: `${(compressed.size / 1024 / 1024).toFixed(2)}MB`,
          압축률: `${((1 - compressed.size / file.size) * 100).toFixed(1)}%`,
        });

        return compressed;
      } catch (error) {
        console.error("이미지 압축 실패:", error);
        return file; // 폴백: 원본 파일
      }
    },
    [getCompressionOptions]
  );

  return { compressForOcr };
};
