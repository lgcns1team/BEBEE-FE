import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { chatApi } from "../../../api/chatApi";
import { postApi } from "../../../api/postApi";
import type { PostDetailResponse } from "../../../types/post.type";
import { HELP_TAG_MAP } from "../../../constants/helpTags";
import type { MatchStatus } from "../types/chat.types";
import { useApplicationStore } from "../../../domain/Application/store/useApplicationStore";
import { useUserStore } from "../../../store/useUserStore";
/* Components */
import HelpTag from "../../../components/HelpTag";
import Header from "../../../components/Header";

const ChatRoomCard = () => {
  const navigate = useNavigate();
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const { activeRoom, setActiveRoom } = useChatStore();
  const { currentPost } = useApplicationStore();
  const [postDetail, setPostDetail] = useState<PostDetailResponse | null>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const { user } = useUserStore();
  const isHelper = user?.role === "HELPER";
  // activeRoom의 matchStatus를 직접 참조하여 항상 최신 상태 반영
  const matchStatus: MatchStatus = activeRoom?.matchStatus ?? "NON_MATCHED";
  const isInteractive = matchStatus === "NON_MATCHED";

  const handleMatchModalClick = () => {
    // 도우미는 매칭하기 버튼을 클릭할 수 없음
    if (isHelper) {
      alert("매칭 확인서는 장애인만 작성할 수 있습니다.");
      return;
    }

    if (!isInteractive) return;
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
        console.log("[ChatRoomCard] 채팅방 조회 응답:", {
          chatroomId: data.chatroomId,
          postId: data.postId,
          postIdType: typeof data.postId,
          matchStatus: data.matchStatus,
          전체데이터: data,
        });
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
  }, [currentPost?.postId, activeRoom?.postId]);

  // 2. 게시글 상세 정보 로딩
  useEffect(() => {
    // currentPost에서 postId를 우선 사용, 없으면 activeRoom.postId 사용
    const postIdToUse = currentPost?.postId || activeRoom?.postId;

    if (!postIdToUse) {
      console.log("postId가 없습니다:", { currentPost, activeRoom });
      return;
    }

    // 로딩 중이면 스킵 (중복 요청 방지)
    if (isLoadingPost) {
      return;
    }

    const fetchPostDetail = async () => {
      setIsLoadingPost(true);
      try {
        console.log({
          postId: postIdToUse,
          postIdType: typeof postIdToUse,
          source: currentPost?.postId ? "currentPost" : "activeRoom",
        });

        const detail = await postApi.getPostDetail(postIdToUse);
        setPostDetail(detail);
      } catch (error) {
        const axiosError = error as {
          response?: { data?: unknown; status?: number; statusText?: string };
          message?: string;
        };
        console.error("실패:", {
          postId: postIdToUse,
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
  }, [currentPost?.postId, activeRoom?.postId]);

  // 3. 렌더링 가드 (Guard Clause)
  if (!activeRoom) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        채팅방 정보를 불러오는 중...
      </div>
    );
  }
  // 프로필 페이지로 이동
  const handleProfileClick = () => {
    navigate(`/profile/${activeRoom.otherId}`);
  };

  return (
    <Wrapper>
      <Header
        title={activeRoom.otherNickname}
        onBack={() => navigate("/chat")}
        showBack
        showRight
        onTitleClick={() => handleProfileClick()}
      />
      <ChatHeader role="region" aria-label="채팅방 정보">
        <HeaderTop role="group" aria-label="게시글 제목 및 매칭 상태">
          <ChatTitle
            id="post-title"
            aria-label={
              isLoadingPost
                ? "게시글 정보를 불러오는 중입니다"
                : postDetail?.title
                ? `게시글 제목: ${postDetail.title}`
                : "게시글 제목 정보가 없습니다"
            }
          >
            {isLoadingPost
              ? "게시글 정보를 불러오는 중..."
              : postDetail?.title || "게시글 제목"}
            <span className="sr-only">
              {isLoadingPost
                ? "게시글 정보를 불러오는 중입니다"
                : postDetail?.title
                ? `게시글 제목: ${postDetail.title}`
                : "게시글 제목 정보가 없습니다"}
            </span>
          </ChatTitle>
          {/* 매칭하기 버튼 누르면 매칭확인서로 페이지 이동*/}
          <MatchButton
            $status={matchStatus}
            onClick={handleMatchModalClick}
            aria-describedby="post-title"
            aria-label={
              isHelper
                ? `매칭 확인서는 장애인만 작성할 수 있습니다. 현재 매칭 상태: ${
                    matchStatus === "NON_MATCHED"
                      ? "매칭 전"
                      : matchStatus === "PROCEEDING"
                      ? "진행 중"
                      : "매칭 완료"
                  }`
                : matchStatus === "NON_MATCHED"
                ? `매칭 확인서 작성하기, ${
                    postDetail?.title
                      ? `${postDetail.title} 게시글에 대한 `
                      : ""
                  }더블탭하여 매칭 확인서 작성 페이지로 이동`
                : `현재 매칭 상태: ${
                    matchStatus === "PROCEEDING" ? "진행 중" : "매칭 완료"
                  }, 매칭 확인서는 이미 ${
                    matchStatus === "PROCEEDING" ? "진행 중" : "완료"
                  }되었습니다`
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleMatchModalClick();
              }
            }}
            disabled={!isInteractive || isHelper}
          >
            {matchStatus === "NON_MATCHED"
              ? "매칭하기"
              : matchStatus === "PROCEEDING"
              ? "진행 중"
              : "매칭 완료"}
            <span className="sr-only">
              {isHelper
                ? "매칭 확인서는 장애인만 작성할 수 있습니다"
                : matchStatus === "NON_MATCHED"
                ? postDetail?.title
                  ? `${postDetail.title} 게시글에 대한 매칭 확인서 작성 페이지로 이동합니다. Enter 키 또는 Space 키를 누르면 실행됩니다.`
                  : "매칭 확인서 작성 페이지로 이동합니다. Enter 키 또는 Space 키를 누르면 실행됩니다."
                : `현재 상태: ${
                    matchStatus === "PROCEEDING" ? "진행 중" : "매칭 완료"
                  }`}
            </span>
          </MatchButton>
        </HeaderTop>

        <HelpTagBox
          role="list"
          aria-label={`도움 카테고리 목록, ${
            postDetail?.helpCategoryIds && postDetail.helpCategoryIds.length > 0
              ? `총 ${postDetail.helpCategoryIds.length}개`
              : "없음"
          }`}
        >
          {postDetail?.helpCategoryIds &&
          postDetail.helpCategoryIds.length > 0 ? (
            <>
              <span className="sr-only">
                도움 카테고리 {postDetail.helpCategoryIds.length}개
              </span>
              {postDetail.helpCategoryIds.map((categoryId, index) => {
                const categoryName = HELP_TAG_MAP[categoryId];
                return categoryName ? (
                  <HelpTag
                    key={categoryId}
                    role="listitem"
                    aria-label={`${categoryName}, ${index + 1}번째 카테고리`}
                    aria-posinset={index + 1}
                    aria-setsize={postDetail.helpCategoryIds.length}
                  >
                    {categoryName}
                  </HelpTag>
                ) : null;
              })}
            </>
          ) : (
            <span className="sr-only">도움 카테고리 정보 없음</span>
          )}
        </HelpTagBox>
      </ChatHeader>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  z-index: 10;
  background-color: ${({ theme }) => theme.color.white};
  flex-shrink: 0;
`;
const ChatHeader = styled.div`
  width: 100%;
  padding: 10px 0;
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

const MatchButton = styled.button<{ $status: MatchStatus }>`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.size.md};
  border: 0.5px solid
    ${({ theme, $status }) => {
      if ($status === "PROCEEDING") return theme.color.blue500;
      if ($status === "MATCHED") return theme.color.red500;
      return theme.color.main;
    }};
  background-color: ${({ theme, $status }) => {
    if ($status === "PROCEEDING") return theme.color.blue50;
    if ($status === "MATCHED") return theme.color.red50;
    return theme.color.subColor2;
  }};
  color: ${({ theme }) => theme.color.text};
  cursor: ${({ $status }) =>
    $status === "NON_MATCHED" ? "pointer" : "not-allowed"};
  &:disabled {
    cursor: not-allowed;
  }
`;

export default ChatRoomCard;
