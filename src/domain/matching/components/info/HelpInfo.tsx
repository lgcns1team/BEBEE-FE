import styled from "styled-components";
import type { EngagementDetail } from "../../../../types/match.type";
import {
  DAY_OF_WEEK_FULL_MAP,
  formatDateToDot,
  formatTimeToHHmm,
} from "../../../../types/common.types";

interface Props {
  engagement: EngagementDetail;
}

const HelpInfo = ({ engagement }: Props) => {
  const isOneDay = engagement.helpType === "DAY";

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
          {isOneDay && engagement.date
            ? formatDateToDot(engagement.date)
            : engagement.startDate && engagement.endDate
            ? `${formatDateToDot(engagement.startDate)} ~ ${formatDateToDot(
                engagement.endDate
              )}`
            : "-"}
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
              {formatTimeToHHmm(engagement.schedules[0].startTime)} ~{" "}
              {formatTimeToHHmm(engagement.schedules[0].endTime)}
            </>
          ) : (
            <ScheduleList>
              {engagement.schedules.map((item, idx) => (
                <ScheduleItem key={idx}>
                  {DAY_OF_WEEK_FULL_MAP[item.dayOfWeek]} ·{" "}
                  {formatTimeToHHmm(item.startTime)} ~{" "}
                  {formatTimeToHHmm(item.endTime)}
                </ScheduleItem>
              ))}
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
      {/* <Row>
        <Label aria-label="활동 시 만남 장소">만남 장소</Label>
        <Value>{engagement.}</Value>
      </Row> */}
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
