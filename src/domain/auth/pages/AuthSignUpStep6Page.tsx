import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Layout from "../../../components/Layout";
import BaseLongButton from "../../../components/BaseLongButton";
import AuthSignUpHeader from "../components/AuthSignUpHeader";
import { useAuthSignUpForm } from "../../../store/useAuthSignUpStore";
import { signUpUser } from "../../../api/authApi";
import type { SignUpRequest } from "../auth.types";

const AuthSignUpStep6Page = () => {
    const navigate = useNavigate();
    const location = useLocation();
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
        systemFlag,
        reset,
    } = useAuthSignUpForm();

    const [isSubmitting, setIsSubmitting] = useState(false);

    // systemFlag가 없으면 이전 단계로
    if (!systemFlag) {
        navigate("/signup/step5");
        return null;
    }

    // HIGH인 경우 재업로드 안내
    if (systemFlag === "HIGH") {
        return (
            <Layout>
                <AuthSignUpHeader
                    currentStep={6}
                    totalSteps={6}
                    onBack={() => navigate("/signup/step5")}
                />
                <PageContainer>
                    <ScrollArea>
                        <Title>서류 확인이 필요해요</Title>
                        <WarningBox>
                            <InfoText style={{ fontWeight: 700, color: '#d32f2f' }}>
                                ⚠️ 문서 인식이 실패했거나 위변조가 의심됩니다.
                            </InfoText>
                            <InfoText>선명한 원본 사진으로 다시 업로드해 주세요.</InfoText>
                        </WarningBox>
                    </ScrollArea>
                    <BaseLongButton
                        label="서류 다시 업로드하기"
                        onClick={() => navigate("/signup/step5")}
                    />
                </PageContainer>
            </Layout>
        );
    }

    // LOW/MID인 경우 회원가입 진행
    const handleSignUp = async () => {
        if (!role) {
            alert("역할이 선택되지 않았습니다. 처음부터 다시 시도해 주세요.");
            navigate("/signup/step1");
            return;
        }
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // 회원가입 (fileUrl, systemFlag 포함)
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
                systemFlag: systemFlag || undefined,
            };

            await signUpUser(signUpParams);

            // 성공 메시지 및 로그인 페이지로 이동
            if (systemFlag === "LOW") {
                alert("가입 및 서류 승인이 완료되었습니다!");
            } else {
                // MID
                alert("서류가 접수되었습니다. 관리자 확인 후 승인될 예정입니다.");
            }

            // navigate를 먼저 실행하여 로그인 페이지로 이동
            // reset은 navigate 후 충분한 딜레이를 두고 호출 (다른 Step 페이지의 useEffect 실행 방지)
            navigate("/login", { replace: true });
            setTimeout(() => {
                reset();
            }, 1000); // 1초 딜레이로 로그인 페이지 렌더링 완료 후 reset
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

                    {systemFlag === "LOW" ? (
                        <SuccessBox>
                            <InfoText>✅ 서류가 정상적으로 확인되었습니다.</InfoText>
                            <InfoText>가입 완료 후 바로 서비스를 이용하실 수 있습니다.</InfoText>
                        </SuccessBox>
                    ) : (
                        <InfoBox>
                            <InfoText>📋 서류가 접수되었습니다.</InfoText>
                            <InfoText>⏱️ 관리자 검토 후 승인될 예정입니다. (보통 1-2일 소요)</InfoText>
                        </InfoBox>
                    )}
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

export default AuthSignUpStep6Page;

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

const InfoBox = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #fff9f0;
  border-radius: 12px;
  border: 1px solid #fee2b3;
`;

const SuccessBox = styled(InfoBox)`
  background-color: #f0fff4;
  border: 1px solid #9ae6b4;
`;

const WarningBox = styled(InfoBox)`
  background-color: #fff0f0;
  border: 1px solid #ffcdd2;
`;

const InfoText = styled.p`
  font-size: 0.875rem;
  color: #855d1d;
  margin: 0.25rem 0;
  line-height: 1.4;
`;
