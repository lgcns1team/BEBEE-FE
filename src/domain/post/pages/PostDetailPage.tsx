import styled from "styled-components";
import { useState, useEffect } from "react";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import { getErrorMessage } from "../../../utils/error";
import { useNavigate, useParams } from "react-router-dom";
import { RxIconjarLogo } from "react-icons/rx";
//import ActionSheetModal from "../components/common/ActionSheetModal";
import HelpTagBee from "../../../assets/images/helptag-bee.png";
import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import { postApi } from "../../../api/postApi";
import type { PostDetailResponse } from "../../../types/post.type";
import { HELP_TAG_MAP } from "../../../constants/helpTags";
import BeeImage from "../../../assets/images/bee-letter.png";
import { applyHelper } from "../../../api/applicationApi";

const PostDetailPage = () => {
  const navigate = useNavigate();

  const { postId } = useParams<{ postId: string }>();

  // 1. 로컬 상태로 관리
  const [post, setPost] = useState<PostDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 도우미가 지원하기 및 나눔하기
  const [isApplied, setIsApplied] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);

        const data = await postApi.getPostDetail(postId, "100");
        console.log(data);
        setPost(data);
      } catch (error) {
        setError(getErrorMessage(error, "데이터를 불러오지 못함"));
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchDetail();
  }, [postId]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>게시글이 없습니다.</div>;

  // 임시 memberId
  const MEMBER_ID = "100";

  // 지원하기 및 나눔하기
  const handleApply = async () => {
    if (!postId) return;

    try {
      setApplyLoading(true);

      await applyHelper({
        memberId: MEMBER_ID,
        postId: postId,
        isVolunteer: false,
      });
      setIsApplied(true);
      setPost((prev) =>
        prev ? { ...prev, applicantCount: prev.applicantCount + 1 } : prev
      );
      alert("지원이 완료 되었습니다!");
    } catch (error) {
      setError(getErrorMessage(error, "지원에 실패했습니다."));
    } finally {
      setApplyLoading(false);
    }
  };

  const handleVolunteer = async () => {
    if (!postId) return;

    try {
      setApplyLoading(true);

      await applyHelper({
        memberId: MEMBER_ID,
        postId: postId,
        isVolunteer: true,
      });
      setIsApplied(true);
      setPost((prev) =>
        prev ? { ...prev, applicantCount: prev.applicantCount + 1 } : prev
      );
      alert("나눔 신청이 완료 되었습니다!");
    } catch (error) {
      setError(getErrorMessage(error, "나눔 신청에 실패했습니다."));
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <Layout>
      <Container>
        <Header onBack={() => navigate(-1)} showRight showBack />

        {/* 
        <ActionSheetModal
          isOpen={isActionSheetOpen}
          onClose={() => setIsActionSheetOpen(false)}
        />*/}

        <TagList>
          <HelpBeeImage src={HelpTagBee} alt="bee" />
          {post.helpCategoryIds.map((cat) => (
            <Tag key={cat}>{HELP_TAG_MAP[cat] ?? "알 수 없음"}</Tag>
          ))}
        </TagList>

        {/* ---------------- Title ---------------- */}
        <Title>{post?.title}</Title>

        {/* ---------------- User Info ---------------- */}
        <UserSection>
          <UserLeft>
            {post?.memberProfileImageUrl ? (
              <UserImage src={post.memberProfileImageUrl} />
            ) : (
              <UserImage src={BeeImage} />
            )}
            <UserInfo>
              <UserName>{post?.memberNickname}</UserName>
              <UserAddress>{post?.memberLegalDongCode}</UserAddress>
            </UserInfo>
          </UserLeft>
        </UserSection>

        <Divider />

        {/* ---------------- Info List ---------------- */}
        <InfoList>
          <InfoItem>
            <RxIconjarLogo size={16} />
            <span>{post?.unitHoney}꿀</span>
          </InfoItem>

          <InfoItem>
            <FiCalendar size={16} />
            <span>{post?.date}</span>
          </InfoItem>

          <InfoItem>
            <FiClock size={16} />
            <span>{post?.startDate}</span> ~ <span>{post?.endDate}</span>
          </InfoItem>

          <InfoItem>
            <FiMapPin size={16} />
            <span>{post?.postLegalDongCode}</span>
          </InfoItem>
        </InfoList>
        {/* ---------------- Description ---------------- */}
        <Description>{post?.content}</Description>

        <ApplicantCount>지원자 수 {post?.applicantCount}</ApplicantCount>
        {post?.postImages && <PostImage src={post.postImages[0]} />}
        {/* ---------------- Bottom Buttons ---------------- */}
        <BottomBar>
          <BottomInner>
            <ShareButton
              disabled={isApplied || applyLoading}
              onClick={handleVolunteer}
            >
              나눔 하기
            </ShareButton>
            <ApplyButton
              disabled={isApplied || applyLoading}
              onClick={handleApply}
            >
              {isApplied ? "지원 완료" : "지원 하기"}
            </ApplyButton>
          </BottomInner>
        </BottomBar>
      </Container>
    </Layout>
  );
};

export default PostDetailPage;

/* ---------------------------------------------
   styled-components
--------------------------------------------- */

const Container = styled.div`
  margin-bottom: 30px;
`;

const HelpBeeImage = styled.img`
  width: 16px;
  height: 16px;
  object-fit: contain;
  margin-right: 2px;
`;

const TagList = styled.div`
  display: flex;
  gap: 6px;
  padding: 0px;
`;

const Tag = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.main};

  font-weight: ${({ theme }) => theme.weight.medium};
`;

const Title = styled.h1`
  padding: 4px 0px;
  margin-bottom: 16px;
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.color.text};
  line-height: 1.3;
`;

const UserSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 0px 16px 0px;
  align-items: center;
`;

const UserLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  cursor: pointer;
`;

const UserAddress = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.subText2};
`;

const Divider = styled.div`
  width: 100%;
  height: 0.5px;
  background: ${({ theme }) => theme.color.natural200};
`;

const InfoList = styled.div`
  padding: 16px 0px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.regular};
`;

const Description = styled.p`
  padding: 16px 0px;
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
  line-height: 1.6;
`;

const ApplicantCount = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
  padding: 0;
  margin-bottom: 12px;
`;

const PostImage = styled.img`
  width: 100%;
`;

const BottomBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: ${({ theme }) => theme.color.white};
  max-width: 375px;
  display: flex;
  justify-content: center;
  padding: 12px 0;
  margin: 0 auto;
`;

const BottomInner = styled.div`
  width: 100%;
  max-width: 345px;
  display: flex;
  gap: 12px;
`;

const ShareButton = styled.button<{ disabled?: boolean }>`
  flex: 1;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 0.5px solid ${({ theme }) => theme.color.natural200};
  font-size: ${({ theme }) => theme.size.md};
  background: ${({ theme, disabled }) =>
    disabled ? theme.color.natural200 : theme.color.white};
  font-weight: ${({ theme }) => theme.weight.medium};
  appearance: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
`;

// const ApplyButton = styled.button`
//   flex: 2;
//   height: 48px;
//   border-radius: ${({ theme }) => theme.borderRadius.sm};
//   background: ${({ theme }) => theme.color.main};
//   color: ${({ theme }) => theme.color.white};
//   font-size: ${({ theme }) => theme.size.md};
//   border: none;
//   font-weight: ${({ theme }) => theme.weight.medium};
// `;

const ApplyButton = styled.button<{ disabled?: boolean }>`
  flex: 2;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme, disabled }) =>
    disabled ? theme.color.natural200 : theme.color.main};
  color: ${({ theme }) => theme.color.white};
  font-size: ${({ theme }) => theme.size.md};
  border: none;
  font-weight: ${({ theme }) => theme.weight.medium};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;
