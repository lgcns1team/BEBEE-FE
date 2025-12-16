// 비비 포인트 -> 조건부 렌더링 사용
//DISABLED (장애인)	충전	포인트 충전 페이지로 이동
// HELPER (도우미)	인출	포인트 인출 페이지로 이동

import { AiOutlineLogout, AiOutlineUnorderedList } from "react-icons/ai";
import { PiReceipt } from "react-icons/pi";
import styled from "styled-components";
const PointSection = () => {
  return (
    <PaymentContainer>
      <PointWrapper>
        <Title>비비 포인트</Title>
        <Point>1,235꿀</Point>
      </PointWrapper>
      <DividerRow />
      <PaymentWrapper>
        <Withdraw>
          <AiOutlineLogout size={16} /> <span>인출</span>
        </Withdraw>
        <DividerColumn />
        <History>
          <PiReceipt size={20} />
          <span>이용 내역</span>
        </History>
      </PaymentWrapper>
    </PaymentContainer>
  );
};

export default PointSection;

const PaymentContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.color.white};
  padding: 0 16px;
`;
const PointWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
`;
const Title = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
`;
const Point = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
`;

const DividerRow = styled.div`
  width: 100%;
  height: 0.5px;
  background: ${({ theme }) => theme.color.natural200};
`;

const PaymentWrapper = styled.div`
  display: flex;
  padding: 16px 0;
  gap: 12px;
  align-items: center;
`;

const Withdraw = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DividerColumn = styled.div`
  background: ${({ theme }) => theme.color.natural200};
  height: 16px;
  width: 0.5px;
`;

const History = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
