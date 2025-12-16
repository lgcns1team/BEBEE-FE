import React from "react";
import styled from "styled-components";

interface MyPageInfoRowProps {
  label: string;
  value: string | React.ReactNode;
}

const MyPageInfoRow = ({ label, value }: MyPageInfoRowProps) => {
  return (
    <Row>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Row>
  );
};

export default MyPageInfoRow;

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
