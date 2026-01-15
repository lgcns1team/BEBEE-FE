// MatchSuccessMessageCard.tsx
import styled from "styled-components";
import type { ChatMessage } from "../types/chat.types";
import PayReceipt from "./PayReceipt";
import { useUserStore } from "../../../store/useUserStore";

interface MatchSuccessCardProps {
  message?: ChatMessage;
}

const MatchSuccessCard = ({ message }: MatchSuccessCardProps) => {
  const { user } = useUserStore();
  const userRole = user?.role;

  const getSuccessDescription = () => {
    const baseText =
      "축하합니다! 매칭이 성공적으로 성사되었습니다. 확정 내용은 매칭 현황에서 확인하실 수 있습니다. 아래에 결제 완료된 영수증 정보가 포함되어 있습니다.";

    return baseText;
  };

  return (
    <Container role="region" aria-label={getSuccessDescription()} tabIndex={0}>
      <div aria-hidden="true">
        <Title>
          <span>🎉</span> 짝짝짝! 매칭이 성사되었어요
        </Title>
        <Sub>확정 내용은 매칭 현황에서도 확인할 수 있어요</Sub>
      </div>
      {userRole === "DISABLED" && message && (
        <div role="group" aria-label="결제 영수증 정보">
          <PayReceipt message={message} />
        </div>
      )}
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
`;
