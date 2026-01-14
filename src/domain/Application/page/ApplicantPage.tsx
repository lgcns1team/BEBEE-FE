import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import ApplicantCard from "../components/ApplicantCard";
import Header from "../../../components/Header";
import { getApplicantsByPostId } from "../../../api/applicationApi";
import { useApplicationStore } from "../store/useApplicationStore";
import { useEffect, useState } from "react";

const ApplicantPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const { applicants, setApplicants, setCurrentPost } = useApplicationStore();
  const [isSharing, setIsSharing] = useState(false);
  const memberId = location.state?.memberId;
  // 전달받은 title이 없으면 기본값 표시
  const title = location.state?.headerTitle || "지원 현황 상세";
  const helpCategoryIds: number[] = location.state?.helpCategoryIds ?? [];

  useEffect(() => {
    if (postId) {
      setCurrentPost({
        postId,
        postTitle: title,
        helpCategoryIds,
      });
    }

    getApplicantsByPostId({
      postId,
    }).then((res) => {
      setApplicants(res.data.applicants);
    });
  }, [postId, memberId, title, helpCategoryIds, setCurrentPost, setApplicants]);

  return (
    <Container
      role="region"
      aria-label={`${title} 페이지, 지원자 목록을 확인할 수 있습니다`}
    >
      <Section>
        <Header onBack={() => navigate(-1)} title={title} showBack />

        <FilterSection role="tablist " aria-label="지원자 필터">
          <button
            role="tab"
            aria-selected={!isSharing}
            aria-controls="applicant-list"
            className={!isSharing ? "active" : ""}
            onClick={() => setIsSharing(false)}
          >
            전체
          </button>

          <button
            role="tab"
            aria-selected={isSharing}
            aria-controls="applicant-list"
            className={isSharing ? "active" : ""}
            onClick={() => setIsSharing(true)}
          >
            나눔
          </button>
        </FilterSection>
      </Section>

      <PostList
        id="applicant-list"
        role="list"
        aria-label={
          isSharing ? "나눔으로 지원한 지원자 목록" : "전체 지원자 목록"
        }
      >
        <ApplicantCard applicants={applicants} isSharing={isSharing} />
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
