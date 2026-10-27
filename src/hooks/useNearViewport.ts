"use client";

import { useEffect, useRef, useState } from "react";

export function useNearViewport<T extends Element>(rootMargin = "300px 0px") {
  const ref = useRef<T>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || isNearViewport) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isNearViewport, rootMargin]);

  return { ref, isNearViewport };
}


