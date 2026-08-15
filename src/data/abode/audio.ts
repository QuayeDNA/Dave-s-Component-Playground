export const AUDIO_ZONES = [
  {
    zone: 'Tema / Accra', act: 'Act I', color: '#c8522a',
    instruments: 'Distorted highlife guitar, industrial bass hum, broken percussion',
    tempo: 'Fast and chaotic — no consistent pulse. The world is falling apart.',
    mood: "Chaos and muscle memory. Kwame acts before he thinks. The city's sonic identity is breaking down in real time.",
    threat: 'Industrial drone overtakes the highlife guitar. The music becomes noise. Then silence.',
    ref: 'Ebo Taylor — corrupted. Ben Frost — Trauma. Lustmord — infrastructure collapse.',
    notes: 'The opening sequence should be sonically overwhelming. Then abruptly quiet when Kwame realizes the bus is empty.',
  },
  {
    zone: 'Cape Coast Road', act: 'Act I–II', color: '#8ab0b8',
    instruments: 'Sparse acoustic guitar, wind through abandoned cars, distant birds',
    tempo: 'Slow and directional. Forward momentum without comfort.',
    mood: "Desolation. The highway was built for movement — now it's just a very long, very exposed corridor.",
    threat: "At night: only wind and distant shuffling. The absence of music is the threat.",
    ref: 'Nils Frahm — Says. Jóhann Jóhannsson — quiet walking themes.',
    notes: 'Dawn and dusk sound completely different on this road. Dawn: bird calls, distant cock crow — normalcy that makes the silence wrong. Dusk: the light failing means something entirely different now.',
  },
  {
    zone: 'Kumasi Market District', act: 'Act II', color: '#e8c84a',
    instruments: 'Found percussion on market stalls, echo of voices, bass resonance in empty halls',
    tempo: "Syncopated — the rhythm keeps almost falling into something familiar, then doesn't.",
    mood: 'The memory of noise in a place that was built on sound. Kumasi central market at full capacity is deafening. Empty, it\'s its own kind of horror.',
    threat: 'When faction soldiers are near, the percussion becomes regimented. Military cadence bleeding into market rhythm.',
    ref: 'Tinariwen — sparse. Rokia Traoré — structural decay of melody.',
    notes: "Ama's theme is first heard here — a light melodic fragment, unresolved, like something half-remembered. It signals her presence before Kwame finds her evidence.",
  },
  {
    zone: 'Northern Interior', act: 'Act III', color: '#c8a8e8',
    instruments: 'Talking drum (transformed — slower, heavier), low choir, long silences',
    tempo: 'Slow to the point of discomfort. Beats spaced far apart.',
    mood: 'The weight of everything that led to this. Kwame and Ama moving north together. This is the point of no return.',
    threat: "Near the antagonist's location: the choir becomes dissonant. The drums stop. Only Kwame's breathing remains.",
    ref: 'Arvo Pärt — Spiegel im Spiegel. Jóhann Jóhannsson — The Sun\'s Gone Dim.',
    notes: "The final confrontation should have no score. Just environmental sound. Then silence. The emotional weight of the music was spent getting here — the moment itself doesn't need it.",
  },
];

export const SOUND_DESIGN = [
  { label: "Kwame's Breathing", body: "The primary health indicator. At full health: controlled, inaudible. As he tires or is injured: audible, labored. At critical: rasping. The player hears his age accumulating across the game. By Act III, even at full health, he breathes a little heavier than he did in Act I." },
  { label: 'Zombie Audio Design', body: "No roars, no classic horror sounds. Cloth rustling. Labored breathing. Familiar voices (occasionally) — a child, a woman calling a name. The uncanny horror is recognition. Stage 1: disoriented, vocalizing. Stage 2: quiet, focused. Stage 3: near-silent. The quieter they get, the more dangerous." },
  { label: 'Twi Radio Fragments', body: "Environmental storytelling. Fragments heard from car radios still running, phones with battery, distant buildings with generators. Some are official broadcasts. Some are personal. One, late in Act II, is a child's voice. It is not Kofi's — but the player won't know that immediately." },
  { label: 'Silence as Design Element', body: "After every significant combat encounter, there should be at least 8–12 seconds of near-silence. Wind. Kwame's breathing. The sound of him reloading or picking up a resource. This silence is mandatory — it prevents desensitization and makes the next threat feel real again." },
  { label: "The Antagonist's Audio Signature", body: "He sounds like Kwame used to sound. Controlled breathing, deliberate movement, no panic. When the two finally meet, the similarity in how they carry themselves should be audible. Same training. Completely different destinations." },
];
