import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import './irregularGeometria.css';
import {
  AUDIO_ZONES,
  BEAT_COLORS,
  BEAT_LABELS,
  DESIGN_PRINCIPLES,
  LORE_ENTRIES,
  MECHANICS,
  NAV_SECTIONS,
  PALETTE,
  SOUND_DESIGN,
  SOURCE_BOARD,
  TIMELINE_BEATS,
  ZONES,
  characters,
  environments,
} from './irregularData';

const SHAPES: Record<string, ReactNode> = {
  circle: <circle cx="50" cy="50" r="35" />,
  triangle: <path d="M50 12 88 82H12Z" />,
  square: <rect x="17" y="17" width="66" height="66" />,
  hexagon: <path d="M50 10 84 30v40L50 90 16 70V30Z" />,
  irregular: <path d="M48 8 68 21 91 34 77 54 86 80 57 75 36 92 25 67 8 49 30 34Z" />,
};

function ShapeSVG({
  shape,
  color = '#7eb8e8',
  opacity = 1,
}: {
  shape: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill={color}
      fillOpacity={opacity}
      stroke={color}
      strokeWidth={3}
      strokeLinejoin="round"
    >
      {SHAPES[shape] ?? SHAPES.irregular}
    </svg>
  );
}

const OVERVIEW_STATS = [
  ['05', 'KNOWN TERRITORIES', 'One central stronghold'],
  ['05', 'KEY FIGURES', 'One antagonist · four allies'],
  ['03', 'NARRATIVE ACTS', 'Survival → Recognition → Choice'],
  ['02', 'POSSIBLE ENDINGS', 'Neither without consequence'],
];

const ACTS = [
  {
    num: '01',
    name: 'Survival',
    subtitle: 'THE WORLD BREAKS OPEN',
    desc: 'The invasion destroys Hexa’s ordinary life. Family is taken, and survival leads them into Circle territory, where the first alliance and first transformation are earned.',
    events: ['The Irregular Invasion', 'Escape', 'Circle Plains', 'Circle Form Unlocked'],
  },
  {
    num: '02',
    name: 'Recognition',
    subtitle: 'THE HISTORY BENEATH THE WAR',
    desc: 'Hexa crosses Triangle and Square territories, earns uneasy alliances, and uncovers the history of the Irregulars. Returning to the Hexagon Archive reveals the truth behind the conflict.',
    events: ['Triangle Peaks', 'Truth Surfaces', 'Triangle + Square Forms', 'Hexagon Archive', 'First Rescue'],
  },
  {
    num: '03',
    name: 'Choice',
    subtitle: 'WHAT SHOULD REPLACE THE OLD ORDER?',
    desc: 'At the Void Core, geometric law collapses. Hexa reunites with family and confronts the Irregular Leader. The final decision defines whether Geometria restores its old order or makes room for something new.',
    events: ['Void Core — Entry', 'Full Reunion', 'The Final Choice'],
  },
];

export default function IrregularPage() {
  const [active, setActive] = useState('overview');
  const [mobileNav, setMobileNav] = useState(false);
  const [selectedZone, setSelectedZone] = useState('void-core');
  const [selectedChar, setSelectedChar] = useState('hexa');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [access, setAccess] = useState('all');
  const [modal, setModal] = useState<string | null>(null);

  const activeSection = NAV_SECTIONS.find((s) => s.id === active) ?? NAV_SECTIONS[0];
  const zone = ZONES.find((z) => z.id === selectedZone) ?? ZONES[0];
  const character = characters.find((c) => c.id === selectedChar) ?? characters[0];
  const selectedLore = LORE_ENTRIES.find((l) => l.id === modal) ?? null;

  const lore = useMemo(() => {
    const q = query.toLowerCase();
    return LORE_ENTRIES.filter(
      (entry) =>
        (category === 'all' || entry.category === category) &&
        (access === 'all' || (access === 'locked' ? entry.locked : !entry.locked)) &&
        (entry.title.toLowerCase().includes(q) ||
          entry.content.toLowerCase().includes(q) ||
          entry.category.toLowerCase().includes(q)),
    );
  }, [query, category, access]);

  const go = (id: string) => {
    setActive(id);
    setMobileNav(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModal(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="geo-app">
      <aside className={`sidebar ${mobileNav ? 'open' : ''}`} id="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <svg viewBox="0 0 40 40" fill="none">
              <path d="M20 3 34.7 11.5v17L20 37 5.3 28.5v-17L20 3Z" stroke="#7eb8e8" strokeWidth="1.5" />
              <path d="m20 10 8.7 5v10L20 30l-8.7-5V15l8.7-5Z" stroke="#7eb8e8" opacity=".55" />
              <circle cx="20" cy="20" r="2" fill="#f5f0e8" />
            </svg>
          </div>
          <div>
            <div className="brand-name">GEOMETRIA</div>
            <div className="brand-sub">HEXAGON ARCHIVE / 04</div>
          </div>
        </div>

        <div className="archive-label">ARCHIVE INDEX</div>
        <nav className="nav" id="nav">
          {NAV_SECTIONS.map((section) => (
            <button
              key={section.id}
              className={active === section.id ? 'active' : ''}
              onClick={() => go(section.id)}
            >
              <span className="num">{section.num}</span>
              {section.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="status-card">
            <div className="status-top">
              <span>ARCHIVE CONNECTION</span>
              <i className="live-dot" />
            </div>
            <div className="status-value">Stable · Restricted</div>
            <div className="status-foot">LAST SYNC // CYCLE 0400.II</div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <button
              className="icon-btn mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMobileNav((open) => !open)}
            >
              ☰
            </button>
            <div className="crumb">
              HEXAGON ARCHIVE <span style={{ color: '#425a6d' }}>/</span> <b id="crumb">{activeSection.label}</b>
            </div>
          </div>
          <div className="top-actions">
            <span className="cycle">ARCHIVE RECORD · GE-0400</span>
            <button className="icon-btn" title="Return to overview" onClick={() => go('overview')}>
              ⌂
            </button>
          </div>
        </header>

        <div className="content">
          <section className={`section ${active === 'overview' ? 'active' : ''}`} id="overview">
            <div className="eyebrow">Recovered world documentation · Record 001</div>
            <div className="hero">
              <div className="hero-copy">
                <div className="eyebrow">A GEOMETRIC CIVILIZATION IN COLLAPSE</div>
                <h1>
                  THE WORLD
                  <br />
                  OF <span>GEOMETRIA.</span>
                </h1>
                <p className="lede">
                  A living archive of shapes, fractured histories, and the fragile rules holding a world
                  together. These records document the journey of Hexa — cartographer, survivor, and
                  something the old order never anticipated.
                </p>
                <div className="hero-meta">
                  <div className="meta-block">
                    <strong>05</strong>
                    <span>KNOWN ZONES</span>
                  </div>
                  <div className="meta-block">
                    <strong>03</strong>
                    <span>STORY ACTS</span>
                  </div>
                  <div className="meta-block">
                    <strong>12</strong>
                    <span>KEY STORY BEATS</span>
                  </div>
                </div>
              </div>
              <svg className="hero-art" viewBox="0 0 300 300" fill="none">
                <path d="M150 18 264 84v132l-114 66L36 216V84L150 18Z" stroke="#7eb8e8" strokeWidth="1.2" />
                <path d="M150 53 234 101v98l-84 48-84-48v-98l84-48Z" stroke="#7eb8e8" opacity=".45" />
                <path d="M150 91 201 120v60l-51 29-51-29v-60l51-29Z" stroke="#c8b8f0" opacity=".8" />
                <circle cx="150" cy="150" r="9" fill="#7eb8e8" />
                <path
                  d="M150 18v73M264 84l-63 36M264 216l-63-36M150 282v-73M36 216l63-36M36 84l63 36"
                  stroke="#7eb8e8"
                  opacity=".25"
                />
                <circle cx="150" cy="150" r="126" stroke="#7eb8e8" opacity=".12" strokeDasharray="3 8" />
              </svg>
            </div>

            <div className="grid stats-grid" id="overviewStats">
              {OVERVIEW_STATS.map(([value, label, note]) => (
                <div className="stat" key={label}>
                  <div className="stat-label">{label}</div>
                  <div className="stat-value">{value}</div>
                  <div className="stat-note">{note}</div>
                </div>
              ))}
            </div>

            <div className="grid two-col">
              <div className="panel">
                <div className="panel-head">
                  <h3>Territorial records</h3>
                  <button className="action-link" onClick={() => go('world-map')}>
                    OPEN WORLD MAP ↗
                  </button>
                </div>
                <div className="zone-list" id="overviewZones">
                  {ZONES.map((z) => (
                    <div
                      className="zone-row"
                      key={z.id}
                      onClick={() => {
                        setSelectedZone(z.id);
                        go('world-map');
                      }}
                    >
                      <div className="shape-icon">
                        <ShapeSVG shape={z.shape} color={z.color} />
                      </div>
                      <div>
                        <strong>{z.name}</strong>
                        <small>{z.ruler}</small>
                      </div>
                      <span className="status-pill">{z.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <h3>Chronicle · opening sequence</h3>
                  <button className="action-link" onClick={() => go('timeline')}>
                    FULL TIMELINE ↗
                  </button>
                </div>
                <div className="beat-list" id="overviewBeats">
                  {TIMELINE_BEATS.slice(0, 4).map((beat, index) => (
                    <div className="beat" key={beat.id}>
                      <div className="beat-marker">0{index + 1}</div>
                      <div>
                        <strong>{beat.label}</strong>
                        <p>{beat.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="footer">
              <span>GEOMETRIA // HEXAGON ARCHIVE</span>
              <span>UNAUTHORIZED DISTRIBUTION PROHIBITED</span>
            </div>
          </section>

          <section className={`section ${active === 'narrative' ? 'active' : ''}`} id="narrative">
            <div className="section-head">
              <div>
                <div className="eyebrow">02 / STORY RECORD</div>
                <h2>Narrative premise</h2>
                <p className="lede">
                  A journey that begins as a rescue mission and becomes a confrontation with the
                  foundations of identity, belonging, and order.
                </p>
              </div>
              <span className="section-index">NARRATIVE / 02</span>
            </div>

            <div className="panel" style={{ marginBottom: 16, padding: 26 }}>
              <div className="eyebrow">THE CENTRAL QUESTION</div>
              <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', maxWidth: 800, margin: '13px 0' }}>
                If a world is built by defining what belongs, what happens to everything it cannot define?
              </h2>
              <p className="lede">
                Geometria&apos;s shape-based societies were built on the promise of order. When the
                Irregulars invade, Hexa&apos;s personal search for their taken family exposes the violence
                hidden beneath that promise. The enemy is not simply an outside force: it is the
                consequence of a civilization that made belonging conditional.
              </p>
            </div>

            <div className="grid two-col">
              <div className="panel">
                <h3>Story pillars</h3>
                <div className="beat-list">
                  <div className="beat">
                    <div className="beat-marker">01</div>
                    <div>
                      <strong>Identity through change</strong>
                      <p>
                        Hexa&apos;s ability to transform is both a practical gift and a challenge to the
                        fixed categories Geometria depends on.
                      </p>
                    </div>
                  </div>
                  <div className="beat">
                    <div className="beat-marker">02</div>
                    <div>
                      <strong>Empathy without absolution</strong>
                      <p>
                        Understanding the Irregulars&apos; grievance does not erase the harm they cause.
                        The story holds both truths.
                      </p>
                    </div>
                  </div>
                  <div className="beat">
                    <div className="beat-marker">03</div>
                    <div>
                      <strong>Rescue is not restoration</strong>
                      <p>
                        Reunions carry consequences. Those who return have changed, and relationships must
                        be rebuilt.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel">
                <h3>Emotional progression</h3>
                <div className="timeline">
                  <div className="timeline-item" style={{ '--beat-color': 'var(--triangle)' } as CSSProperties}>
                    <div>
                      <div className="beat-meta">ACT I · LOSS</div>
                      <h3>Survival</h3>
                      <p>Disorientation, grief, first fragile alliances.</p>
                    </div>
                  </div>
                  <div className="timeline-item" style={{ '--beat-color': 'var(--violet)' } as CSSProperties}>
                    <div>
                      <div className="beat-meta">ACT II · RECOGNITION</div>
                      <h3>Understanding</h3>
                      <p>History complicates the mission. Hexa&apos;s own identity becomes uncertain.</p>
                    </div>
                  </div>
                  <div className="timeline-item" style={{ '--beat-color': 'var(--pink)' } as CSSProperties}>
                    <div>
                      <div className="beat-meta">ACT III · CHOICE</div>
                      <h3>Responsibility</h3>
                      <p>There is no return to the old world without deciding what should replace it.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={`section ${active === 'world-map' ? 'active' : ''}`} id="world-map">
            <div className="section-head">
              <div>
                <div className="eyebrow">03 / CARTOGRAPHIC RECORD</div>
                <h2>World map</h2>
                <p className="lede">
                  Five known territories mapped around the Void Core. Select a zone to inspect its ruler,
                  condition, and recorded form unlock.
                </p>
              </div>
              <span className="section-index">GEOMETRIA / 05 ZONES</span>
            </div>

            <div className="map-layout">
              <div className="map-board" id="mapBoard">
                <span className="map-coord" style={{ top: 16, left: 17 }}>
                  N / 04.20
                </span>
                <span className="map-coord" style={{ top: 16, right: 17 }}>
                  E / 09.11
                </span>
                <svg className="map-lines" viewBox="0 0 700 520" preserveAspectRatio="none">
                  <g stroke="#6389a5" strokeWidth="1" opacity=".28" strokeDasharray="4 7" fill="none">
                    <path d="M140 300 Q250 180 280 110 T435 90 M140 300 Q260 390 430 310 T570 115 M280 110 Q390 170 350 260 Q290 340 430 310" />
                    <path d="M140 300L350 260L570 115M280 110L430 310" />
                  </g>
                  <g fill="#7eb8e8" opacity=".45">
                    <circle cx="140" cy="300" r="2" />
                    <circle cx="280" cy="110" r="2" />
                    <circle cx="430" cy="310" r="2" />
                    <circle cx="570" cy="115" r="2" />
                  </g>
                  <circle cx="350" cy="260" r="76" stroke="#f0a8c8" opacity=".14" strokeDasharray="2 7" />
                  <circle cx="350" cy="260" r="105" stroke="#f0a8c8" opacity=".08" />
                </svg>
                <div id="mapNodes">
                  {ZONES.map((z) => (
                    <button
                      key={z.id}
                      className={`map-node ${selectedZone === z.id ? 'selected' : ''}`}
                      style={
                        {
                          left: `${z.x}%`,
                          top: `${z.y}%`,
                          '--size': `${z.size}px`,
                          '--zone-color': z.color,
                        } as CSSProperties
                      }
                      onClick={() => setSelectedZone(z.id)}
                    >
                      <span className="orb">
                        <ShapeSVG shape={z.shape} color={z.color} opacity={0.75} />
                      </span>
                      <span className="node-label">{z.name.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
                <div className="map-caption">
                  <span>ARCHIVE CARTOGRAPHY // NOT TO SCALE</span>
                  <span>SELECT A TERRITORY TO INSPECT</span>
                </div>
              </div>

              <div className="panel zone-detail" style={{ '--zone-color': zone.color } as CSSProperties}>
                <div className="zone-sigil">
                  <img
                    className="zone-sigil-art"
                    src={environments[zone.id]}
                    alt={`${zone.name} concept art`}
                  />
                  <span className="zone-sigil-shape">
                    <ShapeSVG shape={zone.shape} color={zone.color} />
                  </span>
                </div>
                <div className="detail-status">
                  {zone.status.toUpperCase()} · ACT {zone.act}
                </div>
                <h2>{zone.name}</h2>
                <div className="muted mono small" style={{ marginBottom: 13 }}>
                  {zone.ruler.toUpperCase()}
                </div>
                <p className="detail-desc">{zone.description}</p>
                <div className="detail-fields">
                  <div className="field">
                    <label>FORM / ARCHIVE UNLOCK</label>
                    <strong>{zone.unlock}</strong>
                  </div>
                  <div className="field">
                    <label>KNOWN HOSTILES</label>
                    <strong>{zone.enemies}</strong>
                  </div>
                  <div className="field">
                    <label>STORY PLACEMENT</label>
                    <strong>ACT {zone.act}</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={`section ${active === 'characters' ? 'active' : ''}`} id="characters">
            <div className="section-head">
              <div>
                <div className="eyebrow">04 / PERSONS OF INTEREST</div>
                <h2>Character dossiers</h2>
                <p className="lede">
                  Known figures shaping the conflict. Select a dossier to review recorded traits,
                  abilities, narrative arc, and aptitude profile.
                </p>
              </div>
              <span className="section-index">CHARACTERS / 05</span>
            </div>

            <div className="grid character-grid" id="characterGrid">
              {characters.map((c, index) => (
                <article
                  className="character-card"
                  key={c.id}
                  style={{ '--char-color': c.color } as CSSProperties}
                  onClick={() => setSelectedChar(c.id)}
                >
                  <div className="char-art">
                    <span className="char-no">DOSSIER / 0{index + 1}</span>
                    <span className="char-kind">{c.type.toUpperCase()}</span>
                    <img className="char-portrait" src={c.image} alt={c.name} />
                    <span className="char-shape-badge">
                      <ShapeSVG shape={c.shape} color={c.color} />
                    </span>
                  </div>
                  <div className="char-info">
                    <h3>{c.name}</h3>
                    <div className="char-role">{c.role}</div>
                    <p>{c.description}</p>
                    <div className="trait-list">
                      {c.traits.map((trait) => (
                        <span className="trait" key={trait}>
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div id="characterDetail" style={{ marginTop: 16 }}>
              <div className="char-detail" style={{ '--char-color': character.color } as CSSProperties}>
                <div className="char-detail-art">
                  <img className="char-portrait-full" src={character.image} alt={character.name} />
                  <span className="char-detail-badge">
                    <ShapeSVG shape={character.shape} color={character.color} />
                  </span>
                </div>
                <div className="panel">
                  <div className="eyebrow">SELECTED DOSSIER · {character.type.toUpperCase()}</div>
                  <h2 style={{ margin: '10px 0 3px' }}>{character.name}</h2>
                  <div className="muted mono small">{character.role}</div>
                  <p className="detail-desc" style={{ marginTop: 17 }}>
                    {character.description}
                  </p>
                  <div className="grid two-col" style={{ gap: 20, marginTop: 16 }}>
                    <div>
                      <div className="field">
                        <label>POWER CLASS</label>
                        <strong>{character.powerType}</strong>
                      </div>
                      <div className="field" style={{ marginTop: 12 }}>
                        <label>NARRATIVE ARC</label>
                        <strong>{character.arc}</strong>
                      </div>
                    </div>
                    <div>
                      <div className="field">
                        <label>RECORDED TRAITS</label>
                        <div className="trait-list" style={{ marginTop: 7 }}>
                          {character.traits.map((trait) => (
                            <span className="trait" key={trait}>
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="stat-bars">
                    {Object.entries(character.stats).map(([label, value]) => (
                      <div className="bar-row" key={label}>
                        <span>{label.toUpperCase()}</span>
                        <div className="bar">
                          <i style={{ width: `${value}%` }} />
                        </div>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={`section ${active === 'timeline' ? 'active' : ''}`} id="timeline">
            <div className="section-head">
              <div>
                <div className="eyebrow">05 / CHRONOLOGICAL RECORD</div>
                <h2>Event timeline</h2>
                <p className="lede">
                  The currently reconstructed sequence of events across three acts. Some records remain
                  incomplete or disputed.
                </p>
              </div>
              <span className="section-index">12 KEY BEATS</span>
            </div>

            <div className="panel">
              <div className="timeline" id="timelineList">
                {TIMELINE_BEATS.map((beat) => (
                  <div
                    className="timeline-item"
                    key={beat.id}
                    style={{ '--beat-color': BEAT_COLORS[beat.type] } as CSSProperties}
                  >
                    <div>
                      <div className="beat-meta">
                        {BEAT_LABELS[beat.type].toUpperCase()} · {beat.id.toUpperCase()}
                      </div>
                      <h3>{beat.label}</h3>
                      <p>{beat.description}</p>
                    </div>
                    <span className="act-label">ACT {beat.act}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={`section ${active === 'mechanics' ? 'active' : ''}`} id="mechanics">
            <div className="section-head">
              <div>
                <div className="eyebrow">06 / SYSTEMS DOCUMENTATION</div>
                <h2>Gameplay mechanics</h2>
                <p className="lede">
                  The world is a language of geometry. Each form changes how Hexa moves, fights, and
                  interacts with the environment.
                </p>
              </div>
              <span className="section-index">FORM-SHIFTING SYSTEM</span>
            </div>

            <div className="grid mechanics-grid" id="mechanicsGrid">
              {MECHANICS.map((mechanic) => (
                <div className="mechanic" key={mechanic[0]}>
                  <div className="mechanic-icon">
                    <span>{mechanic[0]}</span>
                  </div>
                  <div className="mono">{mechanic[2].toUpperCase()}</div>
                  <h3 style={{ margin: '7px 0' }}>{mechanic[1]}</h3>
                  <p>{mechanic[3]}</p>
                </div>
              ))}
            </div>

            <div className="panel" style={{ marginTop: 16 }}>
              <div className="panel-head">
                <h3>Core design logic</h3>
                <span className="tag">SYSTEM PRINCIPLE</span>
              </div>
              <p className="lede" style={{ maxWidth: 'none' }}>
                Form changes should not feel like a collection of unrelated powers. They are different
                ways of reading and negotiating the same world. A tunnel, a wall, a pressure plate, or a
                broken platform becomes a different problem depending on the shape Hexa inhabits.
              </p>
            </div>
          </section>

          <section className={`section ${active === 'acts' ? 'active' : ''}`} id="acts">
            <div className="section-head">
              <div>
                <div className="eyebrow">07 / STRUCTURAL OUTLINE</div>
                <h2>Act structure</h2>
                <p className="lede">
                  Three movements from personal survival to a choice about the future of geometric
                  civilization.
                </p>
              </div>
              <span className="section-index">I — III</span>
            </div>

            <div className="grid acts-grid" id="actsGrid">
              {ACTS.map((act) => (
                <article className="act-card" data-num={act.num} key={act.num}>
                  <div className="act-no">
                    ACT {act.num} / {act.subtitle}
                  </div>
                  <h3>{act.name}</h3>
                  <p>{act.desc}</p>
                  <div className="act-events">
                    {act.events.map((event) => (
                      <span key={event}>{event}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={`section ${active === 'art' ? 'active' : ''}`} id="art">
            <div className="section-head">
              <div>
                <div className="eyebrow">08 / VISUAL LANGUAGE</div>
                <h2>Art direction</h2>
                <p className="lede">
                  A visual system where geometry carries culture, corruption carries history, and absence
                  becomes a threat.
                </p>
              </div>
              <span className="section-index">VISUAL SPECIFICATION</span>
            </div>

            <div className="panel concept-board" style={{ marginBottom: 16 }}>
              <div className="panel-head">
                <h3>Concept archive</h3>
                <span className="tag">SOURCE BOARD / ASSET 001</span>
              </div>
              <img src={SOURCE_BOARD} alt="Geometria character and environment concept art board" />
            </div>

            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-head">
                <h3>Chromatic archive</h3>
                <span className="tag">CORE PALETTE / 08 COLORS</span>
              </div>
              <div className="grid palette-grid" id="paletteGrid">
                {PALETTE.map((swatch) => (
                  <div className="swatch" key={swatch.name}>
                    <div
                      className="swatch-color"
                      style={{
                        background: swatch.hex,
                        ...(swatch.name === 'Void Ink' ? { border: '1px solid #31404d' } : {}),
                      }}
                    />
                    <strong>{swatch.name}</strong>
                    <code>{swatch.hex}</code>
                    <p>{swatch.use}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid principle-grid" id="principleGrid">
              {DESIGN_PRINCIPLES.map((principle) => (
                <div className="principle" key={principle.title}>
                  <h3>{principle.title}</h3>
                  <p>{principle.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={`section ${active === 'audio' ? 'active' : ''}`} id="audio">
            <div className="section-head">
              <div>
                <div className="eyebrow">09 / SONIC RECORD</div>
                <h2>Audio direction</h2>
                <p className="lede">
                  Each territory has a distinct musical grammar. Corruption does not replace the original
                  identity — it destabilizes it.
                </p>
              </div>
              <span className="section-index">ZONE SOUND PROFILES</span>
            </div>

            <div className="audio-list" id="audioList">
              {AUDIO_ZONES.map((audio) => (
                <article
                  className="audio-card"
                  key={audio.zone}
                  style={{ '--zone-color': audio.color } as CSSProperties}
                >
                  <h3>{audio.zone}</h3>
                  <div>
                    <label>INSTRUMENTATION</label>
                    <p>{audio.instruments}</p>
                    <label>TEMPO</label>
                    <p>{audio.tempo}</p>
                    <label>EMOTIONAL REGISTER</label>
                    <p>{audio.mood}</p>
                  </div>
                  <div>
                    <label>CORRUPTION TREATMENT</label>
                    <p>{audio.corrupted}</p>
                    <label>REFERENCE LISTENING</label>
                    <p>{audio.reference}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="panel" style={{ marginTop: 16 }}>
              <div className="panel-head">
                <h3>Sound design motifs</h3>
                <span className="tag">SYSTEM-WIDE</span>
              </div>
              <div className="grid two-col" id="soundDesign">
                {SOUND_DESIGN.map((sound, index) => (
                  <div className="beat" key={sound.label}>
                    <div className="beat-marker">0{index + 1}</div>
                    <div>
                      <strong>{sound.label}</strong>
                      <p>{sound.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={`section ${active === 'lore' ? 'active' : ''}`} id="lore">
            <div className="section-head">
              <div>
                <div className="eyebrow">10 / RESTRICTED KNOWLEDGE</div>
                <h2>Archive &amp; lore</h2>
                <p className="lede">
                  Fragments of Geometria&apos;s history, recovered records, and sealed knowledge. Locked
                  entries represent information not yet discovered in the story.
                </p>
              </div>
              <span className="section-index">ARCHIVE INDEX / 06</span>
            </div>

            <div className="lore-tools">
              <input
                className="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search archive records…"
                aria-label="Search lore"
              />
              <select className="filter" value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="all">ALL CATEGORIES</option>
                <option>World Lore</option>
                <option>Character Lore</option>
                <option>Historical</option>
              </select>
              <select className="filter" value={access} onChange={(event) => setAccess(event.target.value)}>
                <option value="all">ALL ACCESS</option>
                <option value="open">UNLOCKED</option>
                <option value="locked">LOCKED</option>
              </select>
            </div>

            <div className="grid lore-grid" id="loreGrid">
              {lore.length ? (
                lore.map((entry) => (
                  <article
                    className={`lore-card ${entry.locked ? 'locked' : ''}`}
                    key={entry.id}
                    onClick={() => setModal(entry.id)}
                  >
                    <div className="lore-top">
                      <span>{entry.category.toUpperCase()}</span>
                      <span className={entry.locked ? 'lock' : ''}>
                        {entry.locked ? '⌑ SEALED' : '● ACCESSIBLE'}
                      </span>
                    </div>
                    <h3>{entry.title}</h3>
                    <p>
                      {entry.locked
                        ? 'This record is sealed. Progress through the story to recover its contents.'
                        : entry.content}
                    </p>
                  </article>
                ))
              ) : (
                <div className="panel muted">No archive records match this search.</div>
              )}
            </div>
          </section>
        </div>
      </main>

      <div
        className={`modal-backdrop ${selectedLore ? 'open' : ''}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) setModal(null);
        }}
      >
        {selectedLore ? (
          <div className="modal">
            <div className="modal-head">
              <div>
                <div className="eyebrow">
                  {selectedLore.category.toUpperCase()} /{' '}
                  {selectedLore.locked ? 'SEALED RECORD' : 'ACCESS GRANTED'}
                </div>
                <h2 style={{ margin: '10px 0 16px' }}>{selectedLore.title}</h2>
              </div>
              <button className="modal-close" aria-label="Close" onClick={() => setModal(null)}>
                ×
              </button>
            </div>
            <p>
              {selectedLore.locked
                ? `This record remains sealed in the Hexagon Archive. ${selectedLore.content}`
                : selectedLore.content}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
