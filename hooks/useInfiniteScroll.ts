"use client";

import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  fetchMore: () => Promise<void>;
  hasMore: boolean;
  threshold?: number;
}

export const useInfiniteScroll = ({ fetchMore, hasMore, threshold = 200 }: UseInfiniteScrollProps) => {
  const loadingRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore) {
        fetchMore();
      }
    },
    [fetchMore, hasMore]
  );

  useEffect(() => {
    if (!loadingRef.current || !hasMore) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0.1,
    });

    const currentRef = loadingRef.current;
    observerRef.current.observe(currentRef);

    return () => {
      if (observerRef.current) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [handleObserver, threshold, hasMore]);

  return { loadingRef };
};