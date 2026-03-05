import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// ABƆDE — VISUAL IDENTITY
//
// This page is NOT a color-swap of Irregular. It has its own
// complete design language:
//
// AESTHETIC: Survival field report / classified military dossier.
// Feels like documents recovered from a collapsed world.
// Distressed, redacted, hand-annotated, urgent.
//
// TYPOGRAPHY:
//   - Headers: "Special Elite" — typewriter, worn, imperfect
//   - Body: "Source Serif 4" — legible but heavy, newspaper feel
//   - Labels/mono: "VT323" — dot-matrix terminal readout
//
// LAYOUT: Everything is off-axis. Sections feel like they were
// stamped, torn, and taped together. Borders are uneven.
// Some content is "redacted" (blacked-out bars). Margins
// are tight and claustrophobic — the world is closing in.
//
// TEXTURE: Subtle noise grain overlay on the entire page.
// Section dividers are hand-drawn dashes (border-dashed),
// not clean lines.
//
// COLORS:
//   --bg:        #0f0d0a   (near-black with warm undertone)
//   --surface:   #1a1610   (dark warm brown)
//   --border:    #3d3020   (aged wood/leather)
//   --accent:    #7ec87e   (survival green — radio, night vision)
//   --warn:      #c8522a   (blood orange — danger, warning)
//   --pale:      #c8b89a   (aged paper — body text)
//   --stamp:     #8b3a1a   (red stamp ink)
//   --redact:    #1a1610   (redaction black)
//
// MOTION: Minimal. Things don't animate in gracefully —
// they flicker on, like a failing screen. Hover states
// feel like static. Nothing is smooth.
//
// SECTIONS: Each section header looks like a stamped label
// on a manila folder tab. Section content feels like
// typed field notes, not designed layouts.
// ─────────────────────────────────────────────────────────────

const G = '#7ec87e';    // survival green
const WARN = '#c8522a'; // blood orange
const PALE = '#c8b89a'; // aged paper
const BG = '#0f0d0a';
const SURFACE = '#1a1610';
const BORDER = '#3d3020';

// ── FONT IMPORT ──────────────────────────────────────────────
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300;1,400&family=VT323&display=swap');
`;

// ── GRAIN TEXTURE (CSS only) ─────────────────────────────────
const GRAIN_CSS = `
  .abode-grain::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 100;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }
  .abode-section-label {
    font-family: 'VT323', monospace;
    font-size: 0.85rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: ${G};
    opacity: 0.7;
  }
  .abode-title {
    font-family: 'Special Elite', cursive;
  }
  .abode-body {
    font-family: 'Source Serif 4', Georgia, serif;
  }
  .abode-mono {
    font-family: 'VT323', monospace;
  }
  .abode-redact {
    background: #1a1610;
    color: transparent;
    user-select: none;
    display: inline;
    border-radius: 1px;
  }
  .abode-stamp {
    font-family: 'Special Elite', cursive;
    color: #8b3a1a;
    border: 3px solid #8b3a1a;
    opacity: 0.6;
    transform: rotate(-4deg);
    display: inline-block;
    padding: 0.2rem 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-size: 0.75rem;
    pointer-events: none;
    user-select: none;
  }
  @keyframes flicker {
    0%, 100% { opacity: 1; }
    92% { opacity: 1; }
    93% { opacity: 0.4; }
    94% { opacity: 1; }
    96% { opacity: 0.6; }
    97% { opacity: 1; }
  }
  .abode-flicker { animation: flicker 8s infinite; }
`;

// ── SHARED SECTION WRAPPER ────────────────────────────────────
// Identity: Looks like a manila folder section divider.
// Dashed top border, stamped label, typed content below.
const ASection: React.FC<{ label: string; stamp?: string; children: React.ReactNode }> = ({ label, stamp, children }) => (
  <motion.div
    className="mb-16"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.4 }}
  >
    <div className="flex items-center gap-4 mb-6" style={{ borderTop: `1px dashed ${BORDER}`, paddingTop: '1.5rem' }}>
      <span className="abode-section-label">{label}</span>
      {stamp && (
        <span className="abode-stamp ml-auto">{stamp}</span>
      )}
    </div>
    {children}
  </motion.div>
);

// ── FIELD NOTE BLOCK ──────────────────────────────────────────
// Looks like handwritten field notes — slightly indented,
// typewriter font, line-height that feels typed not designed.
const FieldNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="abode-body leading-loose mb-4"
    style={{ color: PALE, opacity: 0.82, fontSize: '1.05rem', lineHeight: 1.9 }}
  >
    {children}
  </div>
);

// ── DOSSIER CARD ──────────────────────────────────────────────
// Character entries look like personnel files.
// Corner-clipped, with a STATUS stamp, typed ID line.
const DossierCard: React.FC<{
  id: string; name: string; role: string; status: string;
  description: string; details: string[];
}> = ({ id, name, role, status, description, details }) => (
  <motion.div
    className="mb-4 relative"
    initial={{ opacity: 0, x: -8 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.35 }}
    style={{
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      borderLeft: `3px solid ${G}`,
      padding: '1.5rem',
    }}
  >
    {/* Top row */}
    <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
      <div>
        <div className="abode-mono" style={{ color: G, fontSize: '0.75rem', opacity: 0.5, letterSpacing: '0.3em' }}>
          ID-{id} · {role.toUpperCase()}
        </div>
        <h3 className="abode-title leading-none mt-1" style={{ color: PALE, fontSize: '1.6rem', letterSpacing: '0.02em' }}>
          {name}
        </h3>
      </div>
      <span className="abode-stamp" style={{ fontSize: '0.65rem' }}>{status}</span>
    </div>

    <p className="abode-body mb-4 leading-relaxed" style={{ color: PALE, opacity: 0.78, fontSize: '1rem' }}>
      {description}
    </p>

    {details.length > 0 && (
      <div style={{ borderTop: `1px dashed ${BORDER}`, paddingTop: '0.75rem' }}>
        {details.map((d, i) => (
          <div key={i} className="flex gap-3 mb-1">
            <span className="abode-mono" style={{ color: G, opacity: 0.45, fontSize: '0.8rem' }}>{'>'}</span>
            <span className="abode-body" style={{ color: PALE, opacity: 0.65, fontSize: '0.9rem' }}>{d}</span>
          </div>
        ))}
      </div>
    )}
  </motion.div>
);

// ── MECHANIC ENTRY ────────────────────────────────────────────
// Looks like a systems manual entry. Numbered, clinical,
// like a field survival guide written under pressure.
const ManualEntry: React.FC<{ number: string; title: string; body: string }> = ({ number, title, body }) => (
  <motion.div
    className="mb-5 flex gap-4"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.35 }}
  >
    <div className="abode-mono flex-shrink-0" style={{ color: G, fontSize: '1.1rem', opacity: 0.35, width: 36, textAlign: 'right' }}>
      {number}
    </div>
    <div>
      <div className="abode-title mb-1" style={{ color: G, fontSize: '1rem', letterSpacing: '0.05em' }}>{title}</div>
      <div className="abode-body leading-relaxed" style={{ color: PALE, opacity: 0.72, fontSize: '1rem' }}>{body}</div>
    </div>
  </motion.div>
);

// ── ACT BLOCK ─────────────────────────────────────────────────
// Looks like an incident report. Timestamped, clinical,
// bordered with a danger stripe on the left.
const IncidentBlock: React.FC<{ phase: string; title: string; location: string; body: string }> = ({ phase, title, location, body }) => (
  <motion.div
    className="mb-4"
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.35 }}
    style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderLeft: `4px solid ${WARN}`, padding: '1.25rem 1.5rem' }}
  >
    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
      <div className="abode-mono" style={{ color: WARN, fontSize: '0.85rem', letterSpacing: '0.25em', opacity: 0.8 }}>
        PHASE {phase}
      </div>
      <div className="abode-mono" style={{ color: PALE, fontSize: '0.75rem', opacity: 0.35, letterSpacing: '0.2em' }}>
        LOCATION: {location.toUpperCase()}
      </div>
    </div>
    <h4 className="abode-title mb-2" style={{ color: PALE, fontSize: '1.3rem', letterSpacing: '0.03em' }}>{title}</h4>
    <p className="abode-body leading-relaxed" style={{ color: PALE, opacity: 0.72, fontSize: '1rem' }}>{body}</p>
  </motion.div>
);

// ── INTEL PANEL ───────────────────────────────────────────────
// Overview grid cells look like classified intel cards —
// stamped with a category, content typed below.
const IntelCard: React.FC<{ category: string; content: string }> = ({ category, content }) => (
  <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, padding: '1.25rem' }}>
    <div className="abode-mono mb-2" style={{ color: G, fontSize: '0.75rem', letterSpacing: '0.25em', opacity: 0.55 }}>
      [{category.toUpperCase()}]
    </div>
    <div className="abode-body leading-relaxed" style={{ color: PALE, opacity: 0.78, fontSize: '0.95rem' }}>{content}</div>
  </div>
);

// ── CALLOUT / MISSION BRIEF ───────────────────────────────────
const MissionBrief: React.FC<{ label: string; text: string }> = ({ label, text }) => (
  <div
    className="my-8 p-5 relative"
    style={{ background: `${WARN}0a`, border: `1px solid ${WARN}30`, borderLeft: `3px solid ${WARN}` }}
  >
    <div className="abode-mono mb-2" style={{ color: WARN, fontSize: '0.8rem', letterSpacing: '0.3em', opacity: 0.7 }}>
      !! {label.toUpperCase()} !!
    </div>
    <p className="abode-body italic leading-relaxed" style={{ color: PALE, opacity: 0.82, fontSize: '1.05rem' }}>{text}</p>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
const AbodePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="abode-grain" style={{ background: BG, minHeight: '100vh', color: PALE }}>
      <style>{FONTS + GRAIN_CSS}</style>

      {/* ── BACK NAV ── */}
      {/* Styled as a radio transmission / comms header */}
      <div style={{ borderBottom: `1px dashed ${BORDER}`, padding: '1rem 1.5rem' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => navigate('/games')}
            className="flex items-center gap-2 abode-flicker"
            style={{ color: G, opacity: 0.5 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
          >
            <ArrowLeft size={12} />
            <span className="abode-mono" style={{ fontSize: '0.8rem', letterSpacing: '0.3em' }}>
              ← BACK / GAME INDEX
            </span>
          </motion.button>
          <div className="abode-mono" style={{ color: G, fontSize: '0.75rem', opacity: 0.3, letterSpacing: '0.25em' }}>
            FILE: ABODE_DESIGN_BIBLE_v0.1
          </div>
        </div>
      </div>

      {/* ── HERO / COVER PAGE ── */}
      {/*
        Identity: This looks like a recovered military document cover sheet.
        NOT a designed hero section. The title is typewriter-stamped.
        There's a "CLASSIFIED" stamp. The hook is indented like a brief.
        The background has a very subtle laterite-red radial glow —
        like firelight, not a gradient.
      */}
      <div
        className="relative px-6 pt-12 pb-16 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 20% 100%, ${WARN}08, transparent 60%), ${BG}`,
        }}
      >
        {/* Giant faded number — typewriter style */}
        <div
          className="absolute right-0 top-0 abode-title select-none pointer-events-none leading-none"
          style={{ fontSize: 'clamp(10rem, 30vw, 24rem)', color: `${G}04`, right: '-0.05em', top: '-0.05em' }}
        >
          02
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

            {/* Document header bar */}
            <div
              className="flex items-center gap-4 mb-8 flex-wrap"
              style={{ borderBottom: `1px solid ${BORDER}`, paddingBottom: '1rem' }}
            >
              <div className="abode-mono" style={{ color: G, fontSize: '0.75rem', opacity: 0.45, letterSpacing: '0.3em' }}>
                GENRE: SURVIVAL · ACTION · NARRATIVE
              </div>
              <div className="abode-stamp ml-auto">DRAFT</div>
            </div>

            {/* Title — typewriter, not designed */}
            <div className="mb-2" style={{ lineHeight: 1 }}>
              <h1 className="abode-title" style={{ fontSize: 'clamp(4rem, 14vw, 10rem)', color: G, letterSpacing: '0.01em', lineHeight: 0.9 }}>
                Abɔde
              </h1>
            </div>

            <div className="abode-mono mb-6" style={{ color: PALE, fontSize: '0.85rem', opacity: 0.4, letterSpacing: '0.3em' }}>
              [ TWARA: HOMELAND ] · GAME 02 OF 03
            </div>

            {/* Hook — indented like a mission brief */}
            <div
              className="abode-body italic leading-loose max-w-2xl"
              style={{
                color: PALE,
                fontSize: '1.15rem',
                opacity: 0.8,
                borderLeft: `2px solid ${WARN}`,
                paddingLeft: '1.5rem',
              }}
            >
              The dead walk through Accra's streets. Colonel Kwame Mensah has survived wars he chose.
              This one chose him — and his children are somewhere in it.
            </div>

            {/* Redacted-style subheading */}
            <div className="mt-6 abode-mono" style={{ color: PALE, fontSize: '0.75rem', opacity: 0.3, letterSpacing: '0.2em' }}>
              SETTING: NEAR-FUTURE GHANA · INCIDENT TYPE: OUTBREAK / SEPARATION / RECOVERY
            </div>

          </motion.div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* ── 1. OVERVIEW ── */}
        <ASection label="01 — Intelligence Overview" stamp="VERIFIED">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { category: 'Classification', content: '2D Side-Scrolling Survival / Narrative Action — flat level design with resource management and scavenging loops.' },
              { category: 'Operational Tone', content: "Grim, grounded, and emotionally tethered. Think The Last of Us pacing inside Earth Taken's aesthetic — but set in Ghana." },
              { category: 'Influence Sources', content: "Earth Taken (art style, atmosphere), The Last Stand (level structure, resource loops), This War of Mine (civilian weight, moral decisions)." },
              { category: 'Visual Profile', content: "Muted earth tones: rust, clay, grey concrete. Recognizably Ghanaian architecture — kiosks, compounds, red laterite roads, market streets gone silent." },
            ].map(item => <IntelCard key={item.category} category={item.category} content={item.content} />)}
          </div>
        </ASection>

        {/* ── 2. NARRATIVE ── */}
        <ASection label="02 — Situation Report" stamp="SENSITIVE">
          <FieldNote>
            A near-future Ghana. The outbreak began in the north and spread south within weeks, overwhelming NADMO and
            the Ghana Armed Forces. By the time Accra fell, communications were down. The government broadcast a single
            evacuation order — <span style={{ color: WARN, fontFamily: "'Special Elite', cursive" }}>D-Day</span> — and
            the country tried to move.
          </FieldNote>
          <FieldNote>
            The game's world cycles through recognizable Ghanaian locations: Osu neighborhoods with collapsed bars and
            chop shops. Tema Industrial Area with warehouses. The Cape Coast highway strewn with abandoned vehicles.
            Kumasi's market district. Each zone feels culturally specific — not a generic grey city.
          </FieldNote>
          <FieldNote>
            The story is not about the outbreak. It's about a father who spent his career protecting strangers, now
            having to navigate a collapsed world to protect the two people who actually matter.
          </FieldNote>

          <MissionBrief
            label="Thematic Core"
            text="What does a soldier become when there's no mission — only family? Kwame's entire skill set was built for other people's wars. This one is personal, and that changes everything."
          />
        </ASection>

        {/* ── 3. PERSONNEL FILES ── */}
        <ASection label="03 — Personnel Files" stamp="RESTRICTED">

          <DossierCard
            id="KM-001"
            name="COL. KWAME MENSAH (RET.)"
            role="Protagonist"
            status="Active"
            description="62 years old. Served in ECOMOG, UN peacekeeping in DRC, and two domestic crises. Retired to Tema with his two children after their mother died. On D-Day, separated from them at a checkpoint collapse. He is not a superhero — he moves deliberately, tires realistically, and every fight costs him. But he knows how to survive, how to read terrain, and how to keep his head while everything falls apart."
            details={[
              'Age is a mechanic — experienced but not tireless',
              'Military training: infantry, close-quarters, field medicine',
              'Weakness: emotional tunnel vision when children are at risk',
            ]}
          />

          <DossierCard
            id="AM-002"
            name="AMA MENSAH"
            role="Kwame's Eldest Daughter — Missing"
            status="Located / Act II"
            description="17 years old. Found in Act II — she's been surviving on her own for weeks and has become capable and hardened in ways that surprise her father. Their reunion is not a rescue. Ama doesn't need saving. She needs her father to acknowledge who she's become."
            details={[
              'Knows things about the outbreak and human factions that Kwame doesn\'t',
              'Dynamic shifts as game progresses — she becomes more of a partner than a dependent',
              'Her survival methods may have crossed moral lines Kwame struggles with',
            ]}
          />

          <DossierCard
            id="KM-003"
            name="KOFI MENSAH"
            role="Kwame's Son — Missing"
            status="Unlocated"
            description="12 years old. Location unknown at game start. Kofi's trail is the spine of the third act — and when he's found, the circumstances of his survival will reframe everything the player thought they knew about what's happening in the north."
            details={[
              'Emotional anchor of the entire story',
              'His survival method is the game\'s central Act III revelation',
            ]}
          />

          <DossierCard
            id="TBD-004"
            name="THE ANTAGONIST [NAME PENDING]"
            role="Former Military Colleague — Faction Leader"
            status="Hostile"
            description="A former colleague of Kwame's who chose power over people when the outbreak hit. He controls a military splinter group using the chaos to consolidate territory. The children were not taken by accident. The final confrontation is personal — two men who once served the same mission, now representing opposite choices in a collapsed world."
            details={[
              'TODO: Name and specific rank to be decided',
              'TODO: What unit they served together in — creates backstory hooks',
              'TODO: Decide if he genuinely believes he\'s doing the right thing',
            ]}
          />

          {/*
            TODO: Survivor NPCs — recurring characters across zones who can be helped or abandoned.
            Think: a nurse in Osu, a market trader in Kumasi, a teenager with a radio in Tema.
            Each should feel specific to their location and culture.

            TODO: Faction breakdown — the different human groups:
              - Military splinter (antagonist's group)
              - Civilian convoy (neutral, resource competition)
              - Cult survivors (hostile, unpredictable)
              - Isolated families (dependent, moral weight)

            TODO: Kwame's internal monologue system — how he processes what he sees.
            Should it be voiced? Text logs? Radio transmissions to nobody?
          */}
        </ASection>

        {/* ── 4. SYSTEMS MANUAL ── */}
        <ASection label="04 — Systems Manual" stamp="OPERATIONAL">
          <ManualEntry
            number="1.0"
            title="INVENTORY & EQUIPMENT SYSTEM"
            body="Scavenged weapons (machetes, shotguns, repurposed tools), medical supplies, food, fuel. Weight limits force real decisions. Kwame can modify weapons using found parts — a classic Earth Taken / Last Stand loop adapted for Ghanaian context. Local items: palm oil tins, dried fish (high calorie), kenkey wraps, sachet water."
          />
          <ManualEntry
            number="2.0"
            title="ENDURANCE & INJURY MODEL"
            body="Kwame has a stamina and injury system that reflects his age. Wounds from combat persist between levels unless treated. Running excessively costs stamina. This isn't punishment — it's character authenticity. Every encounter has a cost, and the player feels it accumulate."
          />
          <ManualEntry
            number="3.0"
            title="BASE & REST PHASES"
            body="Between levels, Kwame finds shelter — a compound, a school, an abandoned petrol station. Here players manage resources, craft, and encounter other survivors. NPC decisions create narrative branches that affect what help is available in later levels."
          />
          <ManualEntry
            number="4.0"
            title="INTELLIGENCE GATHERING"
            body="Kwame tracks his children through clues: a schoolbag, a survivor's account, a radio message in Twi. These fragments update a hand-drawn map that functions as the game's progression system. He's searching — not following a waypoint."
          />
          <ManualEntry
            number="5.0"
            title="CULTURAL TEXTURE"
            body="NPCs speak in a mix of English, Twi, and pidgin. Inventory items include local staples. Enemies include human factions — bandits, military splinter groups, cult survivors — not just zombies. The world feels distinctly Ghanaian, not a generic Western zombie setting transplanted to Africa."
          />

          {/*
            TODO: Zombie type breakdown — different mutation stages and behaviors:
              Stage 1: Recently turned — fast, disoriented, responds to sound
              Stage 2: Settled — slow, territorial, senses heat
              Stage 3: Rooted — stationary, radius-based aggro, use as hazard zones
              Stage 4: ???  (late game, Act III reveal)

            TODO: Stealth system — when Kwame chooses to avoid rather than fight.
            He's 62 with limited energy. Stealth should be rewarded more than combat.

            TODO: Crafting tree details — what can be made from what.
            Tie to Ghanaian resourcefulness: repurposed tools, improvised medicine.

            TODO: Moral decision system — how helping/ignoring survivors affects world state.
            Does Accra remember what Kwame did? Does it matter?

            TODO: Day/night cycle — does it affect zombie behavior? Human faction activity?
            Night should feel genuinely dangerous. Kwame's military training helps but doesn't
            make it safe.
          */}
        </ASection>

        {/* ── 5. INCIDENT LOG / ACT STRUCTURE ── */}
        <ASection label="05 — Incident Log" stamp="CHRONOLOGICAL">
          <IncidentBlock
            phase="01"
            title="D-Day / The Separation"
            location="Tema Industrial Area, Accra"
            body="The separation. Tutorial-as-chaos. Kwame fights through collapsing Tema to reach the last known location of his children's school bus. He finds it empty — but finds the first clue: Ama's notebook with a handwritten note. The city is falling. He has to move before it fully goes dark."
          />
          <IncidentBlock
            phase="02"
            title="The Road North"
            location="Cape Coast Highway → Kumasi Outskirts"
            body="Following the trail through increasingly hostile territory. Alliances and betrayals with survivor groups. Ama is found — not saved, found. She's been managing. The truth slowly surfaces: someone is using the outbreak for control, and the children didn't end up where they are by accident."
          />
          <IncidentBlock
            phase="03"
            title="Reunion"
            location="Northern Interior [CLASSIFIED]"
            body="Kwame and Ama track Kofi together. The emotional weight of the full reunion is earned — each character has changed and the relationships have to be renegotiated, not just restored. Final confrontation involves Kwame's former colleague. The ending turns on a single choice: what Kwame does after."
          />

          {/*
            TODO: Level-by-level breakdown within each act:
              Act I: Tema → Osu → Cape Coast checkpoint
              Act II: Cape Coast highway → Kumasi market → Northern road
              Act III: Northern interior → [classified location] → Resolution

            TODO: Emotional beat map — where the game breathes vs. escalates.
            Kwame needs quiet moments. Finding Ama should be a rest beat.
            The road to Kofi should escalate without relief.

            TODO: Scene-by-scene breakdown of the D-Day opening sequence.
            This is the tutorial and the emotional hook — it needs to be extraordinary.
            The separation should feel like something being torn apart, not a cutscene.
          */}
        </ASection>

        {/* ── 6. WORLD MAP (placeholder) ── */}
        <ASection label="06 — Operational Map" stamp="TODO">
          {/*
            TODO: Interactive map of Ghana showing zone progression:
              - Zone 1: Tema / Accra (Act I)
              - Zone 2: Cape Coast road (Act I/II transition)
              - Zone 3: Kumasi market district (Act II)
              - Zone 4: Northern interior (Act III)

            Map aesthetic should match the page: hand-drawn, distressed,
            like a paper map annotated in the field. Not clean SVG.
            Use SVG filters to add paper texture. Zones marked with
            military-style icons (not pins). Routes shown as dashed lines
            with "ROUTE CONFIRMED / ROUTE UNKNOWN" status indicators.

            Interactive: click a zone to expand a field report card
            showing what Kwame knows about it, what resources are there,
            and what threats are active.
          */}
          <div
            className="flex items-center justify-center"
            style={{ background: SURFACE, border: `1px dashed ${BORDER}`, height: 240, opacity: 0.5 }}
          >
            <div className="text-center">
              <div className="abode-mono" style={{ color: G, fontSize: '0.85rem', letterSpacing: '0.3em' }}>
                MAP DATA — PENDING
              </div>
              <div className="abode-mono mt-2" style={{ color: PALE, fontSize: '0.7rem', opacity: 0.4, letterSpacing: '0.2em' }}>
                OPERATIONAL MAP TO BE RENDERED
              </div>
            </div>
          </div>
        </ASection>

        {/* ── 7. CHARACTER COMPARISON (placeholder) ── */}
        <ASection label="07 — Personnel Comparison" stamp="TODO">
          {/*
            TODO: Interactive personnel comparison tool.
            Same concept as Irregular's character roster, but styled as
            a side-by-side dossier comparison — like laying two folders
            on a table. Stats: Fitness, Combat, Emotional Resilience,
            Field Knowledge, Cultural Knowledge.

            Characters to compare:
              - Kwame (protagonist)
              - Ama (found Act II)
              - Kofi (found Act III)
              - The Antagonist (mirror to Kwame)
              - Key NPC survivors

            Visual: stat bars should look like handwritten progress marks
            on a printed form, not clean animated bars.
          */}
          <div style={{ background: SURFACE, border: `1px dashed ${BORDER}`, padding: '2rem', opacity: 0.5 }}>
            <div className="abode-mono" style={{ color: G, fontSize: '0.85rem', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
              COMPARATIVE ANALYSIS — PENDING
            </div>
            <div className="abode-body" style={{ color: PALE, opacity: 0.5, fontSize: '0.9rem' }}>
              Interactive personnel comparison system. Drag to compare two characters side by side.
            </div>
          </div>
        </ASection>

        {/* ── 8. STORY TIMELINE (placeholder) ── */}
        <ASection label="08 — Event Timeline" stamp="TODO">
          {/*
            TODO: Story timeline visualizer.
            Abɔde's timeline should feel like a police incident board —
            photographs (placeholder boxes), string connections, timestamps.
            Not a clean horizontal track like Irregular.

            Beat types for Abɔde:
              - INCIDENT (red) — zombie/threat events
              - INTEL (green) — clue discovery moments
              - CONTACT (orange) — NPC encounters
              - OBJECTIVE (white) — mission progress
              - PERSONAL (pale) — Kwame emotional beats

            Kwame's timeline and Ama's parallel timeline (what she was doing
            while Kwame was searching) should be shown on two tracks that
            merge when they reunite.

            The gap between the two tracks — the period where Kwame doesn't
            know what Ama was doing — should be visually blank/uncertain.
            That uncertainty is the emotional engine of Act II.
          */}
          <div style={{ background: SURFACE, border: `1px dashed ${BORDER}`, padding: '2rem', opacity: 0.5 }}>
            <div className="abode-mono" style={{ color: WARN, fontSize: '0.85rem', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
              TIMELINE RECONSTRUCTION — PENDING
            </div>
            <div className="abode-body" style={{ color: PALE, opacity: 0.5, fontSize: '0.9rem' }}>
              Dual-track timeline: Kwame's journey and Ama's parallel survival story,
              merging at the reunion point. The gap is the story.
            </div>
          </div>
        </ASection>

        {/* ── 9. ART DIRECTION (placeholder) ── */}
        <ASection label="09 — Visual Directive" stamp="TODO">
          {/*
            TODO: Art direction section. Abɔde's visual identity:

            COLOR PALETTE:
              - Laterite red (#c8522a) — soil, danger, dried blood
              - Survival green (#7ec87e) — radio, night vision, hope
              - Aged paper (#c8b89a) — text, light sources
              - Concrete grey (#6a6258) — urban decay
              - Deep shadow (#0f0d0a) — night, threat
              - Void black (#080604) — deepest shadow

            DESIGN PRINCIPLES:
              1. Every level should be recognizable as a real Ghanaian location.
                 Not stylized — grounded. Research: actual Tema compounds,
                 Osu streets, Kumasi central market architecture.
              2. Zombie design should feel like neighbors, not monsters.
                 They're wearing everyday clothes. That's the horror.
              3. Night levels: only Kwame's flashlight, distant fires, phone screens.
                 The darkness is not decorative. It's a resource constraint.
              4. UI should feel like survival: health is shown as a physical state,
                 not a bar. Kwame breathes heavier. He limps. The screen desaturates.

            REFERENCE IMAGES TO GATHER:
              - Osu Castle area, Accra
              - Tema industrial zone
              - Kumasi central market
              - Ghana Armed Forces equipment / vehicles
              - Earth Taken art style breakdown
          */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { name: 'Laterite Red', hex: '#c8522a', use: 'Soil / Danger' },
              { name: 'Survival Green', hex: '#7ec87e', use: 'Radio / Hope' },
              { name: 'Aged Paper', hex: '#c8b89a', use: 'Text / Light' },
              { name: 'Concrete Grey', hex: '#6a6258', use: 'Urban Decay' },
              { name: 'Deep Shadow', hex: '#1a1610', use: 'Night / Threat' },
              { name: 'Rust Orange', hex: '#8b4a1a', use: 'Fire / Decay' },
              { name: 'Pale Sky', hex: '#8ab0b8', use: 'Daylight / Safe' },
              { name: 'Void Black', hex: '#080604', use: 'Deepest Dark' },
            ].map(p => (
              <div key={p.hex}>
                <div style={{ background: p.hex, height: 48, border: `1px solid ${BORDER}`, marginBottom: '0.4rem' }} />
                <div className="abode-mono" style={{ color: PALE, fontSize: '0.6rem', opacity: 0.6, letterSpacing: '0.15em' }}>{p.name}</div>
                <div className="abode-mono" style={{ color: PALE, fontSize: '0.52rem', opacity: 0.3 }}>{p.hex}</div>
              </div>
            ))}
          </div>
        </ASection>

        {/* ── 10. AUDIO DIRECTION (placeholder) ── */}
        <ASection label="10 — Audio Directive" stamp="TODO">
          {/*
            TODO: Audio and music direction section.

            OVERALL PHILOSOPHY:
            Abɔde's sound design should make Ghana audible even in collapse.
            The music doesn't abandon its roots when the world falls apart.
            Highlife rhythms decay into something haunted. Talking drums
            become warning signals. The collapse sounds like Ghana breaking,
            not like a generic zombie soundtrack.

            ZONE AUDIO IDENTITY:
              Tema (Act I):
                - Instruments: distorted highlife guitar, industrial bass hum
                - Mood: chaos and muscle memory. Kwame acts before he thinks.
                - Corrupted version: industrial drone overtakes the guitar

              Cape Coast Road (Act I-II):
                - Instruments: sparse acoustic guitar, wind, nothing else
                - Mood: desolation and forward movement. No comfort.
                - Time of day matters: dawn sounds different from midnight

              Kumasi Market (Act II):
                - Instruments: found percussion on market stalls, crowd echo
                - Mood: the memory of noise in a place that was full of it
                - Ama theme introduced here — light melodic fragment

              Northern Interior (Act III):
                - Instruments: talking drum (transformed), low choir, silence
                - Mood: the weight of everything that led to this moment

            SPECIFIC SOUND DESIGN NOTES:
              - Kwame's breathing is a health indicator. The player hears his age.
              - Zombie sounds: recognizable — cloth sounds, labored breathing, not roars
              - Twi radio fragments heard from passing cars, distant buildings
              - The silence after a fight should be long enough to feel uncomfortable

            REFERENCE TRACKS:
              - Ebo Taylor — Afrobeat influence for pre-collapse tone
              - Nils Frahm — sparse piano for quiet moments
              - Lustmord — deep drone for horror sections
              - Ben Frost — distorted tension for combat
          */}
          <div style={{ background: SURFACE, border: `1px dashed ${BORDER}`, padding: '1.5rem', opacity: 0.6 }}>
            <div className="abode-mono mb-3" style={{ color: G, fontSize: '0.8rem', letterSpacing: '0.25em' }}>
              AUDIO BRIEF SUMMARY
            </div>
            {[
              'Highlife rhythms degrading into haunted ambient — Ghana audible even in collapse',
              'Kwame\'s breathing as health indicator — the player hears his age',
              'Zombie audio: cloth sounds, labored breathing — not monster roars',
              'Twi radio fragments as environmental storytelling',
              'Zone-specific audio: Tema = industrial decay; Kumasi = market echo; North = talking drums',
            ].map((note, i) => (
              <div key={i} className="flex gap-3 mb-2">
                <span className="abode-mono" style={{ color: WARN, opacity: 0.5, fontSize: '0.8rem' }}>{'>'}</span>
                <span className="abode-body" style={{ color: PALE, opacity: 0.65, fontSize: '0.9rem' }}>{note}</span>
              </div>
            ))}
          </div>
        </ASection>

        {/* ── 11. LORE RESEARCH (placeholder) ── */}
        <ASection label="11 — Research & Cultural Notes" stamp="TODO">
          {/*
            TODO: Lore and cultural research panel.

            Unlike Irregular (which has invented world lore), Abɔde's
            lore panel is a research and cultural accuracy reference.
            It should feel like a production bible's research section.

            STRUCTURE:
              - Historical Context: NADMO, Ghana Armed Forces structure,
                geography of Accra/Tema/Kumasi/Cape Coast
              - Cultural Details: Twi phrases to use, naming conventions,
                food items, social dynamics in compound living
              - Zombie Mythology Reference: West African spiritual traditions
                around death — Abɔde shouldn't ignore this. The outbreak
                happening in a place with deep ancestral beliefs about the
                dead creates rich storytelling territory. Is there a
                traditional explanation emerging alongside the scientific one?
              - Survival References: what real Ghanaian emergency preparedness
                looks like. What people actually do in a crisis.
              - Visual Research: street-level photography references for
                each zone's architecture

            ACCURACY COMMITMENT:
            The game must be reviewed by at least one Ghanaian cultural
            consultant before any dialogue is finalized. Twi phrases
            must be accurate. The social dynamics of inter-family compound
            living must be portrayed correctly. The military characters
            must reflect actual Ghana Armed Forces culture.

            NOTES:
            - Osu Castle context — historical weight of the location
            - Tema as a planned city — why it looks different from Accra
            - Kumasi as cultural capital — different feel than coastal cities
          */}
          <div style={{ background: SURFACE, border: `1px dashed ${BORDER}`, padding: '1.5rem', opacity: 0.6 }}>
            <div className="abode-mono mb-3" style={{ color: G, fontSize: '0.8rem', letterSpacing: '0.25em' }}>
              RESEARCH AREAS — TO BE BUILT
            </div>
            {['Ghanaian geography & architecture references', 'NADMO & Ghana Armed Forces structure', 'Twi language accuracy review', 'West African ancestral beliefs around death — story potential', 'Cultural consultant review process'].map((item, i) => (
              <div key={i} className="flex gap-3 mb-2">
                <span className="abode-stamp" style={{ fontSize: '0.55rem', transform: 'rotate(-1deg)', padding: '0.1rem 0.3rem' }}>TODO</span>
                <span className="abode-body" style={{ color: PALE, opacity: 0.65, fontSize: '0.9rem' }}>{item}</span>
              </div>
            ))}
          </div>
        </ASection>

      </div>

      {/* ── FOOTER ── */}
      {/* Styled as a document footer with classification marking */}
      <div style={{ borderTop: `1px dashed ${BORDER}`, padding: '1.5rem', textAlign: 'center' }}>
        <div className="abode-mono" style={{ color: PALE, fontSize: '0.65rem', opacity: 0.25, letterSpacing: '0.3em' }}>
          ABƆDE · DESIGN BIBLE · DRAFT 0.1 · HANDLE WITH CARE
        </div>
      </div>
    </div>
  );
};

export default AbodePage;