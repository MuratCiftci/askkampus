import { useRef, useEffect } from "react";

export default function useInfiniteScroll(
  callback: () => void,
  target: React.RefObject<HTMLDivElement>
) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          callback();
        }
      },
      { threshold: 1 }
    );

    const currentTarget = target.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [callback, target]);

  return target;
}
