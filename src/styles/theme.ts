//사용: ${({ theme }) => theme.color.변수명};
/*fontsize*/
const theme = {
  size: {
    lg: "1rem", //16px -> figma 기준 14 ~ 16
    md: "0.75rem", //12px-> figma 기준 12
    sm: "0.6rem", //8px -> figma 기준 10 이하
  },

  /*color*/
  color: {
    main: "#FFBE00",
    text: "#262626",
    subText: "#525252",
    subText2: "#737373",
    subText3: "#A1A1A1",
    subColor: "#FFF8C4",
    subColor2: "#FEFCE8",
    natural100: "#F5F5F5",
    natural50: "#FAFAFA",
    blue500: "#155DFC",
    red500: "#FB2C36",
    blue50: "#EFF6FF",
    red50: "#FEF2F2",
    white: "#FFFFFF",
  },

  /*border-radius*/
  borderRadius: {
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
