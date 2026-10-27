import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to trigger entrance animations when a component or section
 * scrolls into the viewport.
 */
export function useScrollReveal(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const el = domRef.current;
    if (!el) {
      setIsVisible(true);
      return;
    }

    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: options.threshold !== undefined ? options.threshold : 0.08,
        rootMargin: options.rootMargin || '0px 0px -20px 0px',
        ...options
      }
    );

    observer.observe(el);

    // Fallback timer: ensure visibility after 2 seconds even if observer doesn't fire
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  return [domRef, isVisible];
}

export default useScrollReveal;
