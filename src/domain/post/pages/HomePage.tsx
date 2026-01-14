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
import { Toast } from "../../../components/Toast";
import { initializeFCM, setupFCMMessageListener } from "../../../hooks/useFirebaseHandler";
import { registerFCMToken } from "../../../api/notificationApi";
import Alarm from "../../../components/Alarm";
import { NotificationPermissionModal } from "../../../components/NotificationPermissionModal";
import { useNotificationPermissionStore } from "../../../store/useNotificationPermissionStore";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Loading from "../../../components/Loading";
import PullToRefreshWrapper from "../../../components/PullToRefreshWrapper";
// 모바일 기기 감지 유틸리티
const detectDeviceType = (): "WEB_PC" | "WEB_MOBILE" => {
  if (typeof window === "undefined") return "WEB_PC";

  const userAgent = navigator.userAgent || navigator.vendor || "";
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent.toLowerCase()
  );

  const deviceType = isMobile ? "WEB_MOBILE" : "WEB_PC";

  const isDev = import.meta.env.DEV;
  if (isDev) {
    console.log("📱 [디바이스 감지]", {
      userAgent,
      detectedType: deviceType,
      isMobile,
    });
  }

  return deviceType;
};

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const fcmInitialized = useRef(false);
  const { user } = useUserStore();
  const role = user?.role;
  const isHelper = role === "HELPER";
  const { isModalOpen } = useNotificationPermissionStore();

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
    if (hasInitialized.current || (Array.isArray(posts) && posts.length > 0 && !isLoading)) {
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

  // Pull to Refresh 핸들러
  const handleRefresh = async () => {
    await fetchPosts();
  };

  // 6. FCM 초기화 및 토큰 등록 (권한이 이미 있는 경우에만 자동 등록)
  useEffect(() => {
    // 로그인하지 않았거나 이미 초기화했으면 스킵
    if (!user || fcmInitialized.current) {
      return;
    }

    // 홈 페이지에서만 실행
    if (location.pathname !== "/home") {
      return;
    }

    // PWA 모드 확인 (standalone, fullscreen 등)
    const isPWA =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator &&
        (window.navigator as { standalone?: boolean }).standalone === true) ||
      document.referrer.includes("android-app://");

    const setupFCM = async () => {
      try {
        const isDev = import.meta.env.DEV;

        // Service Worker가 준비될 때까지 대기
        if ("serviceWorker" in navigator) {
          try {
            await navigator.serviceWorker.ready;
          } catch (error) {
            // Service Worker가 없어도 계속 진행
            if (isDev) {
              console.warn("⚠️ [FCM] Service Worker 준비 대기 중 오류:", error);
            }
          }
        }

        // 알림 권한 확인
        const permission = Notification.permission;

        if (isDev) {
          console.log("🔔 [FCM] 권한 상태 확인...", { isPWA, permission });
        }

        // 권한이 이미 허용된 경우에만 자동으로 토큰 등록
        // 권한 요청은 마이페이지의 알림 토글 클릭 시 수행됨
        if (permission === "granted") {
          // 알림 권한 요청 없이 토큰만 가져오기
          const token = await initializeFCM(false);

          if (token) {
            if (isDev) {
              console.log("✅ [FCM] 토큰 획득 성공:", token);
            }

            // 서버에 토큰 등록
            try {
              const deviceType = detectDeviceType();
              await registerFCMToken(token, deviceType);
              if (isDev) {
                console.log("✅ [FCM] 토큰 서버 등록 성공");
              }
              fcmInitialized.current = true;
            } catch (error) {
              console.error("❌ [FCM] 토큰 서버 등록 실패:", error);
            }
          }

          // 포그라운드 메시지 리스너 설정
          setupFCMMessageListener();
        } else {
          // 권한이 없는 경우: 로그인 페이지에서 input 클릭 시 요청됨
          if (isDev) {
            console.log(
              "ℹ️ [FCM] 알림 권한이 없습니다. 로그인 페이지에서 input을 클릭하거나 Alarm 아이콘을 클릭하여 권한을 요청하세요."
            );
          }
        }
      } catch (error) {
        console.error("❌ [FCM] 초기화 오류:", error);
      }
    };

    setupFCM();
  }, [user, location.pathname]);
  return (
    <Layout>
      <Toast position="top" />
      {isModalOpen && <NotificationPermissionModal />}

      <Wrapper ref={wrapperRef}>
        <Alarm />
        {/* ---------------- Tabs ---------------- */}
        <TabBar>
          {/* filters.type 대신 Store의 type 상태를 직접 사용 */}
          <Tab $active={type === undefined} onClick={() => handleTypeChange(undefined)}>
            전체
          </Tab>
          <Tab $active={type === "DAY"} onClick={() => handleTypeChange("DAY")}>
            하루 도움
          </Tab>
          <Tab $active={type === "TERM"} onClick={() => handleTypeChange("TERM")}>
            장기 도움
          </Tab>
        </TabBar>

        {/* ---------------- Filter Row ---------------- */}
        <FilterRow>
          <FilterButton onClick={() => setIsFilterSheetOpen(true)} />

          <SortSelect>
            <button className="sort-btn" onClick={() => setIsSortOpen(!isSortOpen)}>
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
        <PullToRefreshContainer>
          <PullToRefreshWrapper onRefresh={handleRefresh}>
            <ListWrapper>
              {posts?.map((post) => {
                if (!post) return null;
                return (
                  <div key={post.postId} onClick={() => navigate(`/post/${post.postId}`)}>
                    <PostCard post={post} />
                  </div>
                );
              })}
              {isLoading && <Loading />}
              {!isLoading && posts?.length === 0 && <span>조건에 맞는 게시글이 없습니다.</span>}
              {/* 무한 스크롤 감지용 타겟 (바닥) */}
              <div ref={observerTarget} style={{ height: "50px", textAlign: "center" }}>
                {!hasNext && posts?.length > 0 && <p>마지막 게시글입니다.</p>}
              </div>
            </ListWrapper>
          </PullToRefreshWrapper>
        </PullToRefreshContainer>

        {/* ---------------- BottomSheet ---------------- */}
        {/* reqDTO 등의 상세 필터는 이 컴포넌트 내부에서 setReqDTO를 사용하도록 구성됩니다. */}
        <FilterBottomSheet isOpen={isFilterSheetOpen} onClose={() => setIsFilterSheetOpen(false)} />
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
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const TabBar = styled.div`
  position: fixed;
  display: flex;
  gap: 32px;
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
  color: ${({ theme, $active }) => ($active ? theme.color.text : theme.color.subText2)};
  font-weight: ${({ theme, $active }) => ($active ? theme.weight.medium : theme.weight.regular)};

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;

    /* 활성화 상태일 때만 theme.color.text(검은색계열)를 보여줌 */
    background-color: ${({ theme, $active }) => ($active ? theme.color.text : "transparent")};

    border-radius: ${({ theme }) => theme.borderRadius.sm};

    /* 부드러운 전환을 원한다면 추가 */
    transition: background-color 0.2s ease;
  }
`;

const FilterRow = styled.div`
  z-index: 90;
  position: fixed;
  margin-top: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 18px;
  background-color: ${({ theme }) => theme.color.white};
  justify-content: space-between;
  width: 343px;
`;
const ChevronDownIcon = styled(IoChevronDown)`
  color: ${({ theme }) => theme.color.subText2};
`;

const PullToRefreshContainer = styled.div`
  margin-top: 100px;
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
