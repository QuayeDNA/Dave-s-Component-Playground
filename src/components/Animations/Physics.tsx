import React from 'react';
import { motion } from 'framer-motion';
import { ShowcaseCard, SectionHeader } from './physics/shared';
import { BouncingBalls, ProjectileLauncherFixed, SpringPendulum, NewtonsCradleWired } from './physics/Mechanics';
import { VerletRope, ClothSim, FluidRipple, SoftBlob } from './physics/SoftBody';
import { GravityWells, ElasticBilliards, DoublePendulum, OrbitalMechanics } from './physics/Fields';
import { Boids, FallingSandWired, ReactionDiffusion, LangtonsAnt } from './physics/Emergence';

// ── Hero tag ──────────────────────────────────────────────────────────────────
const HeroTag: React.FC<{ label: string }> = ({ label }) => (
  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)' }}>
    {label}
  </span>
);

// ── Section config ─────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 'mechanics', accent: '#4d8fc8', number: '01',
    title: 'Newtonian Mechanics',
    subtitle: 'Conservation laws, projectile motion, spring forces, and elastic collisions.',
    demos: [
      { title: 'Bouncing Ball Pit', description: 'Semi-implicit Euler gravity + ball–ball elastic collision. Click the canvas to spawn new balls.', useCase: 'physics engines, particle systems', component: <BouncingBalls /> },
      { title: 'Projectile Launcher', description: 'Ballistic arc with air drag. Adjust launch angle & power, then fire to trace multiple trajectories.', useCase: 'game ballistics, trajectory prediction', component: <ProjectileLauncherFixed /> },
      { title: 'Spring Pendulum', description: 'A bob on an elastic spring under gravity. Drag the bob and release to observe chaotic orbits.', useCase: 'structural engineering, oscillation modeling', component: <SpringPendulum /> },
      { title: "Newton's Cradle", description: '5 steel pendulums with equal-mass elastic collision (angular velocity exchange). Lift 1–3 balls.', useCase: 'momentum conservation, kinetic art', component: <NewtonsCradleWired /> },
    ],
  },
  {
    id: 'softbody', accent: '#a78bfa', number: '02',
    title: 'Soft Body & Fluid',
    subtitle: 'Verlet integration, constraint relaxation, wave propagation, and deformable meshes.',
    demos: [
      { title: 'Verlet Rope', description: 'Chain of 28 particles with distance-constraint relaxation (6 iterations/frame). Drag any node; toggle wind.', useCase: 'rope physics, cloth anchors, soft robots', component: <VerletRope /> },
      { title: 'Cloth Simulation', description: '22×14 verlet grid with structural + shear springs. Top row pinned. Cloth tears at 1.6× natural length.', useCase: 'fashion simulation, flag physics, cloth rendering', component: <ClothSim /> },
      { title: 'Fluid Ripple Wave', description: '2D discrete wave equation on a 100×70 height field. Click or drag to create splashes; tune wave speed.', useCase: 'water surfaces, sound visualization', component: <FluidRipple /> },
      { title: 'Soft Body Blob', description: '14 rim masses + central mass on springs. Deforms on wall impact; adjust stiffness live.', useCase: 'jelly physics, biological simulation, VFX', component: <SoftBlob /> },
    ],
  },
  {
    id: 'fields', accent: '#34d399', number: '03',
    title: 'Forces & Fields',
    subtitle: 'Gravitational fields, orbital mechanics, billiard collisions, and chaotic attractors.',
    demos: [
      { title: 'Gravity Wells', description: '3 massive bodies attract 60 test particles via F = G·M/r². Drag the wells to reshape the field.', useCase: 'N-body simulation, astrophysics, UI effects', component: <GravityWells /> },
      { title: 'Elastic Billiards', description: '7 balls in a circular arena with mass-weighted 2D elastic collision. Click to impulse the cue ball.', useCase: 'game physics, collision detection, pool simulators', component: <ElasticBilliards /> },
      { title: 'Double Pendulum', description: 'Lagrangian equations with sub-step RK4. Three pendulums with Δθ=0.01 rad diverge exponentially.', useCase: 'chaos theory, sensitivity analysis, research viz', component: <DoublePendulum /> },
      { title: 'Orbital Mechanics', description: 'Five planets in Keplerian orbits (v=√(GM/r)). Drag a planet to perturb its orbit.', useCase: 'space simulations, educational astronomy', component: <OrbitalMechanics /> },
    ],
  },
  {
    id: 'emergence', accent: '#fb923c', number: '04',
    title: 'Emergence & Automata',
    subtitle: 'Complex global behavior arising from simple local rules — flocking, automata, reaction chemistry.',
    demos: [
      { title: 'Boids Flocking', description: '70 agents with separation, alignment, and cohesion. A red predator pursues the flock — tune three rule weights live.', useCase: 'crowd simulation, swarm robotics', component: <Boids /> },
      { title: 'Falling Sand', description: 'Cellular automaton: sand slides diagonally, water flows laterally. Draw with mouse; switch materials; clear.', useCase: 'game mechanics, terrain erosion, artistic tools', component: <FallingSandWired /> },
      { title: 'Reaction Diffusion', description: 'Gray-Scott model — du/dt = D·∇²u − uv² + f(1−u). Patterns self-organize. Click to seed; switch presets.', useCase: 'texture generation, morphogenesis, bio-inspired design', component: <ReactionDiffusion /> },
      { title: "Langton's Ant", description: '4 ants each following a unique 4-color turning rule. Local steps yield global complexity.', useCase: 'AI visualization, cellular computation, generative art', component: <LangtonsAnt /> },
    ],
  },
] as const;

// ── Main page ─────────────────────────────────────────────────────────────────
const Physics: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-20">
      {/* Hero */}
      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.55,ease:'easeOut'}} className="space-y-5">
        <div className="flex items-center gap-2 text-xs" style={{color:'rgba(255,255,255,0.25)'}}>
          <span>Components</span><span>›</span><span>Animations</span><span>›</span>
          <span style={{color:'rgba(255,255,255,0.55)'}}>Physics</span>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3" style={{color:'rgba(255,255,255,0.92)'}}>Physics Simulations</h1>
          <p className="text-base max-w-2xl leading-relaxed" style={{color:'rgba(255,255,255,0.4)'}}>
            Sixteen real-time physics engines running entirely in-browser — no WebGL library, no physics SDK.
            Pure canvas + requestAnimationFrame with semi-implicit Euler, Verlet integration, Lagrangian mechanics, and cellular automata.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['canvas 2D','Verlet integration','Euler method','RK4','Lagrangian mechanics','Boids','Gray-Scott','cellular automata','N-body gravity','elastic collisions'].map(t=>(
            <HeroTag key={t} label={t} />
          ))}
        </div>
        <div className="flex flex-wrap gap-6 pt-2">
          {[{value:'16',label:'simulations'},{value:'4',label:'physics domains'},{value:'0',label:'physics libs used'},{value:'60',label:'fps target'}].map(s=>(
            <div key={s.label}>
              <div className="text-2xl font-black tabular-nums" style={{color:'rgba(255,255,255,0.85)'}}>{s.value}</div>
              <div className="text-[10px] mt-0.5 uppercase tracking-widest" style={{color:'rgba(255,255,255,0.25)'}}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sections */}
      {SECTIONS.map((sec)=>(
        <motion.section key={sec.id}
          initial={{opacity:0,y:32}} whileInView={{opacity:1,y:0}}
          viewport={{once:true,margin:'-80px'}} transition={{duration:0.5,delay:0.05,ease:'easeOut'}}>
          <SectionHeader number={sec.number} title={sec.title} subtitle={sec.subtitle} accent={sec.accent} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {sec.demos.map((demo,di)=>(
              <motion.div key={demo.title}
                initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}}
                viewport={{once:true,margin:'-40px'}} transition={{duration:0.4,delay:di*0.07,ease:'easeOut'}}>
                <ShowcaseCard title={demo.title} description={demo.description} useCase={demo.useCase}>
                  {demo.component}
                </ShowcaseCard>
              </motion.div>
            ))}
          </div>
        </motion.section>
      ))}
    </div>
  );
};

export default Physics;
