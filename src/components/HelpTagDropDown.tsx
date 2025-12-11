import React, { useState } from "react";
import styled from "styled-components";
import { HELP_TAGS } from "../constants/helpTags";
import { IoIosArrowDown } from "react-icons/io";
interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({
  selectedTags,
  onTagsChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tag: string) => {
    onTagsChange(selectedTags.filter((t) => t !== tag));
  };

  return (
    <Container>
      <Title>주요 도움 유형</Title>

      <DropdownWrapper>
        <DropdownButton onClick={() => setIsOpen(!isOpen)}>
          <TagsContainer>
            {selectedTags.map((tag) => (
              <Tag key={tag}>
                {tag}
                <RemoveButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTagRemove(tag);
                  }}
                >
                  ×
                </RemoveButton>
              </Tag>
            ))}
          </TagsContainer>
          <TypeIconWrapper>
            <IoIosArrowDown size={20} />
          </TypeIconWrapper>
        </DropdownButton>

        {isOpen && (
          <DropdownList>
            {HELP_TAGS.map((tag) => (
              <DropdownItem
                key={tag}
                onClick={() => handleTagToggle(tag)}
                isSelected={selectedTags.includes(tag)}
              >
                <Checkbox isSelected={selectedTags.includes(tag)}>
                  {selectedTags.includes(tag) && "✓"}
                </Checkbox>
                {tag}
              </DropdownItem>
            ))}
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
