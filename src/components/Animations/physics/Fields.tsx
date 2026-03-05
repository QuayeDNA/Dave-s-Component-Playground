import React, { useRef, useEffect, useState } from 'react';
import { useCanvasSize, FullCanvas, CtrlBar, Knob, Btn } from './shared';

const ACCENT = '#34d399';

// ── 9 · GRAVITY WELLS ─────────────────────────────────────────────────────────
// 3 draggable massive bodies attract 60 particles; particles respawn at edge
export const GravityWells: React.FC = () => {
  const { containerRef, canvasRef, sizeRef } = useCanvasSize();
  const [grav, setGrav] = useState(9000);
  const gravRef = useRef(9000);
  useEffect(()=>{ gravRef.current=grav; },[grav]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const COLS = ['#34d399','#fb923c','#a78bfa'];
    interface Well { x:number;y:number;mass:number;color:string }
    interface Particle { x:number;y:number;vx:number;vy:number;color:string;alpha:number }
    let wells:Well[]=[], particles:Particle[]=[];

    const init=()=>{
      const {w,h}=sizeRef.current;
      wells=[
        {x:w*0.25,y:h*0.4,mass:1,color:COLS[0]},
        {x:w*0.75,y:h*0.4,mass:1,color:COLS[1]},
        {x:w*0.5, y:h*0.7,mass:1,color:COLS[2]},
      ];
      particles=Array.from({length:60},()=>spawnParticle(w,h));
    };
    const spawnParticle=(w:number,h:number):Particle=>{
      const edge=Math.floor(Math.random()*4);
      let x=0,y=0,vx=(Math.random()-.5)*40,vy=(Math.random()-.5)*40;
      if(edge===0){x=Math.random()*w;y=0;}
      else if(edge===1){x=w;y=Math.random()*h;}
      else if(edge===2){x=Math.random()*w;y=h;}
      else{x=0;y=Math.random()*h;}
      return{x,y,vx,vy,color:COLS[Math.floor(Math.random()*3)],alpha:0.6+Math.random()*0.4};
    };

    let dragWell=-1;
    const onDown=(e:MouseEvent)=>{
      const r=canvas.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;
      dragWell=wells.findIndex(w=>Math.sqrt((w.x-mx)**2+(w.y-my)**2)<18);
    };
    const onMove=(e:MouseEvent)=>{
      if(dragWell<0) return;
      const r=canvas.getBoundingClientRect();
      wells[dragWell].x=e.clientX-r.left;wells[dragWell].y=e.clientY-r.top;
    };
    const onUp=()=>{dragWell=-1;};
    canvas.addEventListener('mousedown',onDown);
    window.addEventListener('mousemove',onMove);
    window.addEventListener('mouseup',onUp);

    let last=performance.now(),raf:number;
    const tick=()=>{
      raf=requestAnimationFrame(tick);
      const now=performance.now(),dt=Math.min((now-last)/1000,0.025);last=now;
      const {w,h}=sizeRef.current;
      if(!wells.length) init();
      const G=gravRef.current;

      for(const p of particles){
        let ax=0,ay=0;
        for(const well of wells){
          const dx=well.x-p.x,dy=well.y-p.y;
          const r2=dx*dx+dy*dy,r3=Math.sqrt(r2);
          const f=G*well.mass/Math.max(r2,400);
          ax+=f*dx/r3; ay+=f*dy/r3;
        }
        p.vx+=ax*dt; p.vy+=ay*dt;
        p.x+=p.vx*dt; p.y+=p.vy*dt;
        // Absorb particles that go out of bounds or get too close
        const oob=p.x<-10||p.x>w+10||p.y<-10||p.y>h+10;
        const cap=wells.some(wl=>Math.sqrt((wl.x-p.x)**2+(wl.y-p.y)**2)<8);
        if(oob||cap) Object.assign(p,spawnParticle(w,h));
      }

      const ctx=canvas.getContext('2d')!;
      ctx.fillStyle='#06080f';ctx.fillRect(0,0,w,h);

      // Particle trails via translucent fill
      ctx.fillStyle='rgba(6,8,15,0.25)';ctx.fillRect(0,0,w,h);

      for(const p of particles){
        ctx.beginPath();ctx.arc(p.x,p.y,2,0,Math.PI*2);
        ctx.fillStyle=p.color+(Math.floor(p.alpha*255).toString(16).padStart(2,'0'));
        ctx.fill();
      }

      // Wells
      for(const well of wells){
        const grd=ctx.createRadialGradient(well.x,well.y,2,well.x,well.y,16);
        grd.addColorStop(0,'#fff');grd.addColorStop(.4,well.color);grd.addColorStop(1,well.color+'00');
        ctx.beginPath();ctx.arc(well.x,well.y,16,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();
        ctx.beginPath();ctx.arc(well.x,well.y,4,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
      }
    };
    tick();
    return()=>{cancelAnimationFrame(raf);canvas.removeEventListener('mousedown',onDown);window.removeEventListener('mousemove',onMove);window.removeEventListener('mouseup',onUp);};
  },[]);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div ref={containerRef} style={{flex:1,position:'relative'}}>
        <FullCanvas canvasRef={canvasRef} />
        <span style={{position:'absolute',top:6,right:8,fontSize:9,color:'rgba(255,255,255,0.25)'}}>drag wells</span>
      </div>
      <CtrlBar>
        <Knob label="Gravity G" value={grav} min={1000} max={30000} step={500} onChange={v=>{setGrav(v);gravRef.current=v;}} accent={ACCENT} />
      </CtrlBar>
    </div>
  );
};

// ── 10 · ELASTIC BILLIARDS ────────────────────────────────────────────────────
// Circular arena; proper 2D elastic collision with mass-weighted impulse
export const ElasticBilliards: React.FC = () => {
  const { containerRef, canvasRef, sizeRef } = useCanvasSize();

  useEffect(() => {
    const canvas = canvasRef.current!;
    interface Ball { x:number;y:number;vx:number;vy:number;r:number;mass:number;color:string }
    const BALL_COLORS=['#34d399','#fb923c','#a78bfa','#4d8fc8','#f472b6','#fbbf24','#7eecd9'];
    let balls:Ball[]=[];
    let arena={cx:0,cy:0,r:0};

    const init=()=>{
      const {w,h}=sizeRef.current;
      arena={cx:w/2,cy:h/2,r:Math.min(w,h)*0.43};
      balls=Array.from({length:7},(_,i)=>{
        const a=2*Math.PI*i/7, radius=11+i%3*4;
        return{x:arena.cx+Math.cos(a)*arena.r*0.5,y:arena.cy+Math.sin(a)*arena.r*0.5,
          vx:(Math.random()-.5)*180,vy:(Math.random()-.5)*180,r:radius,mass:radius*radius,color:BALL_COLORS[i]};
      });
    };

    const onDown=(e:MouseEvent)=>{
      if(!balls.length) return;
      const r=canvas.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;
      const dx=mx-arena.cx,dy=my-arena.cy;
      balls[0].vx+=dx*2;balls[0].vy+=dy*2;
    };
    canvas.addEventListener('mousedown',onDown);

    let last=performance.now(),raf:number;
    const tick=()=>{
      raf=requestAnimationFrame(tick);
      const now=performance.now(),dt=Math.min((now-last)/1000,0.025);last=now;
      const {w,h}=sizeRef.current;
      if(!balls.length) init();
      const {cx,cy,r:AR}=arena;

      for(const b of balls){
        b.vx*=0.999;b.vy*=0.999;
        b.x+=b.vx*dt;b.y+=b.vy*dt;
        // Circle wall bounce
        const dx=b.x-cx,dy=b.y-cy,d=Math.sqrt(dx*dx+dy*dy);
        if(d+b.r>AR){
          const nx=dx/d,ny=dy/d;
          b.x=cx+nx*(AR-b.r);b.y=cy+ny*(AR-b.r);
          const vn=b.vx*nx+b.vy*ny;
          if(vn>0){b.vx-=2*vn*nx;b.vy-=2*vn*ny;}
        }
      }

      // Ball-ball collisions (elastic, mass-weighted impulse)
      for(let i=0;i<balls.length;i++) for(let j=i+1;j<balls.length;j++){
        const a=balls[i],b2=balls[j];
        const dx=b2.x-a.x,dy=b2.y-a.y,d=Math.sqrt(dx*dx+dy*dy),md=a.r+b2.r;
        if(d<md&&d>1e-5){
          const nx=dx/d,ny=dy/d;
          const overlap=(md-d)/2;
          const totM=a.mass+b2.mass;
          a.x-=nx*overlap*(b2.mass/totM)*2;a.y-=ny*overlap*(b2.mass/totM)*2;
          b2.x+=nx*overlap*(a.mass/totM)*2;b2.y+=ny*overlap*(a.mass/totM)*2;
          const dvx=a.vx-b2.vx,dvy=a.vy-b2.vy;
          const vn=dvx*nx+dvy*ny;
          if(vn>0){
            const imp=2*vn/totM;
            a.vx-=imp*b2.mass*nx;a.vy-=imp*b2.mass*ny;
            b2.vx+=imp*a.mass*nx;b2.vy+=imp*a.mass*ny;
          }
        }
      }

      const ctx=canvas.getContext('2d')!;
      ctx.fillStyle='#06080f';ctx.fillRect(0,0,w,h);
      // Arena
      ctx.beginPath();ctx.arc(cx,cy,AR,0,Math.PI*2);
      ctx.strokeStyle='rgba(52,211,153,0.3)';ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle='rgba(52,211,153,0.03)';ctx.fill();

      for(const b of balls){
        const grd=ctx.createRadialGradient(b.x-b.r*.3,b.y-b.r*.35,b.r*.08,b.x,b.y,b.r);
        grd.addColorStop(0,'#fff');grd.addColorStop(.3,b.color);grd.addColorStop(1,'#001a0e');
        ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();
      }
      ctx.fillStyle='rgba(255,255,255,0.18)';ctx.font='9px sans-serif';ctx.fillText('click arena to impulse cue ball',8,14);
    };
    tick();
    return()=>{cancelAnimationFrame(raf);canvas.removeEventListener('mousedown',onDown);};
  },[]);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div ref={containerRef} style={{flex:1}}>
        <FullCanvas canvasRef={canvasRef} />
      </div>
    </div>
  );
};

// ── 11 · DOUBLE PENDULUM ─────────────────────────────────────────────────────
// Lagrangian equations; 3 pendulums with slightly different ICs → chaos
export const DoublePendulum: React.FC = () => {
  const { containerRef, canvasRef, sizeRef } = useCanvasSize();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const L=62, M=1, g=12;
    interface Pend { t1:number;w1:number;t2:number;w2:number;trail:{x:number;y:number}[];color:string }
    const pendulums:Pend[]=[
      {t1:Math.PI*0.72,w1:0,t2:Math.PI*0.7,w2:0,trail:[],color:'#34d399'},
      {t1:Math.PI*0.72+0.01,w1:0,t2:Math.PI*0.7,w2:0,trail:[],color:'#fb923c'},
      {t1:Math.PI*0.72+0.02,w1:0,t2:Math.PI*0.7,w2:0,trail:[],color:'#a78bfa'},
    ];
    const TRAIL_LEN=280;

    let last=performance.now(),raf:number;
    const tick=()=>{
      raf=requestAnimationFrame(tick);
      const now=performance.now(),dt=Math.min((now-last)/1000,0.02);last=now;
      const {w,h}=sizeRef.current;
      const px=w/2, py=h*0.25;

      for(const p of pendulums){
        // Double pendulum Lagrangian equations (m1=m2=M, L1=L2=L)
        const steps=4, sdt=dt/steps;
        for(let s=0;s<steps;s++){
          const d=p.t2-p.t1;
          const sd=Math.sin(d),cd=Math.cos(d);
          const denom=2*M-M*Math.cos(2*d);
          const a1=(-g*(2*M)*Math.sin(p.t1)-M*g*Math.sin(p.t1-2*p.t2)
            -2*M*sd*(p.w2*p.w2*L+p.w1*p.w1*L*cd))/(L*denom);
          const a2=(2*M*sd*(p.w1*p.w1*L+g*Math.cos(p.t1)+p.w2*p.w2*L*cd))/(L*denom);
          p.w1+=a1*sdt; p.w2+=a2*sdt;
          p.t1+=p.w1*sdt; p.t2+=p.w2*sdt;
        }
        const x1=px+L*Math.sin(p.t1), y1=py+L*Math.cos(p.t1);
        const x2=x1+L*Math.sin(p.t2), y2=y1+L*Math.cos(p.t2);
        p.trail.push({x:x2,y:y2});
        if(p.trail.length>TRAIL_LEN) p.trail.shift();
      }

      const ctx=canvas.getContext('2d')!;
      ctx.fillStyle='rgba(6,8,15,0.18)';ctx.fillRect(0,0,w,h);

      for(const p of pendulums){
        // Trail
        if(p.trail.length>1){
          ctx.beginPath();ctx.moveTo(p.trail[0].x,p.trail[0].y);
          for(const pt of p.trail) ctx.lineTo(pt.x,pt.y);
          ctx.strokeStyle=p.color+'55';ctx.lineWidth=1;ctx.stroke();
        }
        const x1=px+L*Math.sin(p.t1),y1=py+L*Math.cos(p.t1);
        const x2=x1+L*Math.sin(p.t2),y2=y1+L*Math.cos(p.t2);
        // Arms
        ctx.strokeStyle=p.color+'80';ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(x1,y1);ctx.stroke();
        ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
        // Joints
        ctx.beginPath();ctx.arc(x1,y1,5,0,Math.PI*2);ctx.fillStyle=p.color+'aa';ctx.fill();
        ctx.beginPath();ctx.arc(x2,y2,7,0,Math.PI*2);ctx.fillStyle=p.color;ctx.fill();
      }
      // Pivot
      ctx.beginPath();ctx.arc(px,py,5,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fill();
    };
    tick();
    return()=>cancelAnimationFrame(raf);
  },[]);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div ref={containerRef} style={{flex:1}}>
        <FullCanvas canvasRef={canvasRef} />
      </div>
      <div style={{padding:'4px 10px 6px'}}>
        <span style={{fontSize:9,color:'rgba(255,255,255,0.2)'}}>3 pendulums · initial Δθ=0.01 rad apart → exponential divergence</span>
      </div>
    </div>
  );
};

// ── 12 · ORBITAL MECHANICS ────────────────────────────────────────────────────
// N-body gravity from central star; circular initial orbits; RK4 integration
export const OrbitalMechanics: React.FC = () => {
  const { containerRef, canvasRef, sizeRef } = useCanvasSize();
  const [gMass, setGMass] = useState(1.2);
  const gRef = useRef(1.2);
  useEffect(()=>{ gRef.current=gMass; },[gMass]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    interface Planet { x:number;y:number;vx:number;vy:number;r:number;color:string;trail:{x:number;y:number}[] }
    const PCOLORS=['#fb923c','#34d399','#4d8fc8','#a78bfa','#fbbf24'];
    const ORBIT_RADII=[60,90,120,150,185];
    let planets:Planet[]=[];
    let star={x:0,y:0};

    const init=()=>{
      const {w,h}=sizeRef.current;
      star={x:w/2,y:h/2};
      const GM=gRef.current*8000;
      planets=ORBIT_RADII.map((or,i)=>{
        const a=Math.random()*Math.PI*2;
        const v=Math.sqrt(GM/or);
        return{x:star.x+Math.cos(a)*or,y:star.y+Math.sin(a)*or,
          vx:-v*Math.sin(a),vy:v*Math.cos(a),r:4+i*1.5,color:PCOLORS[i],trail:[]};
      });
    };

    let dragPlanet=-1;
    const onDown=(e:MouseEvent)=>{
      const r=canvas.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;
      dragPlanet=planets.findIndex(p=>Math.sqrt((p.x-mx)**2+(p.y-my)**2)<p.r+8);
    };
    const onMove=(e:MouseEvent)=>{
      if(dragPlanet<0) return;
      const r=canvas.getBoundingClientRect();
      planets[dragPlanet].x=e.clientX-r.left;planets[dragPlanet].y=e.clientY-r.top;
      planets[dragPlanet].vx=0;planets[dragPlanet].vy=0;
    };
    const onUp=()=>{
      if(dragPlanet>=0){
        // Give circular orbit velocity on release
        const p=planets[dragPlanet];
        const dx=p.x-star.x,dy=p.y-star.y,r0=Math.sqrt(dx*dx+dy*dy);
        const GM=gRef.current*8000;
        const v=Math.sqrt(GM/r0);
        p.vx=-v*dy/r0; p.vy=v*dx/r0;
      }
      dragPlanet=-1;
    };
    canvas.addEventListener('mousedown',onDown);
    window.addEventListener('mousemove',onMove);
    window.addEventListener('mouseup',onUp);

    const TRAIL=120;
    let last=performance.now(),raf:number;
    const tick=()=>{
      raf=requestAnimationFrame(tick);
      const now=performance.now(),dt=Math.min((now-last)/1000,0.025);last=now;
      const {w,h}=sizeRef.current;
      if(!planets.length) init();
      const GM=gRef.current*8000;
      star={x:w/2,y:h/2};

      for(let step=0;step<3;step++){
        const sdt=dt/3;
        for(const p of planets){
          if(planets.indexOf(p)===dragPlanet) continue;
          const dx=star.x-p.x,dy=star.y-p.y,r2=dx*dx+dy*dy,r3=Math.sqrt(r2);
          const f=GM/Math.max(r2,400);
          p.vx+=f*dx/r3*sdt;p.vy+=f*dy/r3*sdt;
          p.x+=p.vx*sdt;p.y+=p.vy*sdt;
        }
      }

      for(const p of planets){
        p.trail.push({x:p.x,y:p.y});if(p.trail.length>TRAIL)p.trail.shift();
      }

      const ctx=canvas.getContext('2d')!;
      ctx.fillStyle='#06080f';ctx.fillRect(0,0,w,h);

      // Stars background
      for(let i=0;i<30;i++){
        const bx=(i*137.5+w/2)%w,by=(i*97.3+h/3)%h;
        ctx.fillStyle=`rgba(255,255,255,${0.1+i%3*0.1})`;
        ctx.beginPath();ctx.arc(bx,by,0.8,0,Math.PI*2);ctx.fill();
      }

      // Trails
      for(const p of planets){
        if(p.trail.length<2) continue;
        ctx.beginPath();ctx.moveTo(p.trail[0].x,p.trail[0].y);
        for(const t of p.trail) ctx.lineTo(t.x,t.y);
        ctx.strokeStyle=p.color+'40';ctx.lineWidth=1;ctx.stroke();
      }

      // Planets
      for(const p of planets){
        const grd=ctx.createRadialGradient(p.x-p.r*.3,p.y-p.r*.3,p.r*.1,p.x,p.y,p.r);
        grd.addColorStop(0,'#fff');grd.addColorStop(.4,p.color);grd.addColorStop(1,p.color+'44');
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();
      }

      // Star (glow)
      const sg=ctx.createRadialGradient(star.x,star.y,2,star.x,star.y,18);
      sg.addColorStop(0,'#fffde8');sg.addColorStop(.4,'#ffb830');sg.addColorStop(1,'transparent');
      ctx.beginPath();ctx.arc(star.x,star.y,18,0,Math.PI*2);ctx.fillStyle=sg;ctx.fill();
      ctx.beginPath();ctx.arc(star.x,star.y,6,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
    };
    tick();
    return()=>{cancelAnimationFrame(raf);canvas.removeEventListener('mousedown',onDown);window.removeEventListener('mousemove',onMove);window.removeEventListener('mouseup',onUp);};
    },[]);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div ref={containerRef} style={{flex:1,position:'relative'}}>
        <FullCanvas canvasRef={canvasRef} />
        <span style={{position:'absolute',top:6,right:8,fontSize:9,color:'rgba(255,255,255,0.25)'}}>drag planet</span>
      </div>
      <CtrlBar>
        <Knob label="Star mass" value={gMass} min={0.3} max={3} step={0.05} onChange={v=>{setGMass(v);gRef.current=v;}} accent={ACCENT} />
        <Btn label="Reset" onClick={()=>{const c=canvasRef.current;c?.dispatchEvent(new CustomEvent('reset'));}} accent={ACCENT} />
      </CtrlBar>
    </div>
  );
};
