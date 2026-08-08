import { ContactShadows, Environment, Float, OrbitControls } from '@react-three/drei';
import { Scene } from '../shared/Scene';

function CrystalCluster() {
  const SHARDS = 7;
  return (
    <>
      {Array.from({ length: SHARDS }).map((_, i) => {
        const angle = (i / SHARDS) * Math.PI * 2;
        const r = 0.6 + (i % 3) * 0.3;
        return (
          <Float key={i} speed={1 + i * 0.3} rotationIntensity={0.4} floatIntensity={0.5} position={[
            Math.cos(angle) * r, (i % 2) * 0.3 - 0.2, Math.sin(angle) * r,
          ]}>
            <mesh rotation={[Math.PI * Math.random(), Math.PI * Math.random(), 0]}>
              <coneGeometry args={[0.15 + (i % 2) * 0.06, 0.8 + (i % 3) * 0.3, 6]} />
              <meshStandardMaterial
                color={['#7eb8e8', '#a78bfa', '#34d399', '#f472b6', '#fbbf24'][i % 5]}
                metalness={0.1} roughness={0.05} transparent opacity={0.85}
              />
            </mesh>
          </Float>
        );
      })}
    </>
  );
}

const FloatingCrystals: React.FC = () => (
  <Scene camera={[0, 0.5, 4]} lightBg>
    <Environment preset="dawn" />
    <CrystalCluster />
    <ContactShadows opacity={0.3} scale={5} blur={2} far={3} position={[0, -1.2, 0]} resolution={256} />
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.9} />
  </Scene>
);

export default FloatingCrystals;