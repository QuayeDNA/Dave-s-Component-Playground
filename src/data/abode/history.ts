export interface HistoryEntry {
  id: string;
  era: string;
  title: string;
  body: string;
}

export const HISTORY_ENTRIES: HistoryEntry[] = [
  {
    id: 'h1',
    era: 'BEFORE',
    title: 'The North Before the Fall',
    body: "Ghana was holding together — barely, as most countries do. The north moved slower: red laterite roads, tamarind shade, markets that opened at dawn and emptied by noon. When the first reports came out of the rural districts — the dead not staying dead, relatives walking home after burial — they were read as rumor. The capital had its own problems. Nobody wanted to believe the north was asking for help.",
  },
  {
    id: 'h2',
    era: 'DAYS 1–3',
    title: 'Origin & First Spread',
    body: "The outbreak began in the north and traveled south along the roads it would later consume — village, then district, then town. There was no patient zero identified, no broadcast explanation, no quarantine that held. It moved faster than any emergency protocol. Within weeks the country was no longer reporting cases. It was reporting regions.",
  },
  {
    id: 'h3',
    era: 'D-DAY',
    title: 'The Collapse of Order',
    body: "NADMO and the Ghana Armed Forces were overwhelmed by the scale. Communications failed district by district. The government broadcast a single evacuation order — D-Day — and the country tried to move at once. The evacuation checkpoints were the first structures to fail. On the N1 at Tema, panic turned a controlled movement into a crush. Kwame Mensah lost his children in that crush.",
  },
  {
    id: 'h4',
    era: 'ONGOING',
    title: 'The Dead That Would Not Transition',
    body: "In Akan tradition, the dead do not cease — they pass to the realm of the ancestors and remain in contact with the living. What rose in Ghana refused that passage. They did not speak, did not recognize, belonged to neither the living nor the ancestor world. Some survivors read it as disease. Others read it as a rupture in the oldest relationship there is. Neither reading has ever been confirmed. Both are lived with.",
  },
  {
    id: 'h5',
    era: 'ACT III',
    title: 'The Ark',
    body: "While the country fell, someone was collecting. Unmarked, military-style vehicles moved unaccompanied children north along back routes, away from the fighting, toward a facility the faction calls the Ark. Col. Yaw Opoku — Kwame's old comrade from ECOMOG, Liberia — believes order, not compassion, is what saves people. The children are not taken by accident. They are the seed he is preserving.",
  },
  {
    id: 'h6',
    era: 'BOTH',
    title: 'Two Explanations',
    body: "As the outbreak spread, two frameworks hardened among survivors: the scientific — a pathogen, a weapon, a thing that can be understood; and the traditional — a curse, a punishment, a rupture in the ancestor-living relationship. The game never confirms either. Kwame, a soldier, defaults to the scientific frame. He has lived long enough to keep a place for the other one.",
  },
];
