import React from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import HoneyRange from "./HoneyRange";
import { useFilterStore } from "../../../../store/useFilterStore";
import Layout from "../../../../components/Layout";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
// 메인 페이지 바텀 시트
const FilterBottomSheet = ({ isOpen, onClose }: Props) => {
  const {
    regions,
    removeRegion,
    addRegion,

    selectedHelpTypes,
    toggleHelpType,

    gender,
    setGender,

    disability,
    setDisability,

    days,
    toggleDay,

    resetAll,
  } = useFilterStore();

  const handleAddRegion = () => {
    alert("지역 추가 기능은 아직 구현되지 않았습니다!");
  };

  const handleSubmit = () => {
    onClose();
  };

  return (
    <Layout>
      <AnimatePresence>
        {isOpen && (
          <>
            <Dim
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            <Sheet
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3 }}
            >
              <HandleBarWrapper>
                <HandleBar />
              </HandleBarWrapper>

              <Title>맞춤조건 설정</Title>

              <Content>
                {/* 🔶 도움 지역 */}
                <Section>
                  <Header>
                    <Label>도움 지역</Label>
                    <Count>
                      <Highlight>{regions.length}</Highlight>/10
                    </Count>
                  </Header>

                  <RegionChipRow>
                    {regions.map((region) => (
                      <RegionChip key={region}>
                        {region}
                        <DeleteBtn onClick={() => removeRegion(region)}>
                          X
                        </DeleteBtn>
                      </RegionChip>
                    ))}
                  </RegionChipRow>

                  <AddRegionBtn onClick={handleAddRegion}>
                    <Plus>＋</Plus> 추가하기
                  </AddRegionBtn>
                </Section>

                {/* 도움 유형 */}
                <Section>
                  <Header>
                    <Label>도움 유형</Label>
                  </Header>

                  <Row>
                    {[
                      "외출 동행",
                      "방문 목욕",
                      "방문 간호",
                      "가사 지원",
                      "정서적 지원",
                      "식사 도움",
                      "학습 지원",
                      "기타",
                    ].map((label) => (
                      <Chip
                        key={label}
                        $active={selectedHelpTypes.includes(label)}
                        onClick={() => toggleHelpType(label)}
                      >
                        {label}
                      </Chip>
                    ))}
                  </Row>
                </Section>

                {/* 성별 */}
                <Section>
                  <Label>성별</Label>

                  <GenderTabs>
                    <GenderTab
                      $active={gender === "남자"}
                      onClick={() => setGender("남자")}
                    >
                      남자
                    </GenderTab>
                    <GenderTab
                      $active={gender === "여자"}
                      onClick={() => setGender("여자")}
                    >
                      여자
                    </GenderTab>
                  </GenderTabs>
                </Section>

                {/* 🍯 회당 획득 꿀 */}
                <HoneyRange />

                {/* 장애 유형 */}
                <Section>
                  <Label>장애 유형</Label>

                  <Row>
                    {[
                      "지체장애",
                      "시각장애",
                      "청각장애",
                      "발달장애",
                      "내부기관장애",
                      "기타장애",
                    ].map((v) => (
                      <Chip
                        key={v}
                        $active={disability === v}
                        onClick={() => setDisability(v)}
                      >
                        {v}
                      </Chip>
                    ))}
                  </Row>
                </Section>

                {/* 도움 요일 */}
                <Section>
                  <Header>
                    <Label>도움 요일</Label>
                    <Count>
                      <Highlight>{days.length}</Highlight>/7
                    </Count>
                  </Header>

                  <Row>
                    {["월", "화", "수", "목", "금", "토", "일"].map((d) => (
                      <DayChip
                        key={d}
                        $active={days.includes(d)}
                        onClick={() => toggleDay(d)}
                      >
                        {d}
                      </DayChip>
                    ))}
                  </Row>
                </Section>
              </Content>

              {/* 하단 버튼 */}
              <Buttons>
                <ResetBtn onClick={resetAll}>초기화</ResetBtn>
                <SubmitBtn onClick={handleSubmit}>완료</SubmitBtn>
              </Buttons>
            </Sheet>
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default FilterBottomSheet;

/* ---------------- styled-components ---------------- */

const Dim = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.color.text};
  z-index: 90;
`;

const Sheet = styled(motion.div)`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 430px;
  margin: 0 auto;
  background: ${({ theme }) => theme.color.white};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  z-index: 100;

  max-height: 85vh;
  display: flex;
  flex-direction: column;
`;

const HandleBarWrapper = styled.div`
  padding: 10px 0;
  display: flex;
  justify-content: center;
`;

const HandleBar = styled.div`
  width: 45px;
  height: 4px;
  background: ${({ theme }) => theme.color.natural100};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const Title = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.bold};
`;

const Content = styled.div`
  padding: 16px;
  flex: 1;
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Label = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.bold};
`;

const Count = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.text};
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.color.main};
  font-weight: ${({ theme }) => theme.weight.bold};
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
`;

const Chip = styled.button<{ $active?: boolean }>`
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ $active, theme }) =>
    $active ? theme.color.subColor2 : theme.color.natural100};

  color: ${({ $active, theme }) =>
    $active ? theme.color.main : theme.color.subText2};

  border: 0.5px solid
    ${({ $active, theme }) =>
      $active ? theme.color.main : theme.color.natural100};

  font-size: ${({ theme }) => theme.size.sm};

  appearance: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
`;

const RegionChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
`;

const RegionChip = styled.div`
  padding: 8px 12px;
  background: ${({ theme }) => theme.color.subColor2};
  color: ${({ theme }) => theme.color.main};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.size.sm};
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const DeleteBtn = styled.span`
  font-size: ${({ theme }) => theme.size.sm};
  cursor: pointer;
`;

const AddRegionBtn = styled.button`
  width: 100%;
  padding: 12px 0;
  background: white;
  border: 0.5px solid ${({ theme }) => theme.color.subText2};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.size.sm};
  display: flex;
  justify-content: center;
  gap: 6px;
  align-items: center;
`;

const Plus = styled.span`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.text};
`;

const GenderTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 10px;
`;

const GenderTab = styled.button<{ $active?: boolean }>`
  padding: 12px 0;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.size.sm};
  background: ${({ $active, theme }) =>
    $active ? "#fff" : theme.color.natural100};

  color: ${({ $active, theme }) =>
    $active ? theme.color.main : theme.color.subText2};

  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.color.main : theme.color.natural100};

  appearance: none;
  -webkit-tap-highlight-color: transparent;
`;

const DayChip = styled.button<{ $active?: boolean }>`
  /* padding: 8px 14px; */
  border-radius: 50%;
  width: 32px;
  height: 32px;
  background: ${({ $active, theme }) =>
    $active ? theme.color.subColor2 : theme.color.natural100};

  color: ${({ $active, theme }) =>
    $active ? theme.color.main : theme.color.subText2};

  border: 0.5px solid
    ${({ $active, theme }) =>
      $active ? theme.color.main : theme.color.natural100};
  font-size: ${({ theme }) => theme.size.sm};
  appearance: none;
  -webkit-tap-highlight-color: transparent;
`;

const Buttons = styled.div`
  display: flex;
  gap: 10px;
  padding: 16px;
`;

const ResetBtn = styled.button`
  flex: 1;
  padding: 14px 0;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme }) => theme.color.natural100};
  color: ${({ theme }) => theme.color.subText};
  font-weight: ${({ theme }) => theme.weight.medium};
  font-size: ${({ theme }) => theme.size.md};
  border: none;
`;

const SubmitBtn = styled.button`
  flex: 1;
  padding: 14px 0;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme }) => theme.color.main};
  color: ${({ theme }) => theme.color.white};
  font-weight: ${({ theme }) => theme.weight.medium};
  font-size: ${({ theme }) => theme.size.md};
  border: none;
`;
