import React, { useRef, useEffect, useState, ReactNode } from 'react';

// ── Tiny 2-D vector helpers ──────────────────────────────────────────────────
export interface V2 { x: number; y: number }
export const v2     = (x: number, y: number): V2 => ({ x, y });
export const v2add  = (a: V2, b: V2): V2 => ({ x: a.x + b.x, y: a.y + b.y });
export const v2sub  = (a: V2, b: V2): V2 => ({ x: a.x - b.x, y: a.y - b.y });
export const v2mul  = (a: V2, s: number): V2 => ({ x: a.x * s, y: a.y * s });
export const v2len  = (a: V2): number => Math.sqrt(a.x * a.x + a.y * a.y);
export const v2dist = (a: V2, b: V2): number => v2len(v2sub(a, b));
export const v2norm = (a: V2): V2 => { const l = v2len(a) || 1e-9; return { x: a.x / l, y: a.y / l }; };
export const v2dot  = (a: V2, b: V2): number => a.x * b.x + a.y * b.y;
export const v2perp = (a: V2): V2 => ({ x: -a.y, y: a.x });
export const v2lerp = (a: V2, b: V2, t: number): V2 => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
export const lerp   = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp  = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// ── Canvas size hook ─────────────────────────────────────────────────────────
export interface CanvasRefs {
  containerRef: React.RefObject<HTMLDivElement>;
  canvasRef:    React.RefObject<HTMLCanvasElement>;
  sizeRef:      React.MutableRefObject<{ w: number; h: number }>;
}
export function useCanvasSize(): CanvasRefs {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const sizeRef      = useRef({ w: 0, h: 0 });
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

// ── Lazy mount (IntersectionObserver) ────────────────────────────────────────
export const LazyMount: React.FC<{ children: ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { rootMargin: '240px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} style={{ width: '100%', height: '100%' }}>{vis ? children : null}</div>;
};

// ── Showcase card ─────────────────────────────────────────────────────────────
interface CardP { title: string; description: string; useCase: string; children: ReactNode; bg?: string; }
export const ShowcaseCard: React.FC<CardP> = ({ title, description, useCase, children, bg = '#06080f' }) => (
  <div className="rounded-xl flex flex-col"
    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
    <div className="px-5 pt-5 pb-1">
      <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.88)' }}>{title}</h3>
      <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.36)' }}>{description}</p>
    </div>
    <div className="mx-5 my-3 rounded-lg overflow-hidden" style={{ height: 320 }}>
      <LazyMount>
        <div style={{ width: '100%', height: '100%', position: 'relative', background: bg }}>
          {children}
        </div>
      </LazyMount>
    </div>
    <div className="px-5 pb-4 flex items-center gap-1.5">
      <span className="text-[9px] tracking-[0.2em] uppercase font-semibold"
        style={{ color: 'rgba(255,255,255,0.16)' }}>use case</span>
      <span className="text-[11px]" style={{ color: '#7eb8e8', opacity: 0.75 }}>— {useCase}</span>
    </div>
  </div>
);

// ── Section header ────────────────────────────────────────────────────────────
export const SectionHeader: React.FC<{ number: string; title: string; subtitle: string; accent: string }> = ({ number, title, subtitle, accent }) => (
  <div className="flex items-start gap-4 mb-7">
    <span className="text-[11px] font-black tabular-nums mt-1 shrink-0"
      style={{ color: accent, fontFamily: 'monospace', opacity: 0.55 }}>{number}</span>
    <div>
      <h2 className="text-xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{title}</h2>
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.32)' }}>{subtitle}</p>
    </div>
  </div>
);

// ── Small control primitives ──────────────────────────────────────────────────
export const CtrlBar: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div style={{ padding: '4px 10px 8px', display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
    {children}
  </div>
);

export const Knob: React.FC<{
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; accent?: string; fmt?: (v: number) => string;
}> = ({ label, value, min, max, step, onChange, accent = '#4d8fc8', fmt }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 110 }}>
    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', minWidth: 70 }}>
      {label} {fmt ? fmt(value) : step < 0.1 ? value.toFixed(2) : Math.round(value)}
    </span>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(+e.target.value)}
      style={{ flex: 1, accentColor: accent, cursor: 'pointer', height: 3 }} />
  </label>
);

export const Btn: React.FC<{ label: string; onClick: () => void; accent?: string }> = ({ label, onClick, accent = '#4d8fc8' }) => (
  <button type="button" onClick={onClick}
    style={{
      fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 99,
      background: `${accent}20`, border: `1px solid ${accent}60`,
      color: accent, cursor: 'pointer', whiteSpace: 'nowrap',
    }}>{label}</button>
);

export const Tag: React.FC<{ label: string; active?: boolean; onClick?: () => void; accent?: string }> = ({ label, active, onClick, accent = '#4d8fc8' }) => (
  <button type="button" onClick={onClick}
    style={{
      fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
      background: active ? `${accent}28` : 'rgba(255,255,255,0.05)',
      border: `1px solid ${active ? accent + '70' : 'rgba(255,255,255,0.08)'}`,
      color: active ? accent : 'rgba(255,255,255,0.35)',
      cursor: onClick ? 'pointer' : 'default',
    }}>{label}</button>
);

// ── Canvas full-fill helper (absolute positioned over container) ───────────────
export const FullCanvas: React.FC<{
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseUp?:   (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}> = ({ canvasRef, onMouseDown, onMouseMove, onMouseUp, onContextMenu, style }) => (
  <canvas
    ref={canvasRef}
    onMouseDown={onMouseDown}
    onMouseMove={onMouseMove}
    onMouseUp={onMouseUp}
    onContextMenu={onContextMenu}
    style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none', ...style }}
  />
);
