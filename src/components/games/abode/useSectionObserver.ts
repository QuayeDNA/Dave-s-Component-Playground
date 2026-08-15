import { useState, useEffect } from 'react';
import { SECTIONS } from '@/data/abode/sections';

export function useSectionObserver() {
  const [activeId, setActiveId] = useState<string>('');
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); });
      },
      { rootMargin: '-15% 0px -75% 0px' }
    );
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return activeId;
}
