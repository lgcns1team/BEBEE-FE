import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
const MatchFailCard = () => {
  const navigate = useNavigate();
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const handleRetry = () => {
    if (chatroomId) {
      navigate(`/chat/${chatroomId}/match`);
    }
  };
  return (
    <Wrapper role="region" aria-label="매칭 실패 알림">
      <FailBox role="alert">
        <Title>
          <span aria-hidden="true">😞</span> 매칭이 성사되지 않았어요
          <span className="sr-only">
            매칭이 성사되지 않았습니다. 다시 한번 이야기를 나눠보시기 바랍니다.
          </span>
        </Title>
        <Sub>
          다시 한번 이야기를 나눠보아요
          <span className="sr-only">
            아래의 다시 작성하기 버튼을 눌러 매칭 확인서를 다시 작성할 수
            있습니다.
          </span>
        </Sub>
      </FailBox>

      <RetryButton
        onClick={handleRetry}
        aria-label="매칭 확인서 다시 작성하기"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleRetry();
          }
        }}
      >
        다시 작성하기
        <span className="sr-only">
          매칭 확인서 작성 페이지로 이동합니다. Enter 키 또는 Space 키를 누르면
          실행됩니다.
        </span>
      </RetryButton>
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
