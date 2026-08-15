import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

// Gates each R3F <Canvas> render loop to on-screen visibility.
// LazyCanvas mounts the scene lazily but keeps it mounted once first shown —
// avoids WebGL context churn / shader recompiles on scroll-back — and only the
// render loop toggles via `frameloop="always"` ↔ `"never"`.
export const SceneActive = createContext(false);

export const useSceneActive = () => useContext(SceneActive);

export const LazyCanvas: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = '#04060c' }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setMounted(true);
      setInView(entry.isIntersecting);
    }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%', background: bg }}>
      <SceneActive.Provider value={mounted && inView}>
        {mounted ? children : null}
      </SceneActive.Provider>
    </div>
  );
};