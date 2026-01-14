import React, { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import { useBadgeStore } from "../store/useBadgeStore";
import { BADGE_RESOURCE_MAP } from "../types/badge.type";
import { DISABILITY_TYPES } from "../../../constants/disabilityTypes";
import ShareButton from "../components/ShareButton";
import Loading from "../../../components/Loading";

const BadgeDetailPage = () => {
  const navigate = useNavigate();
  const { disabilityId } = useParams<{ disabilityId: string }>();
  const [searchParams] = useSearchParams();
  const level = searchParams.get("level");
  const { isLoading, error, fetchBadgeStatus, getBadgeStatusByDisabilityId } = useBadgeStore();

  useEffect(() => {
    fetchBadgeStatus();
  }, [fetchBadgeStatus]);

  const id = disabilityId ? parseInt(disabilityId, 10) : null;

  if (isLoading) {
    return (
      <Layout>
        <Header onBack={() => navigate(-1)} showBack />
        <Loading />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Header onBack={() => navigate(-1)} showBack />
        <ErrorContainer>{error}</ErrorContainer>
      </Layout>
    );
  }

  if (!id) {
    return (
      <Layout>
        <Header onBack={() => navigate(-1)} showBack />
        <ErrorContainer>잘못된 장애 유형입니다.</ErrorContainer>
      </Layout>
    );
  }

  const disability = DISABILITY_TYPES.find((d) => d.id === id);
  if (!disability) {
    return (
      <Layout>
        <Header onBack={() => navigate(-1)} showBack />
        <ErrorContainer>장애 유형을 찾을 수 없습니다.</ErrorContainer>
      </Layout>
    );
  }

  const status = getBadgeStatusByDisabilityId(id);
  const badgeCode = status?.badge_code || null;
  const count = status?.count || 0;

  // level에 따라 표시할 뱃지 결정
  const targetLevel = level === "10" ? "LEVEL_2" : "LEVEL_1";
  const targetCount = level === "10" ? 10 : 5;
  const isUnlocked = badgeCode === targetLevel || count >= targetCount;

  // 뱃지 이미지 가져오기
  // 5회 달성 시 LEVEL_1 이미지, 10회 달성 시 LEVEL_2 이미지 표시
  const badgeResource = BADGE_RESOURCE_MAP[id];
  let badgeImage = badgeResource.DEFAULT;

  if (isUnlocked) {
    // count가 목표치 이상이면 해당 레벨의 이미지 표시
    if (count >= targetCount) {
      badgeImage = badgeResource[targetLevel];
    } else if (badgeCode === targetLevel) {
      // badgeCode가 목표 레벨과 일치하면 해당 레벨 이미지 표시
      badgeImage = badgeResource[targetLevel];
    }
  }

  return (
    <Layout>
      <Header onBack={() => navigate(-1)} showBack />
      <Container>
        <DisabilityInfo>
          <DisabilityName>
            {disability.name} {targetCount === 5 ? "숙련자" : "전문가"}
          </DisabilityName>
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
      </Container>

      <ShareButton
        imageUrl={badgeImage}
        disabilityName={disability.name}
        disabled={false}
        level={level === "10" ? "10" : "5"}
      />
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
  align-items: center;
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
