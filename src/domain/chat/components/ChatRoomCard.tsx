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
  const currentMemberId = "100"; // 실제로는 AuthStore에서 가져옴
  {
    /*}
  console.log("현재 스토어 데이터(activeRoom):", activeRoom);
  console.log("URL에서 가져온 ID(chatroomId):", chatroomId);*/
  }
  // 1. 데이터 로딩 및 동기화 로직
  useEffect(() => {
    // chatroomId가 URL에 없으면 실행 안 함
    if (!chatroomId) return;

    const fetchRoomDetail = async () => {
      try {
        const data = await chatApi.openChatRoom(
          currentMemberId,
          undefined,
          chatroomId
        );
        setActiveRoom(data); // 데이터 수신 완료 -> activeRoom이 null이 아니게 됨
      } catch (error) {
        console.error("채팅방 정보를 불러오는데 실패했습니다.", error);
      }
    };

    // 현재 스토어의 방 ID와 URL의 ID가 다를 때만 데이터를 가져옴
    if (!activeRoom || activeRoom.chatroomId !== chatroomId) {
      fetchRoomDetail();
    }

    // [중요] Cleanup 함수: 페이지를 이동할 때 이전 채팅방 데이터를 비워줌 (잔상 방지)
    return () => {};
  }, [chatroomId]);

  // 2. [가장 중요] 렌더링 가드 (Guard Clause)
  // return문 직전에 작성합니다. 데이터가 없으면 에러가 날 아래 코드를 실행하지 않습니다.
  if (!activeRoom) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        채팅방 정보를 불러오는 중...
      </div>
    );
  }
  return (
    <>
      <Header
        title={activeRoom.otherNickname}
        onBack={() => navigate("/chat")}
        showRight
      />
      <ChatHeader>
        {/*추후 서버랑연동 -> 연결된 게시글 데이터 불러옴*/}
        <HeaderTop>
          <ChatTitle id="게시글 제목">
            병원 동행할 파트너를 구합니다 절찬모집 이얏호
          </ChatTitle>
          {/* 매칭하기 버튼 누르면 매칭확인서로 페이지 이동*/}
          <MatchButton
            onClick={handleMatchModalClick}
            aria-describedby="게시글 제목"
          >
            매칭하기
          </MatchButton>
        </HeaderTop>

        <HelpTagBox role="list" aria-label="도움 카테고리">
          {activeRoom?.helpCategories?.map((cat) => (
            <HelpTag key={cat.id}>{cat.name}</HelpTag>
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
