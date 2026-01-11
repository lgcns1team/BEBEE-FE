import styled from "styled-components";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    // getApplicationPosts({ memberId: MEMBER_ID }).then((res) => {
    getApplicationPosts().then((res) => {
      setPosts(res.data.posts);
    });
  }, []);

  const { totalCommon, totalVolunteer } = posts.reduce(
    (acc, post) => {
      acc.totalCommon += post.commonApplicantCount;
      acc.totalVolunteer += post.volunteerApplicantCount;
      return acc;
    },
    { totalCommon: 0, totalVolunteer: 0 }
  );

  return (
    <Container>
      <Section1>
        <Header
          onBack={() => navigate("/mypage")}
          title="지원 현황"
          showBack
          aria-label="지원 현황 페이지 입니다"
        />
        <SummaryBox>
          <SummaryItem>
            <span>지원자</span>
            <strong>{totalCommon}</strong>
          </SummaryItem>
          <Divider />
          <SummaryItem>
            <span>나눔</span>
            <strong>{totalVolunteer}</strong>
          </SummaryItem>
        </SummaryBox>
      </Section1>
      <Section2>
        <ExcludeDone>
          <Checkbox
            checked={excludeDone}
            onChange={setExcludeDone}
            label="완료 제외"
            aria-label="매칭이 완료된 게시글을 제외할 수 있습니다"
          />
        </ExcludeDone>
        {/* <PostStatusItem posts={posts} /> */}
        <PostStatusItem posts={posts} />
      </Section2>
    </Container>
  );
};

export default ApplicateStatusPage;
const Container = styled.main`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.color.natural50};
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
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
