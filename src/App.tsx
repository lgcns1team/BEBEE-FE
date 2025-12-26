import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./domain/post/pages/HomePage";
import PostDetailPage from "./domain/post/pages/PostDetailPage";
import ChatListPage from "./domain/chat/pages/ChatListPage";
import MatchFormPage from "./domain/chat/pages/MatchFormPage";
import ChatRoomPage from "./domain/chat/pages/ChatRoomPage";
import MatchingPage from "./domain/matching/pages/MatchingPage";
import ReviewPage from "./domain/review/pages/ReviewPage";
import PostWritePage from "./domain/post/pages/PostWritePage";

import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./styles/GlobalStyle";
import theme from "./styles/theme";
import "./App.css";
import DisabledProfilePage from "./domain/profile/pages/DisabledProfilePage";
import DayHelpWrite from "./domain/post/components/write/DayHelpWrite";
import LongHelpWrite from "./domain/post/components/write/LongHelpWrite";
import MapDisabledPage from "./domain/map/pages/MapDisabledPage";
import MatchingInfoPage from "./domain/matching/pages/MatchingInfoPage";
import MapHelperPage from "./domain/map/pages/MapHelperPage";

import HelperMyPage from "./domain/mypage/page/HelperMyPage";
import ApplicateLandingPage from "./domain/Application/page/ApplicateLandingPage";
import ApplicateStatusPage from "./domain/Application/page/ApplicateStatusPage";
import ApplicantPage from "./domain/Application/page/ApplicantPage";
import HelperProfilePage from "./domain/profile/pages/HelperProfilePage";
import ProfileInfoPage from "./domain/mypage/page/ProfileInfoPage";

function App() {
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
          <Route path="/post/write/day" element={<DayHelpWrite />} />
          <Route path="/post/write/long" element={<LongHelpWrite />} />

          {/*채팅*/}
          <Route path="/chat" element={<ChatListPage />} />
          <Route path="/chat/:chatId" element={<ChatRoomPage />} />
          <Route path="/chat/:chatId/match" element={<MatchFormPage />} />
          {/*마이페이지*/}
          {/* <Route path="/mypage" element={<MyPage />} /> */}

          {/* 마이페이지에서 보는 프로필 정보 */}
          <Route path="/profile-info/:infoId" element={<ProfileInfoPage />} />

          {/*테스트*/}
          {/* <Route path="/mypage-1" element={<DisabledMyPage />} /> */}
          {/* <Route path="/mypage-2" element={<HelperMyPage />} /> */}
          <Route path="/mypage" element={<HelperMyPage />} />
          {/*동네지도*/}
          <Route path="/map" element={<MapDisabledPage />} />
          <Route path="/map/user" element={<MapDisabledPage />} />
          <Route path="/map/helper" element={<MapHelperPage />} />

          {/* 매칭 */}
          <Route path="/match" element={<MatchingPage />} />

          {/* 매칭 확인서 */}
          <Route path="/match-info/:infoId" element={<MatchingInfoPage />} />
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
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
