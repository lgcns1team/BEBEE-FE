// MatchSuccessMessageCard.tsx
import styled from "styled-components";

const MatchSuccessCard = () => {
  // 공통 유틸리티 함수 사용

  return (
    <Container>
      <Title>🎉 짝짝짝! 매칭이 성사되었어요</Title>
      <Sub>확정 내용은 매칭 현황에서도 확인할 수 있어요</Sub>
    </Container>
  );
};

export default MatchSuccessCard;

const Container = styled.div`
  width: 100%;
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
