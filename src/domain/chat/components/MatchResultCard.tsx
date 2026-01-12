import styled from "styled-components";
import chatLight from "../../../assets/images/chat-light.png";
import type { ChatMessage } from "../types/chat.types";
import {
  formatDateToKoreanWithDay,
  formatTimeToHHmm,
  formatDayOfWeek,
} from "../../../types/common.types";
import { useUserStore } from "../../../store/useUserStore";
import { useMatchAgreement } from "../hook/useMatchAgreement";
import type {
  DayEngagementTime,
  TermEngagementTime,
  EngagementTimeResponse,
} from "../types/match.types";
interface Props {
  data: ChatMessage;
}

const MatchResultCard = ({ data }: Props) => {
  const { user } = useUserStore();
  const { handleAccept, handleRefuse } = useMatchAgreement({ message: data });
  // 공통 유틸리티 함수 사용
  const formatDate = formatDateToKoreanWithDay;
  const formatTime = formatTimeToHHmm;
  const formatDay = (day?: string) => formatDayOfWeek(day, true);

  // matchData가 없는 일반 텍스트 메시지일 경우를 대비한 방어 코드
  const match = data.matchData;
  if (!match) return null;

  const isHelper = user?.role === "HELPER";

  const isDayType = match.type === "DAY";

  if (!match) return null;

  const renderScheduleInfo = () => {
    const engagement = match.engagementTime;

    // 1. DAY 타입 처리
    if (isDayType) {
      // 타입 가드: 필요한 속성이 어디에 있든 공통 변수로 추출
      const data = engagement as EngagementTimeResponse & DayEngagementTime;
      const date = data.date;
      const schedule = data.schedule;

      if (!date) return null;

      return (
        <>
          <div role="listitem" aria-label={`도움 날짜: ${formatDate(date)}`}>
            날짜: {formatDate(date)}
            <span className="sr-only">
              {`도움을 제공받을 날짜는 ${formatDate(date)}입니다`}
            </span>
          </div>
          {schedule && (
            <div role="list" aria-label="도움 일시 목록">
              일시: {formatTime(schedule.startTime)}~
              {formatTime(schedule.endTime)}
              <span className="sr-only">
                {`도움을 제공받을 시간은 ${formatTime(
                  schedule.startTime
                )}~{formatTime(schedule.endTime)}입니다`}
              </span>
            </div>
          )}
        </>
      );
    }

    // 2. TERM 타입 처리 (데이터 정규화)
    const data = engagement as EngagementTimeResponse & TermEngagementTime;
    const startDate = data.startDate;
    const endDate = data.endDate;
    const schedules = data.schedules || [];

    if (startDate && endDate) {
      return (
        <>
          <InfoRow
            role="listitem"
            aria-label={`도움 기간: ${formatDate(startDate)}부터 ${formatDate(
              endDate
            )}까지`}
          >
            <span className="label">기간:</span>

            <div className="content">
              <span>{formatDate(startDate)} ~</span>
              <span>{formatDate(endDate)}</span>
              <span className="sr-only">
                {`도움 기간은 ${formatDate(startDate)}부터 ${formatDate(
                  endDate
                )}까지입니다`}
              </span>
            </div>
          </InfoRow>

          {schedules.length > 0 && (
            <TermTime
              role="list"
              aria-label="도움 요일 및 시간 목록"
              style={{ marginTop: "8px" }}
            >
              {" "}
              <span>일시:</span>
              <ScheduleList>
                {schedules.map(
                  (
                    schedule: {
                      dayOfWeek: string;
                      startTime: string;
                      endTime: string;
                    },
                    idx: number
                  ) => {
                    const dayName = formatDay(schedule.dayOfWeek);
                    const startTime = formatTime(schedule.startTime);
                    const endTime = formatTime(schedule.endTime);

                    return (
                      <span
                        key={idx}
                        role="listitem"
                        aria-label={`${dayName} ${startTime}부터 ${endTime}까지`}
                      >
                        {dayName} {startTime} - {endTime}
                        <span className="sr-only">
                          {`${dayName}에 ${startTime}부터 ${endTime}까지 도움을 제공합니다`}
                        </span>
                      </span>
                    );
                  }
                )}
              </ScheduleList>
            </TermTime>
          )}
        </>
      );
    }

    return null;
  };

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
          {renderScheduleInfo()}
          <div
            role="listitem"
            aria-label={`도움 장소: ${match.region || "정보 없음"}`}
          >
            장소: {match.region || "-"}
            <span className="sr-only">
              {match.region
                ? `도움을 제공할 장소는 ${match.region}입니다`
                : "도움 장소 정보가 없습니다"}
            </span>
          </div>
          <div
            role="listitem"
            aria-label={
              match.isVolunteer
                ? "보상 정보: 나눔 서비스"
                : isDayType
                ? `보상 정보: ${match.unitHoney?.toLocaleString() || 0}꿀`
                : `보상 정보: 회당 ${
                    match.unitHoney?.toLocaleString() || 0
                  }꿀, 총 ${match.totalHoney.toLocaleString() || 0}꿀`
            }
          >
            {match.isVolunteer ? (
              <>
                꿀: 나눔{" "}
                <span aria-hidden="true" role="img">
                  🩵
                </span>
                <span className="sr-only">
                  나눔 서비스입니다. 꿀이 차감되지 않습니다.
                </span>
              </>
            ) : isDayType ? (
              <>
                꿀: {match.unitHoney?.toLocaleString() || "-"}꿀
                <span className="sr-only">
                  {match.unitHoney
                    ? `${match.unitHoney.toLocaleString()}꿀을 받게 됩니다`
                    : "보상 정보가 없습니다"}
                </span>
              </>
            ) : (
              <>
                꿀: {match.unitHoney?.toLocaleString() || "-"}꿀{" "}
                <Total>
                  /회 (총 {match.totalHoney?.toLocaleString() || "-"}꿀)
                </Total>
                <span className="sr-only">
                  {match.unitHoney && match.totalHoney
                    ? `회당 ${match.unitHoney.toLocaleString()}꿀을 받으며, 총 ${match.totalHoney.toLocaleString()}꿀을 받게 됩니다`
                    : "보상 정보가 없습니다"}
                </span>
              </>
            )}
          </div>
        </Info>
      </Content>
      {isHelper && (
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
            <span className="sr-only">이 매칭 확인서를 거절합니다.</span>
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
              이 매칭 확인서를 수락하고 매칭을 완료합니다.
            </span>
          </AcceptButton>
        </ButtonWrapper>
      )}
    </Card>
  );
};

export default MatchResultCard;

const Card = styled.div`
  width: 100%;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  /*세로선*/
  border-left: 3px solid ${({ theme }) => theme.color.main};
  padding-left: 24px;
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

const TermTime = styled.div`
  display: flex;

  margin-top: 8px;

  span {
    flex-shrink: 0;
    margin-right: 4px;
  }
`;
const InfoRow = styled.div`
  display: flex;
  gap: 8px;

  .label {
    flex-shrink: 0;
    white-space: nowrap;
  }
  .content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
`;
const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px; /* 요일별 간격 */
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

const Total = styled.span`
  margin-left: 2px;
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText};
`;
