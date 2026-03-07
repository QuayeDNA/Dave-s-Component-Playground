import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MousePointerClick, Type, CreditCard, Bell,
  Layers, Box, Cpu, StickyNote, Map,
  Play, Waves, MoreHorizontal,
  ArrowRight, Sparkles, Gamepad2, Sword, Globe, Palette,
} from 'lucide-react';

// ── Animation helpers ─────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};
const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

// ── Data ─────────────────────────────────────────────────

interface FeatureItem {
  label: string;
  description: string;
  path: string;
  Icon: React.ElementType;
  tag?: string;
}

interface Section {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  bg: string;
  borderColor: string;
  items: FeatureItem[];
}

const SECTIONS: Section[] = [
  {
    id: 'components',
    title: 'UI Components',
    subtitle: 'Hand-crafted primitives — the building blocks of every interface.',
    accent: '#7eb8e8',
    bg: 'rgba(78,143,200,0.06)',
    borderColor: 'rgba(78,143,200,0.15)',
    items: [
      { label: 'Buttons', description: 'Variants, states, icon combos, loading & destructive patterns.', path: '/components/buttons', Icon: MousePointerClick, tag: 'Interactive' },
      { label: 'Forms', description: 'Input groups, validation flows, labels and error messaging.', path: '/components/forms', Icon: Type, tag: 'Data entry' },
      { label: 'Cards', description: 'Content containers — media, stats, actions and stacked layouts.', path: '/components/cards', Icon: CreditCard, tag: 'Layout' },
      { label: 'Notifications', description: 'Toasts, alerts, banners and inline status messages.', path: '/components/notification', Icon: Bell, tag: 'Feedback' },
    ],
  },
  {
    id: 'animations',
    title: 'Animations',
    subtitle: 'Motion design demos — from CSS keyframes to physics simulations.',
    accent: '#a78bfa',
    bg: 'rgba(139,92,246,0.06)',
    borderColor: 'rgba(139,92,246,0.15)',
    items: [
      { label: '2D Animations', description: 'CSS transitions, keyframe loops and Framer Motion basics.', path: '/animations/2d', Icon: Layers, tag: 'CSS · Framer' },
      { label: '3D Animations', description: 'Perspective transforms and depth illusions in the browser.', path: '/animations/3d', Icon: Box, tag: 'CSS 3D' },
      { label: 'Physics', description: 'Spring dynamics, gravity, collision and momentum reactions.', path: '/animations/physics', Icon: Waves, tag: 'Spring' },
      { label: 'Tween', description: 'Easing curves, timeline choreography and sequenced playback.', path: '/animations/tween', Icon: Play, tag: 'Timeline' },
    ],
  },
  {
    id: '3d',
    title: '3D Interactive',
    subtitle: 'WebGL scenes running directly in the browser — no plugins needed.',
    accent: '#34d399',
    bg: 'rgba(52,211,153,0.06)',
    borderColor: 'rgba(52,211,153,0.15)',
    items: [
      { label: 'Basics', description: 'Three.js fundamentals — geometries, lighting, cameras & materials.', path: '/3d-interactive', Icon: Box, tag: 'Three.js' },
      { label: 'Torus', description: 'Animated torus mesh with real-time shader colour controls.', path: '/3d-interactive/torus', Icon: MoreHorizontal, tag: 'Shader' },
    ],
  },
  {
    id: 'systems',
    title: 'Systems & Apps',
    subtitle: 'Full-featured experiments that go beyond individual components.',
    accent: '#fb923c',
    bg: 'rgba(251,146,60,0.06)',
    borderColor: 'rgba(251,146,60,0.15)',
    items: [
      { label: 'Zone Management', description: 'Drag-and-draw zone planning tool with Leaflet maps and live state.', path: '/zones', Icon: Map, tag: 'State' },
      { label: 'Sticky Notes', description: 'Filterable task board with categories, priorities and search.', path: '/sticky-notes', Icon: StickyNote, tag: 'Canvas' },
      { label: 'GPT Model Redesign', description: 'A visual redesign concept for the ChatGPT model selector UI.', path: '/model-redesign', Icon: Cpu, tag: 'UI concept' },
    ],
  },
  {
    id: 'games',
    title: 'Three Worlds',
    subtitle: 'Game design documents and interactive UI showcases for three original game concepts.',
    accent: '#c9962b',
    bg: 'rgba(201,150,43,0.06)',
    borderColor: 'rgba(201,150,43,0.15)',
    items: [
      { label: 'Irregular', description: 'Sci-fi metroidvania — shapeshifting protagonist, geometric world, AI companions.', path: '/games/irregular', Icon: Sword, tag: 'Sci-Fi' },
      { label: 'Abɔde', description: 'Survival strategy set in Ghana — family bonds, resource scarcity, dossier aesthetic.', path: '/games/abode', Icon: Globe, tag: 'Survival' },
      { label: 'Gold & Iron', description: 'Historical epic across the Gold Coast — illuminated chronicle presentation.', path: '/games/gold-and-iron', Icon: Gamepad2, tag: 'Historical' },
      { label: 'UI Showcase', description: '9 interactive game UI elements rendered in 6 distinct style directions.', path: '/games/ui', Icon: Palette, tag: '6 Styles' },
    ],
  },
];

// ── Sub-components ────────────────────────────────────────

const Tag: React.FC<{ label: string; accent: string }> = ({ label, accent }) => (
  <span
    className="inline-block text-[9px] font-semibold tracking-[0.14em] uppercase px-2 py-0.5 rounded-full"
    style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}
  >
    {label}
  </span>
);

const FeatureCard: React.FC<{ item: FeatureItem; accent: string; onClick: () => void }> = ({ item, accent, onClick }) => (
  <motion.button
    variants={itemVariants}
    whileHover={{ y: -2, transition: { duration: 0.2 } }}
    onClick={onClick}
    className="group text-left w-full rounded-xl p-5 transition-colors"
    style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${accent}35`; }}
    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
  >
    <div className="flex items-start justify-between mb-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${accent}14`, border: `1px solid ${accent}28` }}
      >
        <item.Icon size={14} style={{ color: accent }} />
      </div>
      {item.tag && <Tag label={item.tag} accent={accent} />}
    </div>
    <div className="font-semibold text-sm mb-1.5 group-hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.82)' }}>
      {item.label}
    </div>
    <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.32)' }}>
      {item.description}
    </p>
    <div
      className="mt-3 flex items-center gap-1 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
      style={{ color: accent }}
    >
      Open <ArrowRight size={10} />
    </div>
  </motion.button>
);

const SectionBlock: React.FC<{ section: Section; navigate: (path: string) => void }> = ({ section, navigate }) => (
  <motion.div
    variants={sectionVariants}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: '-60px' }}
  >
    {/* Section header */}
    <div className="flex items-start gap-4 mb-6">
      <div
        className="w-1 self-stretch rounded-full shrink-0"
        style={{ background: `linear-gradient(180deg, ${section.accent}, transparent)`, minHeight: 48 }}
      />
      <div>
        <h2 className="text-lg font-bold mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>
          {section.title}
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {section.subtitle}
        </p>
      </div>
    </div>

    {/* Cards grid */}
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
    >
      {section.items.map((item) => (
        <FeatureCard
          key={item.path}
          item={item}
          accent={section.accent}
          onClick={() => navigate(item.path)}
        />
      ))}
    </motion.div>
  </motion.div>
);

// ── Page ─────────────────────────────────────────────────

const Overview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen"
      style={{ background: '#06080f', color: '#e4eaf0' }}
    >
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 20% 0%, rgba(77,143,200,0.12) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-12 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={12} style={{ color: '#4d8fc8' }} />
              <span
                className="text-[10px] tracking-[0.28em] uppercase font-semibold"
                style={{ color: 'rgba(77,143,200,0.7)', fontFamily: 'monospace' }}
              >
                Component Playground
              </span>
            </div>
            <h1
              className="mb-4 leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}
            >
              Everything in one place
            </h1>
            <p className="text-base leading-relaxed max-w-xl" style={{ color: 'rgba(255,255,255,0.38)' }}>
              Browse every experiment, component, and system in this playground.&nbsp;
              Click any card to jump straight into it.
            </p>
          </motion.div>

          {/* Stat pills */}
          <motion.div
            className="flex flex-wrap gap-3 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.45 }}
          >
            {[
              { label: 'UI Components', count: 4, color: '#7eb8e8' },
              { label: 'Animation demos', count: 4, color: '#a78bfa' },
              { label: '3D experiments', count: 2, color: '#34d399' },
              { label: 'Systems', count: 3, color: '#fb923c' },
              { label: 'Game Worlds', count: 4, color: '#c9962b' },
            ].map(({ label, count, color }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium"
                style={{ background: `${color}10`, border: `1px solid ${color}22`, color: 'rgba(255,255,255,0.5)' }}
              >
                <span className="font-bold" style={{ color }}>{count}</span>
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 space-y-14">
        {SECTIONS.map((section) => (
          <SectionBlock key={section.id} section={section} navigate={navigate} />
        ))}
      </div>

      {/* Footer nudge */}
      <div
        className="max-w-5xl mx-auto px-5 sm:px-8 pb-12"
      >
        <div
          className="rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: 'rgba(77,143,200,0.06)', border: '1px solid rgba(77,143,200,0.12)' }}
        >
          <div>
            <p className="font-semibold text-sm mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Also building three original games
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>
              Irregular, Abɔde, and Gold &amp; Iron — design docs, world-building and UI concepts.
            </p>
          </div>
          <motion.button
            whileHover={{ x: 4 }}
            onClick={() => navigate('/games')}
            className="flex items-center gap-2 text-sm font-semibold shrink-0"
            style={{ color: '#c99142' }}
          >
            Explore Three Worlds <ArrowRight size={13} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Overview;