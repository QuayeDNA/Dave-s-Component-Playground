import React from 'react';
import { motion } from 'framer-motion';

interface RedactionBarProps {
  revealed: boolean;
  delay?: number;
  duration?: number;
  barColor?: string;
  variant?: 0 | 1 | 2;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

// Rough marker-stroke silhouettes — deliberately irregular top/bottom edges
// and a notched leading (right) edge, wider than any container so the jags
// bleed past the clip rather than terminating in a straight line.
const MARKER_CLIPS = [
  'polygon(0% 9%,5% 3%,10% 8%,16% 1%,23% 7%,31% 0%,39% 6%,48% 1%,56% 8%,' +
  '64% 2%,72% 7%,80% 0%,88% 6%,95% 1%,100% 4%,100% 93%,94% 98%,86% 92%,' +
  '78% 99%,70% 93%,62% 100%,54% 94%,46% 99%,38% 93%,30% 98%,22% 92%,' +
  '14% 97%,6% 91%,1% 96%)',
  'polygon(0% 4%,6% 9%,12% 2%,19% 8%,27% 1%,35% 7%,43% 0%,51% 6%,59% 1%,' +
  '67% 8%,75% 2%,83% 7%,91% 1%,100% 6%,100% 96%,93% 91%,85% 98%,' +
  '77% 92%,69% 97%,61% 91%,53% 98%,45% 92%,37% 97%,29% 91%,21% 99%,' +
  '13% 93%,5% 98%,0% 92%)',
  'polygon(0% 6%,4% 1%,11% 7%,18% 2%,25% 9%,33% 1%,41% 6%,49% 0%,57% 7%,' +
  '65% 1%,73% 8%,81% 2%,89% 6%,96% 0%,100% 5%,100% 94%,95% 99%,87% 93%,' +
  '79% 97%,71% 92%,63% 99%,55% 93%,47% 98%,39% 92%,31% 97%,23% 91%,' +
  '15% 96%,7% 90%,2% 95%)',
];

export const RedactionBar: React.FC<RedactionBarProps> = ({
  revealed, delay = 0, duration = 0.7, barColor = '#0a0705', variant = 0,
  className, style, children,
}) => (
  <span
    className={className}
    style={{ position: 'relative', display: 'inline-block', ...style }}
  >
    {children}
    <span
      aria-hidden="true"
      style={{
        position: 'absolute', top: '-16%', bottom: '-16%', left: '-6%', right: '-6%',
        overflow: 'hidden', pointerEvents: 'none',
      }}
    >
      <motion.span
        initial={{ x: '0%' }}
        animate={{ x: revealed ? '-115%' : '0%' }}
        transition={{ duration, delay, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: 'absolute', top: 0, bottom: 0, left: 0,
          width: '130%',
          background: barColor,
          clipPath: MARKER_CLIPS[variant],
          transform: 'rotate(-0.6deg)',
        }}
      />
    </span>
  </span>
);