import { useParams } from "react-router-dom";
import styled from "styled-components";
import chatLight from "../../../assets/images/chat-light.png";
import type { ChatMessage } from "../chat.types";
import {
  formatDateToKoreanWithDay,
  formatTimeToHHmm,
  formatDayOfWeek,
} from "../../../types/common.types";
import { confirmAgreement } from "../api/agreementApi";
import { useChatStore } from "../store/useChatStore";

interface MatchResultCardProps {
  message: ChatMessage;
  onAcceptSuccess?: (successData: ChatMessage) => void;
}

const MatchResultCard = ({
  message,
  onAcceptSuccess,
}: MatchResultCardProps) => {
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const { getMessageWithMetadata } = useChatStore();

  // 메타데이터가 병합된 메시지 사용
  const messageWithMetadata = getMessageWithMetadata(message);

  // 공통 유틸리티 함수 사용
  const formatDate = formatDateToKoreanWithDay;
  const formatTime = formatTimeToHHmm;
  const formatDay = (day?: string) => formatDayOfWeek(day, true); // "요일" 포함

  const isDayType = messageWithMetadata.matchType === "DAY";

  const handleAccept = async () => {
    if (!messageWithMetadata.agreementId || !chatroomId) {
      console.error("매칭 확인서 수락 실패: 필수 정보가 없습니다.");
      alert("매칭 확인서 수락에 필요한 정보가 없습니다.");
      return;
    }

    // 매칭 확인서에서 필요한 데이터 확인 (메타데이터 병합된 메시지 사용)
    if (
      !messageWithMetadata.postId ||
      !messageWithMetadata.helperId ||
      !messageWithMetadata.disabledId ||
      !messageWithMetadata.title
    ) {
      console.error(
        "매칭 확인서 수락 실패: 매칭 확인서에 필수 정보가 없습니다.",
        {
          postId: messageWithMetadata.postId,
          helperId: messageWithMetadata.helperId,
          disabledId: messageWithMetadata.disabledId,
          title: messageWithMetadata.title,
          agreementId: messageWithMetadata.agreementId,
        }
      );
      alert("매칭 확인서에 필요한 정보가 없습니다.");
      return;
    }

    try {
      console.log("매칭 확인서 수락 시작:", messageWithMetadata.agreementId);

      await confirmAgreement(messageWithMetadata.agreementId, {
        agreementId: messageWithMetadata.agreementId,
        helperId: messageWithMetadata.helperId,
        disabledId: messageWithMetadata.disabledId,
        postId: messageWithMetadata.postId,
        title: messageWithMetadata.title,
        chatroomId: chatroomId,
      });

      console.log("✅ 매칭 확인서 수락 성공");

      // 매칭 성공 데이터 생성 (메타데이터 병합된 메시지 사용)
      const timestamp = new Date().getTime();
      const successData: ChatMessage = {
        id: `match-success-${timestamp}`,
        senderId:
          messageWithMetadata.disabledId || messageWithMetadata.senderId,
        textContent: "매칭이 성사되었습니다.",
        type: "MATCH_SUCCESS",
        attachments: [],
        agreementId: messageWithMetadata.agreementId,
        matchType: messageWithMetadata.matchType,
        startDate: messageWithMetadata.startDate,
        endDate: messageWithMetadata.endDate,
        scheduleDays: messageWithMetadata.scheduleDays,
        scheduleStartTimes: messageWithMetadata.scheduleStartTimes,
        scheduleEndTimes: messageWithMetadata.scheduleEndTimes,
        location: messageWithMetadata.location,
        unitPoints: messageWithMetadata.unitPoints,
        totalPoints: messageWithMetadata.totalPoints,
        createdAt: new Date().toISOString(),
        chatroomId: chatroomId,
        postId: messageWithMetadata.postId,
        title: messageWithMetadata.title,
        helperId: messageWithMetadata.helperId,
        disabledId: messageWithMetadata.disabledId,
      };

      // localStorage에 저장
      localStorage.setItem(
        `bebee-match-success-${chatroomId}`,
        JSON.stringify(successData)
      );

      // 부모 컴포넌트에 알림
      if (onAcceptSuccess) {
        onAcceptSuccess(successData);
      }

      alert("매칭이 성공적으로 수락되었습니다!");
    } catch (error) {
      console.error("❌ 매칭 확인서 수락 실패:", error);
      alert("매칭 확인서 수락에 실패했습니다.");
    }
  };
  const handleRefuse = () => {
    console.log("매칭 확인서 거절:", message.agreementId);
    // TODO: 거절 API 호출
  };

  return (
    <Card>
      <Content>
        <Header>
          <img src={chatLight} alt="chat icon" width={60} height={60} />
          <Title>매칭 확인서가 도착했어요</Title>
          <Sub>아래의 정보를 확인해주세요.</Sub>
        </Header>

        <Info>
          <div>유형: {isDayType ? "하루 도움" : "지속 도움"}</div>
          {isDayType ? (
            <>
              <div>날짜: {formatDate(messageWithMetadata.startDate)}</div>
              {messageWithMetadata.scheduleDays &&
                messageWithMetadata.scheduleDays.length > 0 && (
                  <div>
                    {messageWithMetadata.scheduleDays.map((day, idx) => (
                      <div key={idx}>
                        일시:{" "}
                        {formatTime(
                          messageWithMetadata.scheduleStartTimes?.[idx]
                        )}
                        -
                        {formatTime(
                          messageWithMetadata.scheduleEndTimes?.[idx]
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </>
          ) : (
            <>
              <div>
                기간: {formatDate(messageWithMetadata.startDate)} ~{" "}
                {formatDate(messageWithMetadata.endDate)}
              </div>
              {messageWithMetadata.scheduleDays &&
                messageWithMetadata.scheduleDays.length > 0 && (
                  <div>
                    일시:
                    {messageWithMetadata.scheduleDays.map((day, idx) => (
                      <Indent key={idx}>
                        {formatDay(day)}{" "}
                        {formatTime(
                          messageWithMetadata.scheduleStartTimes?.[idx]
                        )}
                        -
                        {formatTime(
                          messageWithMetadata.scheduleEndTimes?.[idx]
                        )}
                      </Indent>
                    ))}
                  </div>
                )}
            </>
          )}
          <div>장소: {messageWithMetadata.location || "-"}</div>
          <div>
            꿀: {messageWithMetadata.unitPoints?.toLocaleString() || "-"}꿀
            /회(총 {messageWithMetadata.totalPoints?.toLocaleString() || "-"}꿀)
          </div>
          {/* TODO: 카테고리 정보 추가 */}
        </Info>
      </Content>
      <ButtonWrapper>
        <RefusalButton onClick={handleRefuse}>거절</RefusalButton>
        <AcceptButton onClick={handleAccept}>수락</AcceptButton>
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
