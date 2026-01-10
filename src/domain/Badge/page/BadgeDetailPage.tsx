import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import { badgeApi } from "../api/badgeApi";
import type { BadgeStatusItem } from "../types/badge.type";
import { BADGE_RESOURCE_MAP } from "../types/badge.type";
import { DISABILITY_TYPES } from "../../../constants/disabilityTypes";
import ShareButton from "../components/ShareButton";

const BadgeDetailPage = () => {
  const navigate = useNavigate();
  const { disabilityId } = useParams<{ disabilityId: string }>();
  const [searchParams] = useSearchParams();
  const level = searchParams.get("level");
  const [badgeStatus, setBadgeStatus] = useState<BadgeStatusItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBadgeStatus = async () => {
      try {
        const data = await badgeApi.getBadge();
        setBadgeStatus(data.badge_status || []);
      } catch (error) {
        console.error("뱃지 상태 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBadgeStatus();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <Header title="뱃지 상세" onBack={() => navigate(-1)} showBack />
        <LoadingContainer>뱃지 정보를 불러오는 중...</LoadingContainer>
      </Layout>
    );
  }

  const id = disabilityId ? parseInt(disabilityId, 10) : null;
  if (!id) {
    return (
      <Layout>
        <Header title="뱃지 상세" onBack={() => navigate(-1)} showBack />
        <ErrorContainer>잘못된 장애 유형입니다.</ErrorContainer>
      </Layout>
    );
  }

  const disability = DISABILITY_TYPES.find((d) => d.id === id);
  if (!disability) {
    return (
      <Layout>
        <Header title="뱃지 상세" onBack={() => navigate(-1)} showBack />
        <ErrorContainer>장애 유형을 찾을 수 없습니다.</ErrorContainer>
      </Layout>
    );
  }

  const status = badgeStatus.find((item) =>
    item.disabilityCategoryIds.includes(id)
  );
  const badgeCode = status?.badge_code || null;
  const count = status?.count || 0;

  // level에 따라 표시할 뱃지 결정
  const targetLevel = level === "10" ? "LEVEL_2" : "LEVEL_1";
  const targetCount = level === "10" ? 10 : 5;
  const isUnlocked = badgeCode === targetLevel || count >= targetCount;

  // 뱃지 이미지 가져오기
  const badgeResource = BADGE_RESOURCE_MAP[id];
  const badgeImage =
    isUnlocked && badgeCode === targetLevel
      ? badgeResource[targetLevel]
      : badgeResource.DEFAULT;

  return (
    <Layout>
      <Header title="뱃지 상세" onBack={() => navigate(-1)} showBack />
      <Container>
        <DisabilityInfo>
          <DisabilityName>{disability.name} 전문가</DisabilityName>
          <TargetCount>{targetCount}회 도움 완료 시 획득 가능</TargetCount>
        </DisabilityInfo>

        <BadgeImageContainer>
          <BadgeImage src={badgeImage} alt={`${disability.name} 뱃지`} />
          {!isUnlocked && (
            <LockOverlay>
              <LockIcon>🔒</LockIcon>
              <LockText>
                {count}/{targetCount}회 완료
              </LockText>
            </LockOverlay>
          )}
        </BadgeImageContainer>
        <div>
          {!isUnlocked ? (
            <Text>
              <span>아직 뱃지를 획득하지 못했어요</span>
              <span>더 많은 활동에 참여해보세요</span>
            </Text>
          ) : (
            <Text>
              <span>축하합니다! 뱃지를 획득했어요!</span>
            </Text>
          )}
        </div>
        <ShareButtonContainer>
          <ShareButton
            imageUrl={badgeImage}
            disabilityName={disability.name}
            disabled={false}
          />
        </ShareButtonContainer>
      </Container>
    </Layout>
  );
};

export default BadgeDetailPage;

// --- Styled Components ---

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const DisabilityInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
`;

const DisabilityName = styled.h1`
  font-size: ${({ theme }) => theme.size.xl};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.color.text};
  margin: 0;
`;

const TargetCount = styled.p`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.subText};
  margin: 0;
`;

const BadgeImageContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
`;

const BadgeImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
`;

const LockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 16px;
  backdrop-filter: blur(4px);
`;

const LockIcon = styled.div`
  font-size: 48px;
`;

const LockText = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.color.white};
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
`;

const ShareButtonContainer = styled.div`
  width: 100%;
  padding: 0 16px;
  margin-top: 8px;
`;
