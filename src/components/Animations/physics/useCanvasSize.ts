import { useEffect, useRef } from 'react';
import type { MutableRefObject, RefObject } from 'react';

export interface CanvasRefs {
  containerRef: RefObject<HTMLDivElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  sizeRef: MutableRefObject<{ w: number; h: number }>;
}

export function useCanvasSize(): CanvasRefs {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  useEffect(() => {
    const ctr = containerRef.current;
    const cvs = canvasRef.current;
    if (!ctr || !cvs) return;
    const sync = () => {
      const w = ctr.clientWidth, h = ctr.clientHeight;
      cvs.width = w; cvs.height = h;
      sizeRef.current = { w, h };
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(ctr);
    return () => ro.disconnect();
  }, []);
  return { containerRef, canvasRef, sizeRef };
}
