import React, { useRef, useEffect, useState } from 'react';
import { useCanvasSize, FullCanvas, CtrlBar, Knob, Btn } from './shared';

const ACCENT = '#4d8fc8';
const COLS   = ['#4d8fc8','#a78bfa','#34d399','#fb923c','#f472b6','#fbbf24','#7eecd9'];

// ── 1 · BOUNCING BALL PIT ─────────────────────────────────────────────────────
// Semi-implicit Euler + circle-circle elastic collision; click to spawn
export const BouncingBalls: React.FC = () => {
  const { containerRef, canvasRef, sizeRef } = useCanvasSize();
  const [grav,  setGrav]  = useState(500);
  const [elast, setElast] = useState(0.76);
  const gravRef  = useRef(500);
  const elastRef = useRef(0.76);

  useEffect(() => {
    interface Ball { x:number; y:number; vx:number; vy:number; r:number; color:string }
    const balls: Ball[] = [];
    const spawn = (x: number, y: number) => {
      balls.push({ x, y, vx:(Math.random()-.5)*280, vy:-100-Math.random()*200,
        r: 9+Math.random()*11, color: COLS[Math.floor(Math.random()*COLS.length)] });
      if (balls.length > 22) balls.shift();
    };
    // Pre-spawn 7 balls
    for (let i=0;i<7;i++) spawn(60+Math.random()*160, 30+Math.random()*80);

    const canvas = canvasRef.current!;
    const onClick = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      spawn(e.clientX - r.left, e.clientY - r.top);
    };
    canvas.addEventListener('mousedown', onClick);

    let last = performance.now(), raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const dt  = Math.min((now - last) / 1000, 0.03);
      last = now;
      const { w, h } = sizeRef.current;
      const g = gravRef.current, e = elastRef.current;

      for (const b of balls) {
        b.vy += g * dt;
        b.x  += b.vx * dt;
        b.y  += b.vy * dt;
        if (b.x - b.r < 0)   { b.x = b.r;   b.vx = Math.abs(b.vx) * e; }
        if (b.x + b.r > w)   { b.x = w-b.r; b.vx =-Math.abs(b.vx) * e; }
        if (b.y - b.r < 0)   { b.y = b.r;   b.vy = Math.abs(b.vy) * e; }
        if (b.y + b.r > h)   { b.y = h-b.r; b.vy =-Math.abs(b.vy) * e; if (Math.abs(b.vy)<14) b.vy=0; }
      }
      // Ball–ball collision
      for (let i=0; i<balls.length; i++) for (let j=i+1; j<balls.length; j++) {
        const a=balls[i], b2=balls[j];
        const dx=b2.x-a.x, dy=b2.y-a.y, d=Math.sqrt(dx*dx+dy*dy), md=a.r+b2.r;
        if (d < md && d > 1e-4) {
          const push=(md-d)/2, nx=dx/d, ny=dy/d;
          a.x -= nx*push; a.y -= ny*push; b2.x += nx*push; b2.y += ny*push;
          const rv=(a.vx-b2.vx)*nx+(a.vy-b2.vy)*ny;
          if (rv>0){ const imp=rv*e; a.vx-=imp*nx; a.vy-=imp*ny; b2.vx+=imp*nx; b2.vy+=imp*ny; }
        }
      }

      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#06080f'; ctx.fillRect(0,0,w,h);
      ctx.strokeStyle='rgba(255,255,255,0.025)'; ctx.lineWidth=1;
      for (let x=0;x<w;x+=38){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
      for (let y=0;y<h;y+=38){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
      ctx.fillStyle='rgba(77,143,200,0.3)'; ctx.fillRect(0,h-2,w,2);

      for (const b of balls) {
        const grd = ctx.createRadialGradient(b.x-b.r*.3,b.y-b.r*.35,b.r*.06,b.x,b.y,b.r);
        grd.addColorStop(0,'#fff'); grd.addColorStop(.25,b.color); grd.addColorStop(1,'#000a1a');
        ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
        ctx.fillStyle=grd; ctx.fill();
      }
    };
    tick();
    return () => { cancelAnimationFrame(raf); canvas.removeEventListener('mousedown', onClick); };
  }, []);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div ref={containerRef} style={{ flex:1, position:'relative' }}>
        <FullCanvas canvasRef={canvasRef} />
        <span style={{position:'absolute',top:6,right:8,fontSize:9,color:'rgba(255,255,255,0.25)'}}>click to spawn</span>
      </div>
      <CtrlBar>
        <Knob label="Gravity" value={grav} min={0} max={1400} step={10} onChange={v=>{setGrav(v);gravRef.current=v;}} />
        <Knob label="Elasticity" value={elast} min={0} max={1} step={0.01} onChange={v=>{setElast(v);elastRef.current=v;}} />
      </CtrlBar>
    </div>
  );
};

// ── 2 · PROJECTILE LAUNCHER ───────────────────────────────────────────────────
// Fire button wired via canvas custom event; ballistic arc with gravity
export const ProjectileLauncherFixed: React.FC = () => {
  const { containerRef, canvasRef, sizeRef } = useCanvasSize();
  const [angle,  setAngle]  = useState(45);
  const [power,  setPower]  = useState(500);
  const angleRef = useRef(45);
  const powerRef = useRef(500);
  const ballRef  = useRef<{x:number;y:number;vx:number;vy:number;active:boolean}|null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const trails: Array<{ pts:{x:number;y:number}[]; color:string }> = [];
    let curTrail: {x:number;y:number}[] = [];

    const fire = () => {
      const { h } = sizeRef.current;
      const ang = angleRef.current * Math.PI / 180;
      const spd = powerRef.current;
      ballRef.current = { x:30, y:h-20, vx:spd*Math.cos(ang), vy:-spd*Math.sin(ang), active:true };
      curTrail = [];
      if (trails.length >= 6) trails.shift();
      trails.push({ pts:curTrail, color:COLS[trails.length%COLS.length] });
    };
    canvas.addEventListener('fire' as never, fire as never);

    let last=performance.now(), raf:number;
    const tick = () => {
      raf=requestAnimationFrame(tick);
      const now=performance.now(), dt=Math.min((now-last)/1000,0.03); last=now;
      const { w, h }=sizeRef.current;
      const ball=ballRef.current;
      if (ball?.active) {
        ball.vy += 550*dt; ball.x+=ball.vx*dt; ball.y+=ball.vy*dt;
        curTrail.push({x:ball.x,y:ball.y});
        if (ball.y>h-17) ball.active=false;
      }
      const ctx=canvas.getContext('2d')!;
      ctx.fillStyle='#06080f'; ctx.fillRect(0,0,w,h);
      ctx.fillStyle='rgba(77,143,200,0.18)'; ctx.fillRect(0,h-17,w,17);
      ctx.strokeStyle='rgba(77,143,200,0.45)'; ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(0,h-17);ctx.lineTo(w,h-17);ctx.stroke();
      for (const tr of trails) {
        if (!tr.pts.length) continue;
        ctx.beginPath();ctx.moveTo(tr.pts[0].x,tr.pts[0].y);
        for (const p of tr.pts) ctx.lineTo(p.x,p.y);
        ctx.strokeStyle=tr.color+'66';ctx.lineWidth=1.5;ctx.stroke();
      }
      if (ball?.active){ctx.beginPath();ctx.arc(ball.x,ball.y,5,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();}
      const ang=angleRef.current*Math.PI/180;
      const lx=30,ly=h-17,ex=lx+Math.cos(ang)*42,ey=ly-Math.sin(ang)*42;
      const nx=Math.cos(ang),ny=-Math.sin(ang);
      ctx.strokeStyle=ACCENT;ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(ex,ey);ctx.stroke();
      ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex-nx*9-ny*4,ey-ny*9+nx*4);ctx.lineTo(ex-nx*9+ny*4,ey-ny*9-nx*4);ctx.closePath();ctx.fillStyle=ACCENT;ctx.fill();
      ctx.beginPath();ctx.arc(lx,ly,5,0,Math.PI*2);ctx.fill();
      const last2=trails.slice().reverse().find((t:{pts:{x:number;y:number}[];color:string})=>t.pts.length>2);
      if (last2){const pts=last2.pts;const minY=Math.min(...pts.map((p:{x:number;y:number})=>p.y));const topH=Math.round((h-17-minY));const range=Math.round(pts[pts.length-1].x);ctx.fillStyle='rgba(255,255,255,0.28)';ctx.font='9px monospace';ctx.fillText(`range ${range}px  max height ${topH}px`,8,14);}
    };
    tick();
    return ()=>{cancelAnimationFrame(raf);canvas.removeEventListener('fire' as never,fire as never);};
  }, []);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div ref={containerRef} style={{flex:1,position:'relative'}}>
        <FullCanvas canvasRef={canvasRef} />
      </div>
      <CtrlBar>
        <Knob label="Angle °" value={angle} min={5} max={85} step={1} onChange={v=>{setAngle(v);angleRef.current=v;}} />
        <Knob label="Power" value={power} min={100} max={900} step={10} onChange={v=>{setPower(v);powerRef.current=v;}} />
        <Btn label="Fire!" onClick={()=>{canvasRef.current?.dispatchEvent(new CustomEvent('fire'));}} />
      </CtrlBar>
    </div>
  );
};

// ── 3 · SPRING PENDULUM ───────────────────────────────────────────────────────
// Bob attached to anchor by spring; drag to throw; real spring physics
export const SpringPendulum: React.FC = () => {
  const { containerRef, canvasRef, sizeRef } = useCanvasSize();
  const [springK, setSpringK] = useState(180);
  const kRef  = useRef(180);

  useEffect(() => {
    const canvas = canvasRef.current!;
    let bob = { x:0, y:0, vx:0, vy:0, mass:1.5 };
    let drag = false;

    const reset = () => {
      const { w, h } = sizeRef.current;
      bob = { x: w/2+40, y: h*0.45, vx:0, vy:0, mass:1.5 };
    };

    const onDown = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const mx=e.clientX-r.left, my=e.clientY-r.top;
      const d=Math.sqrt((mx-bob.x)**2+(my-bob.y)**2);
      if (d<22){ drag=true; bob.vx=0;bob.vy=0; }
    };
    const onMove = (e: MouseEvent) => {
      if (!drag) return;
      const r = canvas.getBoundingClientRect();
      bob.x=e.clientX-r.left; bob.y=e.clientY-r.top;
    };
    const onUp = () => { drag=false; };
    canvas.addEventListener('mousedown',onDown);
    window.addEventListener('mousemove',onMove);
    window.addEventListener('mouseup',onUp);

    let last=performance.now(), raf:number;
    const L0 = 80;  // natural spring length (px)
    const damp = 0.4;

    const tick = () => {
      raf=requestAnimationFrame(tick);
      const now=performance.now(), dt=Math.min((now-last)/1000,0.025); last=now;
      const { w, h }=sizeRef.current;
      if (!bob.x) reset();
      const ax=w/2, ay=30; // anchor

      if (!drag) {
        const dx=ax-bob.x, dy=ay-bob.y;
        const r=Math.sqrt(dx*dx+dy*dy);
        const k=kRef.current;
        const fSpring=(r-L0)*k/bob.mass;
        const nx=dx/r, ny=dy/r;
        const accX = nx*fSpring - damp*bob.vx/bob.mass;
        const accY = ny*fSpring + 480 - damp*bob.vy/bob.mass;
        bob.vx+=accX*dt; bob.vy+=accY*dt;
        bob.x+=bob.vx*dt; bob.y+=bob.vy*dt;
        // Soft wall collision
        if (bob.x<12){bob.x=12;bob.vx*=-0.6;} if (bob.x>w-12){bob.x=w-12;bob.vx*=-0.6;}
        if (bob.y<12){bob.y=12;bob.vy*=-0.6;} if (bob.y>h-12){bob.y=h-12;bob.vy*=-0.6;}
      }

      const ctx=canvas.getContext('2d')!;
      ctx.fillStyle='#06080f'; ctx.fillRect(0,0,w,h);

      // Draw spring as zigzag
      const dx2=bob.x-ax, dy2=bob.y-ay, r2=Math.sqrt(dx2*dx2+dy2*dy2);
      const nx2=dx2/r2, ny2=dy2/r2;
      const px=-ny2, py=nx2; // perp
      const segs=16; const amplitude=6;
      ctx.beginPath(); ctx.moveTo(ax,ay);
      for (let i=1;i<segs;i++){
        const t=i/segs;
        const cx=ax+nx2*r2*t, cy=ay+ny2*r2*t;
        const side=(i%2===0?1:-1)*amplitude;
        ctx.lineTo(cx+px*side, cy+py*side);
      }
      ctx.lineTo(bob.x,bob.y);
      ctx.strokeStyle='rgba(77,143,200,0.7)'; ctx.lineWidth=1.5; ctx.stroke();

      // Anchor
      ctx.fillStyle='rgba(77,143,200,0.5)';
      ctx.fillRect(ax-18,ay-6,36,6);
      ctx.beginPath(); ctx.arc(ax,ay,4,0,Math.PI*2);
      ctx.fillStyle='#7eb8e8'; ctx.fill();

      // Bob
      const grd=ctx.createRadialGradient(bob.x-6,bob.y-6,2,bob.x,bob.y,18);
      grd.addColorStop(0,'#fff'); grd.addColorStop(.3,ACCENT); grd.addColorStop(1,'#001428');
      ctx.beginPath(); ctx.arc(bob.x,bob.y,16,0,Math.PI*2);
      ctx.fillStyle=grd; ctx.fill();
      ctx.strokeStyle='rgba(77,143,200,0.4)'; ctx.lineWidth=1.5; ctx.stroke();

      if (drag){ ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.font='10px sans-serif'; ctx.fillText('drag to throw',bob.x+20,bob.y-10); }
      else { ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.font='9px sans-serif'; ctx.fillText('drag bob',8,14); }
    };
    tick();
    return ()=>{cancelAnimationFrame(raf);canvas.removeEventListener('mousedown',onDown);window.removeEventListener('mousemove',onMove);window.removeEventListener('mouseup',onUp);};
  }, []);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div ref={containerRef} style={{flex:1,position:'relative'}}>
        <FullCanvas canvasRef={canvasRef} />
      </div>
      <CtrlBar>
        <Knob label="Spring k" value={springK} min={30} max={500} step={5} onChange={v=>{setSpringK(v);kRef.current=v;}} />
      </CtrlBar>
    </div>
  );
};

// ── 4 · NEWTON'S CRADLE ───────────────────────────────────────────────────────
// 5 pendulums with equal-mass elastic collision (angular velocity exchange)
export const NewtonsCradle: React.FC = () => {
  const { containerRef, canvasRef, sizeRef } = useCanvasSize();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const N=5, L=90, R=13, DAMP=0.0006;
    const pendulums = Array.from({length:N}, (_,i)=>({ theta:0, omega:0, idx:i }));

    const liftLeft = (n: number) => {
      for (let i=0;i<N;i++) { pendulums[i].theta=0; pendulums[i].omega=0; }
      for (let i=0;i<n;i++) { pendulums[i].theta = -0.55; pendulums[i].omega=0; }
    };
    liftLeft(1);  // start with 1

    let last=performance.now(), raf:number;
    const g=900;
    const tick = () => {
      raf=requestAnimationFrame(tick);
      const now=performance.now(), dt=Math.min((now-last)/1000,0.016); last=now;
      const { w, h }=sizeRef.current;
      const cx=w/2, topY=18;
      const spacing=R*2+1;
      const pivots=pendulums.map((_,i)=>cx+(i-(N-1)/2)*spacing);

      // Integrate pendulums
      for (const p of pendulums) {
        const alpha = -(g/L)*Math.sin(p.theta) - DAMP*p.omega;
        p.omega += alpha*dt;
        p.theta += p.omega*dt;
      }

      // Ball positions
      const pos = pendulums.map((p,i)=>({ x: pivots[i]+L*Math.sin(p.theta), y: topY+L*Math.cos(p.theta) }));

      // Collision detection between adjacent balls
      for (let i=0;i<N-1;i++){
        const dx=pos[i+1].x-pos[i].x, dy=pos[i+1].y-pos[i].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if (d < 2*R-0.5){
          // Elastic equal-mass: exchange omega (angular velocity ≈ tangential velocity / L)
          const o0=pendulums[i].omega, o1=pendulums[i+1].omega;
          pendulums[i].omega=o1; pendulums[i+1].omega=o0;
          // Push apart so they don't overlap
          const overlap=(2*R-d)/2;
          const dt2=overlap/(L*Math.abs(o0-o1+1e-6));
          pendulums[i].theta -= dt2*o0;
          pendulums[i+1].theta += dt2*o1;
        }
      }

      const ctx=canvas.getContext('2d')!;
      ctx.fillStyle='#06080f'; ctx.fillRect(0,0,w,h);

      // Top bar
      ctx.fillStyle='rgba(255,255,255,0.12)';
      ctx.fillRect(cx-(N/2)*spacing-R-8, topY-6, N*spacing+R*3+16, 6);

      for (let i=0;i<N;i++){
        // String
        ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(pivots[i],topY); ctx.lineTo(pos[i].x,pos[i].y); ctx.stroke();
        // Ball
        const grd=ctx.createRadialGradient(pos[i].x-R*.3,pos[i].y-R*.3,R*.1,pos[i].x,pos[i].y,R);
        grd.addColorStop(0,'#dde8ff'); grd.addColorStop(.4,'#8aaee0'); grd.addColorStop(1,'#0a1528');
        ctx.beginPath(); ctx.arc(pos[i].x,pos[i].y,R,0,Math.PI*2);
        ctx.fillStyle=grd; ctx.fill();
        ctx.strokeStyle='rgba(139,170,220,0.3)'; ctx.lineWidth=1; ctx.stroke();
      }

      ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.font='9px monospace';
      ctx.fillText('lift →',8,h-10);
    };
    tick();
    return ()=>cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div ref={containerRef} style={{flex:1}}>
        <FullCanvas canvasRef={canvasRef} />
      </div>
      <CtrlBar>
        <Btn label="Lift 1L" onClick={()=>{const canvas=canvasRef.current;canvas?.dispatchEvent(new CustomEvent('lift',{detail:{n:1,side:'left'}}));}} />
        <Btn label="Lift 2L" onClick={()=>{const canvas=canvasRef.current;canvas?.dispatchEvent(new CustomEvent('lift',{detail:{n:2,side:'left'}}));}} />
        <Btn label="Lift 3L" onClick={()=>{const canvas=canvasRef.current;canvas?.dispatchEvent(new CustomEvent('lift',{detail:{n:3,side:'left'}}));}} />
        <Btn label="Lift 1R" onClick={()=>{const canvas=canvasRef.current;canvas?.dispatchEvent(new CustomEvent('lift',{detail:{n:1,side:'right'}}));}} />
      </CtrlBar>
    </div>
  );
};

// Wire lift buttons via custom events
export const NewtonsCradleWired: React.FC = () => {
  const { containerRef, canvasRef, sizeRef } = useCanvasSize();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const N=5, L=90, R=13, DAMP=0.0005;
    const pends = Array.from({length:N}, ()=>({ theta:0, omega:0 }));
    const liftL=(n:number)=>{for(let i=0;i<N;i++){pends[i].theta=0;pends[i].omega=0;}for(let i=0;i<n;i++){pends[i].theta=-0.6;}};
    const liftR=(n:number)=>{for(let i=0;i<N;i++){pends[i].theta=0;pends[i].omega=0;}for(let i=N-n;i<N;i++){pends[i].theta=0.6;}};
    liftL(1);

    const onLift=(e:Event)=>{const d=(e as CustomEvent).detail;d.side==='left'?liftL(d.n):liftR(d.n);};
    canvas.addEventListener('lift' as never, onLift as never);

    let last=performance.now(), raf:number;
    const tick=()=>{
      raf=requestAnimationFrame(tick);
      const now=performance.now(), dt=Math.min((now-last)/1000,0.016); last=now;
      const {w,h}=sizeRef.current;
      const cx=w/2, topY=20;
      const sp=R*2+1.5;
      const pivots=pends.map((_,i)=>cx+(i-(N-1)/2)*sp);

      for(const p of pends){p.omega+=dt*(-(900/L)*Math.sin(p.theta)-DAMP*p.omega);p.theta+=p.omega*dt;}
      const pos=pends.map((p,i)=>({x:pivots[i]+L*Math.sin(p.theta),y:topY+L*Math.cos(p.theta)}));

      for(let i=0;i<N-1;i++){
        const dx=pos[i+1].x-pos[i].x,dy=pos[i+1].y-pos[i].y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<2*R-0.2){const o0=pends[i].omega,o1=pends[i+1].omega;pends[i].omega=o1;pends[i+1].omega=o0;}
      }

      const ctx=canvas.getContext('2d')!; ctx.fillStyle='#06080f'; ctx.fillRect(0,0,w,h);
      const barX=pivots[0]-sp, barW=(N+1)*sp;
      ctx.fillStyle='rgba(255,255,255,0.1)'; ctx.fillRect(barX,topY-8,barW,8);
      for(let i=0;i<N;i++){
        ctx.strokeStyle='rgba(200,210,230,0.25)';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(pivots[i],topY);ctx.lineTo(pos[i].x,pos[i].y);ctx.stroke();
        const g2=ctx.createRadialGradient(pos[i].x-R*.3,pos[i].y-R*.35,R*.08,pos[i].x,pos[i].y,R);
        g2.addColorStop(0,'#e8f0ff');g2.addColorStop(.4,'#7ba8d8');g2.addColorStop(1,'#071020');
        ctx.beginPath();ctx.arc(pos[i].x,pos[i].y,R,0,Math.PI*2);ctx.fillStyle=g2;ctx.fill();
        ctx.strokeStyle='rgba(120,170,220,0.25)';ctx.lineWidth=1;ctx.stroke();
      }
    };
    tick();
    return ()=>{cancelAnimationFrame(raf);canvas.removeEventListener('lift' as never,onLift as never);};
  }, []);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div ref={containerRef} style={{flex:1}}><FullCanvas canvasRef={canvasRef} /></div>
      <CtrlBar>
        {[1,2,3].map(n=>(
          <Btn key={n} label={`Lift ${n}L`} onClick={()=>canvasRef.current?.dispatchEvent(new CustomEvent('lift',{detail:{n,side:'left'}}))} />
        ))}
        <Btn label="Lift 1R" onClick={()=>canvasRef.current?.dispatchEvent(new CustomEvent('lift',{detail:{n:1,side:'right'}}))} />
      </CtrlBar>
    </div>
  );
};
