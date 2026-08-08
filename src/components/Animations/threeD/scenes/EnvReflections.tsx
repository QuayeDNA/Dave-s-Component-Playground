import { Suspense, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Scene } from '../shared/Scene';

type EnvPreset = 'city' | 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest';
const ENV_PRESETS: EnvPreset[] = ['city', 'sunset', 'dawn', 'night', 'warehouse', 'forest'];

function EnvBall({ preset }: { preset: EnvPreset }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { ref.current.rotation.y += 0.25 * dt; });
  return (
    <>
      <Environment preset={preset} />
      <mesh ref={ref}>
        <sphereGeometry args={[1.3, 48, 48]} />
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

export default EnvReflections;