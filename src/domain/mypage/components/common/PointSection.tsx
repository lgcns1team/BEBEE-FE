// 비비 포인트 -> 조건부 렌더링 사용
//DISABLED (장애인)	충전	포인트 충전 페이지로 이동
// HELPER (도우미)	인출	포인트 인출 페이지로 이동

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useWalletStore } from "../../../Pay/store/useWalletStore";
import { useEffect } from "react";
import { useWalletActions } from "../../../Pay/hooks/useWalletActions";
const PointSection = () => {
  const navigate = useNavigate();
  const currentHoney = useWalletStore((s) => s.currentHoney);
  const { refreshCurrentHoney } = useWalletActions();

  const goPay = () => {
    navigate("/charge");
  };

  useEffect(() => {
    refreshCurrentHoney();
  }, [refreshCurrentHoney]);
  return (
    <PaymentContainer>
      <PointWrapper>
        <Title>비비 포인트</Title>
        <Point>{currentHoney.toLocaleString()}꿀</Point>
      </PointWrapper>
      <PaymentWrapper>
        <ReceiptButton>내역</ReceiptButton>
        <PayButton onClick={goPay}>충전</PayButton>
      </PaymentWrapper>
    </PaymentContainer>
  );
};

export default PointSection;

const PaymentContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.color.white};
  padding: 0 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const PointWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px 0;
`;
const Title = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.text};
`;
const Point = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
`;

const PaymentWrapper = styled.div`
  height: 60px;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  padding: 16px 0;
  gap: 6px;
`;

const PayButton = styled.button`
  padding: 0px 16px;
  background-color: ${({ theme }) => theme.color.main};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 0.5px solid ${({ theme }) => theme.color.main};
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.white};
`;
const ReceiptButton = styled.button`
  padding: 0px 16px;
  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 0.5px solid ${({ theme }) => theme.color.subText3};
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.text};
`;
