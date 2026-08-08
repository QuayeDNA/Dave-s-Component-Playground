import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import { Scene } from '../shared/Scene';
import { Dropdown } from '@/components/ui/dropdown'

// Geometry swap uses the "share a buffer geometry" API: each shape is built once
// into a memoised THREE.BufferGeometry and passed via `geometry={}` — swapping
// the prop swaps the buffer in place, no JSX reconciliation or flash.
type GeoName = 'Box' | 'Sphere' | 'Torus' | 'Octahedron' | 'Cone';
const GEO_OPTIONS: GeoName[] = ['Box', 'Sphere', 'Torus', 'Octahedron', 'Cone'];
const GEO_FACTORIES: Record<GeoName, () => THREE.BufferGeometry> = {
  Box:        () => new THREE.BoxGeometry(1.5, 1.5, 1.5),
  Sphere:     () => new THREE.SphereGeometry(1, 32, 32),
  Torus:      () => new THREE.TorusGeometry(0.9, 0.36, 24, 64),
  Octahedron: () => new THREE.OctahedronGeometry(1.2),
  Cone:       () => new THREE.ConeGeometry(1, 1.8, 32),
};

function GeoMesh({ geo }: { geo: GeoName }) {
  const ref = useRef<THREE.Mesh>(null!);
  const geometry = useMemo(() => GEO_FACTORIES[geo](), [geo]);
  useFrame((_, dt) => {
    ref.current.rotation.x += 0.4 * dt;
    ref.current.rotation.y += 0.65 * dt;
  });
  return (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial color="#2563eb" metalness={0.4} roughness={0.3} />
    </mesh>
  );
}

// Geometry picker lives in a shared, viewport-aware Dropdown; the menu portals to body so the card's overflow-hidden slot can't clip it.
const GeometryShowcase: React.FC = () => {
  const [geo, setGeo] = useState<GeoName>('Box');
  return (
    <div className="flex flex-col h-full">
      <div className="relative" style={{ flex: 1 }}>
        <Scene camera={[0, 0, 4]} lightBg>
          <GeoMesh geo={geo} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Scene>

        {/* Dropdown — portals out of the canvas card, viewport-aware */}
        <div className="absolute top-2 right-2 z-20">
          <Dropdown
            value={geo}
            onChange={setGeo}
            options={GEO_OPTIONS.map(g => ({ value: g, label: g }))}
            contentClassName="w-40 bg-white/95 border-slate-200 text-slate-600 shadow-lg"
            triggerClassName="border-slate-300 bg-white/75 text-slate-700 backdrop-blur"
          />
        </div>
      </div>
    </div>
  );
};

export default GeometryShowcase;
