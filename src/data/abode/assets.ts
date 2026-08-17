import type { AssetCategory, AssetStatus } from './types';

export interface AssetItem {
  id: string;
  category: AssetCategory;
  name: string;
  status: AssetStatus;
  source: string;
  src?: string;
}

export const ASSETS: AssetItem[] = [
  { id: 'a-con-tema',   category: 'Concept Art', name: 'Tema Industrial Area — Dusk', status: 'final', source: 'Reference: street photography of Tema industrial zone; 1950s plan drawings.', src: '/abode/concept-tema.png' },
  { id: 'a-con-cape',   category: 'Concept Art', name: 'Cape Coast Road — Dawn', status: 'final', source: 'Reference: N1 highway photography; coastal vegetation studies.', src: '/abode/concept-cape-coast.png' },
  { id: 'a-con-kumasi', category: 'Concept Art', name: 'Kumasi Market District', status: 'final', source: 'Reference: Kejetia market documentation; ochre palette study.', src: '/abode/concept-kumasi.png' },
  { id: 'a-con-ark',    category: 'Concept Art', name: 'The Ark — Northern Facility', status: 'final', source: 'Reference: colonial-era teacher training colleges, Northern Region.', src: '/abode/concept-ark.png' },
  { id: 'a-ch-kwame',   category: 'Character', name: 'Col. Kwame Mensah', status: 'concept', source: 'Dossier KM-001. Reference: retired officer portraits; 60s West African military dress.' },
  { id: 'a-ch-ama',     category: 'Character', name: 'Ama Mensah', status: 'concept', source: 'Dossier AM-002. Reference: contemporary Accra youth photography.' },
  { id: 'a-ch-kofi',    category: 'Character', name: 'Kofi Mensah', status: 'concept', source: 'Dossier KM-003. School uniform studies.' },
  { id: 'a-ch-opoku',   category: 'Character', name: 'Col. Yaw Opoku', status: 'concept', source: 'Dossier YO-004. Mirror framing against Kwame.' },
  { id: 'a-ui-dossier', category: 'UI', name: 'Dossier Frame + Stamp Set', status: 'inProduction', source: 'This bible page is the live UI mock.' },
  { id: 'a-ui-map',     category: 'UI', name: 'Field Map + Clue Tracker', status: 'inProduction', source: 'Spec: Intelligence Gathering system 4.0.' },
  { id: 'a-snd-theme',  category: 'Audio', name: 'Highlife Decay — Act I Theme', status: 'concept', source: 'Ebo Taylor corrupted; Ben Frost Trauma.', src: '/abode/audio-act1-theme.mp3' },
  { id: 'a-snd-radio',  category: 'Audio', name: 'Twi Radio Fragments', status: 'concept', source: 'Scripted fragments; native speaker review required.' },
  { id: 'a-map-ghana',  category: 'Map', name: 'Operational Map — Ghana', status: 'inProduction', source: 'Live in bible section 06; hand-drawn SVG silhouette.' },
  { id: 'a-ref-photo',  category: 'Reference', name: 'Location Photography Pack', status: 'concept', source: 'Tema, Osu, Kejetia, Tamale street-level documentation.' },
];
