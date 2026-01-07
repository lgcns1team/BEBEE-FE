import styled from "styled-components";
import chatLight from "../../../assets/images/chat-light.png";
import type { ChatMessage } from "../chat.types";
import {
  formatDateToKoreanWithDay,
  formatTimeToHHmm,
  formatDayOfWeek,
} from "../../../types/common.types";
import { useChatStore } from "../store/useChatStore";
import { useMatchAgreement } from "../hook/useMatchAgreement";

interface MatchResultCardProps {
  message: ChatMessage;
  onAcceptSuccess?: (successData: ChatMessage) => void;
  onRefuseSuccess?: () => void;
}

const MatchResultCard = ({
  message,
  onAcceptSuccess,
  onRefuseSuccess,
}: MatchResultCardProps) => {
  const { getMessageWithMetadata } = useChatStore();
  const { handleAccept, handleRefuse } = useMatchAgreement({
    message,
    onAcceptSuccess,
    onRefuseSuccess,
  });

  // 메타데이터가 병합된 메시지 사용
  const messageWithMetadata = getMessageWithMetadata(message);

  // 공통 유틸리티 함수 사용
  const formatDate = formatDateToKoreanWithDay;
  const formatTime = formatTimeToHHmm;
  const formatDay = (day?: string) => formatDayOfWeek(day, true); // "요일" 포함

  const isDayType = messageWithMetadata.matchType === "DAY";

  return (
    <Card role="region" aria-label="매칭 확인서">
      <Content>
        <Header>
          <img
            src={chatLight}
            alt=""
            width={60}
            height={60}
            aria-hidden="true"
          />
          <Title>
            매칭 확인서가 도착했어요
            <span className="sr-only">
              상대방으로부터 매칭 확인서가 도착했습니다. 아래의 정보를 확인하고
              수락 또는 거절을 선택할 수 있습니다.
            </span>
          </Title>
          <Sub>아래의 정보를 확인해주세요.</Sub>
        </Header>

        <Info role="group" aria-label="매칭 확인서 상세 정보">
          <div
            role="listitem"
            aria-label={`도움 유형: ${isDayType ? "하루 도움" : "지속 도움"}`}
          >
            유형: {isDayType ? "하루 도움" : "지속 도움"}
            <span className="sr-only">
              {isDayType
                ? "하루 단위 도움 요청입니다"
                : "기간 단위 지속 도움 요청입니다"}
            </span>
          </div>
          {isDayType ? (
            <>
              <div
                role="listitem"
                aria-label={`도움 날짜: ${formatDate(
                  messageWithMetadata.startDate
                )}`}
              >
                날짜: {formatDate(messageWithMetadata.startDate)}
                <span className="sr-only">
                  {messageWithMetadata.startDate
                    ? `도움을 제공할 날짜는 ${formatDate(
                        messageWithMetadata.startDate
                      )}입니다`
                    : "날짜 정보 없음"}
                </span>
              </div>
              {messageWithMetadata.scheduleDays &&
                messageWithMetadata.scheduleDays.length > 0 && (
                  <div role="list" aria-label="도움 일시 목록">
                    {messageWithMetadata.scheduleDays.map((day, idx) => {
                      const startTime = formatTime(
                        messageWithMetadata.scheduleStartTimes?.[idx]
                      );
                      const endTime = formatTime(
                        messageWithMetadata.scheduleEndTimes?.[idx]
                      );
                      return (
                        <div
                          key={idx}
                          role="listitem"
                          aria-label={`일시 ${
                            idx + 1
                          }: ${startTime}부터 ${endTime}까지`}
                        >
                          일시: {startTime} - {endTime}
                          <span className="sr-only">
                            {startTime && endTime
                              ? `${startTime}부터 ${endTime}까지 도움을 제공합니다`
                              : "시간 정보 없음"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
            </>
          ) : (
            <>
              <div
                role="listitem"
                aria-label={`도움 기간: ${formatDate(
                  messageWithMetadata.startDate
                )}부터 ${formatDate(messageWithMetadata.endDate)}까지`}
              >
                기간: {formatDate(messageWithMetadata.startDate)} ~{" "}
                {formatDate(messageWithMetadata.endDate)}
                <span className="sr-only">
                  {messageWithMetadata.startDate && messageWithMetadata.endDate
                    ? `도움 기간은 ${formatDate(
                        messageWithMetadata.startDate
                      )}부터 ${formatDate(
                        messageWithMetadata.endDate
                      )}까지입니다`
                    : "기간 정보 없음"}
                </span>
              </div>
              {messageWithMetadata.scheduleDays &&
                messageWithMetadata.scheduleDays.length > 0 && (
                  <div role="list" aria-label="도움 요일 및 시간 목록">
                    일시:
                    {messageWithMetadata.scheduleDays.map((day, idx) => {
                      const dayName = formatDay(day);
                      const startTime = formatTime(
                        messageWithMetadata.scheduleStartTimes?.[idx]
                      );
                      const endTime = formatTime(
                        messageWithMetadata.scheduleEndTimes?.[idx]
                      );
                      return (
                        <Indent
                          key={idx}
                          role="listitem"
                          aria-label={`${dayName} ${startTime}부터 ${endTime}까지`}
                        >
                          {dayName} {startTime} - {endTime}
                          <span className="sr-only">
                            {dayName && startTime && endTime
                              ? `${dayName}에 ${startTime}부터 ${endTime}까지 도움을 제공합니다`
                              : "요일 또는 시간 정보 없음"}
                          </span>
                        </Indent>
                      );
                    })}
                  </div>
                )}
            </>
          )}
          <div
            role="listitem"
            aria-label={`도움 장소: ${
              messageWithMetadata.location || "정보 없음"
            }`}
          >
            장소: {messageWithMetadata.location || "-"}
            <span className="sr-only">
              {messageWithMetadata.location
                ? `도움을 제공할 장소는 ${messageWithMetadata.location}입니다`
                : "도움 장소 정보가 없습니다"}
            </span>
          </div>
          <div
            role="listitem"
            aria-label={`보상 정보: 회당 ${
              messageWithMetadata.unitPoints?.toLocaleString() || 0
            }꿀, 총 ${
              messageWithMetadata.totalPoints?.toLocaleString() || 0
            }꿀`}
          >
            꿀: {messageWithMetadata.unitPoints?.toLocaleString() || "-"}꿀
            /회(총 {messageWithMetadata.totalPoints?.toLocaleString() || "-"}꿀)
            <span className="sr-only">
              {messageWithMetadata.unitPoints && messageWithMetadata.totalPoints
                ? `회당 ${messageWithMetadata.unitPoints.toLocaleString()}꿀을 받으며, 총 ${messageWithMetadata.totalPoints.toLocaleString()}꿀을 받게 됩니다`
                : "보상 정보가 없습니다"}
            </span>
          </div>
          {/* TODO: 카테고리 정보 추가 */}
        </Info>
      </Content>
      <ButtonWrapper role="group" aria-label="매칭 확인서 응답 버튼">
        <RefusalButton
          onClick={handleRefuse}
          aria-label="매칭 확인서 거절하기"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleRefuse();
            }
          }}
        >
          거절
          <span className="sr-only">
            이 매칭 확인서를 거절합니다. Enter 키 또는 Space 키를 누르면
            실행됩니다.
          </span>
        </RefusalButton>
        <AcceptButton
          onClick={handleAccept}
          aria-label="매칭 확인서 수락하기"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleAccept();
            }
          }}
        >
          수락
          <span className="sr-only">
            이 매칭 확인서를 수락하고 매칭을 완료합니다. Enter 키 또는 Space
            키를 누르면 실행됩니다.
          </span>
        </AcceptButton>
      </ButtonWrapper>
    </Card>
  );
};

export default MatchResultCard;

const Card = styled.div`
  width: 100%;
  max-width: 330px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  /*세로선*/
  border-left: 3px solid ${({ theme }) => theme.color.main};
  padding-left: 24px; /* 내용이 선에 붙지 않도록 */
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 1rem;
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.color.main};
`;

const Sub = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.subText2};
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 12px;
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
  line-height: 20px;
`;

const Indent = styled.div`
  margin-left: 40px;
`;
const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: 1rem;
  display: flex;
  gap: 12px;
`;

const AcceptButton = styled.button`
  flex: 1;
  color: ${({ theme }) => theme.color.white};
  background-color: ${({ theme }) => theme.color.main};
  padding: 12px 24px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.size.md};
  cursor: pointer;
`;

const RefusalButton = styled.button`
  flex: 1;
  color: ${({ theme }) => theme.color.subText3};
  background-color: ${({ theme }) => theme.color.natural100};
  padding: 12px 24px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.size.md};
  cursor: pointer;
`;
