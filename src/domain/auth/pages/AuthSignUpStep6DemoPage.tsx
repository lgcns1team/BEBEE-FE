import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Layout from "../../../components/Layout";
import BaseLongButton from "../../../components/BaseLongButton";
import AuthSignUpHeader from "../components/AuthSignUpHeader";
import GeneralInput from "../../../components/GeneralInput";
import { useAuthSignUpForm } from "../../../store/useAuthSignUpStore";
import { signUpUser } from "../../../api/authApi";
import type { SignUpRequest } from "../auth.types";

/**
 * 시연용 Step 6 페이지 - OCR 필드값 하드코딩
 */
const AuthSignUpStep6DemoPage = () => {
    const navigate = useNavigate();
    const {
        role,
        email,
        password,
        name,
        nickname,
        birthDate,
        gender,
        phoneNumber,
        addressRoad,
        latitude,
        longitude,
        districtCode,
        helpTypes,
        disabilityType,
        disabilityGrade,
        disabilityDescription,
        fileUrl,
        reset,
    } = useAuthSignUpForm();

    const [isSubmitting, setIsSubmitting] = useState(false);

    // 시연용 하드코딩 OCR 필드 (HELPER)
    const demoOcrFields = {
        title: "활동지원사 교육 이수증",
        name: "이원희",
        birth: "1984-06-26",
        hours: "50",
        regno: "제24-전문-123"
    };

    // 시연용 systemFlag (LOW = 자동 통과)
    const demoSystemFlag = "LOW";

    const handleSignUp = async () => {
        if (!role) {
            alert("역할이 선택되지 않았습니다. 처음부터 다시 시도해 주세요.");
            navigate("/signup/step1");
            return;
        }
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const signUpParams: SignUpRequest = {
                email,
                password,
                name,
                nickname,
                birthDate,
                gender,
                phoneNumber,
                role,
                addressRoad,
                latitude,
                longitude,
                districtCode,
                helpTypes,
                disabilityType,
                disabilityGrade: disabilityGrade || undefined,
                disabilityDescription,
                fileUrl: fileUrl || undefined,
                systemFlag: demoSystemFlag,
            };

            await signUpUser(signUpParams);

            if (demoSystemFlag === "LOW") {
                alert("가입 및 서류 승인이 완료되었습니다!");
            } else {
                alert("서류가 접수되었습니다. 관리자 확인 후 승인될 예정입니다.");
            }

            navigate("/login", { replace: true });
            setTimeout(() => {
                reset();
            }, 1000);
        } catch (error) {
            console.error("회원가입 실패:", error);
            alert("회원가입 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <AuthSignUpHeader
                currentStep={6}
                totalSteps={6}
                onBack={() => navigate("/signup/step5")}
            />
            <PageContainer>
                <ScrollArea>
                    <Title>마지막 단계예요!</Title>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>
                        서류 확인이 완료되었습니다.
                    </p>

                    <SuccessBox>
                        <InfoText>✅ 서류가 정상적으로 확인되었습니다.</InfoText>
                        <InfoText>가입 완료 후 바로 서비스를 이용하실 수 있습니다.</InfoText>
                    </SuccessBox>

                    {/* OCR 추출 결과 표시 - 하드코딩 */}
                    <OcrFieldsContainer>
                        <OcrSectionTitle>인식된 정보</OcrSectionTitle>

                        <GeneralInput
                            inputLabel="문서종류"
                            value={demoOcrFields.title}
                            disabled
                        />

                        <GeneralInput
                            inputLabel="성명"
                            value={demoOcrFields.name}
                            disabled
                        />

                        <GeneralInput
                            inputLabel="생년월일"
                            value={demoOcrFields.birth}
                            disabled
                        />

                        <GeneralInput
                            inputLabel="이수시간"
                            value={`${demoOcrFields.hours}시간`}
                            disabled
                        />

                        <GeneralInput
                            inputLabel="등록번호"
                            value={demoOcrFields.regno}
                            disabled
                        />
                    </OcrFieldsContainer>
                </ScrollArea>

                <BaseLongButton
                    label={isSubmitting ? "처리 중..." : "가입 완료"}
                    onClick={handleSignUp}
                    disabled={isSubmitting}
                />
            </PageContainer>
        </Layout>
    );
};

export default AuthSignUpStep6DemoPage;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  padding: 0 1.25rem 2rem;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-top: 1rem;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.color.text};
  margin-bottom: 0.5rem;
`;

const SuccessBox = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f0fff4;
  border-radius: 12px;
  border: 1px solid #9ae6b4;
`;

const InfoText = styled.p`
  font-size: 0.875rem;
  color: #855d1d;
  margin: 0.25rem 0;
  line-height: 1.4;
`;

const OcrFieldsContainer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const OcrSectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.color.text};
  margin-bottom: 0.5rem;
`;
