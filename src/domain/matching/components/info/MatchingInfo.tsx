import styled from "styled-components";
import HelpInfo from "./HelpInfo";
import MatchingProfile from "./MatchingProfile";
import type { EngagementDetail } from "../../../../types/match.type";
import { formatDateToDot } from "../../../../types/common.types";

interface Props {
  engagement: EngagementDetail;
}

const MatchingInfo = ({ engagement }: Props) => {
  const isOneDay = engagement.helpType === "DAY";

  // 상단 날짜 텍스트 생성
  const renderDateText = () => {
    if (isOneDay && engagement.date) {
      return formatDateToDot(engagement.date);
    }

    if (!isOneDay && engagement.startDate && engagement.endDate) {
      return `${formatDateToDot(engagement.startDate)} ~ ${formatDateToDot(
        engagement.endDate
      )}`;
    }

    return "";
  };
  return (
    <>
      <MatchingDate aria-label="활동이 진행되는 날짜">
        {renderDateText()}
      </MatchingDate>

      <Wrapper>
        <Status>매칭 완료</Status>
        <HelpInfo engagement={engagement} />
      </Wrapper>

      <MatchingProfile engagement={engagement} />
    </>
  );
};

export default MatchingInfo;

/* styled */
const Wrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.color.main};
  border-radius: 12px;
  padding: 16px;
  margin: 20px 10px;
`;

const MatchingDate = styled.div`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: bold;
  margin-left: 10px;
`;

const Status = styled.div`
  font-weight: bold;
  margin-bottom: 16px;
`;
