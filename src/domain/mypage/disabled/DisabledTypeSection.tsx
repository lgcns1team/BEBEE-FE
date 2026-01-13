import styled from "styled-components";
import { useEffect } from "react";
import AddButton from "../../../components/AddButton";
import {
  ResumContainer,
  ResumeItem,
  Indicator,
  ResumeContent,
  ResumeYear,
  ResumeTitle,
} from "../style/MyPageStyle";
import { useMemberStore } from "../../../store/useMemberStore";

const DisabledTypeSection = () => {
  const { member, fetchMember } = useMemberStore();

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  const disabilityType = member?.disabilityType || "";
  const disabilityDescription = member?.disabilityDescription || "";

  if (!disabilityType) {
    return (
      <Container>
        <Title>장애 유형</Title>
        <ResumContainer>
          <AddButton />
        </ResumContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Title>장애 유형</Title>

      <ResumContainer>
        <ResumeItem>
          <Indicator $active={true} />
          <ResumeContent>
            <ResumeYear>급수</ResumeYear>
            <ResumeTitle>{disabilityType}</ResumeTitle>
            {disabilityDescription && (
              <ResumeText>{disabilityDescription}</ResumeText>
            )}
          </ResumeContent>
        </ResumeItem>
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
