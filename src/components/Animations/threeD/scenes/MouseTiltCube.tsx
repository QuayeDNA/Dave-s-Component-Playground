import { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Scene } from '../shared/Scene';

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

export default MouseTiltCube;