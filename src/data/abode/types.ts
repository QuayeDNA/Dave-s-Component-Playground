export type FeatureStatus = 'concept' | 'inProgress' | 'built' | 'tested' | 'shipped';
export type StoryStatus = 'draft' | 'finalized' | 'locked';
export type AssetStatus = 'concept' | 'inProduction' | 'final' | 'integrated';
export type MilestoneStatus = 'planned' | 'active' | 'completed';

export const FEATURE_ORDER: FeatureStatus[] = ['concept', 'inProgress', 'built', 'tested', 'shipped'];
export const STORY_ORDER: StoryStatus[] = ['draft', 'finalized', 'locked'];
export const ASSET_ORDER: AssetStatus[] = ['concept', 'inProduction', 'final', 'integrated'];
export const MILESTONE_ORDER: MilestoneStatus[] = ['planned', 'active', 'completed'];

export const FEATURE_WEIGHTS: Record<FeatureStatus, number> = { concept: 0, inProgress: 0.35, built: 0.7, tested: 0.9, shipped: 1 };
export const STORY_WEIGHTS: Record<StoryStatus, number> = { draft: 0, finalized: 0.6, locked: 1 };
export const ASSET_WEIGHTS: Record<AssetStatus, number> = { concept: 0, inProduction: 0.5, final: 0.85, integrated: 1 };
export const MILESTONE_WEIGHTS: Record<MilestoneStatus, number> = { planned: 0, active: 0.5, completed: 1 };

export function pct(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100);
}

export type ResearchCat = 'Geography' | 'Culture & Language' | 'Military & Emergency' | 'Ancestral Beliefs' | 'Accuracy Charter';

export type AssetCategory =
  | 'Concept Art' | 'Character' | 'Environment' | 'UI' | 'Audio' | 'Map' | 'Reference';
