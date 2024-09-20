import { useThrottledState } from "@mantine/hooks";
import { useEffect, useRef } from "react";

const options = {
  threshold: 0.1,
};

export const useInteractiveObserver = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useThrottledState(false, 100);

  useEffect(() => {
    const current = ref.current;
    const observer = new IntersectionObserver((entries) => {
      setVisible(entries[0] && entries[0].isIntersecting);
    }, options);

    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [ref, setVisible]);

  return { ref, visible };
};
