import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import landingBee from "../../../assets/images/landing.png";
import nameImage from "../../../assets/images/name.png";
import { useUserStore } from "../../../store/useUserStore";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUserStore();
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2600); // 1.2초(애니메이션) + 2초(여유시간)

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!animationComplete) return;

    // 로그인 상태에 따라 리다이렉트
    if (isLoggedIn) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [animationComplete, isLoggedIn, navigate]);

  return (
    <Container>
      {/* 왼쪽 상단 텍스트 영역 */}
      <TextSection>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <GreetingText>반가워요 !</GreetingText>
          <GreetingText>딱 맞는 파트너를</GreetingText>
          <GreetingText>찾아드릴게요</GreetingText>
          <NameImage src={nameImage} alt="비비" />
        </motion.div>
      </TextSection>

      {/* 오른쪽 하단 벌 캐릭터 */}
      <BeeSection>
        <motion.div
          initial={{
            x:
              typeof window !== "undefined" && window.innerWidth <= 768
                ? -window.innerWidth * 0.8
                : -800,
            y:
              typeof window !== "undefined" && window.innerWidth <= 768
                ? -window.innerHeight * 0.3
                : -200,
            rotate: -45,
            scale: 0.4,
            opacity: 0,
          }}
          animate={{
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
          }}
          transition={{
            x: {
              duration: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94], // 부드러운 가속/감속
            },
            y: {
              duration: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            },
            rotate: {
              duration: 1.2,
              ease: "easeOut",
            },
            scale: {
              duration: 1.2,
              ease: "easeOut",
            },
            opacity: {
              duration: 0.8,
              ease: "easeOut",
            },
          }}
        >
          <motion.img
            src={landingBee}
            alt="비비 캐릭터"
            style={{
              filter: "drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2))",
            }}
          />
        </motion.div>

        {/* 날개 펄럭임 효과 */}
        <WingEffect />
      </BeeSection>
    </Container>
  );
};

export default LandingPage;

// --- Styled Components ---

const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
  background: ${({ theme }) => theme.color.main};
  display: flex;
  justify-content: space-between;
  padding: 16px;
  box-sizing: border-box;
`;

const TextSection = styled.div`
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 3rem;
`;

const GreetingText = styled.div`
  font-size: ${({ theme }) => theme.size.xl};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: white;
  letter-spacing: -0.5px;
  line-height: 1.4;
`;

const NameImage = styled.img`
  width: 140px;
  height: auto;
  margin-top: 16px;
`;

const BeeSection = styled.div`
  position: absolute;
  right: 0;
  bottom: 20%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 320px;
  height: 300px;
  z-index: 1;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    cursor: grab;
    user-select: none;
    pointer-events: auto;

    &:active {
      cursor: grabbing;
    }
  }
`;

// 날개 펄럭임 효과
const WingEffect = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 25%;
    width: 60px;
    height: 80px;
    background: radial-gradient(
      ellipse,
      rgba(255, 255, 255, 0.3) 0%,
      transparent 70%
    );
    border-radius: 50%;
    animation: wingFlap 0.2s ease-in-out infinite;
  }

  &::before {
    left: 20%;
    animation-delay: 0s;
  }

  &::after {
    right: 20%;
    animation-delay: 0.1s;
  }

  @keyframes wingFlap {
    0%,
    100% {
      transform: scaleY(1) rotate(-10deg);
      opacity: 0.3;
    }
    50% {
      transform: scaleY(0.5) rotate(10deg);
      opacity: 0.5;
    }
  }
`;
