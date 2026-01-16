import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";
import { HELP_TAG_LIST } from "../constants/helpTags";

interface TagFilterProps {
  selectedTags: number[];
  onTagsChange: (tags: number[]) => void;
  autoFocusOnMount?: boolean;
}

const TagFilter: React.FC<TagFilterProps> = ({
  selectedTags,
  onTagsChange,
  autoFocusOnMount = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleTagToggle = (id: number) => {
    // ID가 이미 있으면 제거, 없으면 추가
    if (selectedTags.includes(id)) {
      onTagsChange(selectedTags.filter((tagId: number) => tagId !== id));
    } else {
      onTagsChange([...selectedTags, id]);
    }
  };

  const closeList = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  // 페이지 진입 시 드롭다운 버튼으로 초점 이동 (매칭하기 → 폼 진입 시 사용)
  useEffect(() => {
    if (!autoFocusOnMount) return;
    const id = requestAnimationFrame(() => {
      buttonRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [autoFocusOnMount]);

  // 드롭다운 열릴 때 첫 옵션으로 포커스 이동 (토큰 제거 버튼 건너뛰기)
  useEffect(() => {
    if (!isOpen) return;
    const id = requestAnimationFrame(() => {
      itemsRef.current[0]?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  // ESC로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeList();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <Container>
      <Title id="tag-label">주요 도움 유형</Title>
      <VisuallyHidden aria-live="polite">
        주요 도움 유형 선택 드롭다운입니다. 두 번 탭하여 목록을 열 수 있습니다.
      </VisuallyHidden>

      <DropdownWrapper>
        <DropdownButton
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen((prev) => !prev);
            }
          }}
          aria-expanded={isOpen}
          aria-labelledby="tag-label"
          aria-haspopup="listbox"
          aria-label="주요 도움 유형 선택 드롭다운입니다. 두 번 탭하여 목록을 열 수 있습니다."
        >
          <TagsContainer aria-live="polite">
            {selectedTags.length === 0 && (
              <Placeholder>태그를 선택해주세요</Placeholder>
            )}
            {selectedTags.map((id: number) => {
              // 선택된 ID에 해당하는 이름을 리스트에서 찾음
              const tag = HELP_TAG_LIST.find((item) => item.id === id);
              return (
                <Tag key={id}>
                  {tag?.name}
                  <RemoveButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTagToggle(id);
                    }}
                    role="button"
                    tabIndex={isOpen ? -1 : 0} // 열림 상태에서는 탭 포커스 제외
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        handleTagToggle(id);
                      }
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
          <DropdownList role="listbox" ref={listRef} tabIndex={-1}>
            <VisuallyHidden aria-live="polite">리스트 열림</VisuallyHidden>
            {HELP_TAG_LIST.map((tag, index) => {
              const isSelected = selectedTags.includes(tag.id);
              const isLast = index === HELP_TAG_LIST.length - 1;
              return (
                <DropdownItem
                  key={tag.id}
                  ref={(el) => {
                    itemsRef.current[index] = el;
                  }}
                  role="option"
                  aria-selected={isSelected}
                  aria-label={`${tag.name} ${
                    isSelected ? "선택됨" : "선택되지 않음"
                  }`}
                  onClick={() => handleTagToggle(tag.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleTagToggle(tag.id);
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      closeList();
                    } else if (e.key === "Tab") {
                      if (!e.shiftKey && isLast) {
                        e.preventDefault();
                        itemsRef.current[0]?.focus();
                      } else if (e.shiftKey && index === 0) {
                        e.preventDefault();
                        itemsRef.current[HELP_TAG_LIST.length - 1]?.focus();
                      }
                    }
                  }}
                  isSelected={isSelected}
                  tabIndex={0}
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

const RemoveButton = styled.div`
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
  user-select: none;
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

// 스크린리더 전용 텍스트
const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
