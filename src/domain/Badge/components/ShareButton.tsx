import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { uploadFile } from "../../../api/fileApi2";
import { useUserStore } from "../../../store/useUserStore";
import { useMemberStore } from "../../../store/useMemberStore";

interface ShareButtonProps {
  imageUrl: string;
  disabilityName?: string;
  disabled?: boolean;
  level?: "5" | "10"; // 5회 또는 10회 뱃지
}

// 카카오 SDK 타입 선언
declare global {
  interface Window {
    Kakao: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: {
          objectType: string;
          content: {
            title: string;
            description: string;
            imageUrl: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          };
        }) => void;
      };
    };
  }
}

const ShareButton = ({
  imageUrl,
  disabilityName,
  disabled,
  level,
}: ShareButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserStore();
  const { member } = useMemberStore();

  // 사용자 이름 가져오기
  const userName = user?.name || member?.name || "";

  // 카카오 SDK 초기화
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    script.onload = () => {
      const kakaoAppKey = import.meta.env.VITE_KAKAO_MAP_KEY || "";
      if (kakaoAppKey && window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoAppKey);
      }
    };
    document.head.appendChild(script);

    return () => {
      // cleanup
      const existingScript = document.querySelector(
        'script[src="https://developers.kakao.com/sdk/js/kakao.js"]'
      );
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

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

  // 카카오톡 공유
  const shareToKakao = async () => {
    if (disabled || isLoading) return;

    try {
      setIsLoading(true);

      // 이미지 URL 처리 (상대 경로를 절대 경로로 변환)
      const absoluteImageUrl = imageUrl.startsWith("http")
        ? imageUrl
        : imageUrl.startsWith("/")
        ? `${window.location.origin}${imageUrl}`
        : `${window.location.origin}/${imageUrl}`;

      // 이미지 업로드
      const image = await loadImage(absoluteImageUrl);
      const blob = await createStoryImage(image);
      const entityId = `badge_${disabilityName || "share"}_${Date.now()}`;
      const fileName = `${entityId}.png`;
      const file = new File([blob], fileName, { type: "image/png" });
      const uploadedFileUrl = await uploadFile(file, "badge", entityId);

      // 짧은 링크 생성 (base64 인코딩 사용)
      // 한글 문자를 처리하기 위해 encodeURIComponent를 먼저 사용
      const shareData = {
        image: uploadedFileUrl,
        name: disabilityName || "뱃지",
        userName: userName, // 사용자 이름도 포함
        level: level || "5", // 5회 또는 10회 뱃지 레벨
      };
      const shareDataString = JSON.stringify(shareData);
      // 한글 문자를 안전하게 인코딩
      const encodedString = encodeURIComponent(shareDataString);
      const shareId = btoa(encodedString)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");

      // 짧은 링크 생성 (배포 환경에서는 be-bee.link 사용)
      const baseUrl = import.meta.env.PROD
        ? "https://be-bee.link"
        : window.location.origin;
      const shareUrl = `${baseUrl}/badge/share?d=${shareId}`;

      const levelText = level === "10" ? "전문가" : "숙련자";
      const shareTitle = disabilityName
        ? `${disabilityName} ${levelText} 뱃지`
        : "비비 뱃지";
      const shareText = disabilityName
        ? `나는 ${disabilityName} ${levelText}입니다! 비비 앱에서 더 많은 정보를 확인해보세요.`
        : "비비 뱃지를 획득했어요!";

      // 1. Web Share API 시도 (모바일)
      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl,
          });
          return;
        } catch (shareError) {
          // 사용자가 공유를 취소한 경우
          if (shareError instanceof Error && shareError.name === "AbortError") {
            return;
          }
          console.log("Web Share API 실패, 카카오톡 공유로 대체");
        }
      }

      // 2. 카카오톡 공유 시도
      if (window.Kakao && window.Kakao.isInitialized()) {
        try {
          window.Kakao.Share.sendDefault({
            objectType: "feed",
            content: {
              title: shareTitle,
              description: shareText,
              imageUrl: uploadedFileUrl,
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
          });
          return;
        } catch (kakaoError) {
          console.error("카카오톡 공유 실패:", kakaoError);
          // 카카오톡 공유 실패 시 링크 복사로 대체
        }
      }

      // 3. 대체 방법: 클립보드에 링크 복사
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert(
            "공유 링크가 클립보드에 복사되었습니다!\n카카오톡에서 링크를 붙여넣어 공유하세요."
          );
        } catch (clipboardError) {
          console.error("클립보드 복사 실패:", clipboardError);
          alert(
            `공유 링크: ${shareUrl}\n위 링크를 복사하여 카카오톡에서 공유하세요.`
          );
        }
      } else {
        // 클립보드 API가 지원되지 않으면 링크 표시
        alert(
          `공유 링크: ${shareUrl}\n위 링크를 복사하여 카카오톡에서 공유하세요.`
        );
      }
    } catch (error) {
      console.error("공유 실패:", error);
      alert("공유에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ShareArea>
      <ShareButtonStyled
        onClick={shareToKakao}
        disabled={disabled || isLoading}
      >
        {isLoading ? "공유 중..." : "카카오톡으로 공유하기"}
      </ShareButtonStyled>
    </ShareArea>
  );
};

export default ShareButton;
const ShareArea = styled.div`
  width: 100%;
  padding-top: 16px;
  margin-top: auto;
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
