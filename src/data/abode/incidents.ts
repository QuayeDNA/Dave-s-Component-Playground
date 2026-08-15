export interface Incident {
  phase: string; title: string; location: string; body: string;
}

export const INCIDENTS: Incident[] = [
  {
    phase: '01', title: 'D-Day / The Separation', location: 'Tema Industrial Area, Accra',
    body: "The separation. Tutorial-as-chaos. Kwame fights through collapsing Tema to reach the last known location of his children's school bus. He finds it empty — but finds the first clue: Ama's notebook with a handwritten note. The city is falling. He has to move before it fully goes dark.",
  },
  {
    phase: '02', title: 'The Road North', location: 'Cape Coast Highway → Kumasi Outskirts',
    body: "Following the trail through increasingly hostile territory. Alliances and betrayals with survivor groups. Ama is found — not saved, found. She's been managing. The truth slowly surfaces: someone is using the outbreak for control, and the children didn't end up where they are by accident.",
  },
  {
    phase: '03', title: 'Reunion', location: 'The Ark, Northern Region',
    body: "Kwame and Ama track Kofi together to the facility the faction calls the Ark. The emotional weight of the full reunion is earned — each character has changed and the relationships have to be renegotiated, not just restored. The ending turns on a single choice: what Kwame does after the confrontation with Col. Yaw Opoku.",
  },
];
