import React from "react";
import styled from "styled-components";

interface HelpRowProps {
  type: "하루도움" | "지속도움";
  date: string;
  time?: string;
  schedule?: string[];
  honey: string;
  place: string;
  detailPlace: string;
}

const HelpInfo = ({
  type,
  date,
  time,
  honey,
  place,
  detailPlace,
  schedule,
}: HelpRowProps) => {
  const isOneDay = type === "하루도움";
  return (
    <Wrapper>
      <Row>
        <Label>방식</Label>
        <Value>{type}</Value>
      </Row>

      <Row>
        <Label>날짜</Label>
        <Value>{date}</Value>
      </Row>
      <Row>
        <Label>{isOneDay ? "시간" : "일시"}</Label>
        <Value>
          {isOneDay
            ? time
            : schedule?.map((item, idx) => (
                <div key={idx}>{item}</div> // 줄바꿈 처리
              ))}
        </Value>
      </Row>

      <Row>
        <Label>제공 꿀</Label>
        <Value>{honey}</Value>
      </Row>
      <Row>
        <Label>만남 장소</Label>
        <Value>
          {place} · <Detail>{detailPlace}</Detail>
        </Value>
      </Row>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div`
  display: flex;
  margin-bottom: 12px;
`;

const Label = styled.div`
  width: 80px;
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.subText2};
`;

const Value = styled.div`
  flex: 1;
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
  line-height: 1.4;
`;
const Detail = styled.span`
  flex: 1;
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.subText2};
  line-height: 1.4;
`;
export default HelpInfo;
