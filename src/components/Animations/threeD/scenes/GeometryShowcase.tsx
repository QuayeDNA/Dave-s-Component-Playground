import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Scene } from '../shared/Scene';

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

// Dropdown is anchored OUTSIDE the canvas card — it lives in the card column as
// an overlay above the canvas, so the card's `overflow-hidden` clip never cuts it.
const GeometryShowcase: React.FC = () => {
  const [geo, setGeo] = useState<GeoName>('Box');
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col h-full">
      <div className="relative" style={{ flex: 1 }}>
        <Scene camera={[0, 0, 4]} lightBg>
          <GeoMesh geo={geo} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Scene>

        {/* Dropdown — outside canvas (not clipped), float on the scene */}
        <div className="absolute top-2 right-2 z-20">
          <button type="button" onClick={() => setOpen(o => !o)}
            className="rounded-lg px-2.5 py-1 flex items-center gap-1.5"
            style={{
              background: open ? 'rgba(37,99,235,0.16)' : 'rgba(255,255,255,0.75)',
              border: `1px solid ${open ? 'rgba(37,99,235,0.5)' : 'rgba(0,0,0,0.12)'}`,
              backdropFilter: 'blur(6px)', cursor: 'pointer',
            }}>
            <span className="text-[10px] font-semibold" style={{ color: open ? '#2563eb' : '#334155' }}>{geo}</span>
            <ChevronDown size={12} color={open ? '#2563eb' : '#64748b'} />
          </button>
          {open && (
            <div className="absolute top-9 right-0 rounded-xl p-1.5 w-40"
              style={{ background: 'rgba(255,255,255,0.96)', border: '1px solid rgba(0,0,0,0.1)',
                backdropFilter: 'blur(12px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
              {GEO_OPTIONS.map(g => (
                <button key={g} type="button" onClick={() => { setGeo(g); setOpen(false); }}
                  className="w-full text-left text-[10px] font-semibold px-2.5 py-1.5 rounded-lg"
                  style={{
                    background: geo === g ? 'rgba(37,99,235,0.14)' : 'transparent',
                    color: geo === g ? '#2563eb' : '#475569', cursor: 'pointer',
                  }}>{g}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeometryShowcase;
