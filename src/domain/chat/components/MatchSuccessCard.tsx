// MatchSuccessMessageCard.tsx
import styled from "styled-components";
import type { ChatMessage } from "../chat.types";
import {
  formatDateToKorean,
  formatTimeToHHmm,
} from "../../../types/common.types";

interface MatchSuccessCardProps {
  message: ChatMessage;
}

const MatchSuccessCard = ({ message }: MatchSuccessCardProps) => {
  // 공통 유틸리티 함수 사용
  const formatDate = formatDateToKorean;
  const formatTime = formatTimeToHHmm;

  const isDayType = message.matchType === "DAY";

  return (
    <Container>
      <Title>🎉 짝짝짝! 매칭이 성사되었어요</Title>
      <Sub>확정 내용은 맺음 현황에서도 확인할 수 있어요</Sub>

      <InfoSection>
        <InfoRow>
          <InfoLabel>장소:</InfoLabel>
          <InfoValue>{message.location || "-"}</InfoValue>
        </InfoRow>

        {isDayType ? (
          <>
            <InfoRow>
              <InfoLabel>날짜:</InfoLabel>
              <InfoValue>{formatDate(message.startDate)}</InfoValue>
            </InfoRow>
            {message.scheduleDays && message.scheduleDays.length > 0 && (
              <InfoRow>
                <InfoLabel>시간:</InfoLabel>
                <InfoValue>
                  {formatTime(message.scheduleStartTimes?.[0])} -{" "}
                  {formatTime(message.scheduleEndTimes?.[0])}
                </InfoValue>
              </InfoRow>
            )}
          </>
        ) : (
          <>
            <InfoRow>
              <InfoLabel>기간:</InfoLabel>
              <InfoValue>
                {formatDate(message.startDate)} ~ {formatDate(message.endDate)}
              </InfoValue>
            </InfoRow>
            {message.scheduleDays && message.scheduleDays.length > 0 && (
              <InfoRow>
                <InfoLabel>요일/시간:</InfoLabel>
                <InfoValue>
                  {message.scheduleDays.map((day, idx) => (
                    <span key={idx}>
                      {day} {formatTime(message.scheduleStartTimes?.[idx])}-
                      {formatTime(message.scheduleEndTimes?.[idx])}
                      {idx < message.scheduleDays.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </InfoValue>
              </InfoRow>
            )}
          </>
        )}

        <InfoRow>
          <InfoLabel>단위 꿀:</InfoLabel>
          <InfoValue>
            {message.unitPoints?.toLocaleString() || "-"} 꿀
          </InfoValue>
        </InfoRow>

        <InfoRow>
          <InfoLabel>총 꿀:</InfoLabel>
          <InfoValue>
            {message.totalPoints?.toLocaleString() || "-"} 꿀
          </InfoValue>
        </InfoRow>
      </InfoSection>
    </Container>
  );
};

export default MatchSuccessCard;

const Container = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.color.blue50};
  border: 0.5px solid ${({ theme }) => theme.color.blue500};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 20px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.size.md};
  margin-bottom: 8px;
`;

const Sub = styled.div`
  color: ${({ theme }) => theme.color.subText2};
  font-size: ${({ theme }) => theme.size.sm};
  margin-bottom: 16px;
`;

const InfoSection = styled.div`
  width: 100%;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.color.blue500};
  opacity: 0.3;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  color: ${({ theme }) => theme.color.subText2};
  font-size: ${({ theme }) => theme.size.sm};
  font-weight: ${({ theme }) => theme.weight.medium};
  min-width: 80px;
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.size.sm};
  text-align: right;
  flex: 1;
`;
