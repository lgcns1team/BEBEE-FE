import styled from "styled-components";
import { usePostStore } from "../../../store/usePostStore";
import { useState, useEffect, useRef } from "react";
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

  // 1. Store에서 필요한 상태와 액션들을 구조 분해 할당
  // 이제 filters라는 통객체가 아니라 type, isMatched, reqDTO로 분리되어 있습니다.
  const {
    posts,
    hasNext,
    isLoading,
    isLoadingMore,
    error,
    type,
    isMatched,
    fetchPosts,
    fetchMorePosts,
    setType,
    setIsMatched,
  } = usePostStore();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sort, setSort] = useState("최신순");
  const observerTarget = useRef<HTMLDivElement>(null);
  // 2. 초기 데이터 로드 (필터 빈 값 상태로 요청)
  useEffect(() => {
    fetchPosts();
  }, []);

  // 2. 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 화면에 관찰 대상이 보이고, 다음 페이지가 있고, 로딩 중이 아닐 때
        if (entries[0].isIntersecting && hasNext && !isLoadingMore) {
          fetchMorePosts();
        }
      },
      { threshold: 0.1 } // 10%만 보여도 트리거
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasNext, isLoadingMore, fetchMorePosts]);

  // 3. 탭 클릭 핸들러 (전체/일회성/정기적)
  const handleTypeChange = (newType: HelpType | undefined) => {
    setType(newType);
  };

  // 4. 매칭 완료 여부 버튼 클릭 핸들러
  const handleMatchedChange = (matched: boolean | undefined) => {
    setIsMatched(matched);
  };

  return (
    <Layout>
      <Wrapper>
        {/* ---------------- Tabs ---------------- */}
        <TabBar>
          {/* filters.type 대신 Store의 type 상태를 직접 사용 */}
          <Tab
            $active={type === undefined}
            onClick={() => handleTypeChange(undefined)}
          >
            전체
          </Tab>
          <Tab $active={type === "DAY"} onClick={() => handleTypeChange("DAY")}>
            하루 도움
          </Tab>
          <Tab
            $active={type === "TERM"}
            onClick={() => handleTypeChange("TERM")}
          >
            장기 도움
          </Tab>
        </TabBar>

        {/* ---------------- Filter Row ---------------- */}
        <FilterRow>
          <FilterButton onClick={() => setIsFilterSheetOpen(true)} />

          <SortSelect>
            <button
              className="sort-btn"
              onClick={() => setIsSortOpen(!isSortOpen)}
            >
              {sort}
              <ChevronDownIcon size={16} />
            </button>

            {/* {isSortOpen && (
              <div className="dropdown">
                <span onClick={() => handleSelectSort("최신순")}>최신순</span>
                <span onClick={() => handleSelectSort("마감순")}>마감순</span>
              </div>
            )}*/}
          </SortSelect>

          <Checkbox
            // isMatched가 false일 때만 체크된 상태로 표시
            checked={isMatched === false}
            onChange={handleMatchedChange}
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

          {/* 추가 기능: 무한 스크롤 대신 '더보기' 버튼을 쓴다면 */}
          {/* {hasNext && !isLoading && <button onClick={() => fetchPosts(false)}>더보기</button>} */}
        </ListWrapper>

        {/* ---------------- BottomSheet ---------------- */}
        {/* reqDTO 등의 상세 필터는 이 컴포넌트 내부에서 setReqDTO를 사용하도록 구성됩니다. */}
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
