import { G, WARN, PALE } from './theme';

export type BeatType = 'incident' | 'intel' | 'contact' | 'objective' | 'personal';

export interface Beat {
  id: string; track: 'kwame' | 'ama'; type: BeatType;
  label: string; location: string; description: string;
  act: 'I' | 'II' | 'III'; known: boolean;
}

export const BEAT_COLORS: Record<BeatType, string> = {
  incident: WARN, intel: G, contact: '#e8c84a', objective: PALE, personal: '#a8c8e8',
};

export const BEAT_TYPE_LABELS: Record<BeatType, string> = {
  incident: 'THREAT', intel: 'INTEL', contact: 'CONTACT', objective: 'OBJECTIVE', personal: 'PERSONAL',
};

export const BEATS: Beat[] = [
  // ACT I — KWAME
  { id:'k1', track:'kwame', act:'I', type:'incident', known:true, label:'D-Day — Checkpoint Collapse', location:'Tema, N1 Highway', description:"The evacuation checkpoint on the N1 collapses under panic and pressure. Kwame is separated from his children in the crush. By the time he fights clear, the school bus is gone." },
  { id:'k2', track:'kwame', act:'I', type:'intel', known:true, label:'Ama\'s Notebook Found', location:'School Bus — Tema Industrial', description:"The bus is empty. No bodies. Seat 14: Ama's notebook. A note in her handwriting, clearly written in a hurry: 'Kofi is with me. We're going to [SMUDGED]. Don't look for us here.'" },
  { id:'k3', track:'kwame', act:'I', type:'contact', known:true, label:'First Survivor Contact', location:'Osu, Accra', description:"A former market trader holed up in his compound. He saw children being loaded into vehicles — unmarked, military-style. He thought it was evacuation. He's not sure anymore." },
  { id:'k4', track:'kwame', act:'I', type:'objective', known:true, label:'Cape Coast Route Confirmed', location:'Osu → Cape Coast Highway', description:"Piecing together accounts, Kwame traces the vehicles toward Cape Coast. The N1 westbound is the only viable route. He moves at night. He doesn't stop." },
  // ACT I — AMA (Kwame doesn't know this)
  { id:'a1', track:'ama', act:'I', type:'personal', known:false, label:'Separated — Ama Takes Control', location:'Tema, N1 Highway', description:"[Kwame does not know this yet] When the checkpoint collapsed, Ama grabbed Kofi and pulled him away from the crush. She found a group of survivors heading west. She didn't know where Kwame was. She made a decision." },
  { id:'a2', track:'ama', act:'I', type:'incident', known:false, label:'First Night — Alone', location:'Cape Coast Road (Unknown Point)', description:"[Kwame does not know this yet] Ama and Kofi slept in an abandoned vehicle. She gave him the last of her food. She didn't tell him they might not find their father." },
  // ACT II — KWAME
  { id:'k5', track:'kwame', act:'II', type:'contact', known:true, label:'Cape Coast Survivor Camp', location:'Coastal Fishing Village', description:"A fishing village functioning as an informal survivor camp. A woman remembers two children — a teenage girl with short hair, a younger boy. They were here. They left with a convoy heading to Kumasi. Three days ago." },
  { id:'k6', track:'kwame', act:'II', type:'incident', known:true, label:'Splinter Faction Encounter', location:'Cape Coast Highway, North Junction', description:"First contact with the antagonist's splinter group. Not zombies — men in mismatched military gear controlling the junction. They let Kwame pass. They're watching him. He knows them. One of the men looks away when Kwame's eyes meet his." },
  { id:'k7', track:'kwame', act:'II', type:'objective', known:true, label:'Kumasi Approached', location:'Kumasi Outskirts', description:"Kumasi is different from Accra. It held longer, fell harder. The market district is the faction's hub. Getting in means going through them or around them. Kwame chooses through." },
  { id:'k8', track:'kwame', act:'II', type:'intel', known:true, label:'Ama\'s Message Found', location:'Kumasi Central Market', description:"Scratched into the wooden frame of a kiosk in the old market: three words in Twi. It's Ama's handwriting. She knew someone might follow. She knew it might be him. She left him a direction." },
  // ACT II — AMA (Kwame learns this when they reunite)
  { id:'a3', track:'ama', act:'II', type:'incident', known:false, label:'Kumasi — Detained', location:'Kumasi Market Area', description:"[Revealed at reunion] The convoy was intercepted. Ama and Kofi were separated and held in the market area. Ama quickly assessed the faction — their structure, their weaknesses, who among them has doubts." },
  { id:'a4', track:'ama', act:'II', type:'personal', known:false, label:'Kofi Moved North', location:'Kumasi — Faction Holding Area', description:"[Revealed at reunion] Kofi was moved before Ama could act. She saw it happen. She couldn't stop it. She's been tracking the route since, waiting for an opportunity — or for backup." },
  { id:'a5', track:'ama', act:'II', type:'contact', known:false, label:'Ama Makes Allies', location:'Kumasi Market', description:"[Revealed at reunion] Ama identified three faction members who are there under duress. She's been building trust with them slowly. When Kwame arrives, these allies are available — but only if Kwame doesn't immediately blow it with his approach." },
  // ACT III — TOGETHER
  { id:'k9', track:'kwame', act:'III', type:'personal', known:true, label:'Reunion — Ama Found', location:'Kumasi Market District', description:"Not a rescue. Ama was waiting for the right moment. Kwame arriving is the moment. The reunion is not tearful — it's tense, quick, and immediately tactical. There is no time. She briefs him like a soldier. He realizes who his daughter has become." },
  { id:'k10', track:'kwame', act:'III', type:'intel', known:true, label:'Full Picture Assembled', location:'Kumasi → North Road', description:"Ama's intelligence combined with Kwame's trail. For the first time, they know exactly what's happening, who is responsible, and where Kofi is. Col. Yaw Opoku. Kwame says nothing for a long moment." },
  { id:'k11', track:'kwame', act:'III', type:'objective', known:true, label:'North — Final Approach', location:'Northern Interior', description:"Father and daughter moving north together. The dynamic has shifted. Kwame follows Ama's route intel. She leads more than he does. He lets her." },
  { id:'k12', track:'kwame', act:'III', type:'incident', known:true, label:'Final Confrontation', location:'The Ark — Northern Region', description:"Kofi is found. He is alive. Inside the Ark's grounds, Col. Yaw Opoku is waiting — not surprised, not hiding. The confrontation happens. The ending is determined by choices Kwame has made across all three acts — not by a single decision at the end." },
];
