import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";

import MatchResultCard from "../components/MatchResultCard";
/* Components */
import HelpTag from "../../../components/HelpTag";
import Header from "../../../components/Header";

interface MatchInfo {
  type: string;
  period: string;
  times: string[];
  place: string;
  reward: string;
  category: string;
}

const ChatRoomPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);

  const addMessage = (component: React.ReactNode) => {
    setMessages((prev) => [...prev, component]);
  };

  const handleMatchModalClick = () => {
    navigate(`/chat/${chatId}/match`);
  };

  return (
    <>
      <Header
        title="채팅"
        subTitle="47.3당도"
        onBack={() => navigate("/chat")}
      />
      <ChatHeader>
        <HeaderTop>
          <ChatTitle>병원 동행할 파트너를 구합니다 절찬모집 이얏호</ChatTitle>
          <MatchButton onClick={handleMatchModalClick}>매칭하기</MatchButton>
        </HeaderTop>

        <HelpTagBox>
          <HelpTag>이동지원</HelpTag>
          <HelpTag>방문목욕</HelpTag>
        </HelpTagBox>
      </ChatHeader>

      <ChatContent>
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}

        {/* 매칭 확인서 카드 표시 */}
        <CardWrapper>
          <MatchResultCard addMessage={addMessage} />
        </CardWrapper>
      </ChatContent>
    </>
  );
};

const ChatHeader = styled.div`
  width: 100%;
  padding: 20px 20px;
  color: ${({ theme }) => theme.color.text};
  border-bottom: 0.5px solid ${({ theme }) => theme.color.natural200};
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ChatTitle = styled.p`
  max-width: 70%;
  font-size: ${({ theme }) => theme.size.md};
  margin: 0;
`;

const HelpTagBox = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 8px;
`;

const MatchButton = styled.button`
  background-color: ${({ theme }) => theme.color.subColor2};
  color: ${({ theme }) => theme.color.text};
  padding: 20px 16px;
  border: 0.5px solid ${({ theme }) => theme.color.main};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.size.md};
  cursor: pointer;

  &:active {
    background-color: ${({ theme }) => theme.color.mainDark};
  }
`;

const ChatContent = styled.div`
  padding: 20px;
  display: flex;

  flex-direction: column-reverse;
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
`;

export default ChatRoomPage;
