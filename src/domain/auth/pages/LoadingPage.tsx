import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

import loading from "../../../assets/images/loading.png";
import loadingGround from "../../../assets/images/loading_ground.png";

const LOADING_TEXTS = [
  "OCR인증을 진행 중이에요",
  "꼼꼼한 인증으로 시간이 소요되고 있어요",
  "거의 다 왔어요",
];

// 땅이 좌우로 움직이는 애니메이션 (런닝머신 효과)
const groundMove = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const LoadingPage = () => {
  const [textIndex, setTextIndex] = useState(0);

  // 1.5초마다 텍스트 변경
  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Container>
      <Wrapper>
        {/* 캐릭터와 땅을 감싸는 컨테이너 */}
        <AnimationContainer>
          {/* 땅 이미지 (런닝머신 효과) */}
          <GroundWrapper>
            <GroundImage src={loadingGround} alt="ground" />
            <GroundImage src={loadingGround} alt="ground" />
          </GroundWrapper>

          {/* 캐릭터 애니메이션 영역 */}
          <CharacterWrapper
            animate={{
              y: [0, -12, 0], // 위아래로 걷는 모션 (약간 줄임)
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Character src={loading} alt="loading bee" />
          </CharacterWrapper>
        </AnimationContainer>

        {/* 2. 텍스트 전환 애니메이션 */}
        <TextWrapper>
          <AnimatePresence mode="wait">
            <LoadingText
              key={LOADING_TEXTS[textIndex]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {LOADING_TEXTS[textIndex]}
            </LoadingText>
          </AnimatePresence>

          {/* 3. 점진적으로 나타나는 점들 (...) */}
          <DotContainer>
            {[0, 1, 2].map((i) => (
              <Dot
                key={i}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </DotContainer>
        </TextWrapper>
      </Wrapper>
    </Container>
  );
};

export default LoadingPage;

/* ---------------- Styled Components ---------------- */

const Container = styled.div`
  position: fixed;
  inset: 0;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  /* PWA 바운스 방지 */
  overscroll-behavior: none;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

/* ---------------- Styled Components ---------------- */

// 캐릭터와 땅을 감싸는 컨테이너
const AnimationContainer = styled.div`
  position: relative;
  width: 250px; /* 고정 너비를 설정하여 기준점을 잡습니다 */
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  overflow: hidden;
`;

// 땅 이미지 래퍼
const GroundWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  width: 500px;
  height: 300px;
  animation: ${groundMove} 2s linear infinite;
  will-change: transform; /* 애니메이션 성능 최적화 및 렌더링 떨림 방지 */
`;

// 땅 이미지
const GroundImage = styled.img`
  width: 250px; /* 컨테이너 너비와 일치하게 고정 */
  height: 100%;
  /* object-fit: cover는 이미지 크기를 변하게 할 수 있으므로 
     이미지 본연의 크기를 쓰거나 fill을 권장합니다. */
  object-fit: fill;
  display: block;
  flex-shrink: 0;
`;

// 캐릭터 래퍼 (땅 위에 고정)
const CharacterWrapper = styled(motion.div)`
  position: relative;
  z-index: 1;
  width: 140px;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px; /* 땅 위에 위치하도록 */
`;

const Character = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 60px; /* 텍스트 교체 시 레이아웃 흔들림 방지 */
`;

const LoadingText = styled(motion.p)`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.text || "#333"};
  margin: 0;
  text-align: center;
`;

const DotContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 8px;
`;

const Dot = styled(motion.div)`
  width: 6px;
  height: 6px;
  background-color: ${({ theme }) => theme.color.main || "#FFBE00"};
  border-radius: 50%;
`;
