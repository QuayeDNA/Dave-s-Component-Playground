import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Scene } from '../shared/Scene';

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

export default EmissivePulse;