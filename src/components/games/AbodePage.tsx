import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  G, WARN, PALE, BG, SURF, BORD, FONTS, CSS, TITLE,
} from '@/data/abode/theme';
import { PERSONNEL } from '@/data/abode/characters';
import { SYSTEMS } from '@/data/abode/systems';
import { INCIDENTS } from '@/data/abode/incidents';
import { FieldNote, IntelCard, ManualEntry, MissionBrief } from './abode/ui';
import { OpMap } from './abode/OpMap';
import { EvidenceLocker } from './abode/EvidenceLocker';
import { SECTIONS } from '@/data/abode/sections';
import { useSectionObserver, StickyNav } from './abode/sections';
import { ASection } from './abode/ASection';
import { DossierCard } from './abode/DossierCard';
import { IncidentBlock } from './abode/IncidentBlock';
import { PersonnelComparison } from './abode/PersonnelComparison';
import { DualTimeline } from './abode/DualTimeline';
import { ArtDirective } from './abode/ArtDirective';
import { AudioDirective } from './abode/AudioDirective';
import { ResearchPanel } from './abode/ResearchPanel';
import heroImg from '@/assets/images/abode/HeroBg.png';

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
const AbodePage: React.FC = () => {
  const navigate = useNavigate();
  const activeSection = useSectionObserver();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 420], [1, 0]);

  return (
    <div className="ag ascan" style={{ background: BG, minHeight: '100vh', color: PALE }}>
      <style>{FONTS + CSS}</style>

      <StickyNav activeId={activeSection} />

      {/* ── HERO ── */}
      <div ref={heroRef} className="relative flex flex-col overflow-hidden" style={{ minHeight: '100vh' }}>

        {/* ── HERO BACKGROUND — image + readability overlays ── */}
        <div className="absolute inset-0 overflow-hidden">
          <img src={heroImg} alt="Accra under collapse — Abode" className="w-full h-full object-cover object-center"
            style={{ filter: 'saturate(0.85) contrast(1.05) brightness(0.82)' }} />

          {/* Top scrim — darkens strip area for the classification bar */}
          <div className="absolute inset-x-0 top-0" style={{ height: '38%', background: 'linear-gradient(to bottom, #0f0d0a 0%, #0f0d0a55 55%, transparent 100%)' }} />

          {/* Center scrim — ensures headline legibility over bright sky */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 62% 52% at 50% 48%, rgba(15,13,10,0.78) 0%, rgba(15,13,10,0.42) 45%, rgba(15,13,10,0.15) 70%, rgba(15,13,10,0.55) 100%)' }} />

          {/* Bottom scrim — blends hero into content background */}
          <div className="absolute inset-x-0 bottom-0" style={{ height: '42%', background: 'linear-gradient(to top, #0f0d0a 0%, #0f0d0a66 48%, transparent 100%)' }} />

          {/* Warm ambient tint */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 52% 52% at 50% 48%, ${WARN}12, transparent 65%)` }} />
        </div>

        {/* ── TOP CLASSIFICATION STRIP ── */}
        <div className="relative z-10 shrink-0"
          style={{ borderBottom: `1px solid ${WARN}20`, background: `${WARN}08` }}>
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => navigate('/games')}
              className="flex items-center gap-2"
              style={{ color: WARN, opacity: 0.42 }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.42')}>
              <ArrowLeft size={10} />
              <span className="am" style={{ fontSize: '0.58rem', letterSpacing: '0.3em' }}>RETURN TO GAME INDEX</span>
            </motion.button>
            <div className="flex items-center gap-3 md:gap-6">
              <div className="am hidden md:block" style={{ color: WARN, fontSize: '0.52rem', letterSpacing: '0.35em', opacity: 0.38 }}>
                TOP SECRET // SCI // NOFORN · REF: GH-ZB-MENSAH-02
              </div>
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => navigate('/games/abode/dev-tracker')}
                style={{ color: G, opacity: 0.42 }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.42')}>
                <span className="am" style={{ fontSize: '0.58rem', letterSpacing: '0.3em' }}>OPEN PRODUCTION TRACKER</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── HERO CONTENT — centered dossier cover ── */}
        <motion.div style={{ opacity: heroOpacity }}
          className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.42 }} transition={{ delay: 0.1 }}
            className="am mb-5" style={{ color: WARN, fontSize: '0.62rem', letterSpacing: '0.48em' }}>
            {TITLE.operation}
          </motion.div>

          <motion.h1 className="at afl"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.2 }}
            style={{ fontSize: 'clamp(3.5rem, 13vw, 7rem)', color: PALE, letterSpacing: '0.12em', lineHeight: 1, marginBottom: '0.35rem' }}>
            {TITLE.name}
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.52 }} transition={{ delay: 0.38 }}
            className="am mb-8" style={{ color: G, fontSize: '0.68rem', letterSpacing: '0.45em' }}>
            [ {TITLE.translation} ]
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.52, duration: 0.55, ease: 'easeOut' }}
            style={{ width: 88, height: 1, background: `${WARN}45`, marginBottom: '2rem', transformOrigin: 'center' }} />

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.72 }} transition={{ delay: 0.58, duration: 0.55 }}
            className="ab italic leading-loose max-w-lg mb-10"
            style={{ color: PALE, fontSize: '1.05rem' }}>
            The dead walk through Accra's streets. Colonel Kwame Mensah has survived wars he chose.
            This one chose him — and his children are somewhere in it.
          </motion.p>

          {/* Document metadata grid */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }}
            className="w-full max-w-md mb-10" style={{ border: `1px solid ${BORD}`, background: `${SURF}90` }}>
            <div className="grid grid-cols-3">
              {[
                { label: 'SUBJECT',  value: 'COL. K. MENSAH'  },
                { label: 'SETTING',  value: 'GHANA'            },
                { label: 'STATUS',   value: 'DESIGN PHASE'     },
              ].map((item, i) => (
                <div key={i} className="px-3 py-2.5"
                  style={{ borderRight: i < 2 ? `1px solid ${BORD}` : 'none' }}>
                  <div className="am" style={{ color: G, fontSize: '0.46rem', letterSpacing: '0.25em', opacity: 0.42, marginBottom: '3px' }}>{item.label}</div>
                  <div className="at" style={{ color: PALE, fontSize: '0.68rem', letterSpacing: '0.05em', opacity: 0.85 }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2" style={{ borderTop: `1px solid ${BORD}`, background: `${BG}60` }}>
              <span className="am" style={{ color: PALE, fontSize: '0.46rem', letterSpacing: '0.18em', opacity: 0.2 }}>
                SURVIVAL NARRATIVE · NEAR-FUTURE GHANA · OUTBREAK / SEPARATION / RECOVERY
              </span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} transition={{ delay: 1.0 }}
            className="am flex items-center gap-2" style={{ color: G, fontSize: '0.6rem', letterSpacing: '0.38em' }}>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>|</motion.span>
            SCROLL TO READ FIELD REPORT
          </motion.div>
        </motion.div>

        {/* ── BOTTOM CLASSIFICATION STRIP ── */}
        <div className="relative z-10 shrink-0" style={{ borderTop: `1px solid ${BORD}28` }}>
          <div className="max-w-5xl mx-auto px-6 py-2 flex items-center justify-between">
            <span className="am" style={{ color: WARN, fontSize: '0.48rem', letterSpacing: '0.3em', opacity: 0.28 }}>
              HANDLE VIA SI CHANNELS ONLY
            </span>
            <span className="am" style={{ color: PALE, fontSize: '0.48rem', letterSpacing: '0.2em', opacity: 0.16 }}>
              DRAFT {TITLE.draft} · ALL {SECTIONS.length} SECTIONS
            </span>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-4xl xl:max-w-5xl mx-auto px-6 py-12 xl:pl-28">

        <ASection id="overview" label="01 — Intelligence Overview" stamp="VERIFIED">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { category: 'Classification', content: '2D Side-Scrolling Survival / Narrative Action — flat level design with resource management and scavenging loops.' },
              { category: 'Operational Tone', content: "Grim, grounded, and emotionally tethered. The Last of Us pacing inside Earth Taken's aesthetic — but set in Ghana." },
              { category: 'Influence Sources', content: "Earth Taken (art style, atmosphere), The Last Stand (level structure, resource loops), This War of Mine (civilian weight, moral decisions)." },
              { category: 'Visual Profile', content: "Muted earth tones: rust, clay, grey concrete. Recognizably Ghanaian architecture — kiosks, compounds, red laterite roads, market streets gone silent." },
            ].map(item => <IntelCard key={item.category} category={item.category} content={item.content} />)}
          </div>
        </ASection>

        <ASection id="situation" label="02 — Situation Report" stamp="SENSITIVE">
          <FieldNote>A near-future Ghana. The outbreak began in the north and spread south within weeks, overwhelming NADMO and the Ghana Armed Forces. By the time Accra fell, communications were down. The government broadcast a single evacuation order — <span style={{ color: WARN, fontFamily: "'Special Elite', cursive" }}>D-Day</span> — and the country tried to move.</FieldNote>
          <FieldNote>The game's world cycles through recognizable Ghanaian locations: Osu neighborhoods with collapsed bars and chop shops. Tema Industrial Area with warehouses. The Cape Coast highway strewn with abandoned vehicles. Kumasi's market district. Each zone feels culturally specific — not a generic grey city.</FieldNote>
          <FieldNote>The story is not about the outbreak. It's about a father who spent his career protecting strangers, now having to navigate a collapsed world to protect the two people who actually matter.</FieldNote>
          <MissionBrief label="Thematic Core" text="What does a soldier become when there's no mission — only family? Kwame's entire skill set was built for other people's wars. This one is personal, and that changes everything." />
        </ASection>

        <ASection id="personnel" label="03 — Personnel Files" stamp="RESTRICTED">
          {PERSONNEL.map(p => (
            <DossierCard key={p.id} id={p.id} name={p.name} role={p.role} status={p.status}
              description={p.description} details={p.details} />
          ))}
        </ASection>

        <ASection id="systems" label="04 — Systems Manual" stamp="OPERATIONAL">
          {SYSTEMS.map(s => (
            <ManualEntry key={s.id} number={s.number} title={s.title} body={s.body} />
          ))}
        </ASection>

        <ASection id="incidents" label="05 — Incident Log" stamp="CHRONOLOGICAL">
          {INCIDENTS.map(inc => (
            <IncidentBlock key={inc.phase} phase={inc.phase} title={inc.title} location={inc.location} body={inc.body} />
          ))}
        </ASection>

        <ASection id="opmap" label="06 — Operational Map" stamp="FIELD ANNOTATED">
          <OpMap />
        </ASection>

        <ASection id="comparison" label="07 — Personnel Comparison" stamp="ASSESSMENT">
          <div className="am mb-4" style={{ color: PALE, fontSize: '0.65rem', opacity: 0.4, letterSpacing: '0.2em' }}>
            SELECT PERSONNEL FILE TO VIEW CAPABILITY ASSESSMENT →
          </div>
          <PersonnelComparison />
        </ASection>

        <ASection id="timeline" label="08 — Event Timeline" stamp="DUAL TRACK">
          <div className="ab italic mb-4"
            style={{ color: PALE, opacity: 0.55, fontSize: '0.95rem', borderLeft: `2px solid ${WARN}30`, paddingLeft: '1rem' }}>
            Two tracks: what Kwame experienced, and what Ama experienced while he was searching. The gap between the tracks — everything she did that he didn't see — is the emotional engine of Act II. Select a beat to expand.
          </div>
          <DualTimeline />
        </ASection>

        <ASection id="art" label="09 — Visual Directive" stamp="ART BRIEF">
          <ArtDirective />
        </ASection>

        <ASection id="audio" label="10 — Audio Directive" stamp="SOUND BRIEF">
          <AudioDirective />
        </ASection>

        <ASection id="research" label="11 — Research & Cultural Notes" stamp="REFERENCE">
          <MissionBrief label="Accuracy Commitment" text="This game is set in Ghana, made about Ghanaian people, and will be played by Ghanaian players. Every cultural detail — language, architecture, social dynamics, spiritual belief — must be treated with the same rigor as the gameplay systems. Cultural accuracy is not a polish step. It is foundational." />
          <ResearchPanel />
        </ASection>

        <ASection id="locker" label="12 — Evidence Locker" stamp="ASSET REGISTRY">
          <EvidenceLocker />
        </ASection>

      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: `1px dashed ${BORD}`, padding: '1.5rem', textAlign: 'center' }}>
        <div className="am" style={{ color: PALE, fontSize: '0.65rem', opacity: 0.25, letterSpacing: '0.3em' }}>
          {TITLE.romanised} · DESIGN BIBLE · DRAFT {TITLE.draft} · ALL {SECTIONS.length} SECTIONS COMPLETE
        </div>
      </div>
    </div>
  );
};

export default AbodePage;
