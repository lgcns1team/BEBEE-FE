import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Layout from "../../../components/Layout";
import GeneralInput from "../../../components/GeneralInput";
import PasswordInput from "../components/PasswordInput";
import BaseLongButton from "../../../components/BaseLongButton";
import { Toast } from "../../../components/Toast";
import logoIcon from "../../../assets/images/icon.png";
import logoText from "../../../assets/images/application.png";
import { loginUser, getMyInfo } from "../../../api/authApi";
import { useUserStore } from "../../../store/useUserStore";
import { useToastStore } from "../../../store/useToastStore";
import { getErrorMessage } from "../../../utils/error";
import type { LoginRequest } from "../auth.types";
import { PASSWORD_REGEX } from "../auth.constants";

const AuthLoginPage = () => {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useUserStore();
  const { showToast } = useToastStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const loginParams: LoginRequest = { email, password };
      const response = await loginUser(loginParams);

      // Access Token을 Zustand store에 저장 (메모리)
      // Refresh Token은 HttpOnly 쿠키로 자동 저장됨
      setAccessToken(response.accessToken);

      // 내 정보 조회하여 Store에 저장
      const myInfo = await getMyInfo();
      // 백엔드 응답(role: string)을 프론트엔드 타입('DISABLED' | 'HELPER' | 'ADMIN')으로 단언
      setUser({
        ...myInfo,
        role: myInfo.role as "DISABLED" | "HELPER" | "ADMIN",
      });

      // 로그인 성공 시 Toast 표시 후 메인 페이지로 이동
      showToast("로그인 성공!", "SUCCESS");
      setTimeout(() => {
        navigate("/home", { replace: true });
      }, 100);
    } catch (error) {
      getErrorMessage(error, "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
      showToast(
        "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.",

        "ERROR"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Toast />
      <LogoContainer>
        <LogoIcon src={logoIcon} alt="Bebee Icon" />
        <LogoText src={logoText} alt="Bebee Logo" />
        <SubTitle>꿀벌들의 달콤한 동행</SubTitle>
      </LogoContainer>

      <FormContainer>
        <GeneralInput
          inputLabel="아이디"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          inputLabel="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormContainer>
      <LoginButtonWrapper>
        <BaseLongButton
          label="로그인"
          onClick={handleLogin}
          disabled={!email || !password || !new RegExp(PASSWORD_REGEX).test(password)}
        />
      </LoginButtonWrapper>
      <UtilContainer>
        <UtilLink onClick={() => {}}>아이디 찾기</UtilLink>
        <Divider>|</Divider>
        <UtilLink onClick={() => {}}>비밀번호 찾기</UtilLink>
        <Divider>|</Divider>
        <SignUpLink onClick={() => navigate("/signup/step1")}>회원가입</SignUpLink>
      </UtilContainer>
    </Layout>
  );
};

export default AuthLoginPage;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 0;
  padding-top: 5rem;
  flex-shrink: 0;
  user-select: none;
`;

const LogoIcon = styled.img`
  width: 70px;
  height: auto;
  margin-bottom: 1.5rem;
`;

const LogoText = styled.img`
  width: 130px;
  height: auto;
`;

const SubTitle = styled.p`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.subText2};
  margin: 0.75rem 0 0 0;
  font-family: "Paperlogy";
`;

const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  justify-content: center;
`;

const LoginButtonWrapper = styled.div`
  margin-top: 0.75rem;
  padding-bootom: 30px;
`;

const UtilContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2rem;
  gap: 0.75rem;
  flex-shrink: 0;
  padding-bottom: 0.5rem;
`;

const UtilLink = styled.span`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.text};
  }
`;

const Divider = styled.span`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.natural200};
  user-select: none;
`;

const SignUpLink = styled(UtilLink)`
  color: ${({ theme }) => theme.color.text};
  font-weight: ${({ theme }) => theme.weight.medium};

  &:hover {
    color: ${({ theme }) => theme.color.main};
  }
`;
