import styled from "styled-components";
import { useState } from "react";
import AddButton from "../../../components/AddButton";
import {
  ResumContainer,
  ResumeItem,
  Indicator,
  ResumeContent,
  ResumeYear,
  ResumeTitle,
} from "../style/MyPageSTyle";

const CareerSection = () => {
  const [activeTab, setActiveTab] = useState("이수증");
  const resumes = [
    {
      id: 1,
      year: "2024 취득",
      title: "활동지원사 이수증",
      active: true,
    },
    {
      id: 2,
      year: "2024 취득",
      title: "당신대박 이수증",
      active: false,
    },
  ];

  return (
    <Container>
      <Title>이력 정보</Title>

      <TabContainer>
        <Tab
          $active={activeTab === "이수증"}
          onClick={() => setActiveTab("이수증")}
        >
          이수증
        </Tab>
        <Tab
          $active={activeTab === "자격증"}
          onClick={() => setActiveTab("자격증")}
        >
          자격증
        </Tab>
        <Tab
          $active={activeTab === "근무 이력"}
          onClick={() => setActiveTab("근무 이력")}
        >
          근무 이력
        </Tab>
      </TabContainer>
      <ResumContainer>
        {resumes.map((resume) => (
          <ResumeItem key={resume.id}>
            <Indicator $active={resume.active} />
            <ResumeContent>
              <ResumeYear>{resume.year}</ResumeYear>
              <ResumeTitle>{resume.title}</ResumeTitle>
            </ResumeContent>
          </ResumeItem>
        ))}{" "}
        <AddButton />
      </ResumContainer>
    </Container>
  );
};

export default CareerSection;
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

const TabContainer = styled.div`
  display: flex;
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 32px;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px 12px;
  border: none;
  background-color: ${({ theme, $active }) =>
    $active ? theme.color.white : theme.color.natural100};
  color: ${({ theme, $active }) =>
    $active ? theme.color.text : theme.color.subText2};
  font-size: ${({ theme }) => theme.size.md};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
`;
