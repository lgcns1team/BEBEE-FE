import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import { TbMoneybag } from "react-icons/tb";
import { getErrorMessage } from "../../../utils/error";
import { useNavigate, useParams } from "react-router-dom";
import HelpTagBee from "../../../assets/images/helptag-bee.png";
import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import { Toast } from "../../../components/Toast";
import { useToastStore } from "../../../store/useToastStore";
import { postApi } from "../../../api/postApi";
import {
  type PostDetailResponse,
  DAY_OF_WEEK_MAP,
} from "../../../types/post.type";
import { HELP_TAG_MAP } from "../../../constants/helpTags";
import BeeImage from "../../../assets/images/bee-letter.png";
import { applyHelper } from "../../../api/applicationApi";

import { formatDateToKoreanWithDay } from "../../../types/common.types";
const PostDetailPage = () => {
  
  const navigate = useNavigate();
  const { showToast } = useToastStore();

  const { postId } = useParams<{ postId: string }>();

  // 1. 로컬 상태로 관리
  const [post, setPost] = useState<PostDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 도우미가 지원하기 및 나눔하기
  const [isApplied, setIsApplied] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);

  // 이미지 슬라이드
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageSliderRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);

        const data = await postApi.getPostDetail(postId);
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

  // 이미지가 변경되면 인덱스 리셋
  useEffect(() => {
    if (post?.postImageUrls) {
      setCurrentImageIndex(0);
    }
  }, [post?.postImageUrls]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>게시글이 없습니다.</div>;

  // 지원하기 및 나눔하기
  const handleApply = async () => {
    if (!postId) return;

    try {
      setApplyLoading(true);

      await applyHelper({
        // memberId: MEMBER_ID,
        postId: postId,
        isVolunteer: false,
      });
      setIsApplied(true);
      setPost((prev) =>
        prev ? { ...prev, applicantCount: prev.applicantCount + 1 } : prev
      );
      showToast("지원이 완료되었습니다.", "SUCCESS");
    } catch (error) {
      showToast(getErrorMessage(error, "지원에 실패했습니다."), "ERROR");
    } finally {
      setApplyLoading(false);
    }
  };

  const handleVolunteer = async () => {
    if (!postId) return;

    try {
      setApplyLoading(true);

      await applyHelper({
        // memberId: MEMBER_ID,
        postId: postId,
        isVolunteer: true,
      });
      setIsApplied(true);
      setPost((prev) =>
        prev ? { ...prev, applicantCount: prev.applicantCount + 1 } : prev
      );
      showToast("나눔 신청이 완료되었습니다.", "SUCCESS");
    } catch (error) {
      showToast(getErrorMessage(error, "나눔 신청에 실패했습니다."), "ERROR");
    } finally {
      setApplyLoading(false);
    }
  };

  // 공통 슬라이드 로직
  const handleSlide = (startX: number, endX: number) => {
    if (!post?.postImageUrls) return;

    const diff = startX - endX;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // 왼쪽으로 스와이프/드래그 (다음 이미지)
        setCurrentImageIndex((prev) =>
          prev < post.postImageUrls.length - 1 ? prev + 1 : prev
        );
      } else {
        // 오른쪽으로 스와이프/드래그 (이전 이미지)
        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    }
  };

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    handleSlide(touchStartX.current, touchEndX.current);

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // 마우스 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    touchStartX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStartX.current !== null) {
      touchEndX.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      handleSlide(touchStartX.current, touchEndX.current);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleMouseLeave = () => {
    // 마우스가 영역을 벗어나면 드래그 취소
    touchStartX.current = null;
    touchEndX.current = null;
  };
  // 프로필 정보로 이동
  const handleProfileClick = () =>{
    navigate(`/profile/${post.memberId}`)
  }
  
  return (
    <Layout>
      <Container style={{ paddingBottom: "40px" }}>
        <Header onBack={() => navigate(-1)} showRight showBack />
        <Toast position="bottom" />

        {/* 
        <ActionSheetModal
          isOpen={isActionSheetOpen}
          onClose={() => setIsActionSheetOpen(false)}
        />*/}

        <TagList>
          <HelpBeeImage src={HelpTagBee} alt="bee" />
          {post.helpCategoryIds.map((cat) => (
            <Tag key={cat}>{HELP_TAG_MAP[cat]}</Tag>
          ))}
        </TagList>

        <Title>{post?.title}</Title>

        <UserSection onClick={handleProfileClick} >
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

        <InfoList>
          <InfoItem>
            <TbMoneybag size={18} />
            <span>{post?.unitHoney}꿀</span>
            {post.engagementType == "TERM" ? (
              <TotalHoney>/회 (총 {post.totalHoney}꿀)</TotalHoney>
            ) : undefined}
          </InfoItem>

          <InfoItem>
            <FiCalendar size={16} />
            {post.engagementType == "DAY" ? (
              <span>{formatDateToKoreanWithDay(post?.date)}</span>
            ) : (
              <span>
                {post?.startDate} ~ {post?.endDate}{" "}
              </span>
            )}
          </InfoItem>

          <InfoItem style={{ display: "flex", alignItems: "flex-start" }}>
            <FiClock size={16} />

            {post.engagementType === "DAY" ? (
              <Schedules style={{ listStyle: "none" }}>
                {post.schedules?.map((item, index) => (
                  <ScheduleRow key={index} className="schedule-row">
                    {/* 시간 변환: 11:00:00 -> 11:00 */}
                    <span className="time">
                      {item.startTime?.slice(0, 5)} ~{" "}
                      {item.endTime?.slice(0, 5)}
                    </span>
                  </ScheduleRow>
                ))}
              </Schedules>
            ) : (
              <Schedules style={{ listStyle: "none" }}>
                {post.schedules?.map((item, index) => (
                  <ScheduleRow key={index} className="schedule-row">
                    {/* 요일 변환: MONDAY -> (월) */}
                    <span className="day">
                      {DAY_OF_WEEK_MAP[item.dayOfWeek] || item.dayOfWeek}
                      <span>요일:</span>
                    </span>

                    {/* 시간 변환: 11:00:00 -> 11:00 */}
                    <span className="time">
                      {item.startTime?.slice(0, 5)} ~{" "}
                      {item.endTime?.slice(0, 5)}
                    </span>
                  </ScheduleRow>
                ))}
              </Schedules>
            )}
          </InfoItem>

          <InfoItem>
            <FiMapPin size={16} />
            <span>{post?.postAddress}</span>
          </InfoItem>
        </InfoList>
        {/* ---------------- Description ---------------- */}
        <Description>{post?.content}</Description>

        <ApplicantCount>지원자 수 {post?.applicantCount}</ApplicantCount>
        {post?.postImageUrls && post.postImageUrls.length > 0 && (
          <ImageSliderContainer>
            <ImageSlider
              ref={imageSliderRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `translateX(-${currentImageIndex * 100}%)`,
                cursor: "grab",
              }}
            >
              {post.postImageUrls.map((imageUrl, index) => (
                <PostImage
                  key={index}
                  src={imageUrl}
                  alt={`게시글 이미지 ${index + 1}`}
                />
              ))}
            </ImageSlider>
            {post.postImageUrls.length > 1 && (
              <ImageIndicator>
                {currentImageIndex + 1}/{post.postImageUrls.length}
              </ImageIndicator>
            )}
          </ImageSliderContainer>
        )}

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
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
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

const ImageSliderContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-bottom: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ImageSlider = styled.div`
  display: flex;
  transition: transform 0.3s ease-in-out;
  width: 100%;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`;

const PostImage = styled.img`
  width: 100%;
  flex-shrink: 0;
  object-fit: cover;
  display: block;
`;

const ImageIndicator = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: ${({ theme }) => theme.size.sm};
  font-weight: ${({ theme }) => theme.weight.medium};
  z-index: 10;
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

/*TERM 에만 적용*/
const TotalHoney = styled.span`
  color: ${({ theme }) => theme.color.subText2};
  font-size: ${({ theme }) => theme.size.sm};
`;

const Schedules = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column; /* 일정들을 아래로 쌓음 */
  gap: 6px; /* 일정 줄 사이의 간격 */
`;

const ScheduleRow = styled.li`
  display: flex;
  gap: 8px;
  font-size: ${({ theme }) => theme.size.md};
  line-height: 1.2; /* 텍스트 높이를 조절해 아이콘과 맞춤 */
`;
