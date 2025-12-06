//사용: ${({ theme }) => theme.color.변수명};
//사용: ${({ theme }) => theme.size.변수명};
//사용: ${({ theme }) => theme.borderRadius.변수명};
//사용: ${({ theme }) => theme.weight.변수명};
/*fontsize*/
const theme = {
  size: {
    lg: "20px", // figma 기준 14 ~ 16 (제목,헤더)
    md: "16px", //figma 기준 12 (본문)
    sm: "12px", //figma 기준 10 이하 (뱃지, 부가 회색 텍스트)
  },

  /*color*/
  color: {
    main: "#FFBE00",
    mainDark: "#F0B100",
    text: "#262626",
    subText: "#525252",
    subText2: "#737373",
    subText3: "#A1A1A1",
    subColor: "#FFF8C4",
    subColor2: "#FEFCE8",
    natural100: "#F5F5F5",
    natural50: "#FAFAFA",
    natural200: "#E5E5E5",
    blue500: "#155DFC",
    red500: "#FB2C36",
    blue50: "#EFF6FF",
    red50: "#FEF2F2",
    white: "#FFFFFF",
  },

  /*border-radius*/ // xsm -> 1px 로 추가
  borderRadius: {
    xsm: "1px",
    sm: "4px",
    md: "8px",
    lg: "12px",
  },

  /*font-weight*/
  weight: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
};

export default theme;
