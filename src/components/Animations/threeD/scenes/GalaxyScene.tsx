import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Scene } from '../shared/Scene';

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

export default GalaxyScene;