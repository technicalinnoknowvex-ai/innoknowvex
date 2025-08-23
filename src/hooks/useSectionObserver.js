import { useEffect } from "react";
import { useNavColor } from "@/context/NavColorContext";

export const useSectionObserver = (ref, options = {}) => {
  const {
    color = "white",
    threshold = 0,
    rootMargin = "0px 0px 0px 0px",
  } = options;
  const { setNavColor } = useNavColor();

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNavColor(color);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, color, threshold, rootMargin, setNavColor]);
};
