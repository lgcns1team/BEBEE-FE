import { useEffect, useState } from "react";
import styled from "styled-components";
import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import { useNavigate, useParams } from "react-router-dom";

import HelpTag from "../../../components/HelpTag";
import BaseLongButton from "../../../components/BaseLongButton";

import { useMatchStore } from "../../matching/store/useMatchStore";
import {
  getReviewKeywords,
  reviewWrite,
  type ReviewKeyword,
} from "../../../api/reviewApi";

import { HELP_TAG_MAP } from "../../../constants/helpTags";

const ReviewPage = () => {
  const navigate = useNavigate();
  const { getByMatchId } = useMatchStore();
  const { matchId } = useParams<{ matchId: string }>();

  const engagement = matchId ? getByMatchId(matchId) : undefined;

  const [keywords, setKeywords] = useState<ReviewKeyword[]>([]);
  const [selectedKeywordIds, setSelectedKeywordIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const res = await getReviewKeywords();
        setKeywords(res.keywords);
        setAnnounce("리뷰 키워드를 불러왔습니다. 원하는 항목을 선택해 주세요.");
      } catch (e) {
        console.error("리뷰 키워드 조회 실패", e);
      }
    };

    fetchKeywords();
  }, []);

  if (!engagement) {
    return (
      <Layout>
        <Header title="리뷰 보내기" showBack onBack={() => navigate(-1)} />
      </Layout>
    );
  }

  const opponentNickname = engagement.otherNickname;
  const postTitle = engagement.title;
  const helpCategoryIds = engagement.helpCategoryIds;

  /** 리뷰 전송 */
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setAnnounce("리뷰를 전송 중입니다.");

      await reviewWrite(matchId, {
        keywordIds: selectedKeywordIds,
      });

      setAnnounce("리뷰가 성공적으로 등록되었습니다.");
      alert("리뷰가 성공적으로 등록되었습니다.");
      navigate("/home");
    } catch (error) {
      console.error(error);
      setAnnounce("리뷰 등록에 실패했습니다.");
      alert("리뷰 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Header title="리뷰 보내기" showBack onBack={() => navigate(-1)} />

      <ScrollContainer>
        <span className="sr-only" aria-live="polite">
          {announce}
        </span>

        <Title aria-label={`활동 제목 ${postTitle} 입니다`}>{postTitle}</Title>

        <TagWrapper aria-label="도움 유형 입니다">
          {helpCategoryIds.map((id) => (
            <HelpTag key={id}>{HELP_TAG_MAP[id]}</HelpTag>
          ))}
        </TagWrapper>

        <Divider />

        <Content>
          <Prompt
            aria-label={`${opponentNickname}님과의 활동에 대한 리뷰 질문입니다`}
          >
            {opponentNickname}과의 동행은 어떠셨나요?
          </Prompt>

          <Info aria-label="리뷰는 서로에게 공개되지 않습니다">
            상대방은 어떤 리뷰를 남겼는지 알 수 없어요.
          </Info>

          <SelectReview role="group" aria-label="리뷰 키워드 선택 목록입니다">
            {keywords.map((keyword) => {
              const isSelected = selectedKeywordIds.includes(keyword.keywordId);

              const toggleKeyword = () => {
                setSelectedKeywordIds((prev) => {
                  const next = isSelected
                    ? prev.filter((id) => id !== keyword.keywordId)
                    : [...prev, keyword.keywordId];

                  setAnnounce(
                    `${keyword.description} ${
                      isSelected ? "선택이 해제되었습니다" : "선택이 되었습니다"
                    }`
                  );

                  return next;
                });
              };

              return (
                <ReviewCard
                  key={keyword.keywordId}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  aria-label={`${keyword.description}, ${
                    isSelected ? "선택됨" : "선택 안 됨"
                  }`}
                  $active={isSelected}
                  onClick={toggleKeyword}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleKeyword();
                    }
                  }}
                >
                  {keyword.description}
                </ReviewCard>
              );
            })}
          </SelectReview>
        </Content>
      </ScrollContainer>
      <BaseLongButton
        label="리뷰 보내기"
        aria-label={
          selectedKeywordIds.length === 0
            ? "리뷰 키워드를 하나 이상 선택해야 전송할 수 있습니다"
            : "리뷰 보내기"
        }
        disabled={isSubmitting || selectedKeywordIds.length === 0}
        onClick={handleSubmit}
      />
    </Layout>
  );
};

export default ReviewPage;

const ScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  width: 100%;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
  margin-bottom: 10px;
`;

const TagWrapper = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 15px;
`;

const Divider = styled.div`
  width: 100%;
  height: 0.5px;
  background: ${({ theme }) => theme.color.natural200};
`;

const Content = styled.div`
  margin-top: 30px;
  margin-bottom: 40px;
`;

const Prompt = styled.div`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.medium};
  text-align: center;
`;

const Info = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText3};
  text-align: center;
`;

const SelectReview = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  width: 100%;
`;

const ReviewCard = styled.button<{ $active: boolean }>`
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ $active, theme }) =>
    $active ? theme.color.main : theme.color.text};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.color.main : theme.color.natural200};
  font-size: ${({ theme }) => theme.size.md};
  background: ${({ theme }) => theme.color.white};
  cursor: pointer;
  text-align: left;
  width: fit-content;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.main};
    outline-offset: 2px;
  }
  width: fit-content;
`;
