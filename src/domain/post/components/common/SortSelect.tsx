// // src/components/common/SortSelect.tsx

// import styled from "styled-components";
// import { useState } from "react";
// import { IoChevronDown } from "react-icons/io5";
// import { useSortStore } from "../../../../store/useSortStore";

// const SortSelect = () => {
//   const { sort, setSort } = useSortStore();
//   const [open, setOpen] = useState(false);

//   const handleSelect = (v: string) => {
//     setSort(v);
//     setOpen(false);
//   };

//   return (
//     <Wrapper>
//       <Button onClick={() => setOpen((prev) => !prev)}>
//         <span>{sort || "정렬"}</span>
//         <ChevronDownIcon size={14} />
//       </Button>

//       {open && (
//         <Dropdown>
//           <Item onClick={() => handleSelect("최신순")}>최신순</Item>
//           <Item onClick={() => handleSelect("마감순")}>마감순</Item>
//         </Dropdown>
//       )}
//     </Wrapper>
//   );
// };

// export default SortSelect;

// /* ---------------- styled-components ---------------- */

// const Wrapper = styled.div`
//   position: relative;
// `;

// const Button = styled.button`
//   display: flex;
//   align-items: center;
//   gap: 6px;

//   padding: 6px 14px;
//   height: 32px;
//   background: #fff;
//   border: 0.5px solid #dcdcdc;
//   border-radius: 20px;

//   font-size: ${({ theme }) => theme.size.md};
//   color: ${({ theme }) => theme.color.text};

//   cursor: pointer;
// `;

// const Dropdown = styled.div`
//   position: absolute;
//   top: 38px;
//   left: 0;
//   width: 100%;
//   background: white;
//   border: 0.5px solid #dcdcdc;
//   font-size: ${({ theme }) => theme.size.md};
//   border-radius: ${({ theme }) => theme.borderRadius.lg};
//   overflow: hidden;
//   z-index: 50;
// `;

// const Item = styled.div`
//   padding: 10px 12px;
//   font-size: ${({ theme }) => theme.size.md};
//   cursor: pointer;

//   &:hover {
//     background: ${({ theme }) => theme.color.natural100};
//   }
// `;

// const ChevronDownIcon = styled(IoChevronDown)`
//   color: ${({ theme }) => theme.color.text};
// `;
