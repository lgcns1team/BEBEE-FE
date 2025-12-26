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
        memberId,
        setMemberId,
        reset,
    } = store;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ocrData, setOcrData] = useState({
        name: "",
        birth: "",
        title: "",
        regno: "",
        hours: "",
        disabilityType: "",
    });

    useEffect(() => {
        const fetchOcr = async () => {
            if (!uploadedFile) {
                setIsLoading(false);
                return;
            }

            try {
                const result = await extractOcr(uploadedFile, role || "DISABLED");
                const extractedName = result.fields?.name || "";
                const extractedBirth = result.fields?.birth || "";

                setOcrData({
                    name: extractedName,
                    birth: extractedBirth,
                    title: result.fields?.title || "",
                    regno: result.fields?.regno || "",
                    hours: result.fields?.hours || "",
                    disabilityType: result.fields?.disability_type || "",
                });
            } catch (error) {
                console.error("OCR 분석 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOcr();
    }, [uploadedFile, role, name, birthDate]);

    // 데이터 일치 여부 확인 (이름은 띄어쓰기 제거 후 비교)
    const normalizedName = name?.replace(/\s/g, "") || "";
    const normalizedOcrName = ocrData.name?.replace(/\s/g, "") || "";
    const isNameMismatch = ocrData.name !== "" && normalizedName !== normalizedOcrName;

    // 생년월일 비교 (숫자만 추출)
    const cleanBirth = birthDate?.replace(/[^0-9]/g, "") || "";
    const cleanOcrBirth = ocrData.birth?.replace(/[^0-9]/g, "") || "";
    const isBirthMismatch = ocrData.birth !== "" && cleanBirth !== cleanOcrBirth;

    const isMismatch = isNameMismatch || isBirthMismatch;

    const handleNext = async () => {
        if (isMismatch) {
            navigate("/signup/step5");
            return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true);
        // ... (이후 동일)

        try {
            let currentMemberId = memberId;

            // 1. 회원가입 API 호출 (이미 ID가 있는 경우 스킵하 중복가입 방지)
            if (!currentMemberId) {
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
                currentMemberId = signUpRes.memberId;
                if (currentMemberId) {
                    setMemberId(currentMemberId);
                }
            }

            // 2. 문서 업로드 및 분석
            if (uploadedFile && currentMemberId) {
                const uploadRes = await uploadDocument(currentMemberId, uploadedFile);
                const systemFlag = uploadRes.systemFlag;

                if (systemFlag === "HIGH") {
                    alert("문서 인식이 실패했거나 위변조가 의심됩니다. 선명한 원본 사진으로 다시 업로드해 주세요.");
                    navigate("/signup/step5");
                    return;
                }

                if (systemFlag === "LOW") {
                    alert("가입 및 서류 승인이 완료되었습니다!");
                    reset();
                    navigate("/signup/complete?status=success");
                } else {
                    alert("서류가 접수되었습니다. 관리자 확인 후 승인될 예정입니다.");
                    reset();
                    navigate("/signup/complete?status=pending");
                }
            }
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

                    <FormContainer>
                        <GeneralInput
                            inputLabel="성함"
                            value={ocrData.name || (isLoading ? "분석 중..." : "인식 불가")}
                            onChange={() => { }}
                            disabled
                        />
                        {isNameMismatch && (
                            <ErrorMessage>가입 정보({name})와 일치하지 않습니다.</ErrorMessage>
                        )}

                        <GeneralInput
                            inputLabel="생년월일"
                            value={ocrData.birth || (isLoading ? "분석 중..." : "인식 불가")}
                            onChange={() => { }}
                            disabled
                        />
                        {isBirthMismatch && (
                            <ErrorMessage>가입 정보({birthDate})와 일치하지 않습니다.</ErrorMessage>
                        )}

                        {role === "HELPER" && (
                            <>
                                <GeneralInput
                                    inputLabel="등록번호"
                                    value={ocrData.regno || (isLoading ? "분석 중..." : "인식 불가")}
                                    onChange={() => { }}
                                    disabled
                                />
                                <GeneralInput
                                    inputLabel="자격명"
                                    value={ocrData.title || (isLoading ? "분석 중..." : "인식 불가")}
                                    onChange={() => { }}
                                    disabled
                                />
                                <GeneralInput
                                    inputLabel="이수시간"
                                    value={ocrData.hours ? `${ocrData.hours}시간` : (isLoading ? "분석 중..." : "인식 불가")}
                                    onChange={() => { }}
                                    disabled
                                />
                            </>
                        )}

                        {role === "DISABLED" && (
                            <GeneralInput
                                inputLabel="장애유형"
                                value={ocrData.disabilityType || (isLoading ? "분석 중..." : "인식 불가")}
                                onChange={() => { }}
                                disabled
                            />
                        )}
                    </FormContainer>

                    {isMismatch ? (
                        <WarningBox>
                            <InfoText style={{ fontWeight: 700, color: '#d32f2f' }}>⚠️ 정보가 일치하지 않습니다.</InfoText>
                            <InfoText>서류를 다시 확인하거나 선명한 사진을 올려주세요.</InfoText>
                        </WarningBox>
                    ) : (
                        <InfoBox>
                            <InfoText>📋 인식된 정보가 실제와 다른 경우 반려될 수 있습니다.</InfoText>
                            <InfoText>⏱️ 관리자 검토는 보통 1-2일 소요됩니다.</InfoText>
                        </InfoBox>
                    )}
                </ScrollArea>

                <BaseLongButton
                    label={isMismatch ? "서류 다시 업로드하기" : (isSubmitting ? "처리 중..." : "가입 완료")}
                    onClick={handleNext}
                    disabled={(isSubmitting || isLoading) && !isMismatch}
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

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

const ErrorMessage = styled.p`
  font-size: 0.75rem;
  color: #d32f2f;
  margin-top: -1rem;
  margin-left: 0.25rem;
`;

const WarningBox = styled(InfoBox)`
  background-color: #fff0f0;
  border: 1px solid #ffcdd2;
`;
