import { useEffect, useState } from "react";
import styled from "styled-components";
import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";
import HelpTag from "../../../components/HelpTag";
import BaseLongButton from "../../../components/BaseLongButton";
// import { reviewMockData } from "../mock/review.mock";
import { useMatchStore } from "../../matching/store/useMatchStore";
import { useParams } from "react-router-dom";
import {
  getReviewKeywords,
  reviewWrite,
  type ReviewKeyword,
} from "../../../api/reviewApi";
const ReviewPage = () => {
  const navigate = useNavigate();

  const { agreementId } = useParams<{ agreementId: string }>();
  const { getEngagementById } = useMatchStore();

  const [keywords, setKeywords] = useState<ReviewKeyword[]>([]);

  const [selectedKeywordIds, setSelectedKeywordIds] = useState<number[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const engagement = agreementId ? getEngagementById(agreementId) : undefined;
  const myRole = engagement.myRole;

  const opponent =
    myRole === "DISABLED" ? engagement.helper : engagement.disabled;
  const revieweeId = "700";
  const opponentNickname =
    myRole === "DISABLED"
      ? engagement.helper.nickname
      : engagement.disabled.nickname;

  const postTitle = engagement.title;
  const helpCategories = engagement.helpCategories;

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await reviewWrite({
        revieweeId,
        keywordIds: selectedKeywordIds,
      });
      alert("리뷰가 성공적으로 등록되었습니다.");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("리뷰 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const res = await getReviewKeywords();
        setKeywords(res.keywords);
      } catch (e) {
        console.error("리뷰 키워드 조회 실패");
      }
    };
    fetchKeywords();
  }, []);

  return (
    <Layout>
      <Header title="리뷰 보내기" onBack={() => navigate(-1)} showBack />
      <Title>{postTitle}</Title>
      <TagWrapper>
        {helpCategories.map((category) => {
          return (
            <HelpTag key={category.helpCategoryId}>
              {category.helpCategoryName}
            </HelpTag>
          );
        })}
      </TagWrapper>
      <Divider />
      <Content>
        <Prompt>{opponentNickname}과의 동행은 어떠셨나요?</Prompt>
        <Info>상대방은 어떤 리뷰를 남겼는지 알 수 없어요.</Info>
        <SelectReview>
          {keywords.map((keyword) => {
            const isSelected = selectedKeywordIds.includes(keyword.keywordId);

            return (
              <ReviewCard
                key={keyword.keywordId}
                $active={isSelected}
                onClick={() => {
                  setSelectedKeywordIds((prev) =>
                    isSelected
                      ? prev.filter((id) => id !== keyword.keywordId)
                      : [...prev, keyword.keywordId]
                  );
                }}
              >
                {keyword.description}
              </ReviewCard>
            );
          })}
        </SelectReview>
      </Content>
      <BaseLongButton onClick={handleSubmit} label="리뷰 보내기" />
    </Layout>
  );
};

const Title = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
  margin-bottom: 10px;
`;
const TagWrapper = styled.div`
  display: flex;
  gap: 6px;
  padding: 0px;
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
  color: ${({ theme }) => theme.color.text};
  font-weight: ${({ theme }) => theme.weight.medium};
  margin-bottom: 10px;
  text-align: center;
`;
const Info = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText3};
  font-weight: ${({ theme }) => theme.weight.regular};
  text-align: center;
`;

const SelectReview = styled.div`
  margin-top: 40px;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  justify-content: flex-start;
`;

const ReviewCard = styled.span<{ $active: boolean }>`
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ $active, theme }) =>
    $active ? theme.color.main : theme.color.text};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.color.main : theme.color.natural200};
  font-size: ${({ theme }) => theme.size.md};
  cursor: pointer;
  display: inline-flex;
  justify-content: flex-start;
  text-align: left;
`;

export default ReviewPage;
