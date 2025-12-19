import styled from "styled-components";
import Layout from "../../../components/Layout";
import PostStatusItem from "../components/PostStatusItem";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";

const ApplicateStatusPage = () => {
  const navigate = useNavigate();

  return (
    <Layout bg>
      <Header bg onBack={() => navigate(-1)} title="지원 현황" />
      <Container>
        <Box>
          <SectionTitle>전체 지원 현황</SectionTitle>
          <TotalSection>
            <TotalItem>
              <span>지원자 수</span>
              <TotalCount>21명</TotalCount>
            </TotalItem>
            <TotalItem>
              <span>나늠</span>
              <TotalCount>4명</TotalCount>
            </TotalItem>
          </TotalSection>
        </Box>
        <Box>
          <SectionTitle>지원 확인하기</SectionTitle>
          <PostStatusItem />
        </Box>
      </Container>
    </Layout>
  );
};

export default ApplicateStatusPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;
const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
`;
const TotalSection = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
`;
const TotalItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 24px;
`;
const TotalCount = styled.span`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
`;
