import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Scene } from '../shared/Scene';

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

export default InstancedSpheres;