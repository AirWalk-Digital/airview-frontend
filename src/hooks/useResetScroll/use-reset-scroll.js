import { useEffect } from "react";

export function useResetScroll(watcher) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [watcher]);
}
