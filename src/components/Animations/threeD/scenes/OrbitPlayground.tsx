import { ContactShadows, Environment, Float, OrbitControls, Torus } from '@react-three/drei';
import { Scene } from '../shared/Scene';

function OrbitScene() {
  return (
    <>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <Torus args={[1, 0.38, 24, 64]}>
          <meshStandardMaterial color="#7c3aed" metalness={0.5} roughness={0.2} />
        </Torus>
      </Float>
      <ContactShadows opacity={0.3} scale={6} blur={2} far={4} position={[0, -1.8, 0]} resolution={256} />
    </>
  );
}

const OrbitPlayground: React.FC = () => (
  <Scene camera={[0, 1.5, 5]} lightBg>
    <Environment preset="city" />
    <OrbitScene />
    <OrbitControls enableZoom={false} enablePan={false} />
  </Scene>
);

export default OrbitPlayground;