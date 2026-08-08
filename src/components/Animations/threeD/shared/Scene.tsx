import React, { Suspense, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { SceneActive } from './SceneActiveContext';

// Bare Canvas with standard lighting. Render loop idles (`frameloop="never"`)
// while the card is off-screen via the SceneActive context.
export const Scene: React.FC<{ children: React.ReactNode; camera?: [number, number, number]; lightBg?: boolean }> = ({
  children, camera = [0, 0, 5], lightBg,
}) => {
  const active = useContext(SceneActive);
  return (
    <Canvas dpr={[1, 1.5]} frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: !lightBg, powerPreference: 'high-performance' }}
      style={{ background: lightBg ? '#f0f4f8' : 'transparent' }}>
      <PerspectiveCamera makeDefault position={camera} fov={50} />
      {lightBg ? (
        <>
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow />
          <directionalLight position={[-4, -2, -4]} intensity={0.4} color="#c8d8f0" />
        </>
      ) : (
        <>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.2} />
          <pointLight position={[-8, -8, -8]} intensity={0.5} color="#7eb8e8" />
        </>
      )}
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
};