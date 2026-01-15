import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BaseLongButton from "../../../components/BaseLongButton";
import application from "../../../assets/images/application.png";
import { useApplicationStore } from "../../Application/store/useApplicationStore";
import { useEffect } from "react";
import { getApplicationPosts } from "../../../api/applicationApi";

const ApplicationStatusSection = () => {
  const navigate = useNavigate();
  const { posts, setPosts } = useApplicationStore();

  const totalApplicantCount = posts.reduce(
    (sum, post) => sum + post.commonApplicantCount + post.volunteerApplicantCount,
    0
  );
  useEffect(() => {
    getApplicationPosts().then((res) => {
      setPosts(res.data.posts);
    });
  }, [setPosts]);

  return (
    <Container>
      <Box>
        <Info role="button" tabIndex={0} aria-label={`지원 현황을 확인해 보세요. 총 ${totalApplicantCount}명의 지원자가 있습니다.`}>
          <TextContainer aria-hidden="true">
            <Title>지원 현황 확인하기</Title>
            <SubTitle>
              총 {totalApplicantCount}명의
              <br />
              지원자가 있어요
            </SubTitle>
          </TextContainer>
          <ImgContainer aria-hidden="true"></ImgContainer>
        </Info>
        <div style={{ height: "0.5rem" }} />
        <BaseLongButton
          onClick={() => navigate("/applicate-landing")}
          label="보러가기"
          aria-label="지원자를 확인하려면 두번 탭하세요"
        ></BaseLongButton>
      </Box>
    </Container>
  );
};

export default ApplicationStatusSection;

const Container = styled.main`
  width: 100%;
  background-color: ${({ theme }) => theme.color.white};
  padding: 16px;
`;
const Box = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: ${({ theme }) => theme.color.subColor2};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;
const Info = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 20px;
`;
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Title = styled.span`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.main};
`;
const SubTitle = styled.span`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
  font-family: "Paperlogy";
`;
const ImgContainer = styled.div`
  width: 100px;
  height: 100px;
  background-image: url(${application});
  background-size: cover;
  background-position: center;
`;
