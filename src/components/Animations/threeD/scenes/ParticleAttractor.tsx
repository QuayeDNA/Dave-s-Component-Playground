import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Scene } from '../shared/Scene';

function Particles({ attracting }: { attracting: boolean }) {
  const COUNT = 220;
  const geo = useRef<THREE.BufferGeometry>(null!);

  const initPos = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 1.8 + Math.random() * 2;
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const pos = useRef(new Float32Array(initPos));
  const vels = useRef(new Float32Array(COUNT * 3).fill(0));

  const distOrder = useMemo(() => {
    const arr = Array.from({ length: COUNT }, (_, i) => {
      const x = initPos[i*3], y = initPos[i*3+1], z = initPos[i*3+2];
      return { i, r: Math.sqrt(x*x + y*y + z*z) };
    });
    arr.sort((a, b) => a.r - b.r);
    return arr;
  }, [initPos]);

  const phase = useRef(0);

  useEffect(() => {
    phase.current = attracting ? 1 : -1;
  }, [attracting]);

  useFrame((state, dt) => {
    if (!geo.current) return;
    const buf = geo.current.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;

    for (let ii = 0; ii < COUNT; ii++) {
      const { i, r: initDist } = distOrder[ii];
      const ix = i * 3, iy = ix + 1, iz = ix + 2;
      const px = pos.current[ix], py = pos.current[iy], pz = pos.current[iz];
      const dist = Math.sqrt(px*px + py*py + pz*pz) || 0.001;

      if (phase.current === 1) {
        const delay = initDist / 6;
        const elapsed = t - (phase as any)._startTime;
        if ((phase as any)._startTime === undefined || elapsed > delay) {
          const strength = 0.9 * dt * 60;
          vels.current[ix] += (-px / dist) * strength * Math.min(dist * 0.4, 1.8);
          vels.current[iy] += (-py / dist) * strength * Math.min(dist * 0.4, 1.8);
          vels.current[iz] += (-pz / dist) * strength * Math.min(dist * 0.4, 1.8);
        }
        const dampFactor = dist < 0.5 ? 0.72 : 0.90;
        vels.current[ix] *= dampFactor;
        vels.current[iy] *= dampFactor;
        vels.current[iz] *= dampFactor;
      } else {
        const targetR = initDist;
        const radialErr = dist - targetR;
        vels.current[ix] += (-px / dist) * radialErr * 0.015 * dt * 60;
        vels.current[iy] += (-py / dist) * radialErr * 0.015 * dt * 60;
        vels.current[iz] += (-pz / dist) * radialErr * 0.015 * dt * 60;
        vels.current[ix] +=  pz / dist * 0.018 * dt * 60;
        vels.current[iz] += -px / dist * 0.018 * dt * 60;
        vels.current[ix] *= 0.96;
        vels.current[iy] *= 0.96;
        vels.current[iz] *= 0.96;
      }

      pos.current[ix] += vels.current[ix];
      pos.current[iy] += vels.current[iy];
      pos.current[iz] += vels.current[iz];
      buf[ix] = pos.current[ix];
      buf[iy] = pos.current[iy];
      buf[iz] = pos.current[iz];
    }
    geo.current.attributes.position.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(initPos), 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#7eb8e8" sizeAttenuation transparent opacity={0.85} />
    </points>
  );
}

const ParticleAttractor: React.FC = () => {
  const [attracting, setAttracting] = useState(false);
  return (
    <div className="relative h-full">
      <Scene camera={[0, 0, 8]}>
        <Stars radius={30} depth={10} count={400} factor={2} fade />
        <Particles attracting={attracting} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
      </Scene>
      <div className="absolute inset-x-0 bottom-3 flex justify-center">
        <button type="button" onClick={() => setAttracting(a => !a)}
          className="text-[11px] font-semibold px-4 py-1.5 rounded-full"
          style={{
            background: attracting ? 'rgba(52,211,153,0.15)' : 'rgba(77,143,200,0.15)',
            border: `1px solid ${attracting ? 'rgba(52,211,153,0.4)' : 'rgba(77,143,200,0.4)'}`,
            color: attracting ? '#34d399' : '#7eb8e8', cursor: 'pointer',
          }}
        >{attracting ? 'Attract' : 'Orbit'}</button>
      </div>
    </div>
  );
};

export default ParticleAttractor;