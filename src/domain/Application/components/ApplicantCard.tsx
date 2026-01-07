import styled from "styled-components";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { Applicant } from "../../../types/application.type";
import type { Gender } from "../../auth/auth.types";
import { chatApi } from "../../../api/chatApi";
import { useApplicationStore } from "../store/useApplicationStore";

interface Props {
  applicants: Applicant[];
  isSharing: boolean;
}

const GENDER_KR: Record<Gender, string> = {
  MALE: "남성",
  FEMALE: "여성",
  NONE: "비공개",
};

const ApplicantList = ({ applicants, isSharing }: Props) => {
  const navigate = useNavigate();
  const { currentPost, setCurrentPost } = useApplicationStore();
  const filteredApplicants = isSharing
    ? applicants.filter((applicant) => applicant.isVolunteer)
    : applicants;

  const goChat = async (otherMemberId: string) => {
    if (!currentPost) {
      alert("게시글 정보를 불러올 수 없습니다.");
      return;
    }

    try {
      console.log("[ApplicantCard] 채팅방 생성 요청:", {
        otherMemberId,
        body: {
          postId: Number(currentPost.postId),
          postTitle: currentPost.postTitle,
          helpCategoryIds: currentPost.helpCategoryIds,
        },
      });
      const res = await chatApi.createChatRoom(otherMemberId, {
        postId: Number(currentPost.postId),
        postTitle: currentPost.postTitle,
        helpCategoryIds: currentPost.helpCategoryIds,
      });
      console.log("채팅방 생성 응답:", {
        chatroomId: res.chatroomId,
        postId: res.postId,
        postIdType: typeof res.postId,
        전체데이터: res,
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
      navigate(`/chat/${chatroomId}`);
    } catch (e) {
      console.error("채팅방 생성 실패:", e);
      alert("채팅방을 열 수 없습니다");
    }
  };
  return (
    <PostItemWrapper>
      {filteredApplicants.map((applicant) => (
        <Card key={applicant.memberId}>
          <UserRow>
            <UserText>
              <div className="top-row">
                <span className="nickname">{applicant.nickname}</span>
              </div>

              <div className="sub-info">
                {GENDER_KR[applicant.gender]} · {applicant.ageGroup}대
              </div>
            </UserText>

            <GoProfile onClick={() => goChat(applicant.memberId)}>
              채팅하기
            </GoProfile>
          </UserRow>

          {applicant.isVolunteer && (
            <SharingBadge>
              나눔 <FaHeart size={14} color="#FFA2A2" />
            </SharingBadge>
          )}
        </Card>
      ))}
    </PostItemWrapper>
  );
};

export default ApplicantList;

const PostItemWrapper = styled.div`
  position: relative;
`;
const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;

  background-color: ${({ theme }) => theme.color.white};
`;
const UserRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserText = styled.div`
  .top-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;

    .nickname {
      font-size: ${({ theme }) => theme.size.md};
    }
  }

  .sub-info {
    font-size: ${({ theme }) => theme.size.sm};
    color: ${({ theme }) => theme.color.subText3};
  }
`;

const GoProfile = styled.button`
  padding: 4px 8px;
  color: ${({ theme }) => theme.color.text};
  border: 1px solid ${({ theme }) => theme.color.main};
  font-size: ${({ theme }) => theme.size.md};
  background-color: ${({ theme }) => theme.color.subColor};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const SharingBadge = styled.div`
  padding: 4px 10px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.color.red50};
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.size.sm};
  display: flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
`;
