import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./domain/post/pages/HomePage";
import PostDetailPage from "./domain/post/pages/PostDetailPage";
import ChatListPage from "./domain/chat/pages/ChatListPage";
//import MatchFormPage from "./domain/chat/pages/MatchFormPage";
import ChatRoomPage from "./domain/chat/pages/ChatRoomPage";
import MatchingPage from "./domain/matching/pages/MatchingPage";
import ReviewPage from "./domain/review/pages/ReviewPage";
import PostWritePage from "./domain/post/pages/PostWritePage";

import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./styles/GlobalStyle";
import theme from "./styles/theme";
import { initViewportHeight } from "./utils/viewport";
import { FCMMessageModal } from "./components/FCMMessageModal";
import "./App.css";
import MatchingInfoPage from "./domain/matching/pages/MatchingInfoPage";
import MapHelperPage from "./domain/map/pages/MapHelperPage";
//import MapDisabledPage from "./domain/map/pages/MapDisabledPage";
import MatchFormPage from "./domain/chat/pages/MatchFormPage";
import ApplicateLandingPage from "./domain/Application/page/ApplicateLandingPage";
import ApplicateStatusPage from "./domain/Application/page/ApplicateStatusPage";
import ApplicantPage from "./domain/Application/page/ApplicantPage";
import AuthSignUpStep1Page from "./domain/auth/pages/AuthSignUpStep1Page";
import AuthSignUpStep2Page from "./domain/auth/pages/AuthSignUpStep2Page";
import AuthSignUpStep3Page from "./domain/auth/pages/AuthSignUpStep3Page";
import AuthSignUpStep4Page from "./domain/auth/pages/AuthSignUpStep4Page";
import AuthSignUpStep5Page from "./domain/auth/pages/AuthSignUpStep5Page";
import AuthSignUpStep6DemoPage from "./domain/auth/pages/AuthSignUpStep6DemoPage";
import AuthSignUpCompletePage from "./domain/auth/pages/AuthSignUpCompletePage";
import ProfileInfoPage from "./domain/mypage/page/ProfileInfoPage";
import AuthLoginPage from "./domain/auth/pages/AuthLoginPage";
import MyPage from "./domain/mypage/page/MyPage";
import ChargePage from "./domain/Pay/page/ChargePage";
import { CheckoutPage } from "./domain/Pay/page/CheckoutPage";
import { SuccessPage } from "./domain/Pay/page/SuccessPage";
import { FailPage } from "./domain/Pay/page/FailPage";
import LandingPage from "./domain/Landing/page/LandingPage";
import BadgePage from "./domain/Badge/page/Badge";
import BadgeDetailPage from "./domain/Badge/page/BadgeDetailPage";
import BadgeSharePage from "./domain/Badge/page/BadgeSharePage";
import ProfilePage from "./domain/profile/pages/ProfilePage";
import LoadingPage from "./domain/auth/pages/LoadingPage";
import MapPage from "./domain/map/pages/MapPage";
import "./reset.css";
function App() {
  // 모바일 브라우저 뷰포트 높이 초기화
  useEffect(() => {
    const cleanup = initViewportHeight();
    return cleanup;
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />

      <BrowserRouter>
        <FCMMessageModal />
        <Routes>
          {/* 랜딩페이지 */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          {/* 홈 */}
          <Route path="/home" element={<HomePage />} />

          {/* 게시글 상세 */}
          <Route path="/post/:postId" element={<PostDetailPage />} />

          {/* 게시글 작성 */}
          <Route path="/post/write" element={<PostWritePage />} />

          {/*채팅*/}
          <Route path="/chat" element={<ChatListPage />} />
          <Route path="/chat/:chatroomId" element={<ChatRoomPage />} />
          <Route path="/chat/:chatroomId/match" element={<MatchFormPage />} />

          <Route path="/mypage" element={<MyPage />} />

          {/* 마이페이지에서 보는 프로필 정보 */}
          <Route path="/profile-info" element={<ProfileInfoPage />} />

          {/* 타인이 보는 프로필 정보 */}
          <Route path="/profile/:memberId" element={<ProfilePage />} />
          {/*동네지도*/}
          <Route path="/map" element={<MapPage />} />
          {/* <Route path="/map/disabled" element={<MapDisabledPage />} /> */}
          <Route path="/map/helper" element={<MapHelperPage />} />

          {/* 매칭 */}
          <Route path="/engagements" element={<MatchingPage />} />

          {/* 매칭 확인서 */}
          <Route
            path="/match-info/:agreementId"
            element={<MatchingInfoPage />}
          />
          {/* 리뷰 */}
          <Route path="/review/:matchId" element={<ReviewPage />} />
          {/*뱃지*/}
          <Route path="/badge" element={<BadgePage />} />
          <Route path="/badge/:disabilityId" element={<BadgeDetailPage />} />
          <Route path="/badge/share" element={<BadgeSharePage />} />
          {/*지원 현황 */}
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
          <Route path="/signup/step6" element={<AuthSignUpStep6DemoPage />} />
          <Route path="/signup/complete" element={<AuthSignUpCompletePage />} />
          {/* 결제 */}
          <Route path="/charge" element={<ChargePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payments/success" element={<SuccessPage />} />
          <Route path="/payments/fail" element={<FailPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
