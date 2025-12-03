import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    size: {
      lg: string;
      md: string;
      sm: string;
    };
    color: {
      main: string;
      text: string;
      subText: string;
      subText2: string;
      subText3: string;
      subColor: string;
      subColor2: string;
      natural100: string;
      natural50: string;
      blue500: string;
      red500: string;
      blue50: string;
      red50: string;
    };
    borderRadius: {
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
