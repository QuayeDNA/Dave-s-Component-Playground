import { G, WARN } from './theme';
import type { ResearchCat } from './types';

export const RESEARCH_CATEGORIES: (ResearchCat | 'all')[] = ['all', 'Geography', 'Culture & Language', 'Military & Emergency', 'Ancestral Beliefs', 'Accuracy Charter'];

export const RESEARCH_CATEGORY_COLORS: Record<string, string> = {
  'Geography': '#8ab0b8', 'Culture & Language': G, 'Military & Emergency': WARN,
  'Ancestral Beliefs': '#c8a8e8', 'Accuracy Charter': '#e8c84a',
};

export interface ResearchEntry {
  id: string; category: ResearchCat; title: string; content: string;
}

export const RESEARCH_ENTRIES: ResearchEntry[] = [
  {
    id:'r1', category:'Geography',
    title:'Tema — The Planned City',
    content:"Tema was deliberately designed in the 1950s-60s as an industrial port city — its grid layout and compound housing blocks are distinct from Accra's organic sprawl. The industrial area along the coast has large warehouse complexes, cold storage facilities, and shipping infrastructure. This makes it tactically interesting: clear sightlines, hard cover, recognizable landmark structures. The Tema-Accra motorway is the critical artery. When it fails, the city is functionally isolated.",
  },
  {
    id:'r2', category:'Geography',
    title:'Accra — Osu District',
    content:"Osu is one of Accra's oldest districts — a mix of historic compounds, modern commercial streets, and the shoreline. Oxford Street (the main commercial strip) is a reference point most Ghanaians recognize instantly. The density is high but human-scale. Kiosks, chop bars, small compounds with shared courtyards. For survival gameplay: the density creates ambush risk but also resource opportunity. The shoreline provides a navigation landmark.",
  },
  {
    id:'r3', category:'Geography',
    title:'Kumasi — The Garden City',
    content:"Kumasi has a distinct feel from coastal cities — more enclosed, more hierarchical, culturally more conservative. The central market (Kejetia) is one of the largest open-air markets in West Africa — a labyrinth of stalls, covered walkways, and crowd flow. As a gameplay zone it offers extraordinary tactical depth: narrow passages, elevated seller platforms, multiple exit routes, a clear central hub. Komfo Anokye Teaching Hospital is a genuine landmark recognizable to any Ghanaian player.",
  },
  {
    id:'r4', category:'Culture & Language',
    title:'Twi — Language Notes',
    content:"Twi (specifically Asante Twi) is the most widely spoken language in southern Ghana and is understood across much of the country. Key phrases for in-game use must be reviewed by a native speaker. Common expressions: 'Yɛbɛhyia bio' (we'll meet again), 'Gye nyame' (except God — the foundational Adinkra symbol), 'Wo ho te sɛn?' (how are you?). Crucially, pidgin English and code-switching between English and Twi is the natural mode of speech for most urban Ghanaians — NPCs should reflect this authentically.",
  },
  {
    id:'r5', category:'Culture & Language',
    title:'Compound Living — Social Architecture',
    content:"The compound house (odan) is a foundational unit of Ghanaian social life — a shared courtyard with multiple family units around it. In a survival scenario, compounds become natural fortification points. They also have strong social rules: who has authority, who is responsible for what, how decisions are made collectively. These dynamics should appear in rest phase NPC interactions. A compound of survivors is not just shelter — it's a micro-society with its own power structure.",
  },
  {
    id:'r6', category:'Culture & Language',
    title:'Naming Conventions',
    content:"Ghanaian naming traditions are rich and specific. Day names (Akosua = Sunday female, Kwame = Saturday male, Ama = Saturday female, Kofi = Friday male) are widely used alongside given names. Family names vary by region and ethnicity. Military titles (Colonel, Captain) interact with civilian naming in specific ways — a retired colonel would be addressed differently in military vs. civilian contexts. All character names in the game should be reviewed for cultural accuracy and regional appropriateness.",
  },
  {
    id:'r7', category:'Military & Emergency',
    title:'Ghana Armed Forces — Structure & Culture',
    content:"The Ghana Armed Forces (GAF) has a strong institutional culture shaped by ECOMOG peacekeeping service, UN deployments, and domestic civic roles. Officers of Kwame's generation would have served in Liberia and Sierra Leone — formative experiences that created a specific kind of soldier: experienced with asymmetric conflict, aware of civilian impact, accustomed to operating in collapsed state situations. The relationship between military and civilian institutions in Ghana is generally positive — Kwame's reluctance to trust the splinter faction is personal, not institutional.",
  },
  {
    id:'r8', category:'Military & Emergency',
    title:'NADMO — National Disaster Management',
    content:"The National Disaster Management Organisation (NADMO) is Ghana's primary emergency response body. In a genuine national crisis they would coordinate with the GAF, regional authorities, and civil society. Their capacity, resources, and geographic reach are real constraints that the game's fiction should respect. NADMO's collapse (or partial collapse) in Act I is plausible if the outbreak moved faster than any existing emergency protocol could handle — which is the premise.",
  },
  {
    id:'r9', category:'Ancestral Beliefs',
    title:'Akan Spiritual Tradition & the Dead',
    content:"In Akan spiritual tradition, the dead do not simply cease — they transition to the realm of ancestors (asamando) and maintain connection with the living. The concept of the sunsum (spirit/soul) surviving physical death is foundational. An outbreak of the dead refusing to transition — returning instead as something that doesn't speak, doesn't recognize, doesn't belong to either the living or ancestor world — is cosmologically horrifying in a way that Western zombie frameworks don't capture. Some in-game characters should express this: not just survival fear, but spiritual dread at what the dead have become.",
  },
  {
    id:'r10', category:'Ancestral Beliefs',
    title:'Traditional Explanation vs. Scientific Explanation',
    content:"As the outbreak spreads, two explanatory frameworks will emerge among survivors: scientific/medical (a pathogen, a virus, a weapon) and traditional/spiritual (a curse, a punishment, a rupture in the ancestor-living relationship). Neither should be confirmed or denied by the game. Kwame, as a military man, defaults to the scientific frame — but encounters that shake this are important story moments. An elderly survivor who reads the outbreak through traditional knowledge should not be made to look foolish. The two frameworks coexist. That tension is rich storytelling territory.",
  },
  {
    id:'r11', category:'Accuracy Charter',
    title:'Cultural Consultant Requirement',
    content:"The game must be reviewed by at least one Ghanaian cultural consultant — ideally one from Accra/Tema and one with knowledge of Asante Twi and Akan traditions — before any dialogue is finalized. This is non-negotiable. The goal is not to avoid offense (though that matters) but to make the world feel genuinely real to Ghanaian players. A Ghanaian player should be able to point to a location, hear a phrase, or recognize a social dynamic and feel it is accurately rendered.",
  },
  {
    id:'r12', category:'Accuracy Charter',
    title:'Research Reference List',
    content:"Key resources for the development team: (1) 'A History of Ghana' by Roger Gocking — historical foundation. (2) NADMO official documentation — emergency response structure. (3) Ghana Armed Forces institutional history — peacekeeping record. (4) 'The Akan of Ghana' by Kofi Asare Opoku — cultural and spiritual tradition. (5) Street-level documentation of Tema, Osu, Kumasi — architectural reference. (6) Ghanaian film and television — language, social dynamics, authentic contemporary portrayal. This list will expand as production progresses.",
  },
];
