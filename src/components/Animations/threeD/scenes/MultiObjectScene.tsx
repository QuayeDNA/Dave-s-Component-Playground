import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Scene } from '../shared/Scene';

function SceneObjects() {
  const cubeRef  = useRef<THREE.Mesh>(null!);
  const sphereRef = useRef<THREE.Mesh>(null!);
  const torusRef  = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    cubeRef.current.rotation.x  = t * 0.5;
    cubeRef.current.rotation.y  = t * 0.3;
    sphereRef.current.position.y = Math.sin(t) * 0.3;
    torusRef.current.rotation.z  = t * 0.6;
    torusRef.current.rotation.x  = t * 0.2;
  });
  return (
    <>
      <Environment preset="city" />
      <mesh ref={cubeRef} position={[-1.8, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4d8fc8" metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#a78bfa" metalness={0.7} roughness={0.1} />
      </mesh>
      <mesh ref={torusRef} position={[1.8, 0, 0]}>
        <torusGeometry args={[0.5, 0.2, 16, 50]} />
        <meshStandardMaterial color="#34d399" metalness={0.5} roughness={0.3} />
      </mesh>
      <ContactShadows opacity={0.5} scale={8} blur={2.5} far={5} position={[0, -1, 0]} resolution={256} />
    </>
  );
}

const MultiObjectScene: React.FC = () => (
  <Scene camera={[0, 1.5, 6]} lightBg>
    <SceneObjects />
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
  </Scene>
);

export default MultiObjectScene;