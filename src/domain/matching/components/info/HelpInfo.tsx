import styled from "styled-components";
import type {
  Engagement,
  DayEngagementTime,
  TermEngagementTime,
} from "../../../../types/match";

/* 요일 한글 매핑 */
const DAY_KR_MAP: Record<string, string> = {
  MONDAY: "월요일",
  TUESDAY: "화요일",
  WEDNESDAY: "수요일",
  THURSDAY: "목요일",
  FRIDAY: "금요일",
  SATURDAY: "토요일",
  SUNDAY: "일요일",
};

/* 날짜 포맷: YYYY.MM.DD */
const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
};

/* 시간 포맷: HH:MM */
const formatTime = (time: string) => time.slice(0, 5);

interface Props {
  engagement: Engagement;
}

const HelpInfo = ({ engagement }: Props) => {
  const isOneDay = engagement.type === "DAY";

  return (
    <Wrapper>
      {/* 방식 */}
      <Row>
        <Label aria-label="도움의 종류">방식</Label>
        <Value>{isOneDay ? "하루 도움" : "지속 도움"}</Value>
      </Row>

      {/* 날짜 */}
      <Row>
        <Label aria-label="도움 날짜">날짜</Label>
        <Value>
          {isOneDay ? (
            formatDate((engagement.engagementTime as DayEngagementTime).date)
          ) : (
            <>
              {formatDate(
                (engagement.engagementTime as TermEngagementTime).startDate
              )}
              {" ~ "}
              {formatDate(
                (engagement.engagementTime as TermEngagementTime).endDate
              )}
            </>
          )}
        </Value>
      </Row>

      {/* 시간 / 일정 */}
      <Row>
        <Label aria-label="활동 시간 및 일정">
          {isOneDay ? "시간" : "일시"}
        </Label>
        <Value>
          {isOneDay ? (
            <>
              {formatTime(
                (engagement.engagementTime as DayEngagementTime).schedule
                  .startTime
              )}
              {" ~ "}
              {formatTime(
                (engagement.engagementTime as DayEngagementTime).schedule
                  .endTime
              )}
            </>
          ) : (
            <ScheduleList>
              {(engagement.engagementTime as TermEngagementTime).schedules.map(
                (item, idx) => (
                  <ScheduleItem key={idx}>
                    {DAY_KR_MAP[item.dayOfWeek]} · {formatTime(item.startTime)}{" "}
                    ~ {formatTime(item.endTime)}
                  </ScheduleItem>
                )
              )}
            </ScheduleList>
          )}
        </Value>
      </Row>

      {/* 제공 꿀 */}
      <Row>
        <Label>제공 꿀</Label>

        {isOneDay ? (
          <Value aria-label="활동 완료 시 제공되는 꿀">
            {engagement.totalHoney}꿀
          </Value>
        ) : (
          <Value aria-label="활동 완료 시 제공되는 꿀">
            {engagement.unitHoney}꿀/회 (총{engagement.totalHoney}꿀)
          </Value>
        )}
      </Row>

      {/* 장소 */}
      <Row>
        <Label aria-label="활동 시 만남 장소">만남 장소</Label>
        <Value>{engagement.region}</Value>
      </Row>
    </Wrapper>
  );
};

export default HelpInfo;
/* ---------------- styled ---------------- */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
`;

const Label = styled.div`
  width: 80px;
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.subText2};
  flex-shrink: 0;
`;

const Value = styled.div`
  flex: 1;
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
  line-height: 1.5;
`;

const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ScheduleItem = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
`;
