import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { Scene } from '../shared/Scene';

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

export default MotionTrail;