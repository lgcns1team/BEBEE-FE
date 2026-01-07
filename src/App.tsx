import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./domain/post/pages/HomePage";
import PostDetailPage from "./domain/post/pages/PostDetailPage";
import ChatListPage from "./domain/chat/pages/ChatListPage";
import ChatRoomPage from "./domain/chat/pages/ChatRoomPage";
import MatchingPage from "./domain/matching/pages/MatchingPage";
import ReviewPage from "./domain/review/pages/ReviewPage";
import PostWritePage from "./domain/post/pages/PostWritePage";

import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./styles/GlobalStyle";
import theme from "./styles/theme";
import "./App.css";

import MatchingInfoPage from "./domain/matching/pages/MatchingInfoPage";
import MapHelperPage from "./domain/map/pages/MapHelperPage";
import MapDisabledPage from "./domain/map/pages/MapDisabledPage";
import DisabledMyPage from "./domain/mypage/page/DisabledMyPage";
import MatchFormPage from "./domain/chat/pages/MatchFormPage";
import ApplicateLandingPage from "./domain/Application/page/ApplicateLandingPage";
import ApplicateStatusPage from "./domain/Application/page/ApplicateStatusPage";
import ApplicantPage from "./domain/Application/page/ApplicantPage";
import AuthSignUpStep1Page from "./domain/auth/pages/AuthSignUpStep1Page";
import AuthSignUpStep2Page from "./domain/auth/pages/AuthSignUpStep2Page";
import AuthSignUpStep3Page from "./domain/auth/pages/AuthSignUpStep3Page";
import AuthSignUpStep4Page from "./domain/auth/pages/AuthSignUpStep4Page";
import AuthSignUpStep5Page from "./domain/auth/pages/AuthSignUpStep5Page";
import AuthSignUpStep6Page from "./domain/auth/pages/AuthSignUpStep6Page";
import ProfileInfoPage from "./domain/mypage/page/ProfileInfoPage";
import AuthLoginPage from "./domain/auth/pages/AuthLoginPage";
import ChargePage from "./domain/Pay/page/ChargePage";
import Checkout from "./domain/Pay/components/Checkout";

function App() {
  const { setAccessToken, setUser } = useUserStore();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const silentLogin = async () => {
      // 현재 로그인 상태를 직접 조회 (의존성 배열 최적화)
      const { isLoggedIn } = useUserStore.getState();

      if (!isLoggedIn) {
        try {
          // 1. Refresh Token(쿠키)으로 Access Token 재발급 시도
          const { accessToken } = await reissueToken();
          setAccessToken(accessToken);

          // 2. 재발급 성공 시 사용자 정보 복구
          const userInfo = await getMyInfo();

          // 3. Role 타입 검증
          if (!isValidRole(userInfo.role)) {
            throw new Error(`Invalid role: ${userInfo.role}`);
          }

          setUser({
            ...userInfo,
            role: userInfo.role
          });
        } catch (error) {
          // 쿠키가 없거나 만료된 경우 -> 그냥 비로그인 상태 유지
          // 프로덕션에서는 로그 제거
        } finally {
          setIsAuthChecking(false);
        }
      } else {
        setIsAuthChecking(false);
      }
    };
    silentLogin();
  }, [setAccessToken, setUser]); // isLoggedIn 제거로 불필요한 재실행 방지

  // 인증 체크 중에는 로딩 표시 (사용자 경험 개선)
  if (isAuthChecking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          fontSize: '18px',
          color: '#666'
        }}>
          로딩 중...
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          {/* 홈 */}
          <Route path="/" element={<HomePage />} />

          {/* 게시글 상세 */}
          <Route path="/post/:postId" element={<PostDetailPage />} />

          {/* 게시글 작성 */}
          <Route path="/post/write" element={<PostWritePage />} />

          {/*채팅*/}
          <Route path="/chat" element={<ChatListPage />} />
          <Route path="/chat/:chatroomId" element={<ChatRoomPage />} />
          <Route path="/chat/:chatroomId/match" element={<MatchFormPage />} />

          {/*마이페이지*/}
          {/* <Route path="/mypage" element={<MyPage />} /> */}

          {/* 마이페이지에서 보는 프로필 정보 */}
          <Route path="/profile-info/:infoId" element={<ProfileInfoPage />} />

          {/* 마이페이지 */}
          <Route path="/mypage" element={<DisabledMyPage />} />

          {/*동네지도*/}
          <Route path="/map" element={<MapDisabledPage />} />
          <Route path="/map/disabled" element={<MapDisabledPage />} />
          <Route path="/map/helper" element={<MapHelperPage />} />

          {/* 매칭 */}
          <Route path="/engagements" element={<MatchingPage />} />

          {/* 매칭 확인서 */}
          <Route
            path="/match-info/:agreementId"
            element={<MatchingInfoPage />}
          />
          {/* 리뷰 */}
          <Route path="/review/:agreementId" element={<ReviewPage />} />
          {/*  테스트 */}
          <Route path="/applicate-landing" element={<ApplicateLandingPage />} />
          <Route path="/applicate-status" element={<ApplicateStatusPage />} />
          <Route path="/applicant/:postId" element={<ApplicantPage />} />

          {/* 회원가입 */}
          <Route path="/login" element={<AuthLoginPage />} />
          <Route path="/signup/step1" element={<AuthSignUpStep1Page />} />
          <Route path="/signup/step2" element={<AuthSignUpStep2Page />} />
          <Route path="/signup/step3" element={<AuthSignUpStep3Page />} />
          <Route path="/signup/step4" element={<AuthSignUpStep4Page />} />
          <Route path="/signup/step5" element={<AuthSignUpStep5Page />} />
          <Route path="/signup/step6" element={<AuthSignUpStep6Page />} />
          {/* 결제 */}
          <Route path="/charge" element={<ChargePage />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
