import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Layout from "../../../components/Layout";
import BaseLongButton from "../../../components/BaseLongButton";
import Badge from "../../../components/Badge";
import AuthSignUpHeader from "../components/AuthSignUpHeader";
import {
  FieldSet,
  ModalLabel,
  RequiredMark,
} from "../../../styles/FieldSetStyle";
import { useAuthSignUpForm } from "../../../store/useAuthSignUpStore";
import { HELP_TAG_NAMES } from "../../../constants/helpTags";
import { DISABILITY_TYPE } from "../../../constants/disabilityTypes";
import { DISABILITY_GRADES } from "../../../constants/disabilityGrades";

const AuthSignUpStep4Page = () => {
  const navigate = useNavigate();
  const { role, setHelpTypes, setDisabilityInfo } = useAuthSignUpForm();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDisabilityType, setSelectedDisabilityType] = useState("");
  const [selectedDisabilityGrade, setSelectedDisabilityGrade] = useState("");
  const [disabilityDescription, setDisabilityDescription] = useState("");

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDisabilityTypeClick = (type: string) => {
    setSelectedDisabilityType(type);
  };

  const handleDisabilityGradeClick = (grade: string) => {
    setSelectedDisabilityGrade(grade);
  };

  const handleNext = () => {
    // Zustand store에 저장
    if (role === "HELPER") {
      setHelpTypes(selectedTags);
    } else {
      // 장애인: 도움 유형 + 장애 정보 모두 저장
      setHelpTypes(selectedTags);
      setDisabilityInfo(selectedDisabilityType, selectedDisabilityGrade, disabilityDescription);
    }
    navigate("/signup/step5");
  };

  const isFormValid =
    role === "HELPER"
      ? selectedTags.length > 0
      : selectedTags.length > 0 && selectedDisabilityType !== "" && selectedDisabilityGrade !== "" && disabilityDescription !== "";

  return (
    <Layout>
      <AuthSignUpHeader
        currentStep={4}
        totalSteps={5}
        onBack={() => navigate("/signup/step3")}
      />
      <PageContainer>
        <ScrollArea>
          {role === "HELPER" ? (
            // 도우미: 도움 유형 선택
            <FieldSet>
              <ModalLabel>
                어떤 도움을 줄 수 있나요?
                <RequiredMark>*</RequiredMark>
              </ModalLabel>
              <Row>
                {HELP_TAG_NAMES.map((tag) => (
                  <Badge
                    key={tag}
                    $active={selectedTags.includes(tag)}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </Row>
            </FieldSet>
          ) : (
            // 장애인: 도움 유형 선택 + 장애 정보 입력
            <>
              <FieldSet>
                <ModalLabel>
                  어떤 도움이 필요하신가요?
                  <RequiredMark>*</RequiredMark>
                </ModalLabel>
                <Row>
                  {HELP_TAG_NAMES.map((tag) => (
                    <Badge
                      key={tag}
                      $active={selectedTags.includes(tag)}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </Row>
              </FieldSet>

              <FieldSet>
                <ModalLabel>
                  장애 유형<RequiredMark>*</RequiredMark>
                </ModalLabel>
                <Row>
                  {DISABILITY_TYPE.map((type) => (
                    <Badge
                      key={type}
                      $active={selectedDisabilityType === type}
                      onClick={() => handleDisabilityTypeClick(type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </Row>
              </FieldSet>

              <FieldSet>
                <ModalLabel>
                  장애 등급<RequiredMark>*</RequiredMark>
                </ModalLabel>
                <Row>
                  {DISABILITY_GRADES.map((grade) => (
                    <Badge
                      key={grade.value}
                      $active={selectedDisabilityGrade === grade.value}
                      onClick={() => handleDisabilityGradeClick(grade.value)}
                    >
                      {grade.label}
                    </Badge>
                  ))}
                </Row>
              </FieldSet>

              <FieldSet>
                <ModalLabel>
                  장애 상세 설명<RequiredMark>*</RequiredMark>
                </ModalLabel>
                <Textarea
                  placeholder="장애 정도와 필요한 도움을 자세히 설명해주세요"
                  value={disabilityDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setDisabilityDescription(e.target.value)
                  }
                  rows={6}
                />
              </FieldSet>
            </>
          )}
        </ScrollArea>
      </PageContainer>
      <BaseLongButton
        label="다음"
        onClick={handleNext}
        disabled={!isFormValid}
      />
    </Layout>
  );
};

export default AuthSignUpStep4Page;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const Textarea = styled.textarea`
  width: 100%;
  font-size: ${({ theme }) => theme.size.md};
  padding: 1rem;
  border: 0.5px solid ${({ theme }) => theme.color.subText3};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.text};
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.main};
  }

  &::placeholder {
    color: ${({ theme }) => theme.color.subText3};
  }
`;
