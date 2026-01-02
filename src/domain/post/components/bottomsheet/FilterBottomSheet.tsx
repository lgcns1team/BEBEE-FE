import styled from "styled-components";
import { usePostStore } from "../../../../store/usePostStore";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import HoneyRange from "./HoneyRange";
import Badge from "../../../../components/Badge";
import { HELP_TAG_LIST } from "../../../../constants/helpTags";
import { DISABILITY_TYPES } from "../../../../constants/disabilityTypes";

import { SERVER_MAPPING } from "../../../../types/post.type";
interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterBottomSheet = ({ isOpen, onClose }: FilterBottomSheetProps) => {
  const { setFilters, fetchPosts, resetFilters } = usePostStore();
  /* ---------------- local state ---------------- */

  const [regions, setRegions] = useState<string[]>([""]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [gender, setGender] = useState<"남자" | "여자">("여자");
  const [selectedDisabilityIds, setSelectedDisabilityIds] = useState<number[]>(
    []
  );
  const [days, setDays] = useState<string[]>([""]);
  const [honeyRange, setHoneyRange] = useState<number[]>([200, 500]);

  /* ---------------- handlers ---------------- */

  const removeRegion = (region: string) => {
    setRegions((prev) => prev.filter((r) => r !== region));
  };
  const toggleItem = (id: any, state: any[], setState: any) => {
    setState(
      state.includes(id) ? state.filter((i) => i !== id) : [...state, id]
    );
  };

  const handleReset = () => {
    setRegions(["서울 은평구 전체"]);
    setSelectedCategoryIds([]);
    setGender("여자");
    setSelectedDisabilityIds([]);
    setDays([]);
    setHoneyRange([0, 1000]);
    resetFilters();
  };

  const handleSubmit = () => {
    // 서버 reqDTO 형식으로 변환
    const reqDTO = {
      legalDongCodes: regions, // 실제 연동 시 코드로 변환 필요
      helpCategories: selectedCategoryIds,
      gender: SERVER_MAPPING.GENDER[gender],
      minHoney: honeyRange[0],
      maxHoney: honeyRange[1],
      // 다중 선택 시 첫 번째 ID만 혹은 배열로 (서버 협의 필요)
      disabilityCategoryId: selectedDisabilityIds,
      days: days.map(
        (d) => SERVER_MAPPING.DAYS[d as keyof typeof SERVER_MAPPING.DAYS]
      ),
    };

    setFilters(reqDTO);
    fetchPosts();
    onClose();
  };
  /* ---------------- render ---------------- */

  return (
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
            <Container>
              <HandleBarWrapper>
                <HandleBar />
              </HandleBarWrapper>

              <Title>맞춤조건 설정</Title>

              <Content>
                {/* 도움 지역 */}
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

                  <AddRegionBtn
                    onClick={() => alert("지역 선택 API 연결 예정")}
                  >
                    <Plus>＋</Plus> 추가하기
                  </AddRegionBtn>
                </Section>

                {/* 도움 유형 */}
                <Section>
                  <Label>도움 유형</Label>
                  <Row>
                    {" "}
                    {HELP_TAG_LIST.map((tag) => (
                      <Badge
                        key={tag.id}
                        $active={selectedCategoryIds.includes(tag.id)}
                        onClick={() =>
                          toggleItem(
                            tag.id,
                            selectedCategoryIds,
                            setSelectedCategoryIds
                          )
                        }
                      >
                        {tag.name}
                      </Badge>
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

                {/* 꿀 범위 */}
                <Label>회당 획득 꿀</Label>
                <HoneyRange value={honeyRange} onChange={setHoneyRange} />

                {/* 장애 유형 */}
                <Section>
                  <Label>장애 유형</Label>
                  <Row>
                    {DISABILITY_TYPES.map((type) => (
                      <Badge
                        key={type.id}
                        $active={selectedDisabilityIds.includes(type.id)}
                        onClick={() =>
                          toggleItem(
                            type.id,
                            selectedDisabilityIds,
                            setSelectedDisabilityIds
                          )
                        }
                      >
                        {type.name}
                      </Badge>
                    ))}
                  </Row>
                </Section>

                {/* 요일 */}
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
                        onClick={() => toggleItem(d, days, setDays)}
                      >
                        {d}
                      </DayChip>
                    ))}
                  </Row>
                </Section>
              </Content>

              <Buttons>
                <ResetBtn onClick={handleReset}>초기화</ResetBtn>
                <SubmitBtn onClick={handleSubmit}>완료</SubmitBtn>
              </Buttons>
            </Container>
          </Sheet>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterBottomSheet;
/* ---------------- styled-components ---------------- */

const Dim = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.color.text};
  z-index: 100;
`;

const Sheet = styled(motion.div)`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  z-index: 101;
`;

const Container = styled.div`
  width: 100%;
  max-width: 375px;
  max-height: 85vh;

  background: ${({ theme }) => theme.color.white};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;

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
