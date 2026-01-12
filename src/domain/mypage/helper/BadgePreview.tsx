import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useBadgeStore } from "../../Badge/store/useBadgeStore";
import { BADGE_RESOURCE_MAP } from "../../Badge/types/badge.type";
import { DISABILITY_TYPES } from "../../../constants/disabilityTypes";
import { IoChevronForward } from "react-icons/io5";

const BadgePreview = () => {
  const navigate = useNavigate();
  const { badgeStatus, isLoading, error, fetchBadgeStatus } = useBadgeStore();

  useEffect(() => {
    fetchBadgeStatus();
  }, [fetchBadgeStatus]);

  // count가 높은 순으로 정렬하여 상위 5개만 표시
  const displayDisabilities = useMemo(() => {
    const disabilitiesWithCount = DISABILITY_TYPES.map((disability) => {
      const status = badgeStatus.find((item) =>
        item.disabilityCategoryIds.includes(disability.id)
      );
      return {
        ...disability,
        count: status?.count || 0,
        badgeCode: status?.badge_code || null,
      };
    });

    // count가 높은 순으로 정렬
    const sorted = disabilitiesWithCount.sort((a, b) => b.count - a.count);

    // 상위 5개만 반환
    return sorted.slice(0, 5);
  }, [badgeStatus]);

  const handleBadgeClick = () => {
    navigate("/badge");
  };

  if (isLoading) {
    return (
      <BadgePreviewContainer>
        <BadgePreviewTitle>내 뱃지</BadgePreviewTitle>
        <BadgeScrollContainer>
          <LoadingText>뱃지 정보를 불러오는 중...</LoadingText>
        </BadgeScrollContainer>
      </BadgePreviewContainer>
    );
  }

  if (error) {
    return (
      <BadgePreviewContainer>
        <BadgePreviewTitle>내 뱃지</BadgePreviewTitle>
        <BadgeScrollContainer>
          <LoadingText>{error}</LoadingText>
        </BadgeScrollContainer>
      </BadgePreviewContainer>
    );
  }

  return (
    <BadgePreviewContainer>
      <BadgeHeader>
        <BadgePreviewTitle>내 뱃지</BadgePreviewTitle>
        <ViewAllButton onClick={handleBadgeClick}>
          {" "}
          <IoChevronForward size={24} color="#A1A1A1" />
        </ViewAllButton>
      </BadgeHeader>
      <BadgeScrollContainer>
        <BadgeScrollContent>
          {displayDisabilities.map((disability) => {
            const badgeCode = disability.badgeCode;
            const isUnlocked = badgeCode !== null;

            // 뱃지 이미지 결정 (가장 높은 레벨 표시)
            const badgeResource = BADGE_RESOURCE_MAP[disability.id];

            // badgeResource가 없으면 해당 뱃지는 렌더링하지 않음
            if (!badgeResource) {
              console.warn(
                `뱃지 리소스를 찾을 수 없습니다: disabilityId=${disability.id}`
              );
              return null;
            }

            const badgeImage =
              badgeCode && badgeResource[badgeCode]
                ? badgeResource[badgeCode]
                : badgeResource.DEFAULT;

            return (
              <BadgeCard key={disability.id} onClick={handleBadgeClick}>
                <BadgeImageContainer $isUnlocked={isUnlocked}>
                  <BadgeImage
                    src={badgeImage}
                    alt={`${disability.name} 뱃지`}
                  />
                  {!isUnlocked && <LockOverlay>🔒</LockOverlay>}
                </BadgeImageContainer>
                <BadgeText>
                  <BadgeName>{disability.name}</BadgeName>
                  <BadgeCount>달성{disability.count}/5개</BadgeCount>
                </BadgeText>
              </BadgeCard>
            );
          })}
        </BadgeScrollContent>
      </BadgeScrollContainer>
    </BadgePreviewContainer>
  );
};

export default BadgePreview;

const BadgePreviewContainer = styled.div`
  width: 100%;
  padding: 20px 16px;
  background-color: ${({ theme }) => theme.color.white};
  border-radius: 12px;
`;

const BadgeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const BadgePreviewTitle = styled.h3`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
  margin: 0;
`;

const ViewAllButton = styled.button`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText};
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.color.main};
  }
`;

const BadgeScrollContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const BadgeScrollContent = styled.div`
  display: flex;
  gap: 8px;
  padding-bottom: 8px;
`;

const BadgeCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 6px;
  border: 0.5px solid ${({ theme }) => theme.color.natural200};
  border-radius: 10px;
  gap: 8px;
  min-width: 160px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.95);
  }
`;

const BadgeImageContainer = styled.div<{ $isUnlocked: boolean }>`
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.color.natural100};

  opacity: ${({ $isUnlocked }) => ($isUnlocked ? 1 : 0.6)};
  transition: all 0.2s ease;
`;

const BadgeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const LockOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  opacity: 0.8;
`;
const BadgeText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
`;
const BadgeName = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.text};
  text-align: center;
`;

const BadgeCount = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText};
  text-align: center;
`;

const LoadingText = styled.div`
  padding: 40px 0;
  text-align: center;
  color: ${({ theme }) => theme.color.subText};
  font-size: ${({ theme }) => theme.size.sm};
`;
