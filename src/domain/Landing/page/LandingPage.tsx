import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import nameImage from "../../../assets/images/name.png";
import logoLandingImage from "../../../assets/images/logo_landing.png";
import { useUserStore } from "../../../store/useUserStore";

// 랜딩 페이지 전용 전역 스타일
const LandingGlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.color.main} !important;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// logo가 작아지면서 왼쪽으로 이동하는 애니메이션
const shrinkAndMoveLeft = keyframes`
  from {
    transform: translate(-50%, -50%) scale(1.5);
  }
  to {
    transform: translate(calc(-50% - 120px), -50%) scale(1);
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LandingPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUserStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        navigate("/home");
      } else {
        navigate("/login");
      }
    }, 2800); // 2.5초 후 이동

    return () => clearTimeout(timer);
  }, [navigate, isLoggedIn]);

  return (
    <>
      <LandingGlobalStyle />
      <LandingContainer>
        <LogoContainer>
          <LandingLogo src={logoLandingImage} alt="비비 로고" />
        </LogoContainer>
        <NameImageContainer>
          <NameImage src={nameImage} alt="비비 이름" $delay={1.3} />
        </NameImageContainer>
        <TextContainer>
          <TopText $delay={1.4}>국내 유일 장애인 매칭 플랫폼</TopText>
          <BottomText $delay={1.7}>달콤한 동행을 시작해요</BottomText>
        </TextContainer>
      </LandingContainer>
    </>
  );
};

export default LandingPage;

const LandingContainer = styled.div`
  width: 100%;
  height: calc(var(--vh, 1vh) * 100); /* Mobile viewport fix */
  max-height: calc(var(--vh, 1vh) * 100); /* Mobile viewport fix */
  overflow: hidden;
  flex: 1;
  background-color: ${({ theme }) => theme.color.main};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
`;

const LogoContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const NameImageContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const LandingLogo = styled.img`
  width: 60px;
  height: auto;
  object-fit: contain;
  opacity: 0;
  transform: translate(-50%, -50%) scale(1.5);
  animation: ${fadeIn} 0.3s ease-out forwards,
    ${shrinkAndMoveLeft} 0.8s ease-out 0.3s forwards;
`;

const NameImage = styled.img<{ $delay: number }>`
  width: 120px;
  height: auto;
  object-fit: contain;
  opacity: 0;
  animation: ${fadeInUp} 0.6s ease-out forwards;
  animation-delay: ${({ $delay }) => `${$delay}s`};
`;

const TextContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 110px;
  z-index: 0;
`;

const TopText = styled.div<{ $delay: number }>`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.color.white};
  text-align: center;
  white-space: nowrap;
  opacity: 0;
  animation: ${fadeInUp} 0.6s ease-out forwards;
  animation-delay: ${({ $delay }) => `${$delay}s`};
`;

const BottomText = styled.div<{ $delay: number }>`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.white};
  text-align: center;
  white-space: nowrap;
  opacity: 0;
  animation: ${fadeInUp} 0.6s ease-out forwards;
  animation-delay: ${({ $delay }) => `${$delay}s`};
`;
