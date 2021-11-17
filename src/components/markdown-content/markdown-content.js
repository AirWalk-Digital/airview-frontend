import React, { useRef } from "react";
import PropTypes from "prop-types";
import red from "@material-ui/core/colors/red";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Editor from "rich-markdown-editor";
import { useHistory } from "react-router-dom";
import { MarkdownContentLoading } from "./markdown-content-loading";

// Move out to hook
function isExternalLink(link) {
  const tmp = document.createElement("a");
  tmp.href = link;
  return tmp.host !== window.location.host;
}

export const MarkdownContent = React.forwardRef(
  (
    {
      loading,
      readOnly,
      onChange,
      defaultValue,
      classNames,
      onRequestToUploadImage,
    },
    ref
  ) => {
    const styles = useStyles();
    let history = useHistory();
    const uploadedImages = useRef([]);

    const handleOnChange = (markdown) => {
      onChange({ markdown, images: uploadedImages.current });
    };

    const handleOnLinkClick = (href) => {
      if (isExternalLink(href)) {
        window.open(href);
      } else {
        history.push(href.replace(window.location.origin, ""));
      }
    };

    if (loading) return <MarkdownContentLoading />;

    return (
      <Editor
        {...{ readOnly }}
        defaultValue={defaultValue}
        onChange={(value) => handleOnChange(value())}
        onClickLink={handleOnLinkClick}
        uploadImage={onRequestToUploadImage}
        ref={ref}
        className={clsx(styles.editor, classNames)}
        disableExtensions={["container_notice"]}
      />
    );
  }
);

MarkdownContent.displayName = "MarkdownContent";

MarkdownContent.propTypes = {
  /**
   * Sets the component to render in a loading state, best used when fetching data asynchronously
   */
  loading: PropTypes.bool.isRequired,
  /**
   * Enables inline editing or read-only content within the Markdown Editor
   */
  readOnly: PropTypes.bool.isRequired,
  /**
   * Callback for when a change is made in edit mode, calls with object containing edited markdown string, any user added images and cleanup function to remove images from memory. **signature:** `function({ markdown: string, images: array}) => void `
   */
  onChange: PropTypes.func,
  /**
   * Sets the default value of the Markdown editor content
   */
  defaultValue: PropTypes.string,
  /**
   * Adds passed classNames to the root node for styling
   */
  classNames: PropTypes.string,
  /**
   * Callback when Markdown editor has had a user upload an image. **Singnature: `function(file: Blob) : Promise`
   */
  onRequestToUploadImage: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
  editor: {
    "& > div": {
      backgroundColor: "inherit",
    },

    "& .ProseMirror": {
      // All direct child nodes
      "& > *": {
        margin: `0 0 ${theme.spacing(2)}px 0`,
      },

      overflowWrap: "break-word",

      // Headers
      "& h1": {
        ...theme.typography.h1,
      },
      "& h2": {
        ...theme.typography.h2,
      },
      "& h3": {
        ...theme.typography.h3,
      },
      "& h4": {
        ...theme.typography.h4,
      },
      "& h5": {
        ...theme.typography.h5,
      },
      "& h6": {
        ...theme.typography.h6,
      },

      "& h1, & h2, & h3, & h4, & h5, & h6": {
        "&:not(.placeholder):before": {
          content: "none",
        },

        "& .heading-actions": {
          display: "none",
        },
      },

      // All other block type tags
      "& p, & ul, & ol, & dl, & blockquote, & small": {
        ...theme.typography.body1,
      },

      // Blockquotes
      "& blockquote": {
        paddingLeft: theme.spacing(2),
        borderLeft: `${theme.spacing(0.5)}px solid ${
          theme.palette.primary.main
        }`,
        margin: `${theme.spacing(1) + 16}px 0`,

        "&:before": {
          content: "none",
        },

        "& cite": {
          display: "block",
          fontStyle: "normal",
          fontWeight: theme.typography.fontWeightMedium,
          fontSize: theme.typography.pxToRem(14),
        },
      },

      // Small
      "& small": {
        fontSize: theme.typography.pxToRem(12),
        fontStyle: "italic",
      },

      // Inline links
      "& a": {
        textDecoration: "underline",
        color: theme.palette.primary.main,

        "&:hover, &:focus": {
          textDecoration: "none",
        },
      },

      // Unordered and ordered lists
      "& ul, & ol": {
        listStylePosition: "outside",
        padding: "0 0 0 32px",
      },

      // Definition lists
      "& dl": {
        "& dt": {
          fontWeight: theme.typography.fontWeightBold,
        },

        "& dd": {
          margin: `0 0 ${theme.spacing(2)}px 0`,

          "&:last-of-type": {
            marginBottom: 0,
          },
        },
      },

      // Inline code
      "& code": {
        fontSize: "90%",
        fontFamily: "Consolas,'Liberation Mono',Courier,monospace",
        color: red[900],
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.grey["100"],
        padding: "3px 6px",
      },

      // Code block
      "& pre": {
        display: "block",
        width: "100%",
        whiteSpace: "pre",
        overflow: "auto",
        backgroundColor: theme.palette.grey["A400"],
        borderRadius: theme.shape.borderRadius,
        tabSize: 2,
        wordWrap: "initial",
        fontSize: theme.typography.pxToRem(14),
        margin: `${theme.spacing(1) + 16}px 0`,
        padding: 0,

        "& code": {
          overflowX: "auto",
          display: "block",
          padding: `${theme.spacing(2)}px`,
          backgroundColor: "transparent",
          border: 0,
          color: theme.palette.grey["400"],
          fontSize: "100%",
        },
      },

      // HTML table (NOT Material UI Table)
      "& table": {
        borderCollapse: "collapse",
        width: "100%",
        textAlign: "left",
        margin: `${theme.spacing(1) + 16}px 0`,
        fontFamily: theme.typography.fontFamily,
        fontWeight: theme.typography.fontWeightRegular,

        // Scrollable table for smaller viewports
        [theme.breakpoints.down(800)]: {
          overflow: "hidden",
          overflowX: "scroll",
          display: "block",
          whiteSpace: "nowrap",
          height: "auto",
          "-webkit-overflow-scrolling": "touch",
        },

        "& th": {
          fontWeight: theme.typography.fontWeightMedium,
        },

        "& td": {
          verticalAlign: "top",
        },

        "& tbody": {
          wordBreak: "break-word",
        },

        "& th, & td": {
          border: `1px solid ${theme.palette.grey["300"]}`,
          minWidth: 100,
        },

        "& thead th, & thead td, & tbody th, & tbody td, & tfoot th, & tfoot td": {
          padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
        },

        "& thead, & tbody tr:nth-child(even)": {
          backgroundColor: theme.palette.grey["100"],
        },

        "& p": {
          fontSize: "inherit",
        },

        "& th p": {
          fontWeight: "inherit",
        },
      },

      // Mark
      "& mark": {
        backgroundColor: "#b3e7ff",
      },

      // Horizontal rule
      "& hr": {
        display: "block",
        height: 0,
        margin: `${theme.spacing(4)}px 0`,
        border: 0,
        borderBottom: `1px solid ${theme.palette.grey["300"]}`,
      },

      "& .image.placeholder": {
        background: "inherit",
      },

      // Responsive inline images
      "& img": {
        width: "auto",
        maxWidth: "100%",
        display: "block",
        margin: `0 auto ${theme.spacing(2)}px auto`,
      },

      // Header anchor links
      "& .anchor-link": {
        position: "absolute",
        marginTop: "-64px",
      },
    },
  },
}));
