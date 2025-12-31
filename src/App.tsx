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
// import ProfilePage from "./domain/profile/pages/DisabledProfilePage";
// import DayHelpWrite from "./domain/post/components/write/DayHelpWrite";
// import LongHelpWrite from "./domain/post/components/write/LongHelpWrite";

import MatchingInfoPage from "./domain/matching/pages/MatchingInfoPage";
import MapHelperPage from "./domain/map/pages/MapHelperPage";
import ChatTestPage from "./domain/chat/pages/ChatTestPage";
import ApplicateLandingPage from "./domain/Application/page/ApplicateLandingPage";
import ApplicateStatusPage from "./domain/Application/page/ApplicateStatusPage";
import ApplicantPage from "./domain/Application/page/ApplicantPage";
import AuthSignUpStep1Page from "./domain/auth/pages/AuthSignUpStep1Page";
import AuthSignUpStep2Page from "./domain/auth/pages/AuthSignUpStep2Page";
import AuthSignUpStep3Page from "./domain/auth/pages/AuthSignUpStep3Page";
import AuthSignUpStep4Page from "./domain/auth/pages/AuthSignUpStep4Page";
import AuthSignUpStep5Page from "./domain/auth/pages/AuthSignUpStep5Page";
import AuthSignUpStep6Page from "./domain/auth/pages/AuthSignUpStep6Page";
import AuthSignUpCompletePage from "./domain/auth/pages/AuthSignUpCompletePage";
import ProfileInfoPage from "./domain/mypage/page/ProfileInfoPage";
import DisabledProfilePage from "./domain/profile/pages/DisabledProfilePage";
import HelperProfilePage from "./domain/profile/pages/HelperProfilePage";
import MapDisabledPage from "./domain/map/pages/MapDisabledPage";

import DisabledMyPage from "./domain/mypage/page/DisabledMyPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          {/* 홈 */}
          <Route path="/" element={<HomePage />} />

          {/* 게시글 상세 */}
          <Route path="/post/:id" element={<PostDetailPage />} />

          {/* 게시글 작성 */}
          <Route path="/post/write" element={<PostWritePage />} />
          <Route path="/post/write/day" element={<PostWritePage />} />
          <Route path="/post/write/long" element={<PostWritePage />} />

          {/*채팅*/}
          <Route path="/chat" element={<ChatListPage />} />
          <Route path="/chat/:chatId" element={<ChatRoomPage />} />
          <Route path="/chat-test" element={<ChatTestPage />} />

          {/*마이페이지*/}
          {/* <Route path="/mypage" element={<MyPage />} /> */}

          {/* 마이페이지에서 보는 프로필 정보 */}
          <Route path="/profile-info/:infoId" element={<ProfileInfoPage />} />

          {/* 마이페이지 */}
          <Route path="/mypage" element={<DisabledMyPage />} />

          {/*동네지도*/}
          <Route path="/map" element={<MapHelperPage />} />
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
          <Route path="/review" element={<ReviewPage />} />
          {/* 타인이 보는 프로필 정보 */}
          <Route
            path="profile/disabled/:profileId"
            element={<DisabledProfilePage />}
          />
          <Route
            path="profile/helper/:profileId"
            element={<HelperProfilePage />}
          />
          {/*  테스트 */}
          <Route path="/applicate-landing" element={<ApplicateLandingPage />} />
          <Route path="applicate-status" element={<ApplicateStatusPage />} />
          <Route path="/applicant/:id" element={<ApplicantPage />} />

          {/* 회원가입 */}
          <Route path="/signup/step1" element={<AuthSignUpStep1Page />} />
          <Route path="/signup/step2" element={<AuthSignUpStep2Page />} />
          <Route path="/signup/step3" element={<AuthSignUpStep3Page />} />
          <Route path="/signup/step4" element={<AuthSignUpStep4Page />} />
          <Route path="/signup/step5" element={<AuthSignUpStep5Page />} />
          <Route path="/signup/step6" element={<AuthSignUpStep6Page />} />
          <Route path="/signup/complete" element={<AuthSignUpCompletePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
