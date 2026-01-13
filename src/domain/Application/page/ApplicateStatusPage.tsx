import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import PostStatusItem from "../components/PostStatusItem";
import { Checkbox } from "../../../components/Checkbox";

import { useApplicationStore } from "../store/useApplicationStore";
import { getApplicationPosts } from "../../../api/applicationApi";

// const MEMBER_ID = "100";
const ApplicateStatusPage = () => {
  const [excludeDone, setExcludeDone] = useState(false);
  const navigate = useNavigate();
  const { posts, setPosts } = useApplicationStore();
   const [announce, setAnnounce] = useState("");
  useEffect(() => {
    getApplicationPosts().then((res) => {
      setPosts(res.data.posts);
    });
  }, []);
  const filteredPosts = useMemo(() =>{
    if(!excludeDone) return posts;
    return posts.filter((post) => !post.isMatched)
  },[posts, excludeDone])

  const { totalCommon, totalVolunteer } = posts.reduce(
    (acc, post) => {
      acc.totalCommon += post.commonApplicantCount;
      acc.totalVolunteer += post.volunteerApplicantCount;
      return acc;
    },
    { totalCommon: 0, totalVolunteer: 0 }
  );

  const handleExcludeDoneChange = (checked: boolean) => {
    setExcludeDone(checked);
    setAnnounce(
      checked
        ? "완료된 게시글을 제외합니다."
        : "완료된 게시글을 다시 포함합니다."
    );
  };

  return (
    <Container role="main" aria-labelledby="application-status-title">
       <span className="sr-only" aria-live="polite">
        {announce}
      </span>
      <Section1>
        <Header
          onBack={() => navigate("/mypage")}
          title="지원 현황"
          showBack
          aria-label="지원 현황 페이지 입니다"
        />

         <h1 id="application-status-title" className="sr-only">
          지원 현황 페이지
        </h1>
        <SummaryBox aria-label="지원 현황 요약">
          <SummaryItem aria-label={`지원자 수는 ${totalCommon}명 입니다.`}>
            <span>지원자</span>
            <strong>{totalCommon}</strong>
          </SummaryItem >
          <Divider  aria-hidden="true"/>
          <SummaryItem aria-label={`나눔 지원 수는 ${totalVolunteer}명 입니다`}>
            <span>나눔</span>
            <strong>{totalVolunteer}</strong>
          </SummaryItem>
        </SummaryBox>
      </Section1>
      <Section2>
        <ExcludeDone>
          <Checkbox
            checked={excludeDone}
            onChange={handleExcludeDoneChange}
            label="완료 제외"
            aria-label="매칭이 완료된 게시글을 제외할 수 있습니다"
          />
        </ExcludeDone>
        <PostList
          role="region"
          aria-label="지원한 게시글 목록"
        >
        <PostStatusItem posts={filteredPosts} />
        </PostList>
      </Section2>
    </Container>
  );
};

export default ApplicateStatusPage;
const Container = styled.main`
  width: 100%;
  min-height: 100vh;
  max-height: 100vh;
  background-color: ${({ theme }) => theme.color.natural50};
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
const Section1 = styled.div`
  padding: 0 16px 16px 16px;
  background-color: ${({ theme }) => theme.color.white};
`;
const Section2 = styled.div`
  padding: 16px 0;
  background-color: ${({ theme }) => theme.color.white};
`;

const SummaryBox = styled.div`
  display: flex;
  border-top: 1px solid ${({ theme }) => theme.color.natural200};
  border-bottom: 1px solid ${({ theme }) => theme.color.natural200};
  overflow: hidden;
  background-color: ${({ theme }) => theme.color.white};
  padding: 16px 0;
`;

const SummaryItem = styled.div`
  flex: 1;
  padding: 16px 0;
  text-align: center;

  span {
    display: block;
    font-size: ${({ theme }) => theme.size.md};
    margin-bottom: 4px;
  }

  strong {
    font-size: ${({ theme }) => theme.size.md};
    color: ${({ theme }) => theme.color.main};
  }
`;

const Divider = styled.div`
  width: 1px;
  background: #eee;
`;

const ExcludeDone = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.color.subText2};
  justify-content: flex-end;
  margin-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.color.natural200};
  padding: 0px 16px 16px 0px;
`;
const PostList = styled.div`
  
`