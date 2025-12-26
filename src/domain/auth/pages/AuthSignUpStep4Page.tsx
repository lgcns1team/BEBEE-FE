import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Layout from "../../../components/Layout";
import BaseLongButton from "../../../components/BaseLongButton";
import Badge from "../../../components/Badge";
import GeneralInput from "../../../components/GeneralInput";
import AuthSignUpHeader from "../components/AuthSignUpHeader";
import {
    FieldSet,
    ModalLabel,
    RequiredMark,
} from "../../../styles/FieldSetStyle";
import { useAuthSignUpForm } from "../../../store/useAuthSignUpStore";

// TODO: 실제 도움 태그는 constants에서 가져오기
const HELP_TAGS = [
    "외출동행",
    "방문목욕",
    "방문간호",
    "가사지원",
    "기타생활지원",
    "정서적 지원",
    "학습지원",
    "식사도움",
];

const AuthSignUpStep4Page = () => {
    const navigate = useNavigate();
    const { role, setHelpTypes, setDisabilityInfo } = useAuthSignUpForm();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [disabilityType, setDisabilityType] = useState("");
    const [disabilityDescription, setDisabilityDescription] = useState("");

    const handleTagClick = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const handleNext = () => {
        // Zustand store에 저장
        if (role === "HELPER") {
            setHelpTypes(selectedTags);
        } else {
            setDisabilityInfo(disabilityType, disabilityDescription);
        }
        navigate("/signup/step5");
    };

    const isFormValid =
        role === "HELPER"
            ? selectedTags.length > 0
            : disabilityType !== "" && disabilityDescription !== "";

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
                                {HELP_TAGS.map((tag) => (
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
                        // 장애인: 장애 정보 입력
                        <>
                            <GeneralInput
                                inputLabel="장애 유형"
                                placeholder="예: 지체장애, 시각장애 등"
                                value={disabilityType}
                                onChange={(e) => setDisabilityType(e.target.value)}
                                required
                            />

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
