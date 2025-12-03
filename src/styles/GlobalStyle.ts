import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    /* Main */
    --main-color: #FFBE00;

    /* Text */
    --text: #262626;            /* neutral 800 */
    --sub-text: #525252;        /* neutral 600 */
    --sub-text2: #737373;       /* neutral 500 */
    --sub-text3: #A1A1A1;

    /* Sub Colors */
    --sub-color: #FFF8C4;
    --sub-color2: #FEFCE8;      /* yellow 50 */
    --natural-100: #F5F5F5;
    --natural-50: #FAFAFA;
    
    /* Semantic */
    --accept-blue: #155DFC;
    --error-red: #FB2C36;
  
  
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: sans-serif;
    color: var(--text);
    background: #fff;
  }
`;
