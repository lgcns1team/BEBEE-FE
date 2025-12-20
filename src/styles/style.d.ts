import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    size: {
      xl: string;
      lg: string;
      md: string;
      sm: string;
    };
    color: {
      main: string;
      mainDark: string;
      text: string;
      subText: string;
      subText2: string;
      subText3: string;
      subColor: string;
      subColor2: string;
      natural100: string;
      natural50: string;
      natural200: string;
      blue500: string;
      red500: string;
      blue50: string;
      red50: string;
      white: string;
    };
    borderRadius: {
      xsm: string;
      sm: string;
      md: string;
      lg: string;
    };
    weight: {
      regular: number;
      medium: number;
      bold: number;
    };
  }
}
