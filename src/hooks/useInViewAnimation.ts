import { useEffect, useRef, useState } from 'react';

export const useInViewAnimation = <T extends HTMLElement>(
  options: IntersectionObserverInit = { threshold: 0.2 },
) => {
  const elementRef = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const optionsRef = useRef(options);

  useEffect(() => {
    const target = elementRef.current;

    if (!target || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      optionsRef.current,
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return { ref: elementRef, isVisible } as const;
};
