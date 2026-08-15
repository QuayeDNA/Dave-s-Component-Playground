import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Scene } from '../shared/Scene';

function DistortBlob({ speed, distort }: { speed: number; distort: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { ref.current.rotation.y += 0.3 * dt; });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.3, 48, 48]} />
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

export default DistortBlobScene;