// components/info/HelpInfo.tsx
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
  const isDay = engagement.helpType === "DAY";

  return (
    <Wrapper>
      <Row>
        <Label>방식</Label>
        <Value>{isDay ? "하루 도움" : "지속 도움"}</Value>
      </Row>

      <Row>
        <Label>날짜</Label>
        <Value>
          {isDay && engagement.date
            ? formatDateToDot(engagement.date)
            : !isDay && engagement.startDate && engagement.endDate
            ? `${formatDateToDot(engagement.startDate)} ~ ${formatDateToDot(
                engagement.endDate
              )}`
            : "-"}
        </Value>
      </Row>

      <Row>
        <Label>{isDay ? "시간" : "일시"}</Label>
        <Value>
          {isDay ? (
            <>
              {formatTimeToHHmm(engagement.schedules[0].startTime)} ~{" "}
              {formatTimeToHHmm(engagement.schedules[0].endTime)}
            </>
          ) : (
            <ScheduleList>
              {engagement.schedules.map((s, i) => (
                <ScheduleItem key={i}>
                  {DAY_OF_WEEK_FULL_MAP[s.dayOfWeek]} ·{" "}
                  {formatTimeToHHmm(s.startTime)} ~{" "}
                  {formatTimeToHHmm(s.endTime)}
                </ScheduleItem>
              ))}
            </ScheduleList>
          )}
        </Value>
      </Row>

      <Row>
        <Label>제공 꿀</Label>
        <Value>
          {isDay
            ? `${engagement.totalHoney}꿀`
            : `${engagement.unitHoney}꿀/회 (총 ${engagement.totalHoney}꿀)`}
        </Value>
      </Row>
    </Wrapper>
  );
};

export default HelpInfo;

/* styled */
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div`
  display: flex;
`;

const Label = styled.div`
  width: 80px;
  color: ${({ theme }) => theme.color.subText2};
`;

const Value = styled.div`
  flex: 1;
`;

const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ScheduleItem = styled.div``;
