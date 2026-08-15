import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Scene } from '../shared/Scene';

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

  const colors = ['#4d8fc8', '#a78bfa', '#34d399', '#fb923c', '#f472b6', '#60a5fa', '#fbbf24'];
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
        >{exploded ? 'Implode' : 'Explode'}</button>
      </div>
    </div>
  );
};

export default ExplodeScene;