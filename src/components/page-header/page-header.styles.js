import { darken } from "@material-ui/core/styles";

export function pageHeaderStyles(theme) {
  const drawerWidth = 425;

  return {
    // AppBar

    // Offset compensation for fixed Toolbar
    offset: theme.mixins.toolbar,

    // Containers
    toolBarContainer: {
      display: "flex",
      flex: "1 1 auto",
      alignItems: "center",
    },

    toolBarContainerLeft: {
      composes: "$toolBarContainer",
      justifyContent: "flex-start",
      marginRight: theme.spacing(2),
    },

    toolBarContainerRight: {
      composes: "$toolBarContainer",
      justifyContent: "flex-end",
      marginLeft: theme.spacing(2),
    },

    // Reveal menu
    revealMenuButton: {
      marginRight: theme.spacing(2),
    },

    // Toolbar logo
    toolbarLogo: {
      height: 36,

      "& > img": {
        display: "block",
        width: "auto",
        height: "100%",
      },
    },

    // Search
    invokeSearchBtn: {
      border: 0,
      outline: 0,
      display: "flex",
      alignItems: "center",
      height: 30,
      padding: theme.spacing(1, 1),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.common.white,
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightMedium,
      fontSize: theme.typography.pxToRem(14),
      transition: theme.transitions.create("background-color"),

      "&:not(:disabled)": {
        cursor: "pointer",

        "&:hover": {
          backgroundColor: darken(theme.palette.common.white, 0.1),
        },
      },

      "&:disabled": {
        cursor: "not-allowed",
      },
    },

    invokeSearchIcon: {
      marginRight: theme.spacing(1),
    },

    invokeSearchShortcut: {
      backgroundColor: theme.palette.grey[100],
      display: "inline-block",
      padding: "2px 8px",
      fontWeight: theme.typography.fontWeightBold,
      fontSize: theme.typography.pxToRem(12),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      marginLeft: theme.spacing(4),
    },

    // Actions
    toolbarActions: {
      flex: "0 1 auto",
      display: "flex",

      "& > *:first-child": {
        marginLeft: theme.spacing(2),
      },
    },

    /*
    Drawer styles
    */
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },

    drawerPaper: {
      width: drawerWidth,
      padding: theme.spacing(0, 1, 1, 1),
      top: 0,
      height: "100%",
    },

    drawerTitle: {
      marginLeft: theme.spacing(-1),
      marginRight: theme.spacing(-1),
      padding: theme.spacing(0.25, 3),
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      borderBottom: `1px solid ${theme.palette.divider}`,
      ...theme.mixins.toolbar,
    },

    version: {
      fontSize: theme.typography.pxToRem(12),
      color: theme.palette.grey[600],
    },

    accordionMenu: {
      marginTop: 12,
    },
  };
}
