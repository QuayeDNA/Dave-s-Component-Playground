import { WARN } from './theme';

export interface Zone {
  id: string;
  label: string;
  act: string;
  coords: { x: number; y: number };
  status: string;
  statusColor: string;
  threat: string;
  resources: string;
  intel: string;
  locations: string[];
}

export const ZONES: Zone[] = [
  {
    id: 'tema',
    label: 'TEMA / ACCRA', act: 'ACT I',
    coords: { x: 66.6, y: 78.9 },
    status: 'FALLEN', statusColor: WARN,
    threat: 'HIGH — Active outbreak, collapsing infrastructure',
    resources: 'Military depot (looted), petrol station, pharmaceutical warehouse',
    intel: "Kwame's last known location of the school bus: Tema Industrial Area, near the GAF checkpoint on the N1. The checkpoint collapsed during D-Day panic. Bus found empty — Ama's notebook recovered from seat 14.",
    locations: ['Tema Industrial Area', 'Osu residential streets', 'Kotoka approach road', 'GAF Checkpoint Delta'],
  },
  {
    id: 'coast',
    label: 'CAPE COAST ROAD', act: 'ACT I–II',
    coords: { x: 48.3, y: 85.6 },
    status: 'CONTESTED', statusColor: '#e8c84a',
    threat: 'MODERATE — Abandoned vehicles, isolated threats, bandit activity',
    resources: 'Abandoned convoy supplies, fuel from stranded vehicles, roadside kiosks',
    intel: "Primary route west. Evidence of a large civilian convoy that moved through 4–6 days ago. Survivor accounts mention children being 'escorted north' by men in unmarked military vehicles near the Cape Coast junction.",
    locations: ['N1 highway westbound', 'Cape Coast junction', 'Abandoned fuel depot', 'Coastal fishing village (survivor camp)'],
  },
  {
    id: 'kumasi',
    label: 'KUMASI DISTRICT', act: 'ACT II',
    coords: { x: 43.0, y: 67.7 },
    status: 'OCCUPIED', statusColor: WARN,
    threat: 'HIGH — Human faction territory. Antagonist splinter group controls central market zone.',
    resources: 'Kumasi central market (contested), Komfo Anokye Teaching Hospital (partially operational), military barracks (hostile-held)',
    intel: "Ama was here. Found evidence — her jacket, a message scratched into a kiosk wall in Twi. She moved on approximately 2 days ago. The splinter faction is using the market as a processing hub. Something is being moved north.",
    locations: ['Kumasi Central Market', 'Komfo Anokye Hospital', 'Kejetia transport hub', 'Northern road junction'],
  },
  {
    id: 'north',
    label: 'NORTHERN INTERIOR', act: 'ACT III',
    coords: { x: 59.5, y: 24.9 },
    status: 'UNKNOWN', statusColor: '#888',
    threat: 'UNKNOWN — No reliable intelligence. Radio silence. The ground around the facility is different.',
    resources: 'Unknown. Possibly isolated community settlements.',
    intel: "Radio intercepts place a functioning facility north of Tamale — a repurposed teacher-training college running its own radio net. Survivor accounts from the convoy mention children being moved there. Kofi is among them. The dead near the site are not behaving like the dead elsewhere. The Ark, the faction calls it.",
    locations: ['Old teacher-training college (the Ark)', 'Tamale approach roads', 'Ark perimeter fence', '[CLASSIFIED]'],
  },
];

export interface ZoneVisual {
  zone: string; time: string; palette: string; feel: string;
}

export const ZONE_VISUALS: ZoneVisual[] = [
  { zone: 'Tema / Accra', time: 'Dusk → Night', palette: 'Red laterite dust, concrete grey, fire orange against dark sky', feel: 'Claustrophobic. The streets were built for cars, not refugees. Industrial scale makes survival feel small.' },
  { zone: 'Cape Coast Road', time: 'Dawn → Midday', palette: 'Pale sky blue overhead, green-brown roadside bush, bleached tarmac', feel: 'Exposed. The highway offers no cover. Distance is the only safety, and the road is very long.' },
  { zone: 'Kumasi District', time: 'Overcast / Midday', palette: 'Deep ochre market stalls, faded signage colors, concrete shadow', feel: 'Familiar turned wrong. A market full of life becomes a maze of threat. Memory makes it worse.' },
  { zone: 'Northern Interior', time: 'Night / Unknown', palette: 'Near-monochrome — dark greens, deep shadow, single light sources', feel: "Alien. Kwame doesn't know this territory. His military instincts work but his cultural map doesn't." },
];
