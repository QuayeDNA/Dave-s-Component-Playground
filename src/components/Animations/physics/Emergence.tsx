import React, { useRef, useEffect, useState } from 'react';
import { useCanvasSize, FullCanvas, CtrlBar, Knob, Btn, Tag } from './shared';

const ACCENT = '#fb923c';

// ── 13 · BOIDS FLOCKING ──────────────────────────────────────────────────────
// 70 triangular agents — separation, alignment, cohesion steering + predator
export const Boids: React.FC = () => {
  const { containerRef, canvasRef, sizeRef } = useCanvasSize();
  const [sep,  setSep]  = useState(1.4);
  const [ali,  setAli]  = useState(1.0);
  const [coh,  setCoh]  = useState(0.9);
  const sepRef=useRef(1.4), aliRef=useRef(1.0), cohRef=useRef(0.9);
  useEffect(()=>{sepRef.current=sep;},[sep]);
  useEffect(()=>{aliRef.current=ali;},[ali]);
  useEffect(()=>{cohRef.current=coh;},[coh]);

  useEffect(() => {
    const canvas=canvasRef.current!;
    const N=70;
    interface Boid{x:number;y:number;vx:number;vy:number;isPred?:boolean}
    let boids:Boid[]=[];

    const init=()=>{
      const{w,h}=sizeRef.current;
      boids=Array.from({length:N+1},(_,i)=>{
        const spd=60+Math.random()*60;
        const a=Math.random()*Math.PI*2;
        return{x:Math.random()*w,y:Math.random()*h,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,isPred:i===N};
      });
    };

    const SEP_R=28,ALI_R=55,COH_R=70,PRED_R=90;
    const MAX_SPD=160,PRED_SPD=140;

    let last=performance.now(),raf:number;
    const tick=()=>{
      raf=requestAnimationFrame(tick);
      const now=performance.now(),dt=Math.min((now-last)/1000,0.025);last=now;
      const{w,h}=sizeRef.current;
      if(!boids.length) init();
      const sW=sepRef.current,aW=aliRef.current,cW=cohRef.current;

      const flocks=boids.filter(b=>!b.isPred);
      const pred=boids.find(b=>b.isPred)!;

      // Predator chases nearest flock boid
      let nearest=flocks[0],nd=Infinity;
      for(const b of flocks){const d=Math.sqrt((b.x-pred.x)**2+(b.y-pred.y)**2);if(d<nd){nd=d;nearest=b;}}
      const pn={x:nearest.x-pred.x,y:nearest.y-pred.y};
      const pnl=Math.sqrt(pn.x*pn.x+pn.y*pn.y)||1;
      pred.vx+=(pn.x/pnl)*300*dt; pred.vy+=(pn.y/pnl)*300*dt;
      const ps=Math.sqrt(pred.vx*pred.vx+pred.vy*pred.vy);
      if(ps>PRED_SPD){pred.vx=pred.vx/ps*PRED_SPD;pred.vy=pred.vy/ps*PRED_SPD;}
      pred.x+=pred.vx*dt; pred.y+=pred.vy*dt;
      pred.x=(pred.x+w)%w; pred.y=(pred.y+h)%h;

      // Flock steering
      for(const b of flocks){
        let sx=0,sy=0,axv=0,ayv=0,cxv=0,cyv=0;
        let sc=0,ac=0,cc=0;

        for(const nb of flocks){
          if(nb===b) continue;
          const dx=nb.x-b.x,dy=nb.y-b.y,d=Math.sqrt(dx*dx+dy*dy);
          if(d<SEP_R&&d>0){sx-=dx/d*(SEP_R-d);sy-=dy/d*(SEP_R-d);sc++;}
          if(d<ALI_R){axv+=nb.vx;ayv+=nb.vy;ac++;}
          if(d<COH_R){cxv+=nb.x;cyv+=nb.y;cc++;}
        }
        // Flee predator
        const pdx=pred.x-b.x,pdy=pred.y-b.y,pdist=Math.sqrt(pdx*pdx+pdy*pdy);
        if(pdist<PRED_R&&pdist>0){sx-=pdx/pdist*200;sy-=pdy/pdist*200;}

        if(sc>0){b.vx+=sx*sW*dt*60;b.vy+=sy*sW*dt*60;}
        if(ac>0){b.vx+=(axv/ac-b.vx)*aW*dt*2;b.vy+=(ayv/ac-b.vy)*aW*dt*2;}
        if(cc>0){b.vx+=(cxv/cc-b.x)*cW*dt*0.15;b.vy+=(cyv/cc-b.y)*cW*dt*0.15;}

        const spd=Math.sqrt(b.vx*b.vx+b.vy*b.vy);
        if(spd>MAX_SPD){b.vx=b.vx/spd*MAX_SPD;b.vy=b.vy/spd*MAX_SPD;}
        b.x+=b.vx*dt; b.y+=b.vy*dt;
        b.x=(b.x+w)%w; b.y=(b.y+h)%h;
      }

      const ctx=canvas.getContext('2d')!;
      ctx.fillStyle='#06080f';ctx.fillRect(0,0,w,h);

      const drawBoid=(b:Boid,color:string,sz:number)=>{
        const angle=Math.atan2(b.vy,b.vx);
        ctx.save();ctx.translate(b.x,b.y);ctx.rotate(angle);
        ctx.beginPath();ctx.moveTo(sz,0);ctx.lineTo(-sz*.65,sz*.45);ctx.lineTo(-sz*.65,-sz*.45);ctx.closePath();
        ctx.fillStyle=color;ctx.fill();ctx.restore();
      };
      for(const b of flocks) drawBoid(b,'rgba(251,146,60,0.7)',5.5);
      drawBoid(pred,'#f43f5e',9);
    };
    tick();
    return()=>cancelAnimationFrame(raf);
  },[]);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div ref={containerRef} style={{flex:1,position:'relative'}}>
        <FullCanvas canvasRef={canvasRef} />
        <span style={{position:'absolute',top:6,right:8,fontSize:9,color:'rgba(255,255,255,0.25)'}}>red = predator</span>
      </div>
      <CtrlBar>
        <Knob label="Separation" value={sep} min={0} max={4} step={0.05} onChange={v=>{setSep(v);sepRef.current=v;}} accent={ACCENT} />
        <Knob label="Alignment"  value={ali} min={0} max={4} step={0.05} onChange={v=>{setAli(v);aliRef.current=v;}} accent={ACCENT} />
        <Knob label="Cohesion"   value={coh} min={0} max={4} step={0.05} onChange={v=>{setCoh(v);cohRef.current=v;}} accent={ACCENT} />
      </CtrlBar>
    </div>
  );
};

// ── 14 · FALLING SAND ────────────────────────────────────────────────────────
// Cellular automaton: EMPTY/SAND/WATER/WALL; bottom-up update; imageData render
export const FallingSand: React.FC = () => {
  const { containerRef, canvasRef, sizeRef } = useCanvasSize();
  const [tool, setTool] = useState<'sand'|'water'|'wall'>('sand');
  const toolRef = useRef<'sand'|'water'|'wall'>('sand');
  useEffect(()=>{ toolRef.current=tool; },[tool]);

  useEffect(() => {
    const canvas=canvasRef.current!;
    const GW=120,GH=80;
    const EMPTY=0,SAND=1,WATER=2,WALL=3;
    const grid=new Uint8Array(GW*GH);
    const idx=(x:number,y:number)=>y*GW+x;

    let drawing=false;
    const paint=(mx:number,my:number)=>{
      const{w,h}=sizeRef.current;
      const gx=Math.floor(mx/w*GW),gy=Math.floor(my/h*GH);
      const mat=toolRef.current==='sand'?SAND:toolRef.current==='water'?WATER:WALL;
      for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){
        const x=gx+dx,y=gy+dy;
        if(x>0&&x<GW-1&&y>0&&y<GH-1) grid[idx(x,y)]=mat;
      }
    };
    const onDown=(e:MouseEvent)=>{drawing=true;const r=canvas.getBoundingClientRect();paint(e.clientX-r.left,e.clientY-r.top);};
    const onMove=(e:MouseEvent)=>{if(!drawing) return;const r=canvas.getBoundingClientRect();paint(e.clientX-r.left,e.clientY-r.top);};
    const onUp=()=>{drawing=false;};
    canvas.addEventListener('mousedown',onDown);
    canvas.addEventListener('mousemove',onMove);
    window.addEventListener('mouseup',onUp);

    let raf:number;
    const COLORS:Record<number,[number,number,number]>={
      [EMPTY]:[6,8,15],[SAND]:[194,160,90],[WATER]:[40,100,200],[WALL]:[100,100,110],
    };
    const tick=()=>{
      raf=requestAnimationFrame(tick);
      const{w,h}=sizeRef.current;
      // Sand/water simulation (bottom-up)
      for(let y=GH-2;y>=0;y--){
        // Alternate left/right pass per row to reduce bias
        const leftToRight=Math.random()>0.5;
        for(let xi=0;xi<GW;xi++){
          const x=leftToRight?xi:GW-1-xi;
          const c=grid[idx(x,y)];
          if(c===SAND){
            if(grid[idx(x,y+1)]===EMPTY){grid[idx(x,y+1)]=SAND;grid[idx(x,y)]=EMPTY;}
            else if(x>0&&grid[idx(x-1,y+1)]===EMPTY){grid[idx(x-1,y+1)]=SAND;grid[idx(x,y)]=EMPTY;}
            else if(x<GW-1&&grid[idx(x+1,y+1)]===EMPTY){grid[idx(x+1,y+1)]=SAND;grid[idx(x,y)]=EMPTY;}
          } else if(c===WATER){
            if(grid[idx(x,y+1)]===EMPTY){grid[idx(x,y+1)]=WATER;grid[idx(x,y)]=EMPTY;}
            else{
              const d=Math.random()>0.5?1:-1;
              if(x+d>=0&&x+d<GW&&grid[idx(x+d,y)]===EMPTY){grid[idx(x+d,y)]=WATER;grid[idx(x,y)]=EMPTY;}
              else if(x-d>=0&&x-d<GW&&grid[idx(x-d,y)]===EMPTY){grid[idx(x-d,y)]=WATER;grid[idx(x,y)]=EMPTY;}
            }
          }
        }
      }

      const ctx=canvas.getContext('2d')!;
      const img=ctx.createImageData(w,h);
      const sx=w/GW,sy=h/GH;
      for(let gy=0;gy<GH;gy++) for(let gx=0;gx<GW;gx++){
        const[r,g,b]=COLORS[grid[idx(gx,gy)]];
        for(let py=0;py<sy;py++) for(let px=0;px<sx;px++){
          const px2=Math.floor(gx*sx)+px,py2=Math.floor(gy*sy)+py;
          if(px2>=w||py2>=h) continue;
          const i=(py2*w+px2)*4;
          img.data[i]=r;img.data[i+1]=g;img.data[i+2]=b;img.data[i+3]=255;
        }
      }
      ctx.putImageData(img,0,0);
    };
    tick();
    return()=>{cancelAnimationFrame(raf);canvas.removeEventListener('mousedown',onDown);canvas.removeEventListener('mousemove',onMove);window.removeEventListener('mouseup',onUp);};
  },[]);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div ref={containerRef} style={{flex:1}}>
        <FullCanvas canvasRef={canvasRef} />
      </div>
      <CtrlBar>
        <Tag label="Sand"  active={tool==='sand'}  onClick={()=>setTool('sand')}  accent="#c2a05a" />
        <Tag label="Water" active={tool==='water'} onClick={()=>setTool('water')} accent="#3388cc" />
        <Tag label="Wall"  active={tool==='wall'}  onClick={()=>setTool('wall')}  accent="#888899" />
        <Btn label="Clear" onClick={()=>{ const c=canvasRef.current; c?.dispatchEvent(new CustomEvent('clear')); }} accent={ACCENT} />
      </CtrlBar>
    </div>
  );
};

// Wire clear button:
export const FallingSandWired: React.FC = () => {
  const { containerRef, canvasRef, sizeRef } = useCanvasSize();
  const [tool, setTool] = useState<'sand'|'water'|'wall'>('sand');
  const toolRef = useRef<'sand'|'water'|'wall'>('sand');
  const gridRef = useRef<Uint8Array|null>(null);
  useEffect(()=>{ toolRef.current=tool; },[tool]);

  useEffect(() => {
    const canvas=canvasRef.current!;
    const GW=120,GH=80;
    const EMPTY=0,SAND=1,WATER=2,WALL=3;
    if(!gridRef.current) gridRef.current=new Uint8Array(GW*GH);
    const grid=gridRef.current;
    const idx=(x:number,y:number)=>y*GW+x;

    const onClear=()=>grid.fill(0);
    canvas.addEventListener('clear' as never,onClear as never);

    let drawing=false;
    const paint=(mx:number,my:number)=>{
      const{w,h}=sizeRef.current;
      const gx=Math.floor(mx/w*GW),gy=Math.floor(my/h*GH);
      const mat=toolRef.current==='sand'?SAND:toolRef.current==='water'?WATER:WALL;
      for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){
        const x2=gx+dx,y2=gy+dy;
        if(x2>0&&x2<GW-1&&y2>0&&y2<GH-1) grid[idx(x2,y2)]=mat;
      }
    };
    const onDown=(e:MouseEvent)=>{drawing=true;const r=canvas.getBoundingClientRect();paint(e.clientX-r.left,e.clientY-r.top);};
    const onMove=(e:MouseEvent)=>{if(!drawing)return;const r=canvas.getBoundingClientRect();paint(e.clientX-r.left,e.clientY-r.top);};
    const onUp=()=>{drawing=false;};
    canvas.addEventListener('mousedown',onDown);canvas.addEventListener('mousemove',onMove);window.addEventListener('mouseup',onUp);

    const COLORS:{[k:number]:[number,number,number]}={0:[6,8,15],1:[194,160,90],2:[40,100,200],3:[100,100,110]};
    let raf:number;
    const tick=()=>{
      raf=requestAnimationFrame(tick);
      const{w,h}=sizeRef.current;
      for(let y=GH-2;y>=0;y--){
        const lr=Math.random()>0.5;
        for(let xi=0;xi<GW;xi++){
          const x=lr?xi:GW-1-xi;const c=grid[idx(x,y)];
          if(c===SAND){if(grid[idx(x,y+1)]===EMPTY){grid[idx(x,y+1)]=SAND;grid[idx(x,y)]=EMPTY;}
          else if(x>0&&grid[idx(x-1,y+1)]===EMPTY){grid[idx(x-1,y+1)]=SAND;grid[idx(x,y)]=EMPTY;}
          else if(x<GW-1&&grid[idx(x+1,y+1)]===EMPTY){grid[idx(x+1,y+1)]=SAND;grid[idx(x,y)]=EMPTY;}}
          else if(c===WATER){if(grid[idx(x,y+1)]===EMPTY){grid[idx(x,y+1)]=WATER;grid[idx(x,y)]=EMPTY;}
          else{const d=Math.random()>0.5?1:-1;
          if(x+d>=0&&x+d<GW&&grid[idx(x+d,y)]===EMPTY){grid[idx(x+d,y)]=WATER;grid[idx(x,y)]=EMPTY;}
          else if(x-d>=0&&x-d<GW&&grid[idx(x-d,y)]===EMPTY){grid[idx(x-d,y)]=WATER;grid[idx(x,y)]=EMPTY;}}}
        }
      }
      const ctx=canvas.getContext('2d')!;
      const img=ctx.createImageData(w,h);
      const sx=w/GW,sy=h/GH;
      for(let gy2=0;gy2<GH;gy2++) for(let gx2=0;gx2<GW;gx2++){
        const[r,g,b]=COLORS[grid[idx(gx2,gy2)]];
        for(let py=0;py<sy;py++) for(let px=0;px<sx;px++){
          const px2=Math.floor(gx2*sx)+px,py2=Math.floor(gy2*sy)+py;
          if(px2>=w||py2>=h) continue;
          const i=(py2*w+px2)*4;img.data[i]=r;img.data[i+1]=g;img.data[i+2]=b;img.data[i+3]=255;
        }
      }
      ctx.putImageData(img,0,0);
    };
    tick();
    return()=>{cancelAnimationFrame(raf);canvas.removeEventListener('clear' as never,onClear as never);canvas.removeEventListener('mousedown',onDown);canvas.removeEventListener('mousemove',onMove);window.removeEventListener('mouseup',onUp);};
  },[]);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div ref={containerRef} style={{flex:1}}><FullCanvas canvasRef={canvasRef} /></div>
      <CtrlBar>
        <Tag label="Sand"  active={tool==='sand'}  onClick={()=>setTool('sand')}  accent="#c2a05a" />
        <Tag label="Water" active={tool==='water'} onClick={()=>setTool('water')} accent="#3388cc" />
        <Tag label="Wall"  active={tool==='wall'}  onClick={()=>setTool('wall')}  accent="#888899" />
        <Btn label="Clear" onClick={()=>canvasRef.current?.dispatchEvent(new CustomEvent('clear'))} accent={ACCENT} />
      </CtrlBar>
    </div>
  );
};

// ── 15 · REACTION DIFFUSION (Gray-Scott) ─────────────────────────────────────
// du/dt = Du·∇²u - u·v² + f·(1-u)   dv/dt = Dv·∇²v + u·v² - (f+k)·v
export const ReactionDiffusion: React.FC = () => {
  const { containerRef, canvasRef, sizeRef } = useCanvasSize();
  const [preset, setPreset] = useState<'coral'|'fingers'|'solitons'>('coral');
  const presetRef = useRef<'coral'|'fingers'|'solitons'>('coral');
  useEffect(()=>{ presetRef.current=preset; },[preset]);

  useEffect(() => {
    const canvas=canvasRef.current!;
    const GW=100,GH=75;
    const Du=0.16,Dv=0.08;
    const PRESETS={coral:{f:0.055,k:0.062},fingers:{f:0.035,k:0.065},solitons:{f:0.012,k:0.050}};
    let U=new Float32Array(GW*GH).fill(1);
    let V=new Float32Array(GW*GH);
    let Un=new Float32Array(GW*GH);
    let Vn=new Float32Array(GW*GH);

    // Seed center
    const seed=(cx:number,cy:number)=>{
      for(let dy=-4;dy<=4;dy++) for(let dx=-4;dx<=4;dx++){
        const x=Math.floor(cx)+dx,y=Math.floor(cy)+dy;
        if(x>0&&x<GW-1&&y>0&&y<GH-1){U[y*GW+x]=0.5;V[y*GW+x]=0.25;}
      }
    };
    seed(GW/2,GH/2);

    const onDown=(e:MouseEvent)=>{
      const r=canvas.getBoundingClientRect();const{w,h}=sizeRef.current;
      seed((e.clientX-r.left)/w*GW,(e.clientY-r.top)/h*GH);
    };
    canvas.addEventListener('mousedown',onDown);

    // Palette: map v to vivid color
    let raf:number;
    const tick=()=>{
      raf=requestAnimationFrame(tick);
      const{w,h}=sizeRef.current;
      const p=PRESETS[presetRef.current];
      const{f,k}=p;

      for(let steps=0;steps<8;steps++){
        for(let y=1;y<GH-1;y++) for(let x=1;x<GW-1;x++){
          const i=y*GW+x;
          const lapU=U[(y-1)*GW+x]+U[(y+1)*GW+x]+U[y*GW+(x-1)]+U[y*GW+(x+1)]-4*U[i];
          const lapV=V[(y-1)*GW+x]+V[(y+1)*GW+x]+V[y*GW+(x-1)]+V[y*GW+(x+1)]-4*V[i];
          const uvv=U[i]*V[i]*V[i];
          Un[i]=U[i]+Du*lapU-uvv+f*(1-U[i]);
          Vn[i]=V[i]+Dv*lapV+uvv-(f+k)*V[i];
          Un[i]=Math.max(0,Math.min(1,Un[i]));
          Vn[i]=Math.max(0,Math.min(1,Vn[i]));
        }
        const tmp1=U;U=Un;Un=tmp1;
        const tmp2=V;V=Vn;Vn=tmp2;
      }

      const ctx=canvas.getContext('2d')!;
      const img=ctx.createImageData(w,h);
      const sx=w/GW,sy=h/GH;
      for(let gy=0;gy<GH;gy++) for(let gx=0;gx<GW;gx++){
        const v=V[gy*GW+gx];
        // Map v [0,1] → a vivid gradient
        const r=Math.floor(Math.min(255,v*3*255));
        const g3=Math.floor(Math.min(255,Math.max(0,(v-0.15)*2.5*255)));
        const b=Math.floor(Math.min(255,Math.max(0,(v-0.4)*3*255)));
        for(let py=0;py<sy;py++) for(let px=0;px<sx;px++){
          const px2=Math.floor(gx*sx)+px,py2=Math.floor(gy*sy)+py;
          if(px2>=w||py2>=h) continue;
          const i=(py2*w+px2)*4;img.data[i]=r;img.data[i+1]=g3;img.data[i+2]=b;img.data[i+3]=255;
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
        <span style={{position:'absolute',top:6,right:8,fontSize:9,color:'rgba(255,255,255,0.25)'}}>click to seed</span>
      </div>
      <CtrlBar>
        <Tag label="Coral"    active={preset==='coral'}   onClick={()=>setPreset('coral')}   accent="#fb923c" />
        <Tag label="Fingers"  active={preset==='fingers'} onClick={()=>setPreset('fingers')} accent="#fb923c" />
        <Tag label="Solitons" active={preset==='solitons'}onClick={()=>setPreset('solitons')}accent="#fb923c" />
      </CtrlBar>
    </div>
  );
};

// ── 16 · LANGTON'S ANT ──────────────────────────────────────────────────────
// 4-color Langton's ant; 4 ants; speed slider; imageData render
export const LangtonsAnt: React.FC = () => {
  const { containerRef, canvasRef, sizeRef } = useCanvasSize();
  const [speed, setSpeed] = useState(30);
  const speedRef = useRef(30);
  useEffect(()=>{ speedRef.current=speed; },[speed]);

  useEffect(() => {
    const canvas=canvasRef.current!;
    const GW=140,GH=90;
    const STATES=4;
    // Rules: 'R'=turn right, 'L'=turn left, 'U'=reverse
    const RULES=['RL','LRRL','RRLL','LLRR'];
    const grid=new Uint8Array(GW*GH);
    const gidx=(x:number,y:number)=>((y+GH)%GH)*GW+((x+GW)%GW);

    interface Ant{x:number;y:number;dir:number;rules:string;color:[number,number,number]}
    const DIRS=[[1,0],[0,1],[-1,0],[0,-1]]; // R D L U
    const ants:Ant[]=[
      {x:Math.floor(GW*.3),y:Math.floor(GH*.4),dir:0,rules:RULES[0],color:[251,146,60]},
      {x:Math.floor(GW*.7),y:Math.floor(GH*.6),dir:2,rules:RULES[1],color:[52,211,153]},
      {x:Math.floor(GW*.5),y:Math.floor(GH*.3),dir:1,rules:RULES[2],color:[167,139,250]},
      {x:Math.floor(GW*.5),y:Math.floor(GH*.7),dir:3,rules:RULES[3],color:[96,165,250]},
    ];

    // State colors (dark rainbow)
    const STATE_COLORS:Array<[number,number,number]>=[[6,8,15],[30,55,90],[90,30,60],[50,80,30]];

    const stepAnt=(ant:Ant)=>{
      const state=grid[gidx(ant.x,ant.y)]%ant.rules.length;
      const rule=ant.rules[state];
      // Turn
      if(rule==='R') ant.dir=(ant.dir+1)%4;
      else if(rule==='L') ant.dir=(ant.dir+3)%4;
      else if(rule==='U') ant.dir=(ant.dir+2)%4;
      // Flip cell
      grid[gidx(ant.x,ant.y)]=(grid[gidx(ant.x,ant.y)]+1)%STATES;
      // Move
      ant.x=(ant.x+DIRS[ant.dir][0]+GW)%GW;
      ant.y=(ant.y+DIRS[ant.dir][1]+GH)%GH;
    };

    let raf:number;
    const tick=()=>{
      raf=requestAnimationFrame(tick);
      const steps=speedRef.current;
      for(let s=0;s<steps;s++) for(const ant of ants) stepAnt(ant);
      const{w,h}=sizeRef.current;
      const ctx=canvas.getContext('2d')!;
      const img=ctx.createImageData(w,h);
      const sx=w/GW,sy=h/GH;
      for(let gy=0;gy<GH;gy++) for(let gx=0;gx<GW;gx++){
        const[r,g,b]=STATE_COLORS[grid[gidx(gx,gy)]];
        for(let py=0;py<sy;py++) for(let px=0;px<sx;px++){
          const px2=Math.floor(gx*sx)+px,py2=Math.floor(gy*sy)+py;
          if(px2>=w||py2>=h) continue;
          const i=(py2*w+px2)*4;img.data[i]=r;img.data[i+1]=g;img.data[i+2]=b;img.data[i+3]=255;
        }
      }
      ctx.putImageData(img,0,0);
      // Draw ants
      for(const ant of ants){
        const px2=Math.floor(ant.x*sx),py2=Math.floor(ant.y*sy);
        ctx.beginPath();ctx.arc(px2+sx/2,py2+sy/2,Math.max(sx,sy)*0.9,0,Math.PI*2);
        const[r,g,b]=ant.color;ctx.fillStyle=`rgb(${r},${g},${b})`;ctx.fill();
      }
    };
    tick();
    return()=>cancelAnimationFrame(raf);
  },[]);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div ref={containerRef} style={{flex:1}}>
        <FullCanvas canvasRef={canvasRef} />
      </div>
      <CtrlBar>
        <Knob label="Steps/frame" value={speed} min={5} max={200} step={5} onChange={v=>{setSpeed(v);speedRef.current=v;}} accent={ACCENT} />
      </CtrlBar>
    </div>
  );
};
