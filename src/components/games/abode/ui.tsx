import React from 'react';
import { motion } from 'framer-motion';
import { G, WARN, PALE, BG, SURF, BORD } from '@/data/abode/theme';

export const TodoPlaceholder: React.FC<{ title: string; notes?: string[] }> = ({ title, notes = [] }) => (
  <div style={{ background: SURF, border: `1px solid ${BORD}` }} className="relative overflow-hidden">
    <div className="flex flex-wrap items-center justify-between px-4 py-2.5 gap-1"
      style={{ background: `${WARN}15`, borderBottom: `1px solid ${WARN}28` }}>
      <span className="at" style={{ color: WARN, fontSize: '0.75rem', letterSpacing: '0.22em' }}>ACCESS RESTRICTED</span>
      <span className="am" style={{ color: PALE, fontSize: '0.52rem', letterSpacing: '0.18em', opacity: 0.38 }}>
        REF: {title.replace(/\s+/g, '-').toUpperCase().slice(0, 30)}
      </span>
    </div>
    <div className="p-6">
      <div className="space-y-3 mb-6">
        {[1, 0.62, 0.9, 0.68, 0.82].map((w, i) => (
          <div key={i} style={{
            height: i === 2 ? 20 : 11,
            background: BG,
            border: `1px solid ${BORD}44`,
            width: `${Math.round(w * 100)}%`,
          }} />
        ))}
      </div>
      <div className="flex justify-center my-6">
        <motion.div animate={{ opacity: [0.45, 0.7, 0.45] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
          <div className="astamp" style={{ color: WARN, borderColor: WARN, fontSize: '0.8rem', letterSpacing: '0.28em', opacity: 1 }}>
            ASSET PENDING CLEARANCE
          </div>
        </motion.div>
      </div>
      {notes.length > 0 && (
        <div className="pt-4" style={{ borderTop: `1px dashed ${BORD}` }}>
          <div className="am mb-3" style={{ color: G, fontSize: '0.52rem', letterSpacing: '0.28em', opacity: 0.38 }}>
            FIELD REFERENCE DATA:
          </div>
          <div className="space-y-1.5">
            {notes.map((n, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="am flex-shrink-0" style={{ color: WARN, fontSize: '0.58rem', opacity: 0.42 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="am" style={{ color: PALE, fontSize: '0.62rem', opacity: 0.38, lineHeight: 1.6 }}>{n}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export const FieldNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="ab leading-loose mb-4" style={{ color: PALE, opacity: 0.82, fontSize: '1.05rem', lineHeight: 1.9 }}>{children}</div>
);

export const IntelCard: React.FC<{ category: string; content: string }> = ({ category, content }) => (
  <div style={{ background: SURF, border: `1px solid ${BORD}`, padding: '1.25rem' }}>
    <div className="am mb-2" style={{ color: G, fontSize: '0.75rem', letterSpacing: '0.25em', opacity: 0.55 }}>[{category.toUpperCase()}]</div>
    <div className="ab leading-relaxed" style={{ color: PALE, opacity: 0.78, fontSize: '0.95rem' }}>{content}</div>
  </div>
);

export const ManualEntry: React.FC<{ number: string; title: string; body: string }> = ({ number, title, body }) => (
  <motion.div className="mb-5 flex gap-3 sm:gap-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
    <div className="am flex-shrink-0" style={{ color: G, fontSize: '1.1rem', opacity: 0.35, width: 28, textAlign: 'right' }}>{number}</div>
    <div>
      <div className="at mb-1" style={{ color: G, fontSize: '1rem', letterSpacing: '0.05em' }}>{title}</div>
      <div className="ab leading-relaxed" style={{ color: PALE, opacity: 0.72, fontSize: '1rem' }}>{body}</div>
    </div>
  </motion.div>
);

export const MissionBrief: React.FC<{ label: string; text: string }> = ({ label, text }) => (
  <div className="my-8 p-5" style={{ background: `${WARN}0a`, border: `1px solid ${WARN}30`, borderLeft: `3px solid ${WARN}` }}>
    <div className="am mb-2" style={{ color: WARN, fontSize: '0.8rem', letterSpacing: '0.3em', opacity: 0.7 }}>!! {label.toUpperCase()} !!</div>
    <p className="ab italic leading-relaxed" style={{ color: PALE, opacity: 0.82, fontSize: '1.05rem' }}>{text}</p>
  </div>
);

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

export const StatusChip: React.FC<{ status: string }> = ({ status }) => {
  const color = STATUS_COLORS[status] || PALE;
  return (
    <span className="am inline-block px-2 py-0.5" style={{ fontSize: '0.6rem', letterSpacing: '0.18em', color, border: `1px solid ${color}`, opacity: 0.85 }}>
      {STATUS_LABELS[status] || status.toUpperCase()}
    </span>
  );
};

export const ProgressBar: React.FC<{ value: number; color?: string }> = ({ value, color = G }) => (
  <div className="abar-track">
    <div className="abar-fill" style={{ background: color, width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);
