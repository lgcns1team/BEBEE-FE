// src/components/common/SortSelect.tsx

import styled from "styled-components";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { useSortStore } from "../../../../store/useSortStore";

const SortSelect = () => {
  const { sort, setSort } = useSortStore();
  const [open, setOpen] = useState(false);

  const handleSelect = (v: string) => {
    setSort(v);
    setOpen(false);
  };

  return (
    <Wrapper>
      <Button onClick={() => setOpen((prev) => !prev)}>
        <span>{sort || "정렬"}</span>
        <IoChevronDown size={14} color="var(--text)" />
      </Button>

      {open && (
        <Dropdown>
          <Item onClick={() => handleSelect("최신순")}>최신순</Item>
          <Item onClick={() => handleSelect("마감순")}>마감순</Item>
        </Dropdown>
      )}
    </Wrapper>
  );
};

export default SortSelect;

/* ---------------- styled-components ---------------- */

const Wrapper = styled.div`
  position: relative;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 6px 14px;
  height: 32px;
  background: #fff;
  border: 1px solid #dcdcdc;
  border-radius: 20px;

  font-size: 14px;
  color: var(--text);

  cursor: pointer;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 38px;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #dcdcdc;
  border-radius: 12px;
  overflow: hidden;
  z-index: 50;
`;

const Item = styled.div`
  padding: 10px 12px;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;
