import { createTheme } from "@material-ui/core/styles";
import siteConfig from "../site-config.json";

const defaultTheme = createTheme();
const { pxToRem } = defaultTheme.typography;

export const materialUiTheme = createTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        html: {
          textSizeAdjust: "none",
        },
        "html body": {
          "--tina-z-index-2": 1099,
        },
      },
    },
  },
  palette: {
    primary: {
      main: siteConfig.theme.color ?? "#1976d2",
    },
    secondary: {
      main: siteConfig.theme.color ?? "#1976d2",
    },
  },
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji'",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontSize: pxToRem(40),
      fontWeight: 600,
    },
    h2: {
      fontSize: pxToRem(32),
      fontWeight: 600,
    },
    h3: {
      fontSize: pxToRem(28),
      fontWeight: 600,
    },
    h4: {
      fontSize: pxToRem(24),
      fontWeight: 600,
    },
    h5: {
      fontSize: pxToRem(20),
      fontWeight: 600,
    },
    h6: {
      fontSize: pxToRem(18),
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 600,
    },
  },
});
