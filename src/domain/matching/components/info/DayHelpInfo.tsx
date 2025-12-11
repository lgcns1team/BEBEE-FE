import React from "react";
import styled from "styled-components";
import HelpInfo from "./HelpInfo";
import type { MatchInfo } from "../../../../store/useMatchInfoStore";
import MatchingProfile from "./MatchingProfile";
const DayHelpInfo = ({ info }: { info: MatchInfo }) => {
  return (
    <>
      <MatchingDate>2025.12.10</MatchingDate>
      <Wrapper>
        <MatchingStatus>매칭 완료</MatchingStatus>
        <MatchingInfo>
          <HelpInfo
            type={info.type}
            date={info.date}
            time={info.time}
            schedule={info.schedule}
            honey={info.honey}
            place={info.place}
            detailPlace={info.detailPlace}
          />
        </MatchingInfo>
      </Wrapper>
      <MatchingProfile />
    </>
  );
};

const Wrapper = styled.div`
  border: 0.5px solid ${({ theme }) => theme.color.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 16px;
  margin: 20px 10px;
`;
const MatchingDate = styled.div`
  color: ${({ theme }) => theme.color.text};
  font-weight: ${({ theme }) => theme.weight.bold};
  font-size: ${({ theme }) => theme.size.md};
  margin-left: 10px;
  margin-right: 20px;
`;
const MatchingInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MatchingStatus = styled.div`
  color: ${({ theme }) => theme.color.text};
  font-weight: ${({ theme }) => theme.weight.bold};
  font-size: ${({ theme }) => theme.size.md};
  margin-bottom: 12px;
`;

export default DayHelpInfo;
