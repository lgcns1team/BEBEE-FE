import styled from "styled-components";
import BaseLongButton from "../../../components/BaseLongButton";
import application from "../../../assets/images/application.png";
const ApplicationStatusSection = () => {
  return (
    <ApplicateContainer>
      <Info>
        <TextContainer>
          <Title>지원 현황 확인하기</Title>
          <SubTitle>총 21명의</SubTitle>
          <SubTitle> 지원자가 있어요</SubTitle>
        </TextContainer>
        <ImgContainer></ImgContainer>
      </Info>

      <BaseLongButton label="보러가기"></BaseLongButton>
    </ApplicateContainer>
  );
};

export default ApplicationStatusSection;

const ApplicateContainer = styled.div`
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
  padding-top: 16px;
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
`;
const ImgContainer = styled.div`
  width: 120px;
  height: 120px;
  background-image: url(${application});
  background-size: cover;
  background-position: center;
`;
