import { useState } from "react";
import styled from "styled-components";
import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";
import HelpTag from "../../../components/HelpTag";
import BaseLongButton from "../../../components/BaseLongButton";
import { reviewMockData } from "../mock/review.mock";
const ReviewPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);
  const ReviewSubmit = () => {
    navigate("/");
  };
  return (
    <Layout>
      <Header title="리뷰 보내기" onBack={() => navigate(-1)} />
      <Title>아자아자 화이팅!</Title>
      <TagWrapper>
        <HelpTag>이동지원</HelpTag>
        <HelpTag>의료동행</HelpTag>
      </TagWrapper>

      <Divider />
      <Content>
        <Prompt>화이팅님과의 동행은 어떠셨나요?</Prompt>
        <Info>상대방은 어떤 리뷰를 남겼는지 알 수 없어요.</Info>
        <SelectReview>
          {reviewMockData.map((review) => (
            <ReviewCard
              key={review.id}
              $active={selected === review.id}
              onClick={() => setSelected(review.id)}
            >
              {review.reviewcontent}
            </ReviewCard>
          ))}
        </SelectReview>
      </Content>
      <BaseLongButton onClick={ReviewSubmit} label="리뷰 보내기" />
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
