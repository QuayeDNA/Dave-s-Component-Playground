import React from 'react';
import { motion } from 'framer-motion';
import { ShowcaseCard } from './shared/ShowcaseCard';
import { SectionHeader } from './shared/SectionHeader';
import GeometryShowcase from './scenes/GeometryShowcase';
import MaterialExplorer from './scenes/MaterialExplorer';
import FloatingText3D from './scenes/FloatingText3D';
import InstancedSpheres from './scenes/InstancedSpheres';
import MouseTiltCube from './scenes/MouseTiltCube';
import ExplodeScene from './scenes/ExplodeScene';
import OrbitPlayground from './scenes/OrbitPlayground';
import ParticleAttractor from './scenes/ParticleAttractor';
import DistortBlobScene from './scenes/DistortBlobScene';
import EmissivePulse from './scenes/EmissivePulse';
import MotionTrail from './scenes/MotionTrail';
import StarWarp from './scenes/StarWarp';
import EnvReflections from './scenes/EnvReflections';
import MultiObjectScene from './scenes/MultiObjectScene';
import GalaxyScene from './scenes/GalaxyScene';
import FloatingCrystals from './scenes/FloatingCrystals';

const SECTIONS = [
  {
    number: '01', title: 'Geometry & Materials', accent: '#4d8fc8',
    subtitle: 'Real WebGL geometry and PBR materials rendered directly in the browser via React Three Fiber.',
    items: [
      { title: 'Geometry Selector',   description: 'Switch between 5 primitive geometries live — Box, Sphere, Torus, Octahedron, Cone. Each spins with continuous rotation via useFrame. Orbit to explore.',  useCase: 'Product viewers / 3D configurators', C: GeometryShowcase,  bg: '#f0f4f8' },
      { title: 'Material Explorer',   description: 'Six material modes on the same mesh: Standard PBR, Wireframe, Distortion shader, Wobble shader, Phong, and Normal map debug. Open the settings panel for sliders.',  useCase: 'Shader tooling / material preview',  C: MaterialExplorer,  bg: '#f0f4f8' },
      { title: '3D Floating Text',    description: 'Text rendered as actual 3D geometry in the scene, swaying with a sine wave on time. Billboard-quality lettering with an outline pass.',                          useCase: 'Hero sections / 3D branding',        C: FloatingText3D,    bg: '#f0f4f8' },
      { title: 'Instanced Spheres',   description: '20–300 instanced spheres animated individually using a single draw call. Each sphere pulses size and drifts position. Drag the slider to stress-test.',       useCase: 'Data vis / particle systems',        C: InstancedSpheres,  bg: '#f0f4f8' },
    ],
  },
  {
    number: '02', title: 'Physics & Interaction', accent: '#a78bfa',
    subtitle: 'Meshes that respond to the cursor, explode on command, and orbit through real particle dynamics.',
    items: [
      { title: 'Mouse Tilt Cube',    description: 'The cube directly mirrors your cursor position — move left/right to yaw, up/down to pitch. The rotation responds 1:1 with the pointer via onPointerMove.',   useCase: 'Product cards / hero interactions',  C: MouseTiltCube,     bg: '#f0f4f8' },
      { title: 'Explode / Implode',  description: 'Spheres cluster at origin then fly outward along random normalized vectors. Implode reverses velocity back to center. Smooth interpolated with dt scaling.',   useCase: 'Game FX / data reveal animations',   C: ExplodeScene,      bg: '#f0f4f8' },
      { title: 'Orbit Playground',   description: 'A torus with contact shadows under Drei Environment lighting. Grab and drag to orbit freely with OrbitControls. The Float component adds idle breathing.',     useCase: 'Product showcase / 3D demos',        C: OrbitPlayground,   bg: '#f0f4f8' },
      { title: 'Particle Attractor', description: '220 particles orbit in a spherical shell. Attract pulls them inward closest-first. Release disperses them back outward in reverse order.',                     useCase: 'Data viz / visualisation demos',     C: ParticleAttractor, bg: '#04060c' },
    ],
  },
  {
    number: '03', title: 'Shaders & Visual FX', accent: '#34d399',
    subtitle: 'Shader-driven surfaces, emissive glow, motion trails, and warp-speed star streaming.',
    items: [
      { title: 'Distortion Blob',   description: 'MeshDistortMaterial from Drei deforms the sphere geometry in the vertex shader. Speed and distortion amount are both adjustable with sliders.',               useCase: 'Creative / generative art UI',  C: DistortBlobScene, bg: '#04060c' },
      { title: 'Emissive Pulse',    description: 'Three concentric rings with emissiveIntensity driven by a sine wave each frame. The outermost ring pulses in and out of a cyan glow using useFrame.',          useCase: 'Status indicators / sci-fi UI', C: EmissivePulse,    bg: '#04060c' },
      { title: 'Motion Trail',      description: 'A sphere follows a Lissajous figure-eight path. Drei Trail component paints a glowing orange ribbon behind it that fades with a custom attenuation function.', useCase: 'Game FX / data flow lines',     C: MotionTrail,      bg: '#04060c' },
      { title: 'Star Warp',         description: '2500 stars in a radial tunnel rush toward the camera. Depth-sorted placement gives true 3D perspective. Engage Warp jumps to hyperspace speed.',              useCase: 'Space games / loading screens', C: StarWarp,         bg: '#02040a' },
    ],
  },
  {
    number: '04', title: 'Scenes & Environments', accent: '#fb923c',
    subtitle: 'Composed 3D scenes with HDRI environment lighting, multi-object choreography, and procedural generation.',
    items: [
      { title: 'HDRI Reflections',   description: 'A perfectly smooth metal sphere reflects Drei\'s Environment presets — city, sunset, dawn, night, warehouse, forest. Auto-rotates; pause by dragging.',          useCase: 'Product renders / jewellery UX', C: EnvReflections,   bg: '#04060c' },
      { title: 'Multi-object Scene', description: 'Three objects — cube, sphere, torus — spin independently on different axes with contact shadows below. An HDRI environment colours the reflections realistically.', useCase: 'Portfolio / capability demos',  C: MultiObjectScene, bg: '#f0f4f8' },
      { title: 'Galaxy Spiral',      description: '3000 particles arranged on a 3-arm spiral using logarithmic spin math. Vertex colours interpolate from cyan at the core to violet at the edge.',                   useCase: 'Creative / background scenes',  C: GalaxyScene,      bg: '#04060c' },
      { title: 'Crystal Cluster',    description: 'Seven hexagonal crystal shards float with independent Float speeds and phases. Each catches IBL reflections at a different angle as the scene auto-rotates.',       useCase: 'Creative / luxury product UI',  C: FloatingCrystals, bg: '#f0f4f8' },
    ],
  },
];

const ThreeDAnimations: React.FC = () => (
  <div className="min-h-screen" style={{ background: '#06080f', color: '#e4eaf0' }}>

    {/* Hero */}
    <div className="relative overflow-hidden" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 60% at 0% 0%, rgba(77,143,200,0.1) 0%, transparent 65%)' }}
      />
      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-10 pb-9">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-3 font-semibold"
            style={{ color: '#4d8fc8', opacity: 0.6, fontFamily: 'monospace' }}>
            Playground / Animations
          </p>
          <h1 className="mb-3 leading-tight"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
            3D Animations
          </h1>
          <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'rgba(255,255,255,0.36)' }}>
            16 real WebGL scenes built with React Three Fiber and Drei — geometry, PBR materials, shader effects, particle systems, and full 3D environments. All running live in the browser.
          </p>
        </motion.div>
        <motion.div
          className="flex flex-wrap gap-2 mt-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }}
        >
          {['4 categories', '16 scenes', 'React Three Fiber', 'Drei', 'WebGL'].map(tag => (
            <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.4)' }}
            >{tag}</span>
          ))}
        </motion.div>
      </div>
    </div>

    {/* Sections */}
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 space-y-16">
      {SECTIONS.map(section => (
        <motion.div key={section.number}
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeader number={section.number} title={section.title} subtitle={section.subtitle} accent={section.accent} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {section.items.map(item => (
              <ShowcaseCard key={item.title} title={item.title} description={item.description} useCase={item.useCase} bg={item.bg}>
                <div className="w-full h-full">
                  <item.C />
                </div>
              </ShowcaseCard>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default ThreeDAnimations;