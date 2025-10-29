import { useEffect } from 'react';

export const useSmoothScroll = () => {
  useEffect(() => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = 'smooth';

    return () => {
      root.style.scrollBehavior = previousBehavior;
    };
  }, []);
};
