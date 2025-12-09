import styled from "styled-components";

interface InfoRowProps {
  label: string;
  value: string | React.ReactNode;
}

const InfoRow = ({ label, value }: InfoRowProps) => {
  return (
    <Row>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Row>
  );
};

export default InfoRow;

const Row = styled.div`
  display: flex;
  margin-bottom: 12px;
`;

const Label = styled.div`
  width: 80px;
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
`;

const Value = styled.div`
  flex: 1;
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.text};
  line-height: 1.4;
`;
