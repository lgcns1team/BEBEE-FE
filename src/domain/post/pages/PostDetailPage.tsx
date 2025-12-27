import styled from "styled-components";
import { useState } from "react";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";

import { useNavigate, useParams } from "react-router-dom";
import { RxIconjarLogo } from "react-icons/rx";
import ActionSheetModal from "../components/common/ActionSheetModal";
import HelpTagBee from "../../../assets/images/helptag-bee.png";
import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import { usePostStore } from "../../../store/usePostStore";
import { useProfileStore } from "../../../store/useProfileStore";
import BeeImage from "../../../assets/images/bee-letter.png";
const PostDetailPage = () => {
  const navigate = useNavigate();

  const { postId } = useParams<{ postId: string }>();

  const { disabledProfiles } = useProfileStore();

  const postIdNum = Number(postId);

  const post = usePostStore((state) =>
    state.posts.find((p) => p.postId === postIdNum)
  );
  const profile = disabledProfiles.find((p) => p.memberId === post?.memberId);

  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const goProfile = () => {
    navigate(`/profile/disabled/${profile?.memberId}`);
  };

  const formatDate = (date?: Date) => {
    if (!date) return "";
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`;
  };

  const formatHour = (date?: Date) => {
    if (!date) return "";
    return `${new Date(date).getHours()}시`;
  };

  const DAY_KR_MAP: Record<
    "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN",
    string
  > = {
    MON: "월요일",
    TUE: "화요일",
    WED: "수요일",
    THU: "목요일",
    FRI: "금요일",
    SAT: "토요일",
    SUN: "일요일",
  };

  return (
    <Layout>
      <Container>
        {/* ---------------- Header ---------------- */}
        <Header
          onBack={() => navigate(-1)}
          showRight
          onRightClick={() => setIsActionSheetOpen(true)}
        />
        <ActionSheetModal
          isOpen={isActionSheetOpen}
          onClose={() => setIsActionSheetOpen(false)}
        />
        {/* ---------------- Category Tags ---------------- */}
        <TagList>
          <HelpBeeImage src={HelpTagBee} alt="bee" />
          {post?.categoryName.map((category) => (
            <Tag key={category}>{category}</Tag>
          ))}
        </TagList>

        {/* ---------------- Title ---------------- */}
        <Title>{post?.title}</Title>

        {/* ---------------- User Info ---------------- */}
        <UserSection>
          <UserLeft>
            {profile?.profileImageUrl ? (
              <UserImage src={profile.profileImageUrl} />
            ) : (
              <UserImage src={BeeImage} />
            )}
            <UserInfo>
              <UserName onClick={goProfile}>{profile?.name}</UserName>
              <UserAddress>{profile?.addressRoad}</UserAddress>
            </UserInfo>
          </UserLeft>
        </UserSection>

        <Divider />

        {/* ---------------- Info List ---------------- */}
        <InfoList>
          <InfoItem>
            <RxIconjarLogo size={16} />
            <span>{post?.totalHoney}꿀</span>
          </InfoItem>

          <InfoItem>
            <FiCalendar size={16} />

            {/* 하루 도움 */}
            {post?.type === "하루 도움" && (
              <span>{formatDate(post.engagementDate)}</span>
            )}

            {/* 지속 도움 */}
            {post?.type === "지속 도움" && (
              <span>
                {formatDate(post.startDate)} ~ {formatDate(post.endDate)}
              </span>
            )}
          </InfoItem>

          <InfoItem>
            <FiClock size={16} />

            {/* 하루 도움 */}
            {post?.type === "하루 도움" && (
              <span>
                {formatHour(post.startTime)} ~ {formatHour(post.endTime)}
              </span>
            )}

            {/* 지속 도움 */}
            {post?.type === "지속 도움" && (
              <TimeColumn>
                {post.dayOfWeek?.map((schedule) => (
                  <div key={schedule.dayOfWeek}>
                    {DAY_KR_MAP[schedule.dayOfWeek]}: {schedule.startTime} ~{" "}
                    {schedule.endTime}
                  </div>
                ))}
              </TimeColumn>
            )}
          </InfoItem>

          <InfoItem>
            <FiMapPin size={16} />
            <span>{post?.region}</span>
          </InfoItem>
        </InfoList>

        {/* ---------------- Description ---------------- */}
        <Description>{post?.content}</Description>

        <ApplicantCount>지원자 수 13</ApplicantCount>
        {post?.imageUrl && <PostImage src={post.imageUrl} />}
        {/* ---------------- Bottom Buttons ---------------- */}
        <BottomBar>
          <BottomInner>
            <ShareButton>나눔하기</ShareButton>
            <ApplyButton>지원하기</ApplyButton>
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
const TimeColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
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

const ShareButton = styled.button`
  flex: 1;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 0.5px solid ${({ theme }) => theme.color.natural200};
  font-size: ${({ theme }) => theme.size.md};
  background: ${({ theme }) => theme.color.white};
  font-weight: ${({ theme }) => theme.weight.medium};
  appearance: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
`;

const ApplyButton = styled.button`
  flex: 2;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme }) => theme.color.main};
  color: ${({ theme }) => theme.color.white};
  font-size: ${({ theme }) => theme.size.md};
  border: none;
  font-weight: ${({ theme }) => theme.weight.medium};
`;
