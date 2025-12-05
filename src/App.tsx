import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./domain/post/pages/HomePage";
import PostDetailPage from "./domain/post/pages/PostDetailPage";
import ChatListPage from "./domain/chat/pages/ChatListPage";
import MatchConfirmModal from "./domain/chat/components/MatchConfirmModal";
import ChatRoomPage from "./domain/chat/pages/ChatRoomPage";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./styles/GlobalStyle";
import theme from "./styles/theme";
import "./App.css";
import MatchingPage from "./domain/matching/pages/MatchingPage";

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

          {/*채팅*/}
          <Route path="/chat" element={<ChatListPage />} />
          <Route path="/chat/:chatId" element={<ChatRoomPage />} />

          {/*마이페이지*/}
          {/* <Route path="/mypage" element={<MyPage />} /> */}

          {/*동네지도*/}
          {/* <Route path="/map" element={<MapPage />} /> */}

          {/*매칭*/}
          {/* <Route path="/match" element={<MatchConfirmModal />} /> */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
