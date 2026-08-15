import { useRef, useState } from 'react';
import { MeshDistortMaterial, MeshWobbleMaterial, OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Settings2 } from 'lucide-react';
import { Scene } from '../shared/Scene';

type MatMode = 'Standard' | 'Wireframe' | 'Distort' | 'Wobble' | 'Phong' | 'Normal';
const MAT_MODES: MatMode[] = ['Standard', 'Wireframe', 'Distort', 'Wobble', 'Phong', 'Normal'];

function MatMesh({ mode, metalness, roughness }: { mode: MatMode; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { ref.current.rotation.y += 0.5 * dt; ref.current.rotation.x += 0.2 * dt; });
  const col = '#2563eb';
  return (
    <mesh ref={ref} key={mode}>
      <sphereGeometry args={[1.1, 48, 48]} />
      {mode === 'Standard'  && <meshStandardMaterial color={col} metalness={metalness} roughness={roughness} />}
      {mode === 'Wireframe' && <meshStandardMaterial color={col} wireframe />}
      {mode === 'Distort'   && <MeshDistortMaterial  color={col} distort={0.45} speed={2} metalness={metalness} roughness={roughness} />}
      {mode === 'Wobble'    && <MeshWobbleMaterial   color={col} factor={0.6} speed={2} metalness={metalness} roughness={roughness} />}
      {mode === 'Phong'     && <meshPhongMaterial    color={col} shininess={120} specular={new THREE.Color('#6090d0')} />}
      {mode === 'Normal'    && <meshNormalMaterial />}
    </mesh>
  );
}

const MaterialExplorer: React.FC = () => {
  const [mode, setMode] = useState<MatMode>('Standard');
  const [metalness, setMetalness] = useState(0.3);
  const [roughness, setRoughness] = useState(0.3);
  const [open, setOpen] = useState(false);
  const showSliders = mode !== 'Wireframe' && mode !== 'Normal' && mode !== 'Phong';
  return (
    <div className="relative flex flex-col h-full">
      {/* Top-right settings dropdown outside the canvas clip */}
      <div className="absolute top-2 right-2 z-10">
        <button type="button" onClick={() => setOpen(o => !o)}
          className="rounded-lg p-1.5 flex items-center gap-1"
          style={{
            background: open ? 'rgba(37,99,235,0.18)' : 'rgba(255,255,255,0.55)',
            border: `1px solid ${open ? 'rgba(37,99,235,0.4)' : 'rgba(0,0,0,0.1)'}`,
            backdropFilter: 'blur(6px)', cursor: 'pointer',
          }}>
          <Settings2 size={13} color={open ? '#2563eb' : '#334155'} />
        </button>
        {open && (
          <div className="absolute top-9 right-0 rounded-xl p-3 w-52 space-y-3"
            style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(0,0,0,0.1)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
            <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: '#94a3b8' }}>Material</p>
            <div className="flex flex-wrap gap-1">
              {MAT_MODES.map(m => (
                <button key={m} type="button" onClick={() => setMode(m)}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: mode === m ? '#2563eb' : 'rgba(0,0,0,0.06)',
                    color: mode === m ? '#fff' : '#475569', cursor: 'pointer',
                    border: 'none',
                  }}>{m}</button>
              ))}
            </div>
            {showSliders && (
              <>
                <label className="flex flex-col gap-1">
                  <span className="text-[9px] font-semibold" style={{ color: '#64748b' }}>Metalness {metalness.toFixed(2)}</span>
                  <input type="range" min={0} max={1} step={0.05} value={metalness}
                    onChange={e => setMetalness(+e.target.value)}
                    style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[9px] font-semibold" style={{ color: '#64748b' }}>Roughness {roughness.toFixed(2)}</span>
                  <input type="range" min={0} max={1} step={0.05} value={roughness}
                    onChange={e => setRoughness(+e.target.value)}
                    style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }} />
                </label>
              </>
            )}
          </div>
        )}
      </div>
      {/* Canvas fills remaining height */}
      <div style={{ flex: 1 }}>
        <Scene camera={[0, 0, 3.5]} lightBg>
          <MatMesh mode={mode} metalness={metalness} roughness={roughness} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Scene>
      </div>
    </div>
  );
};

export default MaterialExplorer;