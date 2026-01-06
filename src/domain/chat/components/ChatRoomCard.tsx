import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { chatApi } from "../api/chatApi";
import { postApi } from "../../../api/postApi";
import type { PostDetailResponse } from "../../../types/post.type";
import { HELP_TAG_MAP } from "../../../constants/helpTags";

/* Components */
import HelpTag from "../../../components/HelpTag";
import Header from "../../../components/Header";

const ChatRoomCard = () => {
  const navigate = useNavigate();
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const { activeRoom, setActiveRoom } = useChatStore();
  const [postDetail, setPostDetail] = useState<PostDetailResponse | null>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(false);

  const handleMatchModalClick = () => {
    if (chatroomId) {
      navigate(`/chat/${chatroomId}/match`);
    } else {
      console.warn("매칭하기 버튼: chatroomId가 없습니다.");
    }
  };

  // 1. 채팅방 정보 로딩 및 동기화 로직
  useEffect(() => {
    // chatroomId가 URL에 없으면 실행 안 함
    if (!chatroomId) return;

    const fetchRoomDetail = async () => {
      try {
        const data = await chatApi.openChatRoom(undefined, chatroomId);
        setActiveRoom(data); // 데이터 수신 완료 -> activeRoom이 null이 아니게 됨
      } catch (error) {
        console.error("채팅방 정보를 불러오는데 실패했습니다.", error);
      }
    };

    // 현재 스토어의 방 ID와 URL의 ID가 다를 때만 데이터를 가져옴
    if (!activeRoom || activeRoom.chatroomId !== chatroomId) {
      fetchRoomDetail();
    }

    //  Cleanup 함수: 잔상 방지
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatroomId]);

  // 2. 게시글 상세 정보 로딩
  useEffect(() => {
    if (!activeRoom?.postId) {
      console.log("⚠️ [ChatRoomCard] postId가 없습니다:", activeRoom);
      return;
    }

    const fetchPostDetail = async () => {
      setIsLoadingPost(true);
      try {
        console.log({
          postId: activeRoom.postId,
          postIdType: typeof activeRoom.postId,
        });

        const detail = await postApi.getPostDetail(activeRoom.postId);
        console.log("성공:", detail);
        setPostDetail(detail);
      } catch (error) {
        const axiosError = error as {
          response?: { data?: unknown; status?: number; statusText?: string };
          message?: string;
        };
        console.error("실패:", {
          postId: activeRoom.postId,
          error,
          response: axiosError.response?.data,
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
        });
        // 에러 발생 시 postDetail을 null로 설정하여 UI가 깨지지 않도록 함
        setPostDetail(null);
      } finally {
        setIsLoadingPost(false);
      }
    };

    fetchPostDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoom?.postId]);

  // 3. 렌더링 가드 (Guard Clause)
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
        showBack
        showRight
      />
      <ChatHeader>
        <HeaderTop>
          <ChatTitle id="게시글 제목">
            {isLoadingPost
              ? "게시글 정보를 불러오는 중..."
              : postDetail?.title || "게시글 제목"}
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
          {postDetail?.helpCategoryIds?.map((categoryId) => {
            const categoryName = HELP_TAG_MAP[categoryId];
            return categoryName ? (
              <HelpTag key={categoryId}>{categoryName}</HelpTag>
            ) : null;
          })}
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
