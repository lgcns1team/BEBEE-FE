import React, { useState } from "react";
import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";
import { HELP_TAG_LIST } from "../constants/helpTags";

interface TagFilterProps {
  selectedTags: number[]; // ID(숫자) 배열
  onTagsChange: (tags: number[]) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({
  selectedTags,
  onTagsChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTagToggle = (id: number) => {
    // ID가 이미 있으면 제거, 없으면 추가
    if (selectedTags.includes(id)) {
      onTagsChange(selectedTags.filter((tagId) => tagId !== id));
    } else {
      onTagsChange([...selectedTags, id]);
    }
  };

  return (
    <Container>
      <Title id="tag-label">주요 도움 유형</Title>

      <DropdownWrapper>
        <DropdownButton
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-labelledby="tag-label"
        >
          <TagsContainer aria-live="polite">
            {selectedTags.length === 0 && (
              <Placeholder>태그를 선택해주세요</Placeholder>
            )}
            {selectedTags.map((id) => {
              // 선택된 ID에 해당하는 이름을 리스트에서 찾음
              const tag = HELP_TAG_LIST.find((item) => item.id === id);
              return (
                <Tag key={id}>
                  {tag?.name}
                  <RemoveButton
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTagToggle(id);
                    }}
                    aria-label={`${tag?.name} 제거`}
                  >
                    ×
                  </RemoveButton>
                </Tag>
              );
            })}
          </TagsContainer>
          <TypeIconWrapper>
            <IoIosArrowDown size={20} aria-hidden="true" />
          </TypeIconWrapper>
        </DropdownButton>

        {isOpen && (
          <DropdownList role="listbox">
            {HELP_TAG_LIST.map((tag) => {
              const isSelected = selectedTags.includes(tag.id);
              return (
                <DropdownItem
                  key={tag.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleTagToggle(tag.id)}
                  isSelected={isSelected}
                >
                  <Checkbox isSelected={isSelected} aria-hidden="true">
                    {isSelected && "✓"}
                  </Checkbox>
                  {tag.name}
                </DropdownItem>
              );
            })}
          </DropdownList>
        )}
      </DropdownWrapper>
    </Container>
  );
};
export default TagFilter;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2.5rem;
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.color.text};
`;

const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button`
  width: 100%;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  transition: border-color 0.2s;
  border: 0.5px solid ${({ theme }) => theme.color.subText3};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.white};
  padding: 12px;
`;

const TagsContainer = styled.div`
  width: 90%;
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
  display: flex;
  flex-direction: row;

  gap: 8px;
  overflow-x: auto; // ← 가로 스크롤 허용
  white-space: nowrap; // ← 한 줄 유지
  flex-wrap: nowrap; // ← 여러 줄로 줄바꿈 방지
  /* 스크롤바 스타일(optional) */
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--subText3);
    border-radius: 4px;
  }
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 12px;
  background: ${({ theme }) => theme.color.subColor2};
  border: 0.5px solid ${({ theme }) => theme.color.main};
  border-radius: 5px;
  font-size: ${({ theme }) => theme.size.md};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.color.main};
  font-size: ${({ theme }) => theme.size.md};
  line-height: 1;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TypeIconWrapper = styled.div`
  color: ${({ theme }) => theme.color.subText2};
  cursor: pointer;
  z-index: 1;
`;

const DropdownList = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border: 2px solid var(--subText3);
  border-radius: 12px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 8px;
  cursor: pointer;
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.color.main : theme.color.subText2};
`;

const Checkbox = styled.div<{ isSelected: boolean }>`
  width: 20px;
  height: 20px;
  border: 0.5px solid ${({ theme }) => theme.color.white};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ isSelected, theme }) =>
    isSelected ? theme.color.main : theme.color.natural100};
  color: white;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s;
`;
const Placeholder = styled.span`
  color: ${({ theme }) => theme.color.natural200};
  font-size: ${({ theme }) => theme.size.md};
`;
