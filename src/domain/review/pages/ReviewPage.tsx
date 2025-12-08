import React from "react";
import { useState } from "react";
import styled from "styled-components";
import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";
import HelpTag from "../../../components/HelpTag";
import ReviewBee1Black from "../../../assets/images/review-bee1-black.png";
import ReviewBee1 from "../../../assets/images/review-bee1.png";
import ReviewBee2Black from "../../../assets/images/review-bee2-black.png";
import ReviewBee2 from "../../../assets/images/review-bee2.png";
import ReviewBee3Black from "../../../assets/images/review-bee3-black.png";
import ReviewBee3 from "../../../assets/images/review-bee3.png";
import ReviewBee4Black from "../../../assets/images/review-bee4-black.png";
import ReviewBee4 from "../../../assets/images/review-bee4.png";
const ReviewPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);

  const bees = [
    { id: 1, color: ReviewBee1, black: ReviewBee1Black },
    { id: 2, color: ReviewBee2, black: ReviewBee2Black },
    { id: 3, color: ReviewBee3, black: ReviewBee3Black },
    { id: 4, color: ReviewBee4, black: ReviewBee4Black },
  ];
  return (
    <Layout>
      <Container>
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
            {bees.map((bee) => (
              <BeeCard
                key={bee.id}
                $active={selected === bee.id}
                onClick={() => setSelected(bee.id)}
              >
                <BeeImage
                  src={selected === bee.id ? bee.color : bee.black}
                  alt="bee"
                />
                <Label $active={selected === bee.id}>
                  {["별로예요", "보통이에요", "좋아요", "최고예요"][bee.id - 1]}
                </Label>
              </BeeCard>
            ))}
          </SelectReview>
        </Content>
        <SubmitButton>리뷰 보내기</SubmitButton>
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  height: 100vh;
`;
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
  margin-top: 20px;
  text-align: center;
`;
const Prompt = styled.div`
  font-size: ${({ theme }) => theme.size.lg};
  color: ${({ theme }) => theme.color.text};
  font-weight: ${({ theme }) => theme.weight.medium};
  margin-bottom: 10px;
`;
const Info = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText3};
  font-weight: ${({ theme }) => theme.weight.regular};
`;

const SelectReview = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-top: 40px;
  margin-left: 25px;
  margin-right: 25px;
`;

const BeeCard = styled.div<{ $active: boolean }>`
  width: 125px;
  height: 125px;
  padding: 24px 0;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ $active, theme }) =>
    $active ? theme.color.subColor2 : theme.color.natural100};
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.color.main : "transparent")};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BeeImage = styled.img`
  width: 55px;
  height: 55px;
`;
const Label = styled.div<{ $active: boolean }>`
  margin-top: 12px;
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ $active, theme }) =>
    $active ? theme.color.main : theme.color.subText3};
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: ${({ theme }) => theme.color.main};
  color: ${({ theme }) => theme.color.white};
  font-size: ${({ theme }) => theme.size.md};
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: none;
  font-weight: ${({ theme }) => theme.weight.medium};
  position: fixed;
  width: 330px;
  transform: translateX(-50%);
  left: 50%;
  bottom: 20px;
`;

export default ReviewPage;
