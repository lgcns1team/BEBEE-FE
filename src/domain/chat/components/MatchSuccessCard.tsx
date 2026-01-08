// MatchSuccessMessageCard.tsx
import styled from "styled-components";
import type { ChatMessage } from "../chat.types";
import PayReceipt from "./PayReceipt";
// import { useUserStore } from "../../../store/useUserStore";

interface MatchSuccessCardProps {
  message?: ChatMessage;
}

const MatchSuccessCard = ({ message }: MatchSuccessCardProps) => {
  // TODO: userStore 연결 후 role로 구분
  // const { user } = useUserStore();
  // const userRole = user?.role; // 'DISABLED' | 'HELPER' | 'ADMIN'
  // const isDisabled = userRole === "DISABLED"; // 장애인인지 확인

  // 임시로 항상 true로 설정 (나중에 userStore 연결 시 주석 해제)
  const isDisabled = true; // TODO: userStore 연결 후 제거

  return (
    <Container>
      <Title>🎉 짝짝짝! 매칭이 성사되었어요</Title>
      <Sub>확정 내용은 매칭 현황에서도 확인할 수 있어요</Sub>
      {/* 
        role에 따른 조건부 렌더링:
        - 도우미(HELPER): MatchSuccessCard만 표시
        - 장애인(DISABLED): MatchSuccessCard + PayReceipt 영수증 표시
      */}
      {isDisabled &&
        message &&
        message.usedHoney !== undefined &&
        message.usedHoney > 0 && <PayReceipt message={message} />}
      {/* 
        userStore 연결 후 사용할 코드:
        {userRole === "DISABLED" &&
          message &&
          message.usedHoney !== undefined &&
          message.usedHoney > 0 && (
            <PayReceipt message={message} />
          )}
      */}
    </Container>
  );
};

export default MatchSuccessCard;

const Container = styled.div`
  width: 90%;
  background: ${({ theme }) => theme.color.blue50};
  border: 0.5px solid ${({ theme }) => theme.color.blue500};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 20px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.size.md};
  margin-bottom: 8px;
`;

const Sub = styled.div`
  color: ${({ theme }) => theme.color.subText2};
  font-size: ${({ theme }) => theme.size.sm};
  margin-bottom: 16px;
`;
