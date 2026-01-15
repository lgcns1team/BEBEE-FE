import styled from "styled-components";
import { usePostStore } from "../../../../store/usePostStore";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import HoneyRange from "./HoneyRange";
import Badge from "../../../../components/Badge";
import { HELP_TAG_LIST } from "../../../../constants/helpTags";
import { DISABILITY_TYPES } from "../../../../constants/disabilityTypes";

import {
  SERVER_MAPPING,
  type PostsGetReqDTO,
} from "../../../../types/post.type";
import type { DayOfWeek } from "../../../../types/common.types";
interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterBottomSheet = ({ isOpen, onClose }: FilterBottomSheetProps) => {
  const { setFilters, resetFilters } = usePostStore();
  /* ---------------- local state ---------------- */

  const [regions, setRegions] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [gender, setGender] = useState<"남자" | "여자" | undefined>(undefined);
  const [selectedDisabilityIds, setSelectedDisabilityIds] = useState<number[]>(
    []
  );
  const [days, setDays] = useState<string[]>([]);
  const [honeyRange, setHoneyRange] = useState<number[]>([0, 1000]);

  /* ---------------- handlers ---------------- */

  const removeRegion = (region: string) => {
    setRegions((prev) => prev.filter((r) => r !== region));
  };
  const toggleItem = <T,>(
    id: T,
    state: T[],
    setState: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    setState(
      state.includes(id) ? state.filter((i) => i !== id) : [...state, id]
    );
  };

  const handleReset = () => {
    // 모든 필드 초기화
    setRegions([]);
    setSelectedCategoryIds([]);
    setGender(undefined);
    setSelectedDisabilityIds([]);
    setDays([]);
    setHoneyRange([0, 1000]);

    // Store의 필터도 초기화
    resetFilters();

    // 모달 닫기
    onClose();
  };

  const handleSubmit = () => {
    // 서버 reqDTO 형식으로 변환 (빈 값은 제외)
    const reqDTO: PostsGetReqDTO = {};

    // legalDongCodes: 빈 배열이 아니면 추가
    if (regions.length > 0) {
      reqDTO.legalDongCodes = regions;
    }

    // helpCategories: 빈 배열이 아니면 추가
    if (selectedCategoryIds.length > 0) {
      reqDTO.helpCategories = selectedCategoryIds;
    }

    // gender: 선택된 경우만 추가
    if (gender) {
      reqDTO.gender = SERVER_MAPPING.GENDER[gender];
    }

    // minHoney: 0보다 크면 추가
    if (honeyRange[0] > 0) {
      reqDTO.minHoney = honeyRange[0];
    }

    // maxHoney: 1000보다 작으면 추가 (기본값이 1000이므로)
    if (honeyRange[1] < 1000) {
      reqDTO.maxHoney = honeyRange[1];
    }

    // disabilityCategoryIds: 빈 배열이 아니면 추가
    if (selectedDisabilityIds.length > 0) {
      reqDTO.disabilityCategoryIds = selectedDisabilityIds;
    }

    // days: 빈 배열이 아니면 추가 (한글 요일을 영문 DayOfWeek로 변환)
    if (days.length > 0) {
      reqDTO.days = days.map(
        (d) => SERVER_MAPPING.DAYS[d as keyof typeof SERVER_MAPPING.DAYS]
      ) as DayOfWeek[];
    }

    // 필터 적용 (setFilters가 내부에서 fetchPosts를 호출함)
    setFilters(reqDTO);

    // 모달 닫기
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
                {/* <Section>
                  <Header>
                    <Label>도움 지역</Label>
                    {regions.length > 0 && (
                      <Count>
                        <Highlight>{regions.length}</Highlight>/10
                      </Count>
                    )}
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
                </Section> */}

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
                      onClick={() =>
                        setGender(gender === "남자" ? undefined : "남자")
                      }
                    >
                      남자
                    </GenderTab>
                    <GenderTab
                      $active={gender === "여자"}
                      onClick={() =>
                        setGender(gender === "여자" ? undefined : "여자")
                      }
                    >
                      여자
                    </GenderTab>
                  </GenderTabs>
                </Section>

                {/* 꿀 범위 */}
                <div style={{ marginBottom: "32px" }}>
                  <Label>회당 획득 꿀</Label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <HoneyRange value={honeyRange} onChange={setHoneyRange} />
                  </div>
                </div>
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
                    {days.length > 0 && (
                      <Count>
                        <Highlight>{days.length}</Highlight>/7
                      </Count>
                    )}
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
  -webkit-tap-highlight-color: transparent;
`;

const Sheet = styled(motion.div)`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  z-index: 101;
  /* 아이폰에서 스크롤 시 시트가 위로 들리는 버그 방지 */
  touch-action: none;
`;

const Container = styled.div`
  width: 100%;
  max-width: 400px;
  max-height: 85vh;

  background: ${({ theme }) => theme.color.white};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const HandleBarWrapper = styled.div`
  padding: 10px 0;
  display: flex;
  justify-content: center;
  cursor: grab;
`;

const HandleBar = styled.div`
  width: 45px;
  height: 4px;
  background: ${({ theme }) => theme.color.natural50};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const Title = styled.div`
  margin: 0;
  padding: 0 0 16px 0;
  text-align: center;
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.bold};
`;

const Content = styled.div`
  padding: 16px;
  flex: 1;
  overflow-y: auto;
  /* iOS 부드러운 스크롤 */
  -webkit-overflow-scrolling: touch;
  /* 내부 스크롤 시 바닥 페이지 전파 방지 */
  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.bold};
  margin-bottom: 12px;
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
`;

// const RegionChipRow = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 8px;
//   margin: 12px 0;
// `;

// const RegionChip = styled.div`
//   padding: 8px 12px;
//   background: ${({ theme }) => theme.color.subColor2};
//   color: ${({ theme }) => theme.color.main};
//   border-radius: ${({ theme }) => theme.borderRadius.lg};
//   font-size: ${({ theme }) => theme.size.sm};
//   display: inline-flex;
//   align-items: center;
//   gap: 6px;
// `;

// const DeleteBtn = styled.span`
//   font-size: ${({ theme }) => theme.size.sm};
//   cursor: pointer;
//   background: none;
//   border: none;
//   padding: 0;
// `;

// const AddRegionBtn = styled.button`
//   width: 100%;
//   padding: 12px 0;
//   background: white;
//   border: 0.5px solid ${({ theme }) => theme.color.subText2};
//   border-radius: ${({ theme }) => theme.borderRadius.lg};
//   font-size: ${({ theme }) => theme.size.sm};
//   display: flex;
//   justify-content: center;
//   gap: 6px;
//   align-items: center;
// `;

// const Plus = styled.span`
//   font-size: ${({ theme }) => theme.size.sm};
//   color: ${({ theme }) => theme.color.text};
// `;

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
    $active ? "#fff" : theme.color.natural50};

  color: ${({ $active, theme }) =>
    $active ? theme.color.main : theme.color.subText2};

  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.color.main : theme.color.natural50};

  appearance: none;
  -webkit-tap-highlight-color: transparent;
`;

const DayChip = styled.button<{ $active?: boolean }>`
  border-radius: 50%;
  width: 32px;
  height: 32px;
  background: ${({ $active, theme }) =>
    $active ? theme.color.subColor2 : theme.color.natural50};

  color: ${({ $active, theme }) =>
    $active ? theme.color.main : theme.color.subText2};

  border: 0.5px solid
    ${({ $active, theme }) =>
      $active ? theme.color.main : theme.color.natural50};
  font-size: ${({ theme }) => theme.size.sm};
  appearance: none;
  -webkit-tap-highlight-color: transparent;
`;

const Buttons = styled.div`
  display: flex;
  gap: 10px;
  padding: 16px;
  /* 아이폰 홈바 대응 코드 */
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  background: white;
  border-top: 1px solid #eee;
  z-index: 10;
`;

const ResetBtn = styled.button`
  flex: 1;
  padding: 14px 0;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme }) => theme.color.natural50};
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
