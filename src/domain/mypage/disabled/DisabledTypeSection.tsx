import styled from "styled-components";
import AddButton from "../../../components/AddButton";
import {
  ResumContainer,
  ResumeItem,
  Indicator,
  ResumeContent,
  ResumeYear,
  ResumeTitle,
} from "../style/MyPageSTyle";
const DisabledTypeSection = () => {
  const disabled = [
    {
      id: 1,
      step: "2급",
      title: "지체 장애",
      active: true,
    },
  ];

  return (
    <Container>
      <Title>장애 유형</Title>

      <ResumContainer>
        {disabled.map((disable) => (
          <ResumeItem key={disable.id}>
            <Indicator $active={disable.active} />
            <ResumeContent>
              <ResumeYear>{disable.step}</ResumeYear>
              <ResumeTitle>{disable.title}</ResumeTitle>
              <ResumeText>아 증말 불편하요</ResumeText>
            </ResumeContent>
          </ResumeItem>
        ))}{" "}
        <AddButton />
      </ResumContainer>
    </Container>
  );
};

export default DisabledTypeSection;
const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 16px;
  background-color: ${({ theme }) => theme.color.white};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
  margin-bottom: 24px;
`;

const ResumeText = styled.span`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.text};
`;
