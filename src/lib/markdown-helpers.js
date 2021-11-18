/* eslint react/display-name: 0 */
/* eslint react/prop-types: 0 */
/* eslint jsx-a11y/anchor-has-content: 0 */
/* eslint jsx-a11y/anchor-is-valid: 0 */
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useTheme } from "@material-ui/core/styles";
import slug from "slug";

const gfm = require("remark-gfm");

// Markdown code syntax highlighting
function MarkdownCodeRenderer({ language, value }) {
  const theme = useTheme();

  const styles = {
    tabSize: 2,
    margin: `${theme.spacing(1) + 16}px 0`,
    padding: 0,
  };

  return (
    <SyntaxHighlighter language={language} customStyle={styles}>
      {value}
    </SyntaxHighlighter>
  );
}

// Add unique IDs to headings within markdown
function MarkdownHeadingRenderer({ node, duplicateHeaders }) {
  function flatten(text, child) {
    return typeof child === "string"
      ? text + child
      : React.Children.toArray(child.props.children).reduce(flatten, text);
  }

  function getUniqueHeaderId(value) {
    const duplicateHeadersCount = duplicateHeaders.filter(
      (header) => header === value
    ).length;

    return duplicateHeadersCount > 1 ? `-${duplicateHeadersCount - 1}` : "";
  }

  const children = React.Children.toArray(node.children);

  const text = children.reduce(flatten, "");

  duplicateHeaders.push(text);

  const id = getUniqueHeaderId(text);
  const linkSlug = slug(`${text}${id}`);

  const Header = () => React.createElement("h" + node.level, {}, node.children);

  return (
    <React.Fragment>
      <a
        className="anchor-link"
        id={linkSlug}
        data-title={text}
        data-level={node.level}
        aria-label="Anchor"
      ></a>
      <Header />
    </React.Fragment>
  );
}

// Resolve image paths
function MarkdownImagesRenderer({
  src,
  alt,
  path,
  mediaPath,
  preview,
  requireCallback,
}) {
  if (src.includes("http") || typeof window == "undefined") {
    return <img src={src} alt={alt} />;
  }

  if (preview) {
    const token = localStorage.getItem("tinacms-github-token") || null;
    const enc = encodeURIComponent(token);
    const imageSrc = `${mediaPath}/${src}`;
    const proxyUrl = `/api/proxy-github-image${imageSrc}?token=${enc}`;

    return <img src={proxyUrl} alt={src} />;
  }

  return <img src={requireCallback(`./${path}${src}`).default} alt={alt} />;
}

/*
Factory function to return object of markdown renderers
Uses closure to cache duplicate headers for unique id
*/
function markdownRenderers(path, mediaPath, preview, requireCallback) {
  let duplicateHeaders = [];

  return {
    code: ({ language, value }) => {
      return <MarkdownCodeRenderer {...{ language, value }} />;
    },

    heading: (node) => {
      return <MarkdownHeadingRenderer {...{ node, duplicateHeaders }} />;
    },
    image: ({ src, alt }) => {
      return (
        <MarkdownImagesRenderer
          {...{ src, alt, path, mediaPath, preview, requireCallback }}
        />
      );
    },
  };
}

export function ReactMarkdownHelper(props) {
  return (
    <ReactMarkdown
      escapeHtml={false}
      renderers={markdownRenderers(
        props.path,
        props.mediaPath,
        props.preview,
        props.requireCallback
      )}
      plugins={[gfm]}
    >
      {props.children}
    </ReactMarkdown>
  );
}
