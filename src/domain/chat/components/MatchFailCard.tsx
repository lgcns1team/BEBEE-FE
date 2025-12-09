import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
const MatchFailCard = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const handleRetry = () => {
    navigate(`/chat/${chatId}/match`);
  };
  return (
    <Wrapper>
      <FailBox>
        <Title>😞 매칭이 성사되지 않았어요</Title>
        <Sub>다시 한번 이야기를 나눠보아요</Sub>
      </FailBox>

      <RetryButton onClick={handleRetry}>다시 작성하기</RetryButton>
    </Wrapper>
  );
};

export default MatchFailCard;
const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 16px;
  margin-top: 1.5rem;
`;
const FailBox = styled.div`
  background: ${({ theme }) => theme.color.red50};
  border: 0.5px solid ${({ theme }) => theme.color.red500};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 20px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

const RetryButton = styled.button`
  background: white;
  border: 0.5px solid ${({ theme }) => theme.color.subText2};
  color: ${({ theme }) => theme.color.text};
  padding: 14px 0;
  border-radius: 5px;
  font-size: ${({ theme }) => theme.size.md};
  cursor: pointer;
`;
