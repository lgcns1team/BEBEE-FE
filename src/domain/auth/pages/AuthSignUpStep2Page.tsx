import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Layout from "../../../components/Layout";
import BaseLongButton from "../../../components/BaseLongButton";
import GeneralInput from "../../../components/GeneralInput";
import PasswordInput from "../components/PasswordInput";
import AuthSignUpHeader from "../components/AuthSignUpHeader";
// 회원가입 정책 고도화 계획에 중복 체크 API 추가 및 백엔드 검증 로직 강화 내용을 포함합니다.
// #### [MODIFY] [AuthController.java](file:///c:/Users/user/Desktop/BEBEE/BEBEE-BE/member-service/src/main/java/com/lgcns/bebee/member/presentation/AuthController.java)
// - 이메일 중복 체크 엔드포인트 (`GET /auth/check-email`) 추가
// - 닉네임 중복 체크 엔드포인트 (`GET /auth/check-nickname`) 추가
//
// #### [MODIFY] [SignUpUseCase.java](file:///c:/Users/user/Desktop/BEBEE/BEBEE-BE/member-service/src/main/java/com/lgcns/bebee/member/application/usecase/SignUpUseCase.java)
// - 이메일 및 닉네임 중복 체크 로직 강화 (이미 가입된 정보인 경우 예외 발생)
// - `PasswordPolicyValidator`를 통한 비밀번호 규격 검증 적용
import { useAuthSignUpForm } from "../../../store/useAuthSignUpStore";
import { checkEmail } from "../../../api/authApi";

const AuthSignUpStep2Page = () => {
  const navigate = useNavigate();
  const { setAccountInfo } = useAuthSignUpForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    passwordConfirm?: string;
  }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // 백엔드 규격: 대문자, 소문자, 숫자, 특수문자 포함 8~19자
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&])[A-Za-z\d!@#$%&]{8,19}$/;
    return passwordRegex.test(password);
  };

  const handleNext = async () => {
    const newErrors: typeof errors = {};

    // 이메일 검증
    if (!email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!validateEmail(email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    } else {
      // 중복 체크 API 호출
      try {
        const isDuplicated = await checkEmail(email);
        console.log(
          "이메일 중복 체크 결과:",
          isDuplicated,
          typeof isDuplicated
        );
        if (isDuplicated) {
          newErrors.email = "이미 사용 중인 이메일입니다.";
          alert("이미 사용 중인 이메일입니다. 다른 이메일을 입력해주세요.");
        }
      } catch (error) {
        console.error("이메일 중복 체크 실패:", error);
        newErrors.email = "이메일 중복 체크에 실패했습니다.";
        alert("이메일 중복 체크에 실패했습니다. 다시 시도해주세요.");
      }
    }

    // 비밀번호 검증
    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "비밀번호는 대/소문자, 숫자, 특수문자를 포함한 8~19자여야 합니다.";
    }

    // 비밀번호 확인 검증
    if (!passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호 확인을 입력해주세요.";
    } else if (password !== passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    setErrors(newErrors);

    // 에러가 없으면 다음 단계로
    if (Object.keys(newErrors).length === 0) {
      setAccountInfo(email, password);
      navigate("/signup/step3");
    }
  };

  return (
    <Layout>
      <AuthSignUpHeader
        currentStep={2}
        totalSteps={5}
        onBack={() => navigate("/signup/step1")}
      />
      <PageContainer>
        <ScrollArea>
          <GeneralInput
            inputLabel="아이디 (이메일)"
            placeholder="example@bebee.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}

          <PasswordInput
            inputLabel="비밀번호"
            placeholder="8자 이상 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <ErrorText>{errors.password}</ErrorText>}

          <PasswordInput
            inputLabel="비밀번호 확인"
            placeholder="비밀번호를 다시 입력해주세요"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
          {errors.passwordConfirm && (
            <ErrorText>{errors.passwordConfirm}</ErrorText>
          )}
        </ScrollArea>
      </PageContainer>
      <BaseLongButton
        label="다음"
        onClick={handleNext}
        disabled={!email || !password || !passwordConfirm}
      />
    </Layout>
  );
};

export default AuthSignUpStep2Page;

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

const ErrorText = styled.p`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.red500};
  margin-top: -1rem;
  margin-bottom: 1rem;
  padding-left: 0.25rem;
`;
