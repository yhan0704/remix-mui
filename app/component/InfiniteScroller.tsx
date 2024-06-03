import { useEffect, useRef } from "react";

export const InfiniteScroller = ({
  children,
  loading,
  loadNext,
}: {
  children: React.ReactNode;
  loading: boolean;
  loadNext: () => void;
}) => {
  const scrollListener = useRef(loadNext);
  useEffect(() => {
    scrollListener.current = loadNext;
  }, [loadNext]);

  const onScroll = () => {
    const documentHeight = document.documentElement.scrollHeight;
    const scrollDifference = Math.floor(window.innerHeight + window.scrollY);
    const scrollEnded = documentHeight === scrollDifference;

    if (scrollEnded && !loading) {
      scrollListener.current();
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", onScroll);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <>{children}</>;
};
