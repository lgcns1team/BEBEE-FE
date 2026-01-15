import { createGlobalStyle } from "styled-components";
import theme from "./theme";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    background-color: ${theme.color.white};
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100dvh;
    overflow-x: hidden;
    overflow-y: hidden;
    font-family: "Pretendard", "Paperlogy", sans-serif;
  }

  #root {
    width: 375px;
    max-width: 100%;
    margin: 0 auto;
    min-height: calc(var(--vh, 1vh) * 100); /* Mobile viewport fix */
    background-color: transparent;
    color: ${theme.color.text};
    font-family: "Pretendard", "Paperlogy", sans-serif;
    font-size: ${theme.size.md};
    line-height: 1.4;
    overflow-y: hidden;
    overflow-x: hidden;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;
