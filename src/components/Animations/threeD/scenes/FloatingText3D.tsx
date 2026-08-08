import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { Scene } from '../shared/Scene';

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

export default FloatingText3D;