import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../../components/Header";
import { useBadgeStore } from "../store/useBadgeStore";
import { DISABILITY_TYPES } from "../../../constants/disabilityTypes";
import badgeBanner from "../../../assets/images/badge-banner.png";
import StampCard from "../components/StampCard";

const SNOW_COUNT = 60;

const Badge = () => {
  const navigate = useNavigate();
  const { isLoading, error, fetchBadgeStatus, getBadgeStatusByDisabilityId } =
    useBadgeStore();

  // 눈송이 위치와 속도 초기화 (렌더링마다 변경되지 않도록)
  const snowflakes = useMemo(() => {
    return Array.from({ length: SNOW_COUNT }, (_, i) => ({
      id: i,
      left: (i * 7) % 100,
      size: Math.random() * 4 + 3,
      opacity: Math.random() * 0.7 + 0.3,
      duration: Math.random() * 3 + 5,
      delay: Math.random() * 2,
      drift: (Math.random() - 0.5) * 50,
    }));
  }, []);

  useEffect(() => {
    fetchBadgeStatus();
  }, [fetchBadgeStatus]);

  // 장애 유형별 뱃지 상태 조회
  const getBadgeStatus = getBadgeStatusByDisabilityId;

  const displayDisabilities = DISABILITY_TYPES.slice(0, 5);

  if (isLoading) {
    return (
      <BadgeContainer>
        <BannerSection>
          <Header title="뱃지" onBack={() => navigate(-1)} showBack />
          <BannerImage src={badgeBanner} alt="뱃지 배너" />
        </BannerSection>
        <LoadingContainer>뱃지 정보를 불러오는 중...</LoadingContainer>
      </BadgeContainer>
    );
  }

  if (error) {
    return (
      <BadgeContainer>
        <BannerSection>
          <Header title="뱃지" onBack={() => navigate(-1)} showBack />
          <BannerImage src={badgeBanner} alt="뱃지 배너" />
        </BannerSection>
        <ErrorContainer>{error}</ErrorContainer>
      </BadgeContainer>
    );
  }

  return (
    <BadgeContainer>
      <BannerSection>
        <Header title="뱃지" onBack={() => navigate(-1)} showBack />

        {/* 배너 섹션 */}

        <BannerImage src={badgeBanner} alt="뱃지 배너" />
        <SnowContainer>
          {snowflakes.map((snow) => (
            <Snowflake
              key={snow.id}
              $left={snow.left}
              $size={snow.size}
              $opacity={snow.opacity}
              $duration={snow.duration}
              $delay={snow.delay}
              $drift={snow.drift}
            />
          ))}
        </SnowContainer>
      </BannerSection>

      {/* 뱃지 섹션들 */}
      <BadgeSections>
        {/* 5회 카드 섹션 */}
        {displayDisabilities.map((disability) => {
          const status = getBadgeStatus(disability.id);
          const count = status?.count || 0;
          const badgeCode = status?.badge_code || null;

          return (
            <StampCard
              key={`${disability.id}-5`}
              disability={disability}
              count={count}
              targetCount={5}
              badgeCode={badgeCode}
              onNavigate={() => navigate(`/badge/${disability.id}?level=5`)}
            />
          );
        })}

        {/* 10회 카드 섹션 */}
        {displayDisabilities.map((disability) => {
          const status = getBadgeStatus(disability.id);
          const count = status?.count || 0;
          const badgeCode = status?.badge_code || null;

          return (
            <StampCard
              key={`${disability.id}-10`}
              disability={disability}
              count={count}
              targetCount={10}
              badgeCode={badgeCode}
              onNavigate={() => navigate(`/badge/${disability.id}?level=10`)}
            />
          );
        })}
      </BadgeSections>
    </BadgeContainer>
  );
};

export default Badge;

// --- Styled Components ---

const BadgeContainer = styled.div`
  height: 100vh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const BannerSection = styled.div`
  position: fixed;
  top: 0;
  width: 375px;
  height: 220px;
  z-index: 1;
`;

const BadgeSections = styled.div`
  position: relative;
  top: 260px;
  z-index: 2;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  padding: 0 16px 280px 16px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
  z-index: 1;
`;

const SnowContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
`;

interface SnowflakeProps {
  $left: number;
  $size: number;
  $opacity: number;
  $duration: number;
  $delay: number;
  $drift: number;
}

const Snowflake = styled.div<SnowflakeProps>`
  position: absolute;
  top: 35px;
  left: ${({ $left }) => `${$left}%`};
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  background: white;
  border-radius: 50%;
  opacity: ${({ $opacity }) => $opacity};
  animation: snowfall ${({ $duration }) => $duration}s linear infinite;
  animation-delay: ${({ $delay }) => `${$delay}s`};
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.8);

  @keyframes snowfall {
    0% {
      transform: translateY(0) translateX(0) rotate(0deg);
      opacity: ${({ $opacity }) => $opacity};
    }
    50% {
      transform: translateX(${({ $drift }) => $drift}px) rotate(180deg);
    }
    100% {
      transform: translateY(190px) translateX(${({ $drift }) => $drift * 1.2}px)
        rotate(360deg);
      opacity: ${({ $opacity }) => $opacity * 0.5};
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: ${({ theme }) => theme.color.subText2};
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: ${({ theme }) => theme.color.subText2};
`;
