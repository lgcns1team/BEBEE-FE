import styled from "styled-components";
import PostCard from "../components/list/PostCard";
import { usePostStore } from "../../../store/usePostStore";
import { useSortStore } from "../../../store/useSortStore";
import { useState, useEffect } from "react";

import FilterButton from "../components/list/FilterButton";
import FilterBottomSheet from "../components/bottomsheet/FilterBottomSheet";

import { IoChevronDown } from "react-icons/io5";

const HomePage = () => {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const toggleSort = () => setIsSortOpen((prev) => !prev);

  const handleSelectSort = (value: string) => {
    setSort(value);
    setIsSortOpen(false);
  };
  const { posts, setPosts } = usePostStore();
  const {
    sort,
    activeTab,
    excludeDone,
    setSort,
    setActiveTab,
    setExcludeDone,
  } = useSortStore();

  /** 더미 데이터 */
  useEffect(() => {
    setPosts([
      {
        id: 1,
        title: "상체 운동 PT해주실 분 구합니다",
        location: "장충동",
        date: "11월 30일 (화)",
        honey: 300,
        category: "하루 도움",
        done: false,
        tags: ["이동 지원", "생활 지원"],
      },
      {
        id: 2,
        title: "굿모닝 마트에서 한우 육회 1++",
        location: "장충동",
        date: "11월 30일 (화)",
        honey: 200,
        category: "하루 도움",
        done: true,
        tags: ["생활 지원"],
      },
      {
        id: 3,
        title: "굿모닝 마트에서 한우 육회 1++",
        location: "장충동",
        date: "월요일, 수요일",
        honey: 200,
        category: "지속 도움",
        done: true,
        tags: ["생활 지원"],
      },
    ]);
  }, [setPosts]);

  /** 필터된 게시글 */
  const filteredPosts = posts.filter((p) => {
    if (activeTab !== "전체" && p.category !== activeTab) return false;
    if (excludeDone && p.done) return false;
    return true;
  });

  return (
    <Wrapper>
      {/* ---------------- Tabs ---------------- */}
      <TabBar>
        {(["전체", "하루 도움", "지속 도움"] as const).map((tab) => (
          <Tab
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Tab>
        ))}
      </TabBar>

      {/* ---------------- Filters Row ---------------- */}
      <FilterRow>
        <FilterButton onClick={() => setIsFilterSheetOpen(true)} />

        <SortSelect>
          <button className="sort-btn" onClick={toggleSort}>
            {sort || "정렬"}
            <IoChevronDown size={14} color="#737373" />
          </button>

          {isSortOpen && (
            <div className="dropdown">
              <span onClick={() => handleSelectSort("최신순")}>최신순</span>
              <span onClick={() => handleSelectSort("마감순")}>마감순</span>
            </div>
          )}
        </SortSelect>
        <CheckBoxWrapper>
          <input
            type="checkbox"
            checked={excludeDone}
            onChange={(e) => setExcludeDone(e.target.checked)}
          />
          <span>완료 제외</span>
        </CheckBoxWrapper>
      </FilterRow>

      {/* ---------------- Post List ---------------- */}
      <ListWrapper>
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ListWrapper>

      {/* ---------------- Filter BottomSheet ---------------- */}
      <FilterBottomSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
      />
    </Wrapper>
  );
};

export default HomePage;

/* ---------------- styled-components ---------------- */

const Wrapper = styled.div`
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
`;

const TabBar = styled.div`
  display: flex;
  gap: 32px;
  padding: 12px 16px 0 16px;
  border-bottom: 0.5px solid #d4d4d8;
`;

const Tab = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: var(--sub-text2);
  padding-bottom: 10px;
  cursor: pointer;
  position: relative;

  &.active {
    color: var(--text);
    font-weight: 600;
  }

  &.active::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--text);
    border-radius: 2px;
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
`;

const CheckBoxWrapper = styled.label`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;

  input {
    width: 18px;
    height: 18px;
    border: 1.5px solid #e5e5e5;
    border-radius: 4px;
    cursor: pointer;

    /* 기본 체크박스 스타일 제거 */
    appearance: none;
    -webkit-appearance: none;
    outline: none;

    background-color: #fff; /* 기본 */

    /* 체크되었을 때 */
    &:checked {
      background-color: var(--main-color);
      border-color: var(--main-color);
    }

    /* 체크 표시 커스텀 (흰색 V 표시) */
    &:checked::after {
      content: "V";
      color: #fff;
      font-size: 14px;
      font-weight: 300;
      position: relative;
      left: 3px;
      top: -1px;
    }
  }

  span {
    font-size: 14px;
    color: var(--sub-text);
  }
`;

const ListWrapper = styled.div`
  padding-bottom: 40px;
`;

const SortSelect = styled.div`
  position: relative;

  .sort-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    height: 32px;
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    font-size: 14px;
    cursor: pointer;
    color: var(--sub-text);
  }

  .dropdown {
    position: absolute;
    top: 38px;
    left: 0;
    width: 100%;
    background: white;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    overflow: hidden;
    z-index: 20;

    span {
      display: block;
      padding: 10px;
      font-size: 13px;
      cursor: pointer;

      &:hover {
        background: #f5f5f5;
      }
    }
  }
`;
