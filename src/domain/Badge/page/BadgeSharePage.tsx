import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Layout from "../../../components/Layout";
import BaseLongButton from "../../../components/BaseLongButton";
import Header from "../../../components/Header";
import { useUserStore } from "../../../store/useUserStore";
import { useMemberStore } from "../../../store/useMemberStore";
import { BADGE_RESOURCE_MAP } from "../types/badge.type";
import { DISABILITY_TYPES } from "../../../constants/disabilityTypes";

const BadgeSharePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shareId = searchParams.get("d");
  const { user } = useUserStore();
  const { member, fetchMember } = useMemberStore();
  const [showConfetti, setShowConfetti] = useState(true);

  // 폭죽 파티클 생성 (useState로 초기화)
  const [confettiParticles] = useState(() => {
    const particles = [];
    const colors = [
      "#FF6B6B", // 빨강
      "#4ECDC4", // 청록
      "#FFE66D", // 노랑
      "#95E1D3", // 민트
      "#F38181", // 핑크
      "#AA96DA", // 보라
      "#FCBAD3", // 연핑크
      "#A8E6CF", // 연녹
    ];
    const positions = [
      0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38,
      40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74,
      76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100,
    ];

    for (let i = 0; i < 80; i++) {
      particles.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: positions[Math.floor(Math.random() * positions.length)],
        delay: Math.random() * 1.0,
        duration: 3.0 + Math.random() * 2.0,
        size: 6 + Math.random() * 14,
        rotation: Math.random() * 360,
      });
    }
    return particles;
  });

  // base64 디코딩 (early return 전에 수행)
  let imageUrl: string | null = null;
  let badgeName: string | null = null;
  let sharedUserName: string | null = null;
  let badgeLevel: "5" | "10" | null = null;

  if (shareId) {
    try {
      const decodedBase64 = atob(shareId.replace(/-/g, "+").replace(/_/g, "/"));
      const decodedString = decodeURIComponent(decodedBase64);
      const shareData = JSON.parse(decodedString);
      imageUrl = shareData.image;
      badgeName = shareData.name;
      sharedUserName = shareData.userName || null; // 링크에 포함된 사용자 이름
      badgeLevel = shareData.level || "5"; // 5회 또는 10회 뱃지 레벨
    } catch (error) {
      console.error("링크 디코딩 실패:", error);
    }
  }

  // 기존 방식 호환성 (image, name 파라미터 직접 사용)
  if (!imageUrl) {
    imageUrl = searchParams.get("image");
    badgeName = searchParams.get("name");
  }

  // 사용자 이름 가져오기 (링크에 포함된 이름 우선, 없으면 store에서 가져오기)
  const userName = useMemo(() => {
    // 1. 링크에 포함된 이름 우선 사용
    if (sharedUserName) {
      return sharedUserName;
    }
    // 2. store에서 가져오기
    if (user?.name) {
      return user.name;
    }
    if (member?.name) {
      return member.name;
    }
    return "";
  }, [sharedUserName, user, member]);

  // 이름이 없으면 멤버 정보 가져오기 시도
  useEffect(() => {
    if (!userName && !member && !user) {
      fetchMember();
    }
  }, [userName, member, user, fetchMember]);

  // 애니메이션 제어
  useEffect(() => {
    // 폭죽 효과 (5초 후 사라짐 - 더 천천히)
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => {
      clearTimeout(confettiTimer);
    };
  }, []);

  // 공유 정보 계산
  const decodedBadgeName = badgeName ? decodeURIComponent(badgeName) : "뱃지";
  const levelText = badgeLevel === "10" ? "전문가" : "숙련자";

  // 장애 유형 ID 찾기
  const disability = DISABILITY_TYPES.find((d) => d.name === decodedBadgeName);
  const disabilityId = disability?.id || 1;

  // 뱃지 이미지 가져오기 (BadgeDetailPage와 동일한 로직)
  const targetLevel = badgeLevel === "10" ? "LEVEL_2" : "LEVEL_1";
  const badgeResource = BADGE_RESOURCE_MAP[disabilityId];
  const badgeImageUrl = badgeResource ? badgeResource[targetLevel] : imageUrl;

  const baseUrl = import.meta.env.PROD
    ? "https://be-bee.link"
    : window.location.origin;
  const shareUrl = `${baseUrl}${window.location.pathname}${window.location.search}`;
  const badgeTitle = decodedBadgeName + " " + levelText;
  const name = userName ? userName : member?.name;
  const shareTitle = `${decodedBadgeName} ${levelText} 뱃지를 획득했어요!`;

  const shareDescription = `비비에서 함께 도움을 나눠보세요`;

  // OpenGraph 메타 태그 설정 (모든 hooks는 early return 전에 호출)
  useEffect(() => {
    if (!badgeImageUrl) return;
    // 기존 메타 태그 제거
    const existingOgTags = document.querySelectorAll('meta[property^="og:"]');
    existingOgTags.forEach((tag) => tag.remove());

    // OpenGraph 메타 태그 추가
    const ogTags = [
      { property: "og:type", content: "website" },
      { property: "og:title", content: shareTitle },
      { property: "og:description", content: shareDescription },
      { property: "og:image", content: badgeImageUrl },
      { property: "og:url", content: shareUrl },
      { property: "og:site_name", content: "비비" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
    ];

    ogTags.forEach(({ property, content }) => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", property);
      meta.setAttribute("content", content);
      document.head.appendChild(meta);
    });

    // Twitter Card 메타 태그도 추가
    const twitterTags = [
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: shareTitle },
      { name: "twitter:description", content: shareDescription },
      { name: "twitter:image", content: badgeImageUrl },
    ];

    twitterTags.forEach(({ name, content }) => {
      const meta = document.createElement("meta");
      meta.setAttribute("name", name);
      meta.setAttribute("content", content);
      document.head.appendChild(meta);
    });

    // 페이지 제목도 변경
    document.title = shareTitle;

    // cleanup 함수
    return () => {
      const ogTagsToRemove = document.querySelectorAll('meta[property^="og:"]');
      ogTagsToRemove.forEach((tag) => tag.remove());
      const twitterTagsToRemove = document.querySelectorAll(
        'meta[name^="twitter:"]'
      );
      twitterTagsToRemove.forEach((tag) => tag.remove());
    };
  }, [shareTitle, shareDescription, badgeImageUrl, shareUrl]);

  // early return (모든 hooks 호출 후)
  if (!badgeImageUrl) {
    return (
      <Layout>
        <Header onBack={() => navigate("/")} showBack />
        <ErrorContainer>뱃지 정보를 찾을 수 없습니다.</ErrorContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      {showConfetti && (
        <ConfettiContainer>
          {confettiParticles.map((particle) => (
            <ConfettiParticle
              key={particle.id}
              $left={particle.left}
              $delay={particle.delay}
              $duration={particle.duration}
              $size={particle.size}
              $color={particle.color}
              $rotation={particle.rotation}
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 폭죽 모양 SVG */}
                <circle cx="10" cy="10" r="3" fill={particle.color} />
                <path
                  d="M10 2 L10 6 M10 14 L10 18 M2 10 L6 10 M14 10 L18 10 M4.5 4.5 L7 7 M13 13 L15.5 15.5 M15.5 4.5 L13 7 M7 13 L4.5 15.5"
                  stroke={particle.color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </ConfettiParticle>
          ))}
        </ConfettiContainer>
      )}
      <Container>
        <TextContainer>
          <BadgeTitle>{badgeTitle}</BadgeTitle>
          <div>
            <Title>{name}님이</Title>
            <Title>{shareTitle}</Title>
          </div>
          <Description>{shareDescription}</Description>
        </TextContainer>
        <BadgeImageContainer>
          <BadgeImage src={badgeImageUrl} alt={`${decodedBadgeName} 뱃지`} />
        </BadgeImageContainer>
      </Container>
      <BaseLongButton
        label="가입하기"
        onClick={() => navigate("/signup/step1")}
      />
    </Layout>
  );
};

export default BadgeSharePage;

// --- Styled Components ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  padding-top: 50px;
`;
const BadgeTitle = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  width: fit-content;
  padding: 0 15px;
  height: 40px;
  border-radius: 50px;
  border: 1px solid ${({ theme }) => theme.color.blue50};
  background: ${({ theme }) => theme.color.blue50};
  color: ${({ theme }) => theme.color.blue500};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  line-height: 1.4;
`;
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;
const Title = styled.h2`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.color.text};
  text-align: center;
  margin: 0;
  line-height: 1.4;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.subText};
  text-align: center;
  margin: 0;
  line-height: 1.6;
`;

const confetti = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
`;

const ConfettiContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
`;

const ConfettiParticle = styled.div<{
  $left: number;
  $delay: number;
  $duration: number;
  $size: number;
  $color: string;
  $rotation: number;
}>`
  position: absolute;
  left: ${({ $left }) => $left}%;
  top: -50px;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  animation: ${confetti} ${({ $duration }) => $duration}s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  pointer-events: none;
  transform: rotate(${({ $rotation }) => $rotation}deg);

  svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 2px ${({ $color }) => $color});
  }
`;

const BadgeImageContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const BadgeImage = styled.img`
  width: 80%;
  border-radius: 16px;
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: ${({ theme }) => theme.color.subText2};
`;
