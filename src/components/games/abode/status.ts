import { G } from '@/data/abode/theme';

export const STATUS_COLORS: Record<string, string> = {
  concept: '#6a6258', inProgress: '#e8c84a', built: G, tested: '#8ab0b8', shipped: '#57d68a',
  draft: '#6a6258', finalized: '#e8c84a', locked: G,
  inProduction: '#e8c84a', final: '#8ab0b8', integrated: G,
  planned: '#6a6258', active: '#e8c84a', completed: G,
};

export const STATUS_LABELS: Record<string, string> = {
  concept: 'CONCEPT', inProgress: 'IN PROGRESS', built: 'BUILT', tested: 'TESTED', shipped: 'SHIPPED',
  draft: 'DRAFT', finalized: 'FINALIZED', locked: 'LOCKED',
  inProduction: 'IN PRODUCTION', final: 'FINAL', integrated: 'INTEGRATED',
  planned: 'PLANNED', active: 'ACTIVE', completed: 'COMPLETED',
};
