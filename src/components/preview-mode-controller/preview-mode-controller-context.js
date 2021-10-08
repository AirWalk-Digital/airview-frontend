import React, { useContext } from "react";

export const PreviewModeControllerContext = React.createContext();

export const usePreviewModeControllerContext = () =>
  useContext(PreviewModeControllerContext);
