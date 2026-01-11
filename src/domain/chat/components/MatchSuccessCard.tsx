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
  const userRole = user?.role; // 'DISABLED' | 'HELPER' | 'ADMIN'

  return (
    <Container role="region" aria-label="매칭 성공 알림">
      <Title>
        <span aria-hidden="true">🎉</span> 짝짝짝! 매칭이 성사되었어요
        <span className="sr-only">
          매칭이 성사되었습니다. 확정 내용은 매칭 현황에서도 확인할 수 있습니다.
        </span>
      </Title>
      <Sub>
        확정 내용은 매칭 현황에서도 확인할 수 있어요
        <span className="sr-only">
          매칭 현황 페이지에서 확정된 매칭 내용을 확인할 수 있습니다.
        </span>
      </Sub>
      {/* 
        role에 따른 조건부 렌더링:
        - 도우미(HELPER): MatchSuccessCard만 표시
        - 장애인(DISABLED): MatchSuccessCard + PayReceipt 영수증 표시
      */}

      {userRole === "DISABLED" &&
        message &&
        message.usedHoney !== undefined &&
        message.usedHoney > 0 && <PayReceipt message={message} />}
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
