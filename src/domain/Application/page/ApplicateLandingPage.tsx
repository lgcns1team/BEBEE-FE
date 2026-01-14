import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { letterVariants } from "../animation/letterVariants";

import styled from "styled-components";
import Layout from "../../../components/Layout";

import letter from "../../../assets/images/letter.png";
import bee_letter from "../../../assets/images/bee-letter.png";
import BaseLongButton from "../../../components/BaseLongButton";
import { MdPeopleAlt } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { BsFillPatchCheckFill } from "react-icons/bs";
// Card 데이터 타입

const infoList = [
  {
    id: 1,
    text: "도우미의 프로필 정보를 확인할 수 있어요",
    icon: <MdPeopleAlt size={20} color="#8EC5FF" />,
  },
  {
    id: 2,
    text: "내가 선택한 도우미와 채팅이 가능해요",
    icon: <FaHeart size={20} color="#FFA2A2" />,
  },
  {
    id: 3,
    text: "매칭이 완료되면 뱃지가 비활성화돼요",
    icon: <BsFillPatchCheckFill size={20} color="#FFBE00" />,
  },
];

const PointLandingPage = () => {
  const navigate = useNavigate();
  const LETTER_COUNT = 5;
  return (
    <Layout>
      <Wrapper>
        <IntroCard
          role="group"
          tabIndex={0}
          aria-label="
          반가워요.
          꿀벌들이 당신을 기다리고 있어요.
          도우미 프로필을 확인할 수 있고,
          선택한 도우미와 채팅이 가능하며,
          매칭이 완료되면 뱃지가 비활성화됩니다.
          "
        >
        <HiConatiner aria-hidden="true">
          <span>반가워요 !</span>
          <span>
            <span style={{ color: "#FFBE00" }}>꿀벌</span>들이 당신을
          </span>
          <span>기다리고 있어요</span>
        </HiConatiner>
        <ImgContainer aria-hidden="true">
          <LeftArea>
            {Array.from({ length: LETTER_COUNT }).map((_, i) => (
              <motion.img
                key={i}
                src={letter}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                style={{
                  position: "absolute",
                  right: 0, // 기준점 고정
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 30,
                  pointerEvents: "none",
                }}
              />
            ))}
          </LeftArea>

          <RightArea>
            {" "}
            {/* 꿀벌 */}
            <motion.img
              src={bee_letter}
              alt="꿀벌"
              animate={{
                y: [0, -12, 0],
                rotate: [-2, 2, -2],
                scale: [1, 1.03, 1],
              }}
              transition={{
                duration: 1.8,
                ease: "easeInOut",
              }}
              style={{ width: "200px", height: "200px" }}
            />
          </RightArea>
        </ImgContainer>
        {/* 정보 리스트 */}
        <InformationList aria-hidden="true">
          {infoList.map((info) => (
            <InfoItem key={info.id}>
              <Icon>{info.icon}</Icon>
              <Text>{info.text}</Text>
            </InfoItem>
          ))}
        </InformationList>
        </IntroCard>
      </Wrapper>
      <ButtonWrapper>
        <BaseLongButton
          label="지원자 보러가기"
          onClick={() => navigate("/applicate-status")}
          aria-label="지원자 보러가기"
        />
      </ButtonWrapper>
    </Layout>
  );
};

export default PointLandingPage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  justify-content: center;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
`;

const HiConatiner = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: ${({ theme }) => theme.size.xl};
  color: ${({ theme }) => theme.color.text};
  font-weight: ${({ theme }) => theme.weight.bold};
  flex-shrink: 0;
  font-family: "Paperlogy";
`;

const ImgContainer = styled.div`
  width: 100%;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const LeftArea = styled.div`
  flex: 1;
  position: relative;
`;

const RightArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const InformationList = styled.ol`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
  flex-shrink: 0;
  padding-bottom: 8px;
`;

const InfoItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  font-size: ${({ theme }) => theme.size.md};
`;

const Icon = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  padding: 5px;
  flex-shrink: 0;
`;

const Text = styled.span`
  color: ${({ theme }) => theme.color.text};
`;

const ButtonWrapper = styled.div`
  width: 100%;
  padding-top: 12px;
  flex-shrink: 0;
`;

const IntroCard = styled.div`
  
`