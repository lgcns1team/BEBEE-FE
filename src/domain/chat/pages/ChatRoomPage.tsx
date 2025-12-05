import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
/* Components */
import HelpTag from "../../../components/HelpTag";
import Header from "../../../components/Header";
import MatchFormModal from "../components/matchModal/MatchFormModal";

const ChatRoomPage = () => {
  const { chatId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleMatchModalClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Header title="채팅" subTitle="47.3당도" onBack={() => navigate(-1)} />
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

      <MatchFormModal isOpen={isOpen} setIsOpen={setIsOpen} />
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
  margin-top: 3.5rem; /* 제목과 약간 간격 */
  display: flex;
  gap: 8px; /* 태그들 사이의 간격 */
`;

const MatchButton = styled.button`
  background-color: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.text};
  padding: 4px 6px;
  border: 0.5px solid ${({ theme }) => theme.color.text};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.size.md};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.color.natural100};
  }
`;

export default ChatRoomPage;
