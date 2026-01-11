import React, { useState } from "react";
import styled from "styled-components";
import { uploadFile } from "../../../api/fileApi2";

interface ShareButtonProps {
  imageUrl: string;
  disabilityName?: string;
  disabled?: boolean;
}

const ShareButton = ({
  imageUrl,
  disabilityName,
  disabled,
}: ShareButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Canvas로 인스타그램 스토리 형식 이미지 생성
  const createStoryImage = (image: HTMLImageElement): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context를 가져올 수 없습니다."));
        return;
      }

      // 인스타그램 스토리 비율 (9:16)
      const storyWidth = 1080;
      const storyHeight = 1920;

      canvas.width = storyWidth;
      canvas.height = storyHeight;

      // 배경색 (흰색)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, storyWidth, storyHeight);

      // 이미지를 중앙에 그리기 (비율 유지)
      const imgWidth = image.width;
      const imgHeight = image.height;
      const imgAspectRatio = imgWidth / imgHeight;

      const drawWidth = storyWidth * 0.8; // 여백 20%
      const drawHeight = drawWidth / imgAspectRatio;
      const drawX = (storyWidth - drawWidth) / 2;
      const drawY = (storyHeight - drawHeight) / 2;

      // 텍스트 추가 (선택사항)
      if (disabilityName) {
        ctx.fillStyle = "#333333";
        ctx.font = "bold 60px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          `${disabilityName} 전문가`,
          storyWidth / 2,
          storyHeight * 0.1
        );
      }

      // 이미지 그리기
      ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

      // Canvas를 Blob으로 변환
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("이미지를 생성할 수 없습니다."));
            return;
          }
          resolve(blob);
        },
        "image/png",
        0.95
      );
    });
  };

  // 이미지 로드
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("이미지를 로드할 수 없습니다."));
      image.src = url;
    });
  };

  const shareToInstagram = async () => {
    if (disabled || isLoading) return;

    try {
      setIsLoading(true);

      // 이미지 URL 처리 (상대 경로를 절대 경로로 변환)
      const absoluteImageUrl = imageUrl.startsWith("http")
        ? imageUrl
        : imageUrl.startsWith("/")
        ? `${window.location.origin}${imageUrl}`
        : `${window.location.origin}/${imageUrl}`;

      // 1. 이미지 로드
      const image = await loadImage(absoluteImageUrl);

      // 2. Canvas로 스토리 형식 이미지 생성
      const blob = await createStoryImage(image);

      // 3. Blob을 File로 변환
      const entityId = `badge_${disabilityName || "share"}_${Date.now()}`;
      const fileName = `${entityId}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      // 4. fileApi2를 사용하여 S3에 업로드
      const uploadedFileUrl = await uploadFile(file, "badge", entityId);

      console.log("✅ 이미지 업로드 완료:", uploadedFileUrl);

      // 5. Web Share API로 공유 시도 (모바일)
      if (navigator.share) {
        try {
          // 업로드된 이미지 URL에서 파일 다시 가져오기
          const response = await fetch(uploadedFileUrl);
          if (response.ok) {
            const sharedBlob = await response.blob();
            const sharedFile = new File([sharedBlob], fileName, {
              type: "image/png",
            });

            if (navigator.canShare?.({ files: [sharedFile] })) {
              await navigator.share({
                files: [sharedFile],
                title: disabilityName
                  ? `${disabilityName} 전문가 뱃지`
                  : "뱃지",
                text: disabilityName
                  ? `나는 ${disabilityName} 전문가입니다! 비비 앱에서 더 많은 정보를 확인해보세요.`
                  : "비비 뱃지를 획득했어요!",
                url: uploadedFileUrl, // 공유 링크
              });
              return;
            }
          }
        } catch (error) {
          // 사용자가 공유를 취소한 경우
          if (error instanceof Error && error.name === "AbortError") {
            return;
          }
          console.log("Web Share API로 공유 실패, 링크 공유로 대체");
        }
      }

      // 6. 대체 방법: 링크 복사 또는 다운로드
      // 클립보드에 링크 복사 시도
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(uploadedFileUrl);
          alert(
            "이미지 링크가 클립보드에 복사되었습니다!\n인스타그램에서 링크를 붙여넣어 공유하거나, 이미지를 다운로드하여 사용하세요."
          );
        } catch (clipboardError) {
          console.error("클립보드 복사 실패:", clipboardError);
          // 다운로드로 대체
          downloadImage(blob, fileName);
        }
      } else {
        // 클립보드 API가 지원되지 않으면 다운로드
        downloadImage(blob, fileName);
        alert(
          `이미지가 다운로드되었습니다!\n업로드된 이미지 링크: ${uploadedFileUrl}\n인스타그램 앱에서 스토리를 열고 이미지를 업로드해주세요.`
        );
      }
    } catch (error) {
      console.error("공유 실패:", error);
      alert("공유에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 이미지 다운로드 헬퍼 함수
  const downloadImage = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <ShareArea>
      <ShareButtonStyled
        onClick={shareToInstagram}
        disabled={disabled || isLoading}
      >
        {isLoading ? "공유 중..." : "인스타그램 스토리로 공유"}
      </ShareButtonStyled>
    </ShareArea>
  );
};

export default ShareButton;
const ShareArea = styled.div`
  width: 100%;
  padding-top: 16px;
  margin-top: auto;
  position: sticky;
  z-index: 800;
`;
const ShareButtonStyled = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px;
  background: ${({ theme }) => theme.color.subColor2};
  color: ${({ theme }) => theme.color.main};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.bold};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: opacity 0.2s ease, transform 0.1s ease;

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;
