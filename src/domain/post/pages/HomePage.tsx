import styled from "styled-components";
import { usePostStore } from "../../../store/usePostStore";
import { useState, useEffect } from "react";

import PostCard from "../components/list/PostCard";
import FilterButton from "../components/list/FilterButton";
import FilterBottomSheet from "../components/bottomsheet/FilterBottomSheet";
import { IoChevronDown } from "react-icons/io5";

import Layout from "../../../components/Layout";
import NavBar from "../../../components/NavBar";
import WriteButton from "../components/common/WriteButton";
import { Checkbox } from "../../../components/Checkbox";
import { postMockData } from "../../../mock/post/post.mock";

type TabType = "전체" | "하루 도움" | "지속 도움";

const HomePage = () => {
  const { posts, setPosts } = usePostStore();

  const [activeTab, setActiveTab] = useState<TabType>("전체");
  const [excludeDone, setExcludeDone] = useState(false);
  const [sort, setSort] = useState("");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const toggleSort = () => setIsSortOpen((prev) => !prev);

  const handleSelectSort = (value: string) => {
    setSort(value);
    setIsSortOpen(false);
  };

  useEffect(() => {
    setPosts(postMockData);
  }, [setPosts]);

  const filteredPosts = posts
    .filter((p) => {
      if (activeTab !== "전체" && p.type !== activeTab) return false;
      if (excludeDone && p.status) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "최신순") return b.postId - a.postId;
      if (sort === "마감순") return Number(a.status) - Number(b.status);
      return 0;
    });

  return (
    <Layout>
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

        {/* ---------------- Filter Row ---------------- */}
        <FilterRow>
          <FilterButton onClick={() => setIsFilterSheetOpen(true)} />

          <SortSelect>
            <button className="sort-btn" onClick={toggleSort}>
              {sort || "정렬"}
              <ChevronDownIcon size={16} />
            </button>

            {isSortOpen && (
              <div className="dropdown">
                <span onClick={() => handleSelectSort("최신순")}>최신순</span>
                <span onClick={() => handleSelectSort("마감순")}>마감순</span>
              </div>
            )}
          </SortSelect>

          <Checkbox
            checked={excludeDone}
            onChange={setExcludeDone}
            label="완료 제외"
          />
        </FilterRow>

        {/* ---------------- Post List ---------------- */}
        <ListWrapper>
          {filteredPosts.map((post) => (
            <PostCard key={post.postId} post={post} />
          ))}
        </ListWrapper>

        {/* ---------------- BottomSheet ---------------- */}
        <FilterBottomSheet
          isOpen={isFilterSheetOpen}
          onClose={() => setIsFilterSheetOpen(false)}
        />

        <WriteButton />
        <NavBar />
      </Wrapper>
    </Layout>
  );
};

export default HomePage;

/* ---------------- styled-components ---------------- */

const Wrapper = styled.div`
  min-height: 100vh;
`;

const TabBar = styled.div`
  margin-bottom: 20px;
  position: fixed;
  display: flex;
  gap: 32px;
  padding-top: 12px;
  padding-bottom: 0;
  border-bottom: 0.5px solid #d4d4d8;
  z-index: 90;
  background-color: white;
  width: 343px;
`;

const Tab = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.subText2};
  padding-bottom: 10px;
  cursor: pointer;
  position: relative;

  &.active {
    color: ${({ theme }) => theme.color.text};
    font-weight: ${({ theme }) => theme.weight.medium};
  }

  &.active::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${({ theme }) => theme.color.text};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
`;

const FilterRow = styled.div`
  z-index: 90;
  position: fixed;
  margin-top: 45px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 20px;
  background-color: white;
  justify-content: space-between;
  width: 343px;
`;
const ChevronDownIcon = styled(IoChevronDown)`
  color: ${({ theme }) => theme.color.subText2};
`;

const ListWrapper = styled.div`
  padding-top: 120px;
  padding-bottom: 40px;
`;

const SortSelect = styled.div`
  position: relative;

  .sort-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    background: ${({ theme }) => theme.color.white};
    border: 0.5px solid ${({ theme }) => theme.color.natural200};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    font-size: ${({ theme }) => theme.size.sm};
    cursor: pointer;
    color: ${({ theme }) => theme.color.text};
  }

  .dropdown {
    position: absolute;
    top: 38px;
    left: 0;
    width: 100%;
    background: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.natural200};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    overflow: hidden;
    z-index: 20;

    span {
      display: block;
      padding: 10px;
      font-size: ${({ theme }) => theme.size.sm};
      cursor: pointer;

      &:hover {
        background: ${({ theme }) => theme.color.natural100};
      }
    }
  }
`;
