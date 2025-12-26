import React from "react";
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
import ProfilePage from "./domain/profile/pages/ProfilePage";
import MapUserPage from "./domain/map/pages/MapUserPage";
import MatchingInfoPage from "./domain/matching/pages/MatchingInfoPage";
import MapHelperPage from "./domain/map/pages/MapHelperPage";
import DisabledMyPage from "./domain/mypage/page/DisabledMyPage";
import HelperMyPage from "./domain/mypage/page/HelperMyPage";
import ChatTestPage from "./domain/chat/pages/ChatTestPage";

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
          {/*테스트*/}
          <Route path="/mypage-1" element={<DisabledMyPage />} />
          <Route path="/mypage-2" element={<HelperMyPage />} />

          {/*동네지도*/}
          <Route path="/map" element={<MapHelperPage />} />
          <Route path="/map/user" element={<MapUserPage />} />
          <Route path="/map/helper" element={<MapHelperPage />} />

          {/* 매칭 */}
          <Route path="/match" element={<MatchingPage />} />

          {/* 매칭 확인서 */}
          <Route path="/match-info/:infoId" element={<MatchingInfoPage />} />
          {/* 리뷰 */}
          <Route path="/review" element={<ReviewPage />} />
          {/* 프로필 */}
          <Route path="profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
