import { createGlobalStyle } from "styled-components";
import theme from "./theme";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    width: 375px;
    max-width: 100%;
    margin: 0 auto;
    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: ${theme.size.md};
    color: ${theme.color.text};
    background-color: ${theme.color.natural100};
    line-height: 1.4;
 
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
