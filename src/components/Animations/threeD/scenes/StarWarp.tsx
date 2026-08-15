import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneActive } from '../shared/SceneActiveContext';

function WarpStarField({ warp }: { warp: boolean }) {
  const ref = useRef<THREE.Points>(null!);
  const COUNT = 2500;

  const initPositions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 0.4 + Math.random() * 7;
      arr[i * 3]     = Math.cos(theta) * radius;
      arr[i * 3 + 1] = Math.sin(theta) * radius;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 120;
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
      if (pos.current[iz] > 40) {
        pos.current[iz] = -80;
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
  const active = useSceneActive();
  return (
    // Full-bleed — no inner padding, canvas fills entire card slot
    <div className="relative" style={{ width: '100%', height: '100%' }}>
      <Canvas dpr={[1, 1.5]} frameloop={active ? 'always' : 'never'}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        style={{ background: '#02040a', width: '100%', height: '100%' }}>
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
        >{warp ? 'Drop Warp' : 'Engage Warp'}</button>
      </div>
    </div>
  );
};

export default StarWarp;