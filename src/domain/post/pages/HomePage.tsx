import styled from "styled-components";
import { usePostStore } from "../../../store/usePostStore";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PostCard from "../components/list/PostCard";
import FilterButton from "../components/list/FilterButton";
import FilterBottomSheet from "../components/bottomsheet/FilterBottomSheet";
import { IoChevronDown } from "react-icons/io5";
import type { HelpType } from "../../../types/post.type";
import Layout from "../../../components/Layout";
import NavBar from "../../../components/NavBar";
import WriteButton from "../components/common/WriteButton";
import { Checkbox } from "../../../components/Checkbox";
import { useUserStore } from "../../../store/useUserStore";
const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Store에서 필요한 상태와 액션들을 구조 분해 할당

  const {
    posts,
    hasNext,
    isLoading,
    isLoadingMore,
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
  const hasInitialized = useRef(false);
  const { user } = useUserStore();
  const role = user?.role;
  const isHelper = role === "HELPER";

  // HomePage에서 뒤로가기 방지
  useEffect(() => {
    // history 스택에 현재 상태를 추가하여 뒤로가기를 막음
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      // 뒤로가기를 눌렀을 때 다시 /home으로 이동 (replace로 history 스택에서 제거)
      navigate("/home", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);
  // 초기 데이터 로드 (필터 빈 값 상태로 요청)
  useEffect(() => {
    // 홈 경로가 아니면 초기화하지 않음
    if (location.pathname !== "/home") {
      return;
    }

    // 이미 초기화했거나 게시글이 있으면 다시 로드하지 않음
    // posts가 undefined/null이거나 배열이 아닐 경우를 대비해 안전하게 체크
    if (
      hasInitialized.current ||
      (Array.isArray(posts) && posts.length > 0 && !isLoading)
    ) {
      return;
    }

    hasInitialized.current = true;
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 배열로 마운트 시 1회만 실행

  // 3. 무한 스크롤 감지 (Intersection Observer)
  useEffect(() => {
    if (!observerTarget.current || !hasNext) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 요소가 화면에 나타나고, 로딩 중이 아닐 때만 다음 페이지 요청
        if (entries[0].isIntersecting && !isLoading && !isLoadingMore) {
          fetchMorePosts();
        }
      },
      { threshold: 1.0 } // 요소가 100% 다 보였을 때 실행
    );

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNext, isLoading, isLoadingMore]);
  // 4. 탭 클릭 핸들러 (전체/일회성/정기적)
  const handleTypeChange = (newType: HelpType | undefined) => {
    setType(newType);
  };

  // 5. 매칭 완료 여부 버튼 클릭 핸들러
  const handleMatchedChange = (checked: boolean) => {
    console.log("클릭:", checked);
    setIsMatched(checked ? false : undefined);
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
            checked={isMatched === false}
            onChange={handleMatchedChange}
            label="완료 제외"
          />
        </FilterRow>

        {/* ---------------- Post List ---------------- */}
        <ListWrapper>
          {posts?.map((post) => {
            if (!post) return null;
            return (
              <div
                key={post.postId}
                onClick={() => navigate(`/post/${post.postId}`)}
              >
                <PostCard post={post} />
              </div>
            );
          })}

          {isLoading && <span>불러오는 중...</span>}
          {!isLoading && posts?.length === 0 && (
            <span>조건에 맞는 게시글이 없습니다.</span>
          )}
          {/* 무한 스크롤 감지용 타겟 (바닥) */}
          <div
            ref={observerTarget}
            style={{ height: "50px", textAlign: "center" }}
          >
            {isLoadingMore && <p> 불러오는 중...</p>}
            {!hasNext && posts?.length > 0 && <p>마지막 게시글입니다.</p>}
          </div>
        </ListWrapper>

        {/* ---------------- BottomSheet ---------------- */}
        {/* reqDTO 등의 상세 필터는 이 컴포넌트 내부에서 setReqDTO를 사용하도록 구성됩니다. */}
        <FilterBottomSheet
          isOpen={isFilterSheetOpen}
          onClose={() => setIsFilterSheetOpen(false)}
        />
        {!isHelper && <WriteButton onClick={() => navigate("/post/write")} />}
        <NavBar />
      </Wrapper>
    </Layout>
  );
};
export default HomePage;
/* ---------------- styled-components ---------------- */

const Wrapper = styled.div`
  min-height: 100vh;
  overflow-y: auto;
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
  color: ${({ theme, $active }) =>
    $active ? theme.color.text : theme.color.subText2};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.weight.medium : theme.weight.regular};

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;

    /* 활성화 상태일 때만 theme.color.text(검은색계열)를 보여줌 */
    background-color: ${({ theme, $active }) =>
      $active ? theme.color.text : "transparent"};

    border-radius: ${({ theme }) => theme.borderRadius.sm};

    /* 부드러운 전환을 원한다면 추가 */
    transition: background-color 0.2s ease;
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
