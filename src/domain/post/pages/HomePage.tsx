import styled from "styled-components";
import { usePostStore } from "../../../store/usePostStore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/list/PostCard";
import FilterButton from "../components/list/FilterButton";
import FilterBottomSheet from "../components/bottomsheet/FilterBottomSheet";
import { IoChevronDown } from "react-icons/io5";
import type { HelpType } from "../../../types/post.type";
import Layout from "../../../components/Layout";
import NavBar from "../../../components/NavBar";
import WriteButton from "../components/common/WriteButton";
import { Checkbox } from "../../../components/Checkbox";

const HomePage = () => {
  const navigate = useNavigate();

  // 1. 스토어 상태 및 액션 가져오기
  const { posts, fetchPosts, filters, setFilters, isLoading } = usePostStore();

  // 2. 로컬 UI 상태 (정렬, 드롭다운 등)
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sort, setSort] = useState("최신순");

  // 3. 초기 데이터 로드
  useEffect(() => {
    fetchPosts(true);
  }, []);

  // 4. 상단 탭 필터 (전체/일회성/정기적)
  const handleApplyTab = (type: HelpType | "ALL") => {
    setFilters({
      ...filters,
      type: type === "ALL" ? undefined : type,
    });
    fetchPosts(true);
  };

  // 5. "완료 제외" 체크박스 핸들러
  // 체크 시: 매칭 전만 보기 (isMatched: false), 체크 해제 시: 전체 보기 (isMatched: null)
  const handleExcludeDoneChange = (checked: boolean) => {
    setFilters({
      ...filters,
      isMatched: checked ? false : null,
    });
    fetchPosts(true);
  };

  // 6. 정렬 관련 핸들러
  const toggleSort = () => setIsSortOpen(!isSortOpen);
  const handleSelectSort = (label: string) => {
    setSort(label);
    setIsSortOpen(false);
    // 필요 시 fetchPosts(true) 호출하여 서버 정렬 요청 가능
  };

  return (
    <Layout>
      <Wrapper>
        {/* ---------------- Tabs ---------------- */}
        <TabBar>
          <Tab $active={!filters.type} onClick={() => handleApplyTab("ALL")}>
            전체
          </Tab>
          <Tab
            $active={filters.type === "DAY"}
            onClick={() => handleApplyTab("DAY")}
          >
            하루 도움
          </Tab>
          <Tab
            $active={filters.type === "TERM"}
            onClick={() => handleApplyTab("TERM")}
          >
            장기 도움
          </Tab>
        </TabBar>

        {/* ---------------- Filter Row ---------------- */}
        <FilterRow>
          <FilterButton onClick={() => setIsFilterSheetOpen(true)} />

          <SortSelect>
            <button className="sort-btn" onClick={toggleSort}>
              {sort}
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
            checked={filters.isMatched === false}
            onChange={handleExcludeDoneChange}
            label="완료 제외"
          />
        </FilterRow>

        {/* ---------------- Post List ---------------- */}
        <ListWrapper>
          {posts.map((post) => (
            <div
              key={post.postId}
              onClick={() => navigate(`/post/${post.postId}`)}
            >
              <PostCard post={post} />
            </div>
          ))}

          {isLoading && <span>불러오는 중...</span>}
          {!isLoading && posts.length === 0 && (
            <span>조건에 맞는 게시글이 없습니다.</span>
          )}
        </ListWrapper>

        {/* ---------------- BottomSheet ---------------- */}
        <FilterBottomSheet
          isOpen={isFilterSheetOpen}
          onClose={() => setIsFilterSheetOpen(false)}
        />

        <WriteButton onClick={() => navigate("post/write")} />
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

const Tab = styled.button<{ $active?: boolean }>`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.subText2};
  padding-bottom: 10px;
  cursor: pointer;
  position: relative;
  border: none;
  background-color: ${({ theme }) => theme.color.white};
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
