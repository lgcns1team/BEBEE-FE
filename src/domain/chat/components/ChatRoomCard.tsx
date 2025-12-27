import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { chatApi } from "../api/chatApi";

/* Components */
import HelpTag from "../../../components/HelpTag";
import Header from "../../../components/Header";

const ChatRoomCard = () => {
  const navigate = useNavigate();
  const handleMatchModalClick = () => {
    navigate(`/chat/${chatroomId}/match`);
  };

  const { chatroomId } = useParams<{ chatroomId: string }>();
  const { activeRoom, setActiveRoom } = useChatStore();
  const currentMemberId = 100; // 실제로는 AuthStore에서 가져옴

  // 1. 데이터 로딩 (채팅방 정보 가져오기)
  useEffect(() => {
    if (!activeRoom || activeRoom.chatroomId !== String(chatroomId)) {
      const fetchRoomDetail = async () => {
        try {
          // fetch를 직접 사용하거나 chatApi 호출
          const data = await chatApi.openChatRoom(
            currentMemberId,
            undefined,
            String(chatroomId)
          );
          setActiveRoom(data);
        } catch (error) {
          console.error("채팅방 정보를 불러오는데 실패했습니다.");
        }
      };
      fetchRoomDetail();
    }

    // 페이지를 나갈 때 스토어의 activeRoom을 비워주고 싶다면 clean-up 추가
    // return () => setActiveRoom(null);
  }, [chatroomId]);

  return (
    <>
      <Header
        title={activeRoom.otherNickname}
        subTitle="47.3당도"
        onBack={() => navigate("/chat")}
        showRight
      />
      <ChatHeader>
        {/*추후 서버랑연동 -> 연결된 게시글 데이터 불러옴*/}
        <HeaderTop>
          <ChatTitle>병원 동행할 파트너를 구합니다 절찬모집 이얏호</ChatTitle>
          {/* 매칭하기 버튼 누르면 매칭확인서로 페이지 이동*/}
          <MatchButton onClick={handleMatchModalClick}>매칭하기</MatchButton>
        </HeaderTop>

        <HelpTagBox>
          {activeRoom.helpCategories.map((cat) => (
            <HelpTag key={cat.id}>#{cat.name}</HelpTag>
          ))}
        </HelpTagBox>
      </ChatHeader>
    </>
  );
};

const ChatHeader = styled.div`
  width: 100%;
  padding: 20px 0;
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
  padding: 4px 12px;
  border: 0.5px solid ${({ theme }) => theme.color.main};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.size.md};
  cursor: pointer;

  &:active {
    background-color: ${({ theme }) => theme.color.mainDark};
  }
`;

export default ChatRoomCard;
