import React, { useRef, useEffect, useState } from 'react';
import { useCanvasSize, FullCanvas, CtrlBar, Knob, Btn } from './shared';

const ACCENT = '#a78bfa';

// ── 5 · VERLET ROPE ───────────────────────────────────────────────────────────
// 28-particle chain; Verlet integration + distance constraint relaxation
// Drag any particle; wind toggle
export const VerletRope: React.FC = () => {
  const { containerRef, canvasRef, sizeRef } = useCanvasSize();
  const [wind, setWind] = useState(false);
  const windRef = useRef(false);
  useEffect(()=>{ windRef.current=wind; },[wind]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const N=28, SEG=8; // 28 particles, 8px rest length
    interface Pt { x:number; y:number; px:number; py:number; pinned?:boolean }
    let pts: Pt[] = [];

    const init = () => {
      const { w } = sizeRef.current;
      pts = Array.from({length:N}, (_,i)=>({
        x: w/2, y: 20+i*SEG,
        px: w/2, py: 20+i*SEG,
        pinned: i===0,
      }));
    };

    let dragIdx = -1;
    const onDown = (e: MouseEvent) => {
      const r=canvas.getBoundingClientRect(); const mx=e.clientX-r.left,my=e.clientY-r.top;
      let best=-1,bd=999;
      pts.forEach((p,i)=>{ const d=Math.sqrt((p.x-mx)**2+(p.y-my)**2); if(d<bd&&d<24){bd=d;best=i;} });
      dragIdx=best;
    };
    const onMove = (e: MouseEvent) => {
      if (dragIdx<0) return;
      const r=canvas.getBoundingClientRect();
      pts[dragIdx].x=e.clientX-r.left; pts[dragIdx].y=e.clientY-r.top;
      pts[dragIdx].px=pts[dragIdx].x; pts[dragIdx].py=pts[dragIdx].y;
    };
    const onUp = () => { dragIdx=-1; };
    canvas.addEventListener('mousedown',onDown);
    window.addEventListener('mousemove',onMove);
    window.addEventListener('mouseup',onUp);

    let last=performance.now(), raf:number;
    const ITERS=6, DAMP=0.985, G=700;
    const tick = () => {
      raf=requestAnimationFrame(tick);
      const now=performance.now(), dt=Math.min((now-last)/1000,0.025); last=now;
      const {w,h}=sizeRef.current;
      if (!pts.length) init();

      const windF=windRef.current ? 80*Math.sin(now/800) : 0;

      // Verlet integrate
      for (const p of pts) {
        if (p.pinned||dragIdx===pts.indexOf(p)) continue;
        const vx=(p.x-p.px)*DAMP, vy=(p.y-p.py)*DAMP;
        p.px=p.x; p.py=p.y;
        p.x+=vx+windF*dt*dt; p.y+=vy+G*dt*dt;
      }

      // Constraint relaxation
      for (let iter=0;iter<ITERS;iter++) {
        for (let i=0;i<N-1;i++) {
          const a=pts[i],b=pts[i+1];
          const dx=b.x-a.x,dy=b.y-a.y,d=Math.sqrt(dx*dx+dy*dy);
          if (d<1e-6) continue;
          const diff=(d-SEG)/d*0.5;
          if (!a.pinned&&i!==dragIdx){a.x+=dx*diff;a.y+=dy*diff;}
          if (!b.pinned&&(i+1)!==dragIdx){b.x-=dx*diff;b.y-=dy*diff;}
        }
        // Pin anchor
        pts[0].x=pts[0].px; pts[0].y=pts[0].py;
        // Bounds
        for (const p of pts) { p.x=Math.max(6,Math.min(w-6,p.x)); p.y=Math.max(6,Math.min(h-6,p.y)); }
      }

      const ctx=canvas.getContext('2d')!;
      ctx.fillStyle='#06080f'; ctx.fillRect(0,0,w,h);
      // Anchor bar
      ctx.fillStyle='rgba(167,139,250,0.3)'; ctx.fillRect(pts[0].x-20,0,40,6);
      // Draw rope as thick line with gradient
      ctx.lineWidth=3; ctx.lineCap='round'; ctx.lineJoin='round';
      ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y);
      for (let i=1;i<N;i++) ctx.lineTo(pts[i].x,pts[i].y);
      ctx.strokeStyle='rgba(167,139,250,0.7)'; ctx.stroke();
      // Particle dots
      for (let i=0;i<N;i++) {
        const p=pts[i];
        ctx.beginPath(); ctx.arc(p.x,p.y,i===dragIdx?5:2.5,0,Math.PI*2);
        ctx.fillStyle=i===0?'#c4b5fd':'rgba(167,139,250,0.4)'; ctx.fill();
      }
      if (windRef.current) {
        ctx.fillStyle='rgba(167,139,250,0.3)'; ctx.font='9px sans-serif';
        ctx.fillText(`wind ${(80*Math.sin(Date.now()/800)).toFixed(0)}`,8,14);
      }
    };
    tick();
    return ()=>{cancelAnimationFrame(raf);canvas.removeEventListener('mousedown',onDown);window.removeEventListener('mousemove',onMove);window.removeEventListener('mouseup',onUp);};
  }, []);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div ref={containerRef} style={{flex:1,position:'relative'}}>
        <FullCanvas canvasRef={canvasRef} />
        <span style={{position:'absolute',top:6,right:8,fontSize:9,color:'rgba(255,255,255,0.25)'}}>drag rope</span>
      </div>
      <CtrlBar>
        <Btn label={wind?'Wind ON':'Wind OFF'} onClick={()=>setWind(w=>!w)} accent={ACCENT} />
      </CtrlBar>
    </div>
  );
};

// ── 6 · CLOTH SIMULATION ──────────────────────────────────────────────────────
// 20×14 verlet grid; structural springs; top row pinned; mouse to pull
export const ClothSim: React.FC = () => {
  const { containerRef, canvasRef, sizeRef } = useCanvasSize();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const COLS2=22, ROWS=14;
    interface Pt { x:number;y:number;px:number;py:number;pinned?:boolean;torn?:boolean }
    interface Lnk { a:number;b:number;rest:number;torn:boolean }
    let pts:Pt[]=[], links:Lnk[]=[];

    const init = () => {
      const {w}=sizeRef.current; pts=[]; links=[];
      const sx=w/(COLS2+1), sy=10;
      const ox=(w-COLS2*sx)/2;
      for(let r=0;r<ROWS;r++) for(let c=0;c<COLS2;c++){
        pts.push({x:ox+c*sx,y:22+r*sy,px:ox+c*sx,py:22+r*sy,pinned:r===0&&(c%2===0)});
      }
      const idx=(r:number,c:number)=>r*COLS2+c;
      const addLink=(a:number,b:number)=>{const pa=pts[a],pb=pts[b];const rest=Math.sqrt((pa.x-pb.x)**2+(pa.y-pb.y)**2);links.push({a,b,rest,torn:false});};
      for(let r=0;r<ROWS;r++) for(let c=0;c<COLS2;c++){
        if(c<COLS2-1) addLink(idx(r,c),idx(r,c+1));
        if(r<ROWS-1)  addLink(idx(r,c),idx(r+1,c));
      }
    };

    let dragIdx=-1;
    const onDown=(e:MouseEvent)=>{
      const r=canvas.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;
      let best=-1,bd=99;
      pts.forEach((p,i)=>{const d=Math.sqrt((p.x-mx)**2+(p.y-my)**2);if(d<bd&&d<20){bd=d;best=i;}});
      dragIdx=best;
    };
    const onMove=(e:MouseEvent)=>{
      if(dragIdx<0) return;
      const r=canvas.getBoundingClientRect();
      pts[dragIdx].x=e.clientX-r.left; pts[dragIdx].y=e.clientY-r.top;
      pts[dragIdx].px=pts[dragIdx].x; pts[dragIdx].py=pts[dragIdx].y;
    };
    const onUp=()=>{dragIdx=-1;};
    canvas.addEventListener('mousedown',onDown);
    window.addEventListener('mousemove',onMove);
    window.addEventListener('mouseup',onUp);

    let last=performance.now(),raf:number;
    const ITERS=4,DAMP=0.98,G=500,MAX_STRETCH=1.6;
    const tick=()=>{
      raf=requestAnimationFrame(tick);
      const now=performance.now(),dt=Math.min((now-last)/1000,0.025);last=now;
      const {w,h}=sizeRef.current;
      if(!pts.length) init();

      for(const p of pts){
        if(p.pinned||pts.indexOf(p)===dragIdx) continue;
        const vx=(p.x-p.px)*DAMP,vy=(p.y-p.py)*DAMP;
        p.px=p.x;p.py=p.y;
        p.x+=vx;p.y+=vy+G*dt*dt;
      }
      for(let _=0;_<ITERS;_++){
        for(const lk of links){
          if(lk.torn) continue;
          const a=pts[lk.a],b=pts[lk.b];
          const dx=b.x-a.x,dy=b.y-a.y,d=Math.sqrt(dx*dx+dy*dy);
          if(d<1e-5) continue;
          if(d>lk.rest*MAX_STRETCH){lk.torn=true;continue;}
          const diff=(d-lk.rest)/d*0.5;
          if(!a.pinned&&lk.a!==dragIdx){a.x+=dx*diff;a.y+=dy*diff;}
          if(!b.pinned&&lk.b!==dragIdx){b.x-=dx*diff;b.y-=dy*diff;}
        }
        for(const p of pts){p.x=Math.max(4,Math.min(w-4,p.x));p.y=Math.max(4,Math.min(h-4,p.y));}
      }

      const ctx=canvas.getContext('2d')!;
      ctx.fillStyle='#06080f';ctx.fillRect(0,0,w,h);
      ctx.strokeStyle='rgba(167,139,250,0.5)';ctx.lineWidth=1;
      for(const lk of links){
        if(lk.torn) continue;
        const a=pts[lk.a],b=pts[lk.b];
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
      }
      ctx.fillStyle='rgba(167,139,250,0.6)';
      for(const p of pts){if(p.pinned){ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fill();}}
    };
    tick();
    return()=>{cancelAnimationFrame(raf);canvas.removeEventListener('mousedown',onDown);window.removeEventListener('mousemove',onMove);window.removeEventListener('mouseup',onUp);};
  },[]);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div ref={containerRef} style={{flex:1,position:'relative'}}>
        <FullCanvas canvasRef={canvasRef} />
        <span style={{position:'absolute',top:6,right:8,fontSize:9,color:'rgba(255,255,255,0.25)'}}>drag to pull · tears on overstretch</span>
      </div>
    </div>
  );
};

// ── 7 · FLUID RIPPLE ─────────────────────────────────────────────────────────
// 2D wave equation height field; click to splash; wave speed slider
export const FluidRipple: React.FC = () => {
  const { containerRef, canvasRef, sizeRef } = useCanvasSize();
  const [speed, setSpeed] = useState(0.35);
  const speedRef = useRef(0.35);
  useEffect(()=>{ speedRef.current=speed; },[speed]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const GW=100, GH=70;
    const u    = new Float32Array(GW*GH);
    const prev = new Float32Array(GW*GH);
    const next = new Float32Array(GW*GH);

    const splash = (mx: number, my: number) => {
      const {w,h}=sizeRef.current;
      const gx=Math.floor(mx/w*GW), gy=Math.floor(my/h*GH);
      for(let dy=-3;dy<=3;dy++) for(let dx=-3;dx<=3;dx++){
        const x=gx+dx,y=gy+dy;
        if(x>0&&x<GW-1&&y>0&&y<GH-1) u[y*GW+x]=1.5*(1-Math.sqrt(dx*dx+dy*dy)/4);
      }
    };

    const onDown=(e:MouseEvent)=>{ const r=canvas.getBoundingClientRect(); splash(e.clientX-r.left,e.clientY-r.top); };
    canvas.addEventListener('mousedown',onDown);
    canvas.addEventListener('mousemove',(e:MouseEvent)=>{ if(e.buttons) { const r=canvas.getBoundingClientRect(); splash(e.clientX-r.left,e.clientY-r.top); } });

    let raf:number;
    const tick=()=>{
      raf=requestAnimationFrame(tick);
      const {w,h}=sizeRef.current;
      const c2=speedRef.current*speedRef.current;
      // Wave equation step
      for(let y=1;y<GH-1;y++) for(let x=1;x<GW-1;x++){
        const i=y*GW+x;
        const lap=u[(y-1)*GW+x]+u[(y+1)*GW+x]+u[y*GW+(x-1)]+u[y*GW+(x+1)]-4*u[i];
        next[i]=2*u[i]-prev[i]+c2*lap;
        next[i]*=0.997; // damping
      }
      prev.set(u); u.set(next);

      // Draw
      const ctx=canvas.getContext('2d')!;
      const img=ctx.createImageData(w,h);
      const scaleX=w/GW, scaleY=h/GH;
      for(let gy2=0;gy2<GH;gy2++) for(let gx2=0;gx2<GW;gx2++){
        const val=u[gy2*GW+gx2];
        const r2=Math.max(0,Math.min(255,Math.floor(42+val*80)));
        const g2=Math.max(0,Math.min(255,Math.floor(80+val*120)));
        const b2=Math.max(0,Math.min(255,Math.floor(140+val*80)));
        // Fill block of pixels
        for(let py2=0;py2<scaleY;py2++) for(let px2=0;px2<scaleX;px2++){
          const px3=Math.floor(gx2*scaleX)+px2, py3=Math.floor(gy2*scaleY)+py2;
          if(px3>=w||py3>=h) continue;
          const idx2=(py3*w+px3)*4;
          img.data[idx2]=r2; img.data[idx2+1]=g2; img.data[idx2+2]=b2; img.data[idx2+3]=255;
        }
      }
      ctx.putImageData(img,0,0);
    };
    tick();
    return()=>{cancelAnimationFrame(raf);canvas.removeEventListener('mousedown',onDown);};
  },[]);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div ref={containerRef} style={{flex:1,position:'relative'}}>
        <FullCanvas canvasRef={canvasRef} />
        <span style={{position:'absolute',top:6,right:8,fontSize:9,color:'rgba(255,255,255,0.25)'}}>click / drag to splash</span>
      </div>
      <CtrlBar>
        <Knob label="Wave speed" value={speed} min={0.1} max={0.7} step={0.01} onChange={v=>{setSpeed(v);speedRef.current=v;}} accent={ACCENT} />
      </CtrlBar>
    </div>
  );
};


// ── SOFT BODY BLOB ────────────────────────────────────────────────────────────
// Central mass + 14 peripheral masses connected by springs; bounces & deforms

export const SoftBlob: React.FC = () => {
  const { containerRef, canvasRef, sizeRef } = useCanvasSize();
  const [stiffness, setStiffness] = useState(200);
  const kRef    = useRef(200);
  const animRef = useRef<number>(0);

  useEffect(() => { kRef.current = stiffness; }, [stiffness]);

  useEffect(() => {
    const canvas = canvasRef.current!;

    // Wait one rAF so useCanvasSize / ResizeObserver has fired and
    // canvas.width / canvas.height are real numbers
    const initRaf = requestAnimationFrame(() => {
      const W = canvas.width;
      const H = canvas.height;
      if (!W || !H) return;

      // ── constants ────────────────────────────────────────────────────
      const N       = 14;
      const R       = 48;
      const GRAV    = 700;
      const BOUNCE  = 0.68;
      const PAD     = R + 10;
      const STEPS   = 8;
      const DT      = (1 / 60) / STEPS;
      const rimRest = 2 * R * Math.sin(Math.PI / N);

      // ── initial state ────────────────────────────────────────────────
      const cx = W * 0.45, cy = H * 0.22;
      const VX = 110, VY = -30;

      const C = { x: cx, y: cy, vx: VX, vy: VY };
      const pts = Array.from({ length: N }, (_, i) => {
        const a = (2 * Math.PI * i) / N;
        return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, vx: VX, vy: VY };
      });

      // ── XPBD spring ──────────────────────────────────────────────────
      const applySpring = (
        a: { x: number; y: number },
        b: { x: number; y: number },
        restLen: number, k: number,
      ) => {
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1e-9;
        const corr = (dist - restLen) / 2 * Math.min(k * DT * DT * 60, 0.45);
        const nx = dx / dist, ny = dy / dist;
        a.x += nx * corr; a.y += ny * corr;
        b.x -= nx * corr; b.y -= ny * corr;
      };

      // ── smooth blob path ─────────────────────────────────────────────
      const drawBlob = (ctx: CanvasRenderingContext2D) => {
        const n = pts.length;
        ctx.beginPath();
        ctx.moveTo((pts[n - 1].x + pts[0].x) / 2, (pts[n - 1].y + pts[0].y) / 2);
        for (let i = 0; i < n; i++) {
          const p = pts[i], q = pts[(i + 1) % n];
          ctx.quadraticCurveTo(p.x, p.y, (p.x + q.x) / 2, (p.y + q.y) / 2);
        }
        ctx.closePath();
      };


      const tick = () => {
        animRef.current = requestAnimationFrame(tick);

        const { w, h } = sizeRef.current;
        const k = kRef.current;

        // ── physics substeps ────────────────────────────────────────────
        for (let s = 0; s < STEPS; s++) {
          const prevCx = C.x, prevCy = C.y;
          const prevPts = pts.map(p => ({ x: p.x, y: p.y }));

          // integrate
          C.vy += GRAV * DT; C.x += C.vx * DT; C.y += C.vy * DT;
          for (const p of pts) {
            p.vy += GRAV * DT; p.x += p.vx * DT; p.y += p.vy * DT;
          }

          // springs
          for (let i = 0; i < N; i++) {
            applySpring(C, pts[i], R, k);
            applySpring(pts[i], pts[(i + 1) % N], rimRest, k * 0.5);
          }

          // walls — only center gets full bounce, rim gets soft pushback
          const wall = (p: typeof C, hard: boolean) => {
            if (p.x < PAD)     { p.x = PAD;     if (hard) p.vx =  Math.abs(p.vx) * BOUNCE; }
            if (p.x > w - PAD) { p.x = w - PAD; if (hard) p.vx = -Math.abs(p.vx) * BOUNCE; }
            if (p.y < PAD)     { p.y = PAD;     if (hard) p.vy =  Math.abs(p.vy) * BOUNCE; }
            if (p.y > h - PAD) { p.y = h - PAD; if (hard) p.vy = -Math.abs(p.vy) * BOUNCE; }
          };
          wall(C, true);
          for (const p of pts) wall(p, false);

          // derive velocities from corrected positions (XPBD)
          C.vx = (C.x - prevCx) / DT;
          C.vy = (C.y - prevCy) / DT;
          for (let i = 0; i < N; i++) {
            pts[i].vx = (pts[i].x - prevPts[i].x) / DT;
            pts[i].vy = (pts[i].y - prevPts[i].y) / DT;
          }

          // light damping
          C.vx *= 0.997; C.vy *= 0.997;
          for (const p of pts) { p.vx *= 0.997; p.vy *= 0.997; }
        }

        // ── render ──────────────────────────────────────────────────────
        const ctx = canvas.getContext('2d')!;
        const { w: cw, h: ch } = sizeRef.current;
        ctx.fillStyle = '#06080f';
        ctx.fillRect(0, 0, cw, ch);

        drawBlob(ctx);

        // glow layer
        ctx.save();
        ctx.filter = 'blur(12px)';
        const grd1 = ctx.createRadialGradient(C.x, C.y, 2, C.x, C.y, R * 1.8);
        grd1.addColorStop(0,   'rgba(196,181,253,0.55)');
        grd1.addColorStop(1,   'rgba(109,40,217,0.0)');
        ctx.fillStyle = grd1;
        ctx.fill();
        ctx.restore();

        // main fill
        drawBlob(ctx);
        const grd2 = ctx.createRadialGradient(C.x, C.y, 2, C.x, C.y, R * 1.6);
        grd2.addColorStop(0,    'rgba(237,233,254,0.95)');
        grd2.addColorStop(0.4,  'rgba(167,139,250,0.60)');
        grd2.addColorStop(1,    'rgba(76,29,149,0.05)');
        ctx.fillStyle = grd2;
        ctx.fill();

        // outline
        ctx.strokeStyle = 'rgba(167,139,250,0.85)';
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        // centre dot
        ctx.beginPath();
        ctx.arc(C.x, C.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#f5f3ff';
        ctx.fill();
      };

      animRef.current = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(initRaf);
      cancelAnimationFrame(animRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div ref={containerRef} style={{ flex: 1, position: 'relative' }}>
        <FullCanvas canvasRef={canvasRef} />
      </div>
      <CtrlBar>
        <Knob
          label="Stiffness"
          value={stiffness}
          min={40}
          max={500}
          step={5}
          onChange={v => { setStiffness(v); kRef.current = v; }}
          accent={ACCENT}
        />
      </CtrlBar>
    </div>
  );
};
