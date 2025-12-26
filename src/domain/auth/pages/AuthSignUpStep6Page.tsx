import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Layout from "../../../components/Layout";
import BaseLongButton from "../../../components/BaseLongButton";
import GeneralInput from "../../../components/GeneralInput";
import AuthSignUpHeader from "../components/AuthSignUpHeader";
import { useAuthSignUpForm } from "../../../store/useAuthSignUpStore";
import { signUpUser } from "../../../api/authApi";
import { extractOcr } from "../../../api/ocrApi";
import { uploadDocument } from "../../../api/documentApi";
import type { SignUpRequest } from "../auth.types";

const AuthSignUpStep6Page = () => {
    const navigate = useNavigate();
    const store = useAuthSignUpForm();
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
        uploadedFile,
        reset,
    } = store;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ocrData, setOcrData] = useState({
        name: "",
        birth: "",
        title: "",
        date: "",
        extraLabel: "",
        extraValue: "",
    });

    useEffect(() => {
        const fetchOcr = async () => {
            if (!uploadedFile) {
                setIsLoading(false);
                return;
            }

            try {
                // OCR 전용 API 호출
                console.log("OCR 분석 요청 시작 (role: " + (role || "DISABLED") + ")");
                const result = await extractOcr(uploadedFile, role || "DISABLED");
                console.log("OCR 분석 결과 수신:", result);

                setOcrData({
                    name: result.names?.[0] || name || "확인 불가",
                    birth: birthDate || "확인 불가",
                    title: result.fields?.title || (role === "HELPER" ? "이수증" : "장애인 증명서"),
                    date: new Date().toISOString().split('T')[0],
                    extraLabel: role === "HELPER" ? "이수 시간" : "장애 유형",
                    extraValue: role === "HELPER"
                        ? (result.fields?.hours || "시간 확인 불가")
                        : (result.fields?.disability_type || "유형 확인 불가"),
                });
            } catch (error) {
                console.error("OCR 분석 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOcr();
    }, [uploadedFile, role, name, birthDate]);

    const handleNext = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // 1. 회원가입 API 호출
            const signUpParams: SignUpRequest = {
                email,
                password,
                name,
                nickname,
                birthDate,
                gender,
                phoneNumber,
                role: role!,
                addressRoad,
                latitude,
                longitude,
                districtCode,
            };

            const signUpRes = await signUpUser(signUpParams);
            const memberId = signUpRes.memberId;

            // 2. 문서 업로드 API 호출 (분석 및 회원 승인 포함)
            if (uploadedFile && memberId) {
                await uploadDocument(memberId, 1, uploadedFile);
            }

            alert("회원가입이 완료되었습니다!");
            reset();
            navigate("/signup/complete");
        } catch (error) {
            alert("회원가입 처리 중 오류가 발생했습니다.");
            console.error(error);
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
                        업로드한 서류 정보를 확인해 주세요. {isLoading && "(분석 중...)"}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <GeneralInput
                            inputLabel="성함"
                            value={ocrData.name}
                            onChange={() => { }}
                            disabled
                        />
                        <GeneralInput
                            inputLabel="생년월일"
                            value={ocrData.birth}
                            onChange={() => { }}
                            disabled
                        />
                        <GeneralInput
                            inputLabel="서류 종류"
                            value={ocrData.title}
                            onChange={() => { }}
                            disabled
                        />
                        {ocrData.extraLabel && (
                            <GeneralInput
                                inputLabel={ocrData.extraLabel}
                                value={ocrData.extraValue}
                                onChange={() => { }}
                                disabled
                            />
                        )}
                    </div>

                    <InfoBox>
                        <InfoText>📋 인식된 정보가 실제와 다른 경우 반려될 수 있습니다.</InfoText>
                        <InfoText>⏱️ 관리자 검토는 보통 1-2일 소요됩니다.</InfoText>
                    </InfoBox>
                </ScrollArea>

                <BaseLongButton
                    label={isSubmitting ? "처리 중..." : "가입 완료"}
                    onClick={handleNext}
                    disabled={isSubmitting || isLoading}
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

const InfoText = styled.p`
  font-size: 0.875rem;
  color: #855d1d;
  margin: 0.25rem 0;
  line-height: 1.4;
`;
