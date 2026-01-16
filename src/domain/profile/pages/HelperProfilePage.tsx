import { useLocation, useNavigate } from "react-router-dom";

import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import BaseLongButton from "../../../components/BaseLongButton";

import ProfileDetailSection from "../components/common/ProfileDetailSection";
import ExperienceSection from "../components/helper/ExperienceSection";

import ReceivedReview from "../components/common/ReceivedReview";
import { useApplicationStore } from "../../Application/store/useApplicationStore";
import { useChatStore } from "../../chat/store/useChatStore";
import { chatApi } from "../../../api/chatApi";
import type { Applicant } from "../../../types/application.type";
import styled from "styled-components";
type LocationState = {
  applicant?: Applicant;
};

const HelperProfilePage = () => {
  const navigate = useNavigate();
  const { currentPost, setCurrentPost } = useApplicationStore();
  const { setActiveRoom } = useChatStore();
  const location = useLocation();

  const applicant = (location.state as LocationState | null)?.applicant;
  const goChat = async (otherMemberId: string, isVolunteer: boolean) => {
    if (!currentPost) {
      alert("게시글 정보를 불러올 수 없습니다.");
      return;
    }

    try {
      console.log("[ApplicantCard] 채팅방 생성 요청:", {
        otherMemberId,
        body: {
          postId: currentPost.postId,
          postTitle: currentPost.postTitle,
          helpCategoryIds: currentPost.helpCategoryIds,
          isVolunteer,
        },
      });
      const res = await chatApi.createChatRoom(otherMemberId, {
        postId: currentPost.postId,
        postTitle: currentPost.postTitle,
        helpCategoryIds: currentPost.helpCategoryIds,
        isVolunteer,
      });
      console.log("[ApplicantCard] 채팅방 생성 응답:", {
        chatroomId: res.chatroomId,
        postId: res.postId,
        postIdType: typeof res.postId,
        isVolunteer: isVolunteer,
        응답전체데이터: res,
      });
      const chatroomId = res.chatroomId;

      // 채팅방 생성 응답의 postId를 store에 저장
      if (res.postId) {
        setCurrentPost({
          postId: String(res.postId),
          postTitle: currentPost.postTitle,
          helpCategoryIds: currentPost.helpCategoryIds,
        });
      }

      // 채팅방 정보를 store에 저장 (응답에 isVolunteer가 없으므로 요청 시 전달한 값 포함)
      setActiveRoom({
        ...res,
        isVolunteer,
      });

      navigate(`/chat/${chatroomId}`);
    } catch (e) {
      console.error("채팅방 생성 실패:", e);
      alert("채팅방을 열 수 없습니다");
    }
  };
  return (
    <Layout bg>
      <Header title="프로필 정보" onBack={() => navigate(-1)} bg showBack />
<ScrollContainer>
      <ProfileDetailSection />

      <ExperienceSection />
      <ReceivedReview mode="other" />
      </ScrollContainer>
      <BaseLongButton
        label="채팅하기"
        onClick={() =>
          goChat(String(applicant.memberId), applicant.isVolunteer)
        }
        aria-label={`${applicant?.nickname} 님과 채팅하기`}
      />
      
    </Layout>
  );
};

export default HelperProfilePage;

const ScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 24px;

  /* iOS 스크롤 자연스럽게 */
  -webkit-overflow-scrolling: touch;
`;