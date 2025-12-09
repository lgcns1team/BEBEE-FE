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
import DayHelpWrite from "./domain/post/components/write/DayHelpWrite";
import LongHelpWrite from "./domain/post/components/write/LongHelpWrite";

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
          <Route path="/post/write/day" element={<DayHelpWrite />} />
          <Route path="/post/write/long" element={<LongHelpWrite />} />

          {/*채팅*/}
          <Route path="/chat" element={<ChatListPage />} />
          <Route path="/chat/:chatId" element={<ChatRoomPage />} />
          <Route path="/chat/:chatId/match" element={<MatchFormPage />} />
          {/*마이페이지*/}
          {/* <Route path="/mypage" element={<MyPage />} /> */}

          {/*동네지도*/}
          {/* <Route path="/map" element={<MapPage />} /> */}

          {/* 매칭 */}
          <Route path="/match" element={<MatchingPage />} />

          {/* 리뷰 */}
          <Route path="/review" element={<ReviewPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
