{
  /* 빌드 오류 (useUSerStroe 없음 해결 필요) import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Layout from "../../../components/Layout";
import GeneralInput from "../../../components/GeneralInput";
import PasswordInput from "../components/PasswordInput";
import BaseLongButton from "../../../components/BaseLongButton";
import logoIcon from "../../../assets/images/icon.png";
import logoText from "../../../assets/images/application.png";
import { loginUser, getMyInfo } from "../../../api/authApi";
import { useUserStore } from "../../../store/useUserStore";
import type { LoginRequest } from "../auth.types";

const AuthLoginPage = () => {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useUserStore();
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

      // 로그인 성공 시 메인 페이지로 이동
      alert("로그인 성공!");
      navigate("/");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <PageContainer>
        <LogoContainer>
          <LogoIcon src={logoIcon} alt="Bebee Icon" />
          <LogoText src={logoText} alt="Bebee Logo" />
          <SubTitle>꿀벌들의 달콤한 동행</SubTitle>
        </LogoContainer>

        <FormContainer>
          <GeneralInput
            inputLabel="아이디 (이메일)"
            placeholder="example@bebee.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            inputLabel="비밀번호"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <LoginButtonWrapper>
            <BaseLongButton
              label="로그인"
              onClick={handleLogin}
              disabled={!email || !password}
            />
          </LoginButtonWrapper>
        </FormContainer>

        <UtilContainer>
          <UtilLink onClick={() => {}}>아이디 찾기</UtilLink>
          <Divider>|</Divider>
          <UtilLink onClick={() => {}}>비밀번호 찾기</UtilLink>
          <Divider>|</Divider>
          <SignUpLink onClick={() => navigate("/signup/step1")}>
            회원가입
          </SignUpLink>
        </UtilContainer>
      </PageContainer>
    </Layout>
  );
};

export default AuthLoginPage;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.25rem;
  flex: 1;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
  margin-top: 2rem;
`;

const LogoIcon = styled.img`
  width: 70px;
  height: auto;
  margin-bottom: 0.5rem;
`;

const LogoText = styled.img`
  width: 130px;
  height: auto;
`;

const SubTitle = styled.p`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.subText2};
  margin: 2rem 0 0 0;
`;

const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const LoginButtonWrapper = styled.div`
  margin-top: 1.5rem;
`;

const UtilContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2.5rem;
  gap: 0.75rem;
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
*/
}
