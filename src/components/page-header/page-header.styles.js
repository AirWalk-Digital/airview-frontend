import { alpha } from "@material-ui/core/styles";

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
    toolbarSearch: {
      display: "flex",
      flex: "0 1 200px",
      justifyContent: "flex-start",
      alignItems: "center",
      padding: theme.spacing(0.25, 1, 0.25, 1),
      borderRadius: theme.shape.borderRadius,
      transition: theme.transitions.create(["background-color", "flex-basis"]),
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,

      "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.2),
      },
      "&:focus-within": {
        flexBasis: "400px",
      },
    },

    toolbarSearchInputRoot: {
      color: "inherit",
    },
    toolbarSearchInput: {
      paddingLeft: theme.spacing(1),
      fontSize: theme.typography.pxToRem(14),
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
