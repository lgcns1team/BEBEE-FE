import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./domain/post/pages/HomePage";
import PostDetailPage from "./domain/post/pages/PostDetailPage"; // 상세페이지(파일명은 네 프로젝트에 맞게 조정)
import { GlobalStyle } from "./styles/GlobalStyle";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* 홈 */}
          <Route path="/" element={<HomePage />} />

          {/* 게시글 상세 */}
          <Route path="/post/:id" element={<PostDetailPage />} />
        </Routes>
      </BrowserRouter>
      <GlobalStyle />
    </>
  );
}

export default App;
