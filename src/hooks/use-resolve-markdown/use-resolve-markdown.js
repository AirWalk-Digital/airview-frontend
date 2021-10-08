import { useRef } from "react";
import * as matter from "gray-matter";

export function useResolveMarkdown() {
  const resolvedImages = useRef([]);
  const newImages = useRef([]);
  const originalMarkdown = useRef("");

  const cleanupImages = () => {
    if (resolvedImages.current.length > 0) {
      resolvedImages.current.forEach((image) => {
        image.cleanup();
      });
    }
  };

  const searchMarkdownStringForImages = function (markdownString) {
    const regexp =
      /!\[[^\]]*\]\((?<filename>.*?)(?=\s|"|\))(?<optionalpart>"|\s.*")?\)/g;

    const images = [...markdownString.matchAll(regexp)];

    if (images.length < 1) return [];

    const resolvedImages = images.reduce((prevValue, currentValue) => {
      return [...prevValue, currentValue.groups.filename];
    }, []);

    return resolvedImages;
  };

  const createObjectUrlDataFromImageBlob = function (originalImage, imageBlob) {
    const imageObjectUrl = URL.createObjectURL(imageBlob);

    const ret = {
      originalImageUrl: originalImage,
      imageObjectUrl,
      cleanup: function () {
        return URL.revokeObjectURL(imageObjectUrl);
      },
    };
    return ret;
  };

  const findAndReplaceImagesWithinMarkdownString = function (
    markdownString,
    replacements
  ) {
    let parsedMarkdown = markdownString;

    replacements.forEach((replacement) => {
      parsedMarkdown = parsedMarkdown.replace(
        replacement.originalImageUrl,
        replacement.imageObjectUrl
      );
    });

    return parsedMarkdown;
  };

  const resolveInbound = async function (markdown, mediaPath, fetcher) {
    resolvedImages.current = [];
    newImages.current = [];
    originalMarkdown.current = markdown;
    const images = searchMarkdownStringForImages(markdown);

    if (images.length < 1) return markdown;

    for (const image of images) {
      try {
        const imageBlob = await fetcher(`${mediaPath}/${image.trim()}`);

        const resolved = createObjectUrlDataFromImageBlob(image, imageBlob);
        resolvedImages.current.push(resolved);
      } catch (err) {
        console.error(`Error fetching remote image ${image}`);
      }
    }

    if (resolvedImages.current.length < 1) return markdown;

    const resolvedMarkdown = findAndReplaceImagesWithinMarkdownString(
      markdown,
      resolvedImages.current
    );

    return resolvedMarkdown;
  };

  const resolveOutbound = async function ({
    markdown,
    frontmatter,
    markdownFileName,
  }) {
    const outboundFiles = [];

    resolvedImages.current.forEach((image) => {
      markdown = markdown.replace(image.imageObjectUrl, image.originalImageUrl);
    });

    for (let image of newImages.current) {
      const pre = markdown;
      markdown = markdown.replace(image.imageObjectUrl, image.originalImageUrl);
      //only add image for commit if it exists in the markdown (i.e. hasnt been added then removed before saving)
      if (pre !== markdown) {
        const blob = await fetch(image.imageObjectUrl).then((r) => r.blob());
        outboundFiles.push({
          fileName: image.originalImageUrl,
          blob,
        });
      }
    }
    // dont commit markdown if it didn't change
    if (markdown !== originalMarkdown.current) {
      const markdownString = matter.stringify(markdown, frontmatter);
      outboundFiles.push({
        fileName: markdownFileName,
        blob: new Blob([markdownString], {
          type: "text/plain",
        }),
      });
    }

    return outboundFiles;
  };

  const getUniqueFileName = (fileName) => {
    let [originalName, extension] = fileName.split(".");
    let name = fileName;
    const imageNames = resolvedImages.current
      .map((m) => m.originalImageUrl)
      .concat(newImages.current.map((m) => m.originalImageUrl));

    let existingName = imageNames.find((f) => f == fileName);
    let i = 1;
    while (existingName !== undefined) {
      name = `${originalName}_${i}.${extension}`;
      existingName = imageNames.find((f) => f == name);
      i++;
    }
    return name;
  };

  const handleOnUploadImage = async (file) => {
    try {
      const imageObjectUrl = URL.createObjectURL(file);
      const name = getUniqueFileName(file.name);
      newImages.current.push({
        originalImageUrl: name,
        imageObjectUrl,
        revokeObjectURL: function () {
          return URL.revokeObjectURL(this.imageObjectUrl);
        },
      });

      return imageObjectUrl;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    resolveInbound,
    resolveOutbound,
    handleOnUploadImage,
    cleanupImages,
  };
}
