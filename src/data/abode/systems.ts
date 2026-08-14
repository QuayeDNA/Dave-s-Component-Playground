export interface SystemEntry {
  id: string;
  number: string;
  title: string;
  body: string;
}

export const SYSTEMS: SystemEntry[] = [
  { id: 'sys-inventory', number: '1.0', title: 'INVENTORY & EQUIPMENT SYSTEM',
    body: "Scavenged weapons (machetes, shotguns, repurposed tools), medical supplies, food, fuel. Weight limits force real decisions. Kwame can modify weapons using found parts. Local items: palm oil tins, dried fish (high calorie), kenkey wraps, sachet water." },
  { id: 'sys-endurance', number: '2.0', title: 'ENDURANCE & INJURY MODEL',
    body: "Stamina and injury system that reflects Kwame's age. Wounds persist between levels unless treated. Running costs stamina. Every encounter has an accumulating cost — by Act III, Kwame carries the whole game in his body." },
  { id: 'sys-rest', number: '3.0', title: 'BASE & REST PHASES',
    body: "Between levels: a compound, a school, an abandoned petrol station. Resource management, crafting, survivor NPC encounters. Decisions here create narrative branches that affect what help is available in later levels." },
  { id: 'sys-intel', number: '4.0', title: 'INTELLIGENCE GATHERING',
    body: "Kwame tracks his children through clues: a schoolbag, a survivor's account, a radio message in Twi. Fragments update a hand-drawn map that drives progression. He's searching — not following a waypoint." },
  { id: 'sys-culture', number: '5.0', title: 'CULTURAL TEXTURE',
    body: "NPCs speak in a mix of English, Twi, and pidgin. Inventory includes local staples. Enemies include human factions — bandits, military splinter groups, cult survivors. The world feels specifically Ghanaian." },
  { id: 'sys-zombie', number: '6.0', title: 'ZOMBIE STAGE SYSTEM',
    body: "Stage 1: Recently turned — fast, disoriented, responds to sound. Stage 2: Settled — slower, territorial, senses heat. Stage 3: Rooted — near-stationary, wide aggro radius, used as zone hazards. Stage 4: The Recalled — old dead that remember. They do not attack; they recognize, and they reproduce the voices of the living they loved. The game never confirms what they are." },
  { id: 'sys-stealth', number: '7.0', title: 'STEALTH & AVOIDANCE',
    body: "Kwame is 62 with limited stamina. Stealth is rewarded more than combat. Crouching, distraction, route planning. Killing every threat is not sustainable — and the game's resource system ensures the player feels this." },
  { id: 'sys-morality', number: '8.0', title: 'MORAL DECISION SYSTEM',
    body: "Helping or ignoring survivors affects the world state. Camps Kwame aided are different on a return pass. NPCs remember behavior. The world is a record of choices — not a score, but a quiet, accumulating consequence." },
];
