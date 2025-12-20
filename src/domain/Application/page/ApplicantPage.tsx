import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import ApplicantCard from "../components/ApplicantCard";
import Header from "../../../components/Header";
interface PostItem {
  id: number;
  nickname: string;
  temperature: number;
  gender: string;
  ageGroup: string;
  location: string;
  isSharing: boolean;
  tags: string[];
}

const MOCK_POSTS: PostItem[] = [
  {
    id: 1,
    nickname: "어디든간다",
    temperature: 40.5,
    gender: "여성",
    ageGroup: "50대",
    location: "갈현동",
    isSharing: true,
    tags: ["생활 지원", "방문 목욕"],
  },
  {
    id: 2,
    nickname: "어디든간다",
    temperature: 40.5,
    gender: "여성",
    ageGroup: "50대",
    location: "갈현동",
    isSharing: false,
    tags: ["생활 지원", "방문 목욕"],
  },
  {
    id: 3,
    nickname: "어디든간다",
    temperature: 40.5,
    gender: "여성",
    ageGroup: "50대",
    location: "갈현동",
    isSharing: true,
    tags: ["생활 지원", "방문 목욕"],
  },
];
const ApplicantPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 전달받은 title이 없으면 기본값 표시
  const title = location.state?.headerTitle || "지원 현황 상세";
  return (
    <Container>
      <Section>
        <Header onBack={() => navigate(-1)} title={title} />

        <FilterSection>
          <button className="active">전체</button>
          <button>나눔</button>
        </FilterSection>
      </Section>

      <PostList>
        {MOCK_POSTS.map((post) => (
          <ApplicantCard key={post.id} item={post} />
        ))}
      </PostList>
    </Container>
  );
};

export default ApplicantPage;

// --- Styled Components ---

const Container = styled.div`
  max-width: 480px;
  margin: 0 auto;
  background-color: #fff;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.color.natural50};
`;
const Section = styled.div`
  padding: 0px 16px;
  background-color: ${({ theme }) => theme.color.white};
  margin-bottom: 12px;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px 0;
  background-color: ${({ theme }) => theme.color.white};

  button {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    border: 1px solid #eee;
    background: #fff;
    cursor: pointer;

    &.active {
      background: #333;
      color: #fff;
      border-color: #333;
    }
  }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
