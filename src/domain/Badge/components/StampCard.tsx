import styled from "styled-components";
import type { BadgeLevel } from "../types/badge.type";

interface DisabilityType {
  id: number;
  name: string;
}

interface StampCardProps {
  disability: DisabilityType;
  count: number;
  targetCount: 5 | 10;
  badgeCode: BadgeLevel;
  onNavigate: () => void;
}

const StampCard = ({
  disability,
  count,
  targetCount,
  badgeCode,
  onNavigate,
}: StampCardProps) => {
  const isComplete = count >= targetCount;
  const isLevel1 = targetCount === 5 && badgeCode === "LEVEL_1";
  const isLevel2 = targetCount === 10 && badgeCode === "LEVEL_2";

  // 5회 카드면 1-5, 10회 카드면 6-10
  const stamps = targetCount === 5 ? [1, 2, 3, 4, 5] : [6, 7, 8, 9, 10];

  return (
    <StampSection
      $isActive={isComplete || isLevel1 || isLevel2}
      onClick={onNavigate}
    >
      <SectionTitle>{disability.name} 전문가</SectionTitle>
      <SectionDescription>
        {disability.name}에게 {targetCount}회 도움을 주면 뱃지 획득!
      </SectionDescription>

      <StampContainer>
        {stamps.map((num, index) => {
          // 5회 카드는 count >= num, 10회 카드는 count >= num (6, 7, 8, 9, 10)
          const isActive = count >= num;
          return (
            <BadgeItem key={index} $isActive={isActive}>
              {num}
            </BadgeItem>
          );
        })}
      </StampContainer>
    </StampSection>
  );
};

export default StampCard;

const StampSection = styled.div<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: ${({ theme }) => theme.color.white};
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  border: 2px solid
    ${({ $isActive, theme }) =>
      $isActive ? theme.color.main : theme.color.natural100};

  &:active {
    transform: translateY(0);
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.color.text};
  margin: 0;
`;

const SectionDescription = styled.p`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText};
  margin: 0;
  line-height: 1.5;
`;

const StampContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
`;

const BadgeItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 1px solid
    ${({ $isActive, theme }) =>
      $isActive ? theme.color.main : theme.color.natural200};
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.color.subColor2 : theme.color.natural100};
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.color.main : theme.color.natural200};
  transition: all 0.2s ease;
  fonst-style: italic;
`;
