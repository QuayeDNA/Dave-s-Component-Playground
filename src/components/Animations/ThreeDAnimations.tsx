import React, { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls, PerspectiveCamera, Stars, Trail,
  MeshDistortMaterial, MeshWobbleMaterial, Float,
  Text, Environment, ContactShadows, Torus,
} from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Settings2 } from 'lucide-react';

// ── Lazy-mount: Canvas only renders when card is in view ─────────────────────
const LazyCanvas: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = '#04060c' }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: '200px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%', background: bg }}>
      {visible ? children : null}
    </div>
  );
};

// ── Design-system wrappers ────────────────────────────────────────────────────
interface CardProps {
  title: string;
  description: string;
  useCase: string;
  children: React.ReactNode;
  bg?: string; // canvas background colour
}
const ShowcaseCard: React.FC<CardProps> = ({ title, description, useCase, children, bg }) => (
  <div
    className="rounded-xl flex flex-col"
    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
  >
    <div className="px-5 pt-5 pb-1">
      <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.88)' }}>{title}</h3>
      <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.36)' }}>{description}</p>
    </div>
    <div className="mx-5 my-3 rounded-lg overflow-hidden" style={{ height: 220 }}>
      <LazyCanvas bg={bg}>{children}</LazyCanvas>
    </div>
    <div className="px-5 pb-4 flex items-center gap-1.5">
      <span className="text-[9px] tracking-[0.2em] uppercase font-semibold" style={{ color: 'rgba(255,255,255,0.16)' }}>use case</span>
      <span className="text-[11px]" style={{ color: '#7eb8e8', opacity: 0.75 }}>— {useCase}</span>
    </div>
  </div>
);

interface SectionHeaderProps { number: string; title: string; subtitle: string; accent: string; }
const SectionHeader: React.FC<SectionHeaderProps> = ({ number, title, subtitle, accent }) => (
  <div className="flex items-start gap-4 mb-7">
    <span className="text-[11px] font-black tabular-nums mt-1 shrink-0"
      style={{ color: accent, fontFamily: 'monospace', opacity: 0.55 }}>{number}</span>
    <div>
      <h2 className="text-xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{title}</h2>
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.32)' }}>{subtitle}</p>
    </div>
  </div>
);

// ── Scene: bare Canvas with standard lighting ────────────────────────────────
const Scene: React.FC<{ children: React.ReactNode; camera?: [number, number, number]; lightBg?: boolean }> = ({
  children, camera = [0, 0, 5], lightBg,
}) => (
  <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: !lightBg }}
    style={{ background: lightBg ? '#f0f4f8' : 'transparent' }}>
    <PerspectiveCamera makeDefault position={camera} fov={50} />
    {lightBg ? (
      <>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow />
        <directionalLight position={[-4, -2, -4]} intensity={0.4} color="#c8d8f0" />
      </>
    ) : (
      <>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-8, -8, -8]} intensity={0.5} color="#7eb8e8" />
      </>
    )}
    <Suspense fallback={null}>{children}</Suspense>
  </Canvas>
);

// ═══════════════════════════════════════════════════════
// SECTION 1 — GEOMETRY & MATERIALS
// ═══════════════════════════════════════════════════════

// 1 · Spinning geometry selector
type GeoName = 'Box' | 'Sphere' | 'Torus' | 'Octahedron' | 'Cone';
const GEO_OPTIONS: GeoName[] = ['Box', 'Sphere', 'Torus', 'Octahedron', 'Cone'];

// Separate component so swapping geo key causes clean remount of geometry
function GeoMesh({ geo }: { geo: GeoName }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    ref.current.rotation.x += 0.4 * dt;
    ref.current.rotation.y += 0.65 * dt;
  });
  return (
    <mesh ref={ref}>
      {geo === 'Box'        && <boxGeometry args={[1.5, 1.5, 1.5]} />}
      {geo === 'Sphere'     && <sphereGeometry args={[1, 32, 32]} />}
      {geo === 'Torus'      && <torusGeometry args={[0.9, 0.36, 24, 64]} />}
      {geo === 'Octahedron' && <octahedronGeometry args={[1.2]} />}
      {geo === 'Cone'       && <coneGeometry args={[1, 1.8, 32]} />}
      <meshStandardMaterial color="#2563eb" metalness={0.4} roughness={0.3} />
    </mesh>
  );
}
const GeometryShowcase: React.FC = () => {
  const [geo, setGeo] = useState<GeoName>('Box');
  return (
    <div className="flex flex-col h-full">
      <div style={{ flex: 1 }}>
        <Scene camera={[0, 0, 4]} lightBg>
          {/* key forces full geometry remount — no flash */}
          <GeoMesh key={geo} geo={geo} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Scene>
      </div>
      <div className="flex flex-wrap gap-1 justify-center pb-3 px-2">
        {GEO_OPTIONS.map(g => (
          <button key={g} type="button" onClick={() => setGeo(g)}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: geo === g ? 'rgba(37,99,235,0.15)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${geo === g ? 'rgba(37,99,235,0.5)' : 'rgba(0,0,0,0.12)'}`,
              color: geo === g ? '#2563eb' : 'rgba(0,0,0,0.45)', cursor: 'pointer',
            }}>{g}</button>
        ))}
      </div>
    </div>
  );
};

// 2 · Material explorer — top-right dropdown for sliders, light bg
type MatMode = 'Standard' | 'Wireframe' | 'Distort' | 'Wobble' | 'Phong' | 'Normal';
const MAT_MODES: MatMode[] = ['Standard', 'Wireframe', 'Distort', 'Wobble', 'Phong', 'Normal'];

function MatMesh({ mode, metalness, roughness }: { mode: MatMode; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { ref.current.rotation.y += 0.5 * dt; ref.current.rotation.x += 0.2 * dt; });
  const col = '#2563eb';
  return (
    <mesh ref={ref} key={mode}>
      <sphereGeometry args={[1.1, 64, 64]} />
      {mode === 'Standard'  && <meshStandardMaterial color={col} metalness={metalness} roughness={roughness} />}
      {mode === 'Wireframe' && <meshStandardMaterial color={col} wireframe />}
      {mode === 'Distort'   && <MeshDistortMaterial  color={col} distort={0.45} speed={2} metalness={metalness} roughness={roughness} />}
      {mode === 'Wobble'    && <MeshWobbleMaterial   color={col} factor={0.6} speed={2} metalness={metalness} roughness={roughness} />}
      {mode === 'Phong'     && <meshPhongMaterial    color={col} shininess={120} specular={new THREE.Color('#6090d0')} />}
      {mode === 'Normal'    && <meshNormalMaterial />}
    </mesh>
  );
}
const MaterialExplorer: React.FC = () => {
  const [mode, setMode] = useState<MatMode>('Standard');
  const [metalness, setMetalness] = useState(0.3);
  const [roughness, setRoughness] = useState(0.3);
  const [open, setOpen] = useState(false);
  const showSliders = mode !== 'Wireframe' && mode !== 'Normal' && mode !== 'Phong';
  return (
    <div className="relative flex flex-col h-full">
      {/* Top-right settings dropdown */}
      <div className="absolute top-2 right-2 z-10">
        <button type="button" onClick={() => setOpen(o => !o)}
          className="rounded-lg p-1.5 flex items-center gap-1"
          style={{
            background: open ? 'rgba(37,99,235,0.18)' : 'rgba(255,255,255,0.55)',
            border: `1px solid ${open ? 'rgba(37,99,235,0.4)' : 'rgba(0,0,0,0.1)'}`,
            backdropFilter: 'blur(6px)', cursor: 'pointer',
          }}>
          <Settings2 size={13} color={open ? '#2563eb' : '#334155'} />
        </button>
        {open && (
          <div className="absolute top-9 right-0 rounded-xl p-3 w-52 space-y-3"
            style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(0,0,0,0.1)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
            <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: '#94a3b8' }}>Material</p>
            <div className="flex flex-wrap gap-1">
              {MAT_MODES.map(m => (
                <button key={m} type="button" onClick={() => setMode(m)}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: mode === m ? '#2563eb' : 'rgba(0,0,0,0.06)',
                    color: mode === m ? '#fff' : '#475569', cursor: 'pointer',
                    border: 'none',
                  }}>{m}</button>
              ))}
            </div>
            {showSliders && (
              <>
                <label className="flex flex-col gap-1">
                  <span className="text-[9px] font-semibold" style={{ color: '#64748b' }}>Metalness {metalness.toFixed(2)}</span>
                  <input type="range" min={0} max={1} step={0.05} value={metalness}
                    onChange={e => setMetalness(+e.target.value)}
                    style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[9px] font-semibold" style={{ color: '#64748b' }}>Roughness {roughness.toFixed(2)}</span>
                  <input type="range" min={0} max={1} step={0.05} value={roughness}
                    onChange={e => setRoughness(+e.target.value)}
                    style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }} />
                </label>
              </>
            )}
          </div>
        )}
      </div>
      {/* Canvas fills remaining height */}
      <div style={{ flex: 1 }}>
        <Scene camera={[0, 0, 3.5]} lightBg>
          <MatMesh mode={mode} metalness={metalness} roughness={roughness} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Scene>
      </div>
    </div>
  );
};

// 3 · Floating text in 3D space
function Scene3DText() {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
  });
  return (
    <group ref={groupRef}>
      <Text fontSize={0.55} color="#1e3a5f" anchorX="center" anchorY="middle"
        font={undefined} maxWidth={4} textAlign="center"
        outlineWidth={0.012} outlineColor="#b8d0e8"
      >{'THREE\nDIMENSIONS'}</Text>
    </group>
  );
}
const FloatingText3D: React.FC = () => (
  <Scene camera={[0, 0, 4]} lightBg>
    <Scene3DText />
  </Scene>
);

// 4 · Instanced sphere cluster
function InstancedCluster({ count }: { count: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const positions = useMemo(() =>
    Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
    ] as [number, number, number]), [count]);

  useFrame((state) => {
    positions.forEach(([x, y, z], i) => {
      const t = state.clock.elapsedTime + i;
      dummy.position.set(
        x + Math.sin(t * 0.4) * 0.3,
        y + Math.cos(t * 0.3) * 0.3,
        z,
      );
      dummy.scale.setScalar(0.18 + Math.abs(Math.sin(t * 0.5)) * 0.12);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#4d8fc8" metalness={0.5} roughness={0.2}
        emissive="#1a3a5c" emissiveIntensity={0.3} />
    </instancedMesh>
  );
}
const InstancedSpheres: React.FC = () => {
  const [count, setCount] = useState(80);
  return (
    <div className="flex flex-col h-full">
      <div style={{ flex: 1 }}>
        <Scene camera={[0, 0, 6]} lightBg>
          <InstancedCluster count={count} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
        </Scene>
      </div>
      <div className="pb-3 px-3 flex flex-col items-center gap-1">
        <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Instances: {count}</span>
        <input type="range" min={20} max={300} step={10} value={count}
          onChange={e => setCount(+e.target.value)}
          style={{ width: 160, accentColor: '#4d8fc8', height: 3, cursor: 'pointer' }} />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// SECTION 2 — PHYSICS & INTERACTION
// ═══════════════════════════════════════════════════════

// 5 · Mouse-tracked tilt cube
function TiltCube() {
  const ref = useRef<THREE.Mesh>(null!);
  const { size } = useThree();
  return (
    <mesh
      ref={ref}
      onPointerMove={e => {
        const x = (e.clientX / size.width  - 0.5) * 2;
        const y = (e.clientY / size.height - 0.5) * 2;
        ref.current.rotation.y = x * 1.2;
        ref.current.rotation.x = -y * 1.2;
      }}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#2563eb" metalness={0.6} roughness={0.25} />
    </mesh>
  );
}
const MouseTiltCube: React.FC = () => (
  <Scene camera={[0, 0, 4.5]} lightBg>
    <TiltCube />
    <OrbitControls enableZoom={false} enablePan={false} />
  </Scene>
);

// 6 · Click-to-explode sphere cluster
function ExplodeSpheres({ exploded }: { exploded: boolean }) {
  const BALLS = 14;
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const dirs = useMemo(() =>
    Array.from({ length: BALLS }, () => new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
    ).normalize()), []);
  const t = useRef(0);

  useFrame((_, dt) => {
    t.current = Math.min(t.current + dt * (exploded ? 2 : -3), 1.8);
    if (t.current < 0) t.current = 0;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const dist = Math.max(0, t.current) * 2.2;
      m.position.copy(dirs[i]).multiplyScalar(dist);
      m.rotation.x += dt * 1.2;
      m.rotation.y += dt * 0.8;
    });
  });

  const colors = ['#4d8fc8','#a78bfa','#34d399','#fb923c','#f472b6','#60a5fa','#fbbf24'];
  return (
    <>
      {Array.from({ length: BALLS }).map((_, i) => (
        <mesh key={i} ref={el => { refs.current[i] = el; }}>
          <sphereGeometry args={[0.22 + (i % 3) * 0.08, 16, 16]} />
          <meshStandardMaterial color={colors[i % colors.length]} metalness={0.3} roughness={0.4} />
        </mesh>
      ))}
    </>
  );
}
const ExplodeScene: React.FC = () => {
  const [exploded, setExploded] = useState(false);
  return (
    <div className="relative h-full">
      <Scene camera={[0, 0, 6]} lightBg>
        <ExplodeSpheres exploded={exploded} />
      </Scene>
      <div className="absolute inset-x-0 bottom-3 flex justify-center">
        <button type="button" onClick={() => setExploded(e => !e)}
          className="text-[11px] font-semibold px-4 py-1.5 rounded-full"
          style={{
            background: exploded ? 'rgba(251,146,60,0.15)' : 'rgba(37,99,235,0.12)',
            border: `1px solid ${exploded ? 'rgba(251,146,60,0.4)' : 'rgba(37,99,235,0.35)'}`,
            color: exploded ? '#ea580c' : '#2563eb', cursor: 'pointer',
          }}
        >{exploded ? '⟵ Implode' : '💥 Explode'}</button>
      </div>
    </div>
  );
};

// 7 · Orbit controls playground — free drag
function OrbitScene() {
  return (
    <>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <Torus args={[1, 0.38, 24, 64]}>
          <meshStandardMaterial color="#7c3aed" metalness={0.5} roughness={0.2} />
        </Torus>
      </Float>
      <ContactShadows opacity={0.3} scale={6} blur={2} far={4} position={[0, -1.8, 0]} />
    </>
  );
}
const OrbitPlayground: React.FC = () => (
  <Scene camera={[0, 1.5, 5]} lightBg>
    <Environment preset="city" />
    <OrbitScene />
    <OrbitControls enableZoom={false} enablePan={false} />
  </Scene>
);

// 8 · Particle attractor — distance-sorted staggered gravity well
function Particles({ attracting }: { attracting: boolean }) {
  const COUNT = 220;
  const geo = useRef<THREE.BufferGeometry>(null!);

  // stable initial positions
  const initPos = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 1.8 + Math.random() * 2;
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  // current positions (mutated each frame)
  const pos = useRef(new Float32Array(initPos));
  const vels = useRef(new Float32Array(COUNT * 3).fill(0));

  // distance from origin for each particle (used for stagger sorting)
  const distOrder = useMemo(() => {
    const arr = Array.from({ length: COUNT }, (_, i) => {
      const x = initPos[i*3], y = initPos[i*3+1], z = initPos[i*3+2];
      return { i, r: Math.sqrt(x*x + y*y + z*z) };
    });
    arr.sort((a, b) => a.r - b.r); // closest first for attract, far first for release
    return arr;
  }, [initPos]);

  const phase = useRef(0); // 0 = orbiting, 1 = attracting, -1 = releasing

  useEffect(() => {
    phase.current = attracting ? 1 : -1;
  }, [attracting]);

  useFrame((state, dt) => {
    if (!geo.current) return;
    const buf = geo.current.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;

    for (let ii = 0; ii < COUNT; ii++) {
      const { i, r: initDist } = distOrder[ii];
      const ix = i * 3, iy = ix + 1, iz = ix + 2;
      const px = pos.current[ix], py = pos.current[iy], pz = pos.current[iz];
      const dist = Math.sqrt(px*px + py*py + pz*pz) || 0.001;

      if (phase.current === 1) {
        // Closest particles get pulled first — stagger by initDist / 6
        const delay = initDist / 6;
        const elapsed = t - (phase as any)._startTime;
        if ((phase as any)._startTime === undefined || elapsed > delay) {
          // Gravity: acceleration toward origin, stronger when farther
          const strength = 0.9 * dt * 60;
          vels.current[ix] += (-px / dist) * strength * Math.min(dist * 0.4, 1.8);
          vels.current[iy] += (-py / dist) * strength * Math.min(dist * 0.4, 1.8);
          vels.current[iz] += (-pz / dist) * strength * Math.min(dist * 0.4, 1.8);
        }
        // Dampen hard near origin to prevent bouncing
        const dampFactor = dist < 0.5 ? 0.72 : 0.90;
        vels.current[ix] *= dampFactor;
        vels.current[iy] *= dampFactor;
        vels.current[iz] *= dampFactor;
      } else {
        // Orbiting / release — gentle tangential swirl + drift back toward shell
        const targetR = initDist;
        const radialErr = dist - targetR;
        vels.current[ix] += (-px / dist) * radialErr * 0.015 * dt * 60;
        vels.current[iy] += (-py / dist) * radialErr * 0.015 * dt * 60;
        vels.current[iz] += (-pz / dist) * radialErr * 0.015 * dt * 60;
        // Tangential swirl in XZ plane
        vels.current[ix] +=  pz / dist * 0.018 * dt * 60;
        vels.current[iz] += -px / dist * 0.018 * dt * 60;
        vels.current[ix] *= 0.96;
        vels.current[iy] *= 0.96;
        vels.current[iz] *= 0.96;
      }

      pos.current[ix] += vels.current[ix];
      pos.current[iy] += vels.current[iy];
      pos.current[iz] += vels.current[iz];
      buf[ix] = pos.current[ix];
      buf[iy] = pos.current[iy];
      buf[iz] = pos.current[iz];
    }
    geo.current.attributes.position.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(initPos), 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#7eb8e8" sizeAttenuation transparent opacity={0.85} />
    </points>
  );
}
const ParticleAttractor: React.FC = () => {
  const [attracting, setAttracting] = useState(false);
  return (
    <div className="relative h-full">
      <Scene camera={[0, 0, 8]}>
        <Stars radius={30} depth={10} count={400} factor={2} fade />
        <Particles attracting={attracting} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
      </Scene>
      <div className="absolute inset-x-0 bottom-3 flex justify-center">
        <button type="button" onClick={() => setAttracting(a => !a)}
          className="text-[11px] font-semibold px-4 py-1.5 rounded-full"
          style={{
            background: attracting ? 'rgba(52,211,153,0.15)' : 'rgba(77,143,200,0.15)',
            border: `1px solid ${attracting ? 'rgba(52,211,153,0.4)' : 'rgba(77,143,200,0.4)'}`,
            color: attracting ? '#34d399' : '#7eb8e8', cursor: 'pointer',
          }}
        >{attracting ? '✦ Attract' : '⟳ Orbit'}</button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// SECTION 3 — SHADER & VISUAL EFFECTS
// ═══════════════════════════════════════════════════════

// 9 · Dynamic distortion blob
function DistortBlob({ speed, distort }: { speed: number; distort: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { ref.current.rotation.y += 0.3 * dt; });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.3, 64, 64]} />
      <MeshDistortMaterial
        color="#a78bfa" distort={distort} speed={speed}
        metalness={0.2} roughness={0.1}
        emissive="#4a1d96" emissiveIntensity={0.15}
      />
    </mesh>
  );
}
const DistortBlobScene: React.FC = () => {
  const [speed, setSpeed] = useState(2);
  const [distort, setDistort] = useState(0.4);
  return (
    <div className="flex flex-col h-full">
      <div style={{ flex: 1 }}>
        <Scene camera={[0, 0, 4]}>
          <DistortBlob speed={speed} distort={distort} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Scene>
      </div>
      <div className="pb-3 px-3 flex gap-3 justify-center">
        <label className="flex flex-col items-center gap-1">
          <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Speed {speed.toFixed(1)}</span>
          <input type="range" min={0} max={8} step={0.2} value={speed}
            onChange={e => setSpeed(+e.target.value)} style={{ width: 80, accentColor: '#a78bfa', height: 3, cursor: 'pointer' }} />
        </label>
        <label className="flex flex-col items-center gap-1">
          <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Distort {distort.toFixed(2)}</span>
          <input type="range" min={0} max={1} step={0.02} value={distort}
            onChange={e => setDistort(+e.target.value)} style={{ width: 80, accentColor: '#a78bfa', height: 3, cursor: 'pointer' }} />
        </label>
      </div>
    </div>
  );
};

// 10 · Emissive pulse ring
function PulseRing() {
  const ring = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 0.5 + Math.sin(t * 2) * 0.5;
    (ring.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse * 1.4;
    ring.current.rotation.x += 0.006;
    ring.current.rotation.z += 0.009;
  });
  return (
    <>
      <mesh ref={ring}>
        <torusGeometry args={[1.2, 0.12, 24, 100]} />
        <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={1} metalness={0} roughness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.07, 16, 80]} />
        <meshStandardMaterial color="#7eb8e8" emissive="#7eb8e8" emissiveIntensity={0.9} metalness={0} roughness={0.2} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#f9fafb" emissive="#ffffff" emissiveIntensity={1.2} />
      </mesh>
    </>
  );
}
const EmissivePulse: React.FC = () => (
  <Scene camera={[0, 0, 4]}>
    <PulseRing />
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
  </Scene>
);

// 11 · Motion trail — ball leaving a trail
function TrailBall() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.position.x = Math.sin(t * 1.2) * 1.8;
    ref.current.position.y = Math.cos(t * 0.9) * 1.2;
    ref.current.position.z = Math.sin(t * 0.6) * 0.8;
  });
  return (
    <Trail width={0.18} length={14} color="#fb923c" attenuation={t => t * t}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={1.2} />
      </mesh>
    </Trail>
  );
}
const MotionTrail: React.FC = () => (
  <Scene camera={[0, 0, 5]}>
    <Stars radius={25} depth={10} count={500} fade />
    <TrailBall />
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
  </Scene>
);

// 12 · Starfield warp — true 3D tunnel with depth perception
function WarpStarField({ warp }: { warp: boolean }) {
  const ref = useRef<THREE.Points>(null!);
  const COUNT = 2500;

  // Stars spread in a cylinder around the Z-axis — radial placement gives tunnel effect
  const initPositions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 0.4 + Math.random() * 7;          // spread across a wide cone
      arr[i * 3]     = Math.cos(theta) * radius;
      arr[i * 3 + 1] = Math.sin(theta) * radius;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 120;   // deep Z spread
    }
    return arr;
  }, []);

  const pos = useRef(new Float32Array(initPositions));

  useFrame((_, dt) => {
    if (!ref.current) return;
    const buf = ref.current.geometry.attributes.position.array as Float32Array;
    const speed = warp ? 55 : 5;
    for (let i = 0; i < COUNT; i++) {
      const iz = i * 3 + 2;
      pos.current[iz] += speed * dt;
      // Seamless loop: wrap back to far end keeping same radial position
      if (pos.current[iz] > 40) {
        pos.current[iz] = -80;
        // Randomise radius on recycle for variety
        const theta = Math.random() * Math.PI * 2;
        const radius = 0.4 + Math.random() * 7;
        pos.current[i * 3]     = Math.cos(theta) * radius;
        pos.current[i * 3 + 1] = Math.sin(theta) * radius;
      }
      buf[i * 3]     = pos.current[i * 3];
      buf[i * 3 + 1] = pos.current[i * 3 + 1];
      buf[i * 3 + 2] = pos.current[iz];
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    // Dynamic point size: warp gives streaky "motion" feel
    (ref.current.material as THREE.PointsMaterial).size = warp ? 0.22 : 0.07;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(initPositions), 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#ddeeff" sizeAttenuation transparent opacity={0.95} />
    </points>
  );
}
const StarWarp: React.FC = () => {
  const [warp, setWarp] = useState(false);
  return (
    // Full-bleed — no inner padding, canvas fills entire card slot
    <div className="relative" style={{ width: '100%', height: '100%' }}>
      <Canvas dpr={[1, 1.5]} gl={{ antialias: false, alpha: false }}
        style={{ background: '#02040a', width: '100%', height: '100%' }}>
        {/* Camera sits at origin pointing down −Z; stars rush from −Z toward us */}
        <PerspectiveCamera makeDefault position={[0, 0, 0]} fov={80} near={0.05} far={200} />
        <Suspense fallback={null}>
          <WarpStarField warp={warp} />
        </Suspense>
      </Canvas>
      <div className="absolute inset-x-0 bottom-3 flex justify-center pointer-events-none">
        <button type="button" onClick={() => setWarp(w => !w)}
          className="text-[11px] font-semibold px-4 py-1.5 rounded-full pointer-events-auto"
          style={{
            background: warp ? 'rgba(244,114,182,0.2)' : 'rgba(255,255,255,0.08)',
            border: `1px solid ${warp ? 'rgba(244,114,182,0.6)' : 'rgba(255,255,255,0.18)'}`,
            color: warp ? '#f472b6' : 'rgba(255,255,255,0.65)', cursor: 'pointer',
            backdropFilter: 'blur(6px)',
          }}
        >{warp ? '⊠ Drop Warp' : '⚡ Engage Warp'}</button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// SECTION 4 — SCENES & ENVIRONMENT
// ═══════════════════════════════════════════════════════

// 13 · HDRI environment reflections — auto-rotate, pause on drag
type EnvPreset = 'city' | 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest';
const ENV_PRESETS: EnvPreset[] = ['city', 'sunset', 'dawn', 'night', 'warehouse', 'forest'];
function EnvBall({ preset }: { preset: EnvPreset }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { ref.current.rotation.y += 0.25 * dt; });
  return (
    <>
      <Environment preset={preset} />
      <mesh ref={ref}>
        <sphereGeometry args={[1.3, 64, 64]} />
        <meshStandardMaterial metalness={1} roughness={0.05} />
      </mesh>
    </>
  );
}
const EnvReflections: React.FC = () => {
  const [preset, setPreset] = useState<EnvPreset>('city');
  const [interacting, setInteracting] = useState(false);
  return (
    <div className="flex flex-col h-full">
      <div style={{ flex: 1 }}>
        <Scene camera={[0, 0, 3.5]}>
          <Suspense fallback={null}><EnvBall preset={preset} /></Suspense>
          <OrbitControls
            enableZoom={false} enablePan={false}
            autoRotate={!interacting} autoRotateSpeed={1.2}
            onStart={() => setInteracting(true)}
            onEnd={() => setInteracting(false)}
          />
        </Scene>
      </div>
      <div className="pb-3 px-2 flex flex-wrap gap-1 justify-center">
        {ENV_PRESETS.map(p => (
          <button key={p} type="button" onClick={() => setPreset(p)}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize"
            style={{
              background: preset === p ? 'rgba(251,146,60,0.22)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${preset === p ? 'rgba(251,146,60,0.5)' : 'rgba(255,255,255,0.08)'}`,
              color: preset === p ? '#fb923c' : 'rgba(255,255,255,0.35)', cursor: 'pointer',
            }}>{p}</button>
        ))}
      </div>
    </div>
  );
};

// 14 · Multi-object scene with contact shadows
function SceneObjects() {
  const cubeRef  = useRef<THREE.Mesh>(null!);
  const sphereRef = useRef<THREE.Mesh>(null!);
  const torusRef  = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    cubeRef.current.rotation.x  = t * 0.5;
    cubeRef.current.rotation.y  = t * 0.3;
    sphereRef.current.position.y = Math.sin(t) * 0.3;
    torusRef.current.rotation.z  = t * 0.6;
    torusRef.current.rotation.x  = t * 0.2;
  });
  return (
    <>
      <Environment preset="city" />
      <mesh ref={cubeRef} position={[-1.8, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4d8fc8" metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#a78bfa" metalness={0.7} roughness={0.1} />
      </mesh>
      <mesh ref={torusRef} position={[1.8, 0, 0]}>
        <torusGeometry args={[0.5, 0.2, 16, 50]} />
        <meshStandardMaterial color="#34d399" metalness={0.5} roughness={0.3} />
      </mesh>
      <ContactShadows opacity={0.5} scale={8} blur={2.5} far={5} position={[0, -1, 0]} />
    </>
  );
}
const MultiObjectScene: React.FC = () => (
  <Scene camera={[0, 1.5, 6]} lightBg>
    <SceneObjects />
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
  </Scene>
);

// 15 · Galaxy spiral
function Galaxy() {
  const COUNT = 3000;
  const geo = useRef<THREE.BufferGeometry>(null!);
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const radius = Math.random() * 4;
      const spinAngle = radius * 3.5;
      const branchAngle = ((i % 3) / 3) * Math.PI * 2;
      const rand = (v: number) => Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * v;
      arr[i * 3]     = Math.cos(branchAngle + spinAngle) * radius + rand(0.3);
      arr[i * 3 + 1] = rand(0.18);
      arr[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + rand(0.3);
    }
    return arr;
  }, []);

  const colors = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    const inner = new THREE.Color('#7eb8e8');
    const outer = new THREE.Color('#a78bfa');
    for (let i = 0; i < COUNT; i++) {
      const r = Math.sqrt(positions[i*3]**2 + positions[i*3+2]**2) / 4;
      const c = inner.clone().lerp(outer, r);
      arr[i*3] = c.r; arr[i*3+1] = c.g; arr[i*3+2] = c.b;
    }
    return arr;
  }, [positions]);

  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += 0.08 * dt; });

  return (
    <points ref={ref}>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} sizeAttenuation vertexColors transparent opacity={0.9} />
    </points>
  );
}
const GalaxyScene: React.FC = () => (
  <Scene camera={[0, 2.5, 6]}>
    <Galaxy />
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
  </Scene>
);

// 16 · Floating crystal cluster — Float + environment
function CrystalCluster() {
  const SHARDS = 7;
  return (
    <>
      {Array.from({ length: SHARDS }).map((_, i) => {
        const angle = (i / SHARDS) * Math.PI * 2;
        const r = 0.6 + (i % 3) * 0.3;
        return (
          <Float key={i} speed={1 + i * 0.3} rotationIntensity={0.4} floatIntensity={0.5} position={[
            Math.cos(angle) * r, (i % 2) * 0.3 - 0.2, Math.sin(angle) * r,
          ]}>
            <mesh rotation={[Math.PI * Math.random(), Math.PI * Math.random(), 0]}>
              <coneGeometry args={[0.15 + (i % 2) * 0.06, 0.8 + (i % 3) * 0.3, 6]} />
              <meshStandardMaterial
                color={['#7eb8e8','#a78bfa','#34d399','#f472b6','#fbbf24'][i % 5]}
                metalness={0.1} roughness={0.05} transparent opacity={0.85}
              />
            </mesh>
          </Float>
        );
      })}
    </>
  );
}
const FloatingCrystals: React.FC = () => (
  <Scene camera={[0, 0.5, 4]} lightBg>
    <Environment preset="dawn" />
    <CrystalCluster />
    <ContactShadows opacity={0.3} scale={5} blur={2} far={3} position={[0, -1.2, 0]} />
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.9} />
  </Scene>
);

// ═══════════════════════════════════════════════════════
// PAGE DATA
// ═══════════════════════════════════════════════════════

const SECTIONS = [
  {
    number: '01', title: 'Geometry & Materials', accent: '#4d8fc8',
    subtitle: 'Real WebGL geometry and PBR materials rendered directly in the browser via React Three Fiber.',
    items: [
      { title: 'Geometry Selector',   description: 'Switch between 5 primitive geometries live — Box, Sphere, Torus, Octahedron, Cone. Each spins with continuous rotation via useFrame. Orbit to explore.',  useCase: 'Product viewers / 3D configurators', C: GeometryShowcase,  bg: '#f0f4f8' },
      { title: 'Material Explorer',   description: 'Six material modes on the same mesh: Standard PBR, Wireframe, Distortion shader, Wobble shader, Phong, and Normal map debug. Open the ⚙ panel for sliders.',  useCase: 'Shader tooling / material preview',  C: MaterialExplorer,  bg: '#f0f4f8' },
      { title: '3D Floating Text',    description: 'Text rendered as actual 3D geometry in the scene, swaying with a sine wave on time. Billboard-quality lettering with an outline pass.',                          useCase: 'Hero sections / 3D branding',        C: FloatingText3D,    bg: '#f0f4f8' },
      { title: 'Instanced Spheres',   description: '20–300 instanced spheres animated individually using a single draw call. Each sphere pulses size and drifts position. Drag the slider to stress-test.',       useCase: 'Data vis / particle systems',        C: InstancedSpheres,  bg: '#f0f4f8' },
    ],
  },
  {
    number: '02', title: 'Physics & Interaction', accent: '#a78bfa',
    subtitle: 'Meshes that respond to the cursor, explode on command, and orbit through real particle dynamics.',
    items: [
      { title: 'Mouse Tilt Cube',    description: 'The cube directly mirrors your cursor position — move left/right to yaw, up/down to pitch. The rotation responds 1:1 with the pointer via onPointerMove.',   useCase: 'Product cards / hero interactions',  C: MouseTiltCube,     bg: '#f0f4f8' },
      { title: 'Explode / Implode',  description: 'Spheres cluster at origin then fly outward along random normalized vectors. Implode reverses velocity back to center. Smooth interpolated with dt scaling.',   useCase: 'Game FX / data reveal animations',   C: ExplodeScene,      bg: '#f0f4f8' },
      { title: 'Orbit Playground',   description: 'A torus with contact shadows under Drei Environment lighting. Grab and drag to orbit freely with OrbitControls. The Float component adds idle breathing.',     useCase: 'Product showcase / 3D demos',        C: OrbitPlayground,   bg: '#f0f4f8' },
      { title: 'Particle Attractor', description: '220 particles orbit in a spherical shell. Attract pulls them inward closest-first. Release disperses them back outward in reverse order.',                     useCase: 'Data viz / visualisation demos',     C: ParticleAttractor, bg: '#04060c' },
    ],
  },
  {
    number: '03', title: 'Shaders & Visual FX', accent: '#34d399',
    subtitle: 'Shader-driven surfaces, emissive glow, motion trails, and warp-speed star streaming.',
    items: [
      { title: 'Distortion Blob',   description: 'MeshDistortMaterial from Drei deforms the sphere geometry in the vertex shader. Speed and distortion amount are both adjustable with sliders.',               useCase: 'Creative / generative art UI',  C: DistortBlobScene, bg: '#04060c' },
      { title: 'Emissive Pulse',    description: 'Three concentric rings with emissiveIntensity driven by a sine wave each frame. The outermost ring pulses in and out of a cyan glow using useFrame.',          useCase: 'Status indicators / sci-fi UI', C: EmissivePulse,    bg: '#04060c' },
      { title: 'Motion Trail',      description: 'A sphere follows a Lissajous figure-eight path. Drei Trail component paints a glowing orange ribbon behind it that fades with a custom attenuation function.', useCase: 'Game FX / data flow lines',     C: MotionTrail,      bg: '#04060c' },
      { title: 'Star Warp',         description: '2500 stars in a radial tunnel rush toward the camera. Depth-sorted placement gives true 3D perspective. Engage Warp jumps to hyperspace speed.',              useCase: 'Space games / loading screens', C: StarWarp,         bg: '#02040a' },
    ],
  },
  {
    number: '04', title: 'Scenes & Environments', accent: '#fb923c',
    subtitle: 'Composed 3D scenes with HDRI environment lighting, multi-object choreography, and procedural generation.',
    items: [
      { title: 'HDRI Reflections',   description: 'A perfectly smooth metal sphere reflects Drei\'s Environment presets — city, sunset, dawn, night, warehouse, forest. Auto-rotates; pause by dragging.',          useCase: 'Product renders / jewellery UX', C: EnvReflections,   bg: '#04060c' },
      { title: 'Multi-object Scene', description: 'Three objects — cube, sphere, torus — spin independently on different axes with contact shadows below. An HDRI environment colours the reflections realistically.', useCase: 'Portfolio / capability demos',  C: MultiObjectScene, bg: '#f0f4f8' },
      { title: 'Galaxy Spiral',      description: '3000 particles arranged on a 3-arm spiral using logarithmic spin math. Vertex colours interpolate from cyan at the core to violet at the edge.',                   useCase: 'Creative / background scenes',  C: GalaxyScene,      bg: '#04060c' },
      { title: 'Crystal Cluster',    description: 'Seven hexagonal crystal shards float with independent Float speeds and phases. Each catches IBL reflections at a different angle as the scene auto-rotates.',       useCase: 'Creative / luxury product UI',  C: FloatingCrystals, bg: '#f0f4f8' },
    ],
  },
];

// ═══════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════

const ThreeDAnimations: React.FC = () => (
  <div className="min-h-screen" style={{ background: '#06080f', color: '#e4eaf0' }}>

    {/* Hero */}
    <div className="relative overflow-hidden" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 60% at 0% 0%, rgba(77,143,200,0.1) 0%, transparent 65%)' }}
      />
      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-10 pb-9">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-3 font-semibold"
            style={{ color: '#4d8fc8', opacity: 0.6, fontFamily: 'monospace' }}>
            Playground / Animations
          </p>
          <h1 className="mb-3 leading-tight"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
            3D Animations
          </h1>
          <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'rgba(255,255,255,0.36)' }}>
            16 real WebGL scenes built with React Three Fiber and Drei — geometry, PBR materials, shader effects, particle systems, and full 3D environments. All running live in the browser.
          </p>
        </motion.div>
        <motion.div
          className="flex flex-wrap gap-2 mt-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }}
        >
          {['4 categories', '16 scenes', 'React Three Fiber', 'Drei', 'WebGL'].map(tag => (
            <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.4)' }}
            >{tag}</span>
          ))}
        </motion.div>
      </div>
    </div>

    {/* Sections */}
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 space-y-16">
      {SECTIONS.map(section => (
        <motion.div key={section.number}
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeader number={section.number} title={section.title} subtitle={section.subtitle} accent={section.accent} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {section.items.map(item => (
              <ShowcaseCard key={item.title} title={item.title} description={item.description} useCase={item.useCase} bg={item.bg}>
                <div className="w-full h-full">
                  <item.C />
                </div>
              </ShowcaseCard>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default ThreeDAnimations;
