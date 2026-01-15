import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import type {
  ApplicationPost,
  ApplicationPostDayEngagementTime,
  ApplicationPostTermEngagementTime,
} from "../../../types/application.type";
import { HELP_TAG_LIST } from "../../../constants/helpTags";

interface Props {
  posts: ApplicationPost[];
  hideMatched?: boolean;
}

/* ======================
   요일 한글 매핑
====================== */
const DAY_OF_WEEK_KR: Record<
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY",
  string
> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

const toKoreanDay = (dayOfWeek?: string) =>
  dayOfWeek
    ? DAY_OF_WEEK_KR[dayOfWeek as keyof typeof DAY_OF_WEEK_KR] ?? dayOfWeek
    : "";

/* ======================
   타입 가드
====================== */
const isDayEngagement = (
  engagementTime: ApplicationPost["engagementTime"]
): engagementTime is ApplicationPostDayEngagementTime => {
  return "date" in engagementTime;
};

const isTermEngagement = (
  engagementTime: ApplicationPost["engagementTime"]
): engagementTime is ApplicationPostTermEngagementTime => {
  return "startDate" in engagementTime;
};

/* ======================
   날짜 포맷
====================== */
const formatDateWithDay = (dateStr: string, dayOfWeek: string) => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}(${toKoreanDay(dayOfWeek)})`;
};

const formatEngagementDate = (
  engagementTime: ApplicationPost["engagementTime"]
) => {
  // 하루 도움
  if (isDayEngagement(engagementTime)) {
    return formatDateWithDay(
      engagementTime.date,
      engagementTime.schedule.dayOfWeek
    );
  }

  // 지속 도움
  if (isTermEngagement(engagementTime)) {
    const first = engagementTime.schedules[0];
    const last = engagementTime.schedules[engagementTime.schedules.length - 1];

    return (
      formatDateWithDay(engagementTime.startDate, first.dayOfWeek) +
      " ~ " +
      formatDateWithDay(engagementTime.endDate, last.dayOfWeek)
    );
  }

  return "";
};

/* ======================
   Component
====================== */
const PostStatusItem = ({ posts, hideMatched = false }: Props) => {
  // const MEMBER_ID = "100";
  const navigate = useNavigate();

  const filteredItems = hideMatched
    ? posts.filter((item) => !item.isMatched)
    : posts;

  const goToApplicant = (
    postId: string,
    title: string,
    helpCategoryIds: number[]
  ) => {
    console.log("postId:", postId);
    navigate(`/applicant/${postId}`, {
      // state: { headerTitle: title, memberId: MEMBER_ID, helpCategoryIds },
      state: { headerTitle: title, helpCategoryIds },
    });
  };

  return (
    <Container role="list">
      {filteredItems.map((item) => {
        const statusText = item.isMatched ? "매칭 완료" : "진행 중";
        const regionText = item.region;
        const dateText = formatEngagementDate(item.engagementTime);

        const helpTagsText = item.helpCategories
          .map((id) => {
            const tag = HELP_TAG_LIST.find((t) => t.id === id);
            return tag?.name;
          })
          .filter(Boolean)
          .join(", ");

        const cardLabel = `
          ${statusText} 게시글.
          제목 ${item.title}.
          도움 카테고리 ${helpTagsText}.
          활동 지역 ${regionText}.
          활동 기간 ${dateText}.
          지원자 ${item.commonApplicantCount}명,
          나눔 지원자 ${item.volunteerApplicantCount}명,
          마감까지 ${item.daysRemaining}일 남음.
        `;

        return (
          <Card
            key={item.postId}
            role="button"
            tabIndex={0}
            aria-label={cardLabel}
            onClick={() =>
              goToApplicant(item.postId, item.title, item.helpCategories)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                goToApplicant(item.postId, item.title, item.helpCategories);
              }
            }}
          >
            <TagRow aria-hidden="true">
              <StatusBadge completed={item.isMatched}>
                <CheckIcon completed={item.isMatched} />
                <span>{statusText}</span>
              </StatusBadge>

              <HelpTag>
                {item.helpCategories.map((id) => {
                  const tag = HELP_TAG_LIST.find((t) => t.id === id);
                  return tag ? <SubTag key={id}>{tag.name}</SubTag> : null;
                })}
              </HelpTag>
            </TagRow>

            <div aria-hidden="true">
              <CardTitle>{item.title}</CardTitle>

              <InfoRow>
                <InfoItem>
                  <FiMapPin />
                  <span>{regionText}</span>
                </InfoItem>

                <InfoItem>
                  <FiCalendar />
                  <span>{dateText}</span>
                </InfoItem>
              </InfoRow>
            </div>
            <BottomBox aria-hidden="true">
              <BottomItem>
                지원자 <em>{item.commonApplicantCount}</em>
              </BottomItem>
              <Line />
              <BottomItem>
                나눔 <em>{item.volunteerApplicantCount}</em>
              </BottomItem>
              <Line />
              <BottomItem>
                마감 <em>D-{item.daysRemaining}</em>
              </BottomItem>
            </BottomBox>
          </Card>
        );
      })}
    </Container>
  );
};

export default PostStatusItem;

/* ======================
   Styled Components
====================== */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  background-color: ${({ theme }) => theme.color.natural50};
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TagRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const StatusBadge = styled.div<{ completed?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ completed, theme }) =>
    completed ? theme.color.natural100 : theme.color.subColor2};

  span {
    color: ${({ completed, theme }) =>
      completed ? theme.color.subText3 : theme.color.main};
  }
`;

const CheckIcon = styled(BsFillPatchCheckFill)<{ completed?: boolean }>`
  font-size: 16px;
  color: ${({ completed, theme }) =>
    completed ? theme.color.subText3 : theme.color.main};
`;

const HelpTag = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SubTag = styled.span`
  font-size: ${({ theme }) => theme.size.sm};
  padding: 2px 8px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.color.natural200};
  color: ${({ theme }) => theme.color.subText2};
`;

const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.size.md};
  margin-bottom: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 14px;
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    font-size: 14px;
  }
`;

const BottomBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
`;

const BottomItem = styled.div`
  em {
    color: ${({ theme }) => theme.color.main};
    font-style: normal;
    margin-left: 4px;
  }
`;

const Line = styled.div`
  width: 1px;
  height: 14px;
  background: #eee;
`;
