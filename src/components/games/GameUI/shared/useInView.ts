import { useEffect, useState, type RefObject } from 'react';

export function useInView<T extends HTMLElement>(ref: RefObject<T>): boolean {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? true),
      { rootMargin: '120px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
}
