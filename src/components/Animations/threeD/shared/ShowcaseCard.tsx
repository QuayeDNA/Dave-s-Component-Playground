import React from 'react';
import { LazyCanvas } from './SceneActiveContext';

interface ShowcaseCardProps {
  title: string;
  description: string;
  useCase: string;
  children: React.ReactNode;
  bg?: string; // canvas background colour
}
export const ShowcaseCard: React.FC<ShowcaseCardProps> = ({ title, description, useCase, children, bg }) => (
  <div
    className="rounded-xl flex flex-col"
    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
  >
    <div className="px-5 pt-5 pb-1">
      <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.88)' }}>{title}</h3>
      <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.36)' }}>{description}</p>
    </div>
    <div className="mx-5 my-3 rounded-lg overflow-hidden" style={{ height: 220 }}>
      <LazyCanvas bg={bg}>{children}</LazyCanvas>
    </div>
    <div className="px-5 pb-4 flex items-center gap-1.5">
      <span className="text-[9px] tracking-[0.2em] uppercase font-semibold" style={{ color: 'rgba(255,255,255,0.16)' }}>use case</span>
      <span className="text-[11px]" style={{ color: '#7eb8e8', opacity: 0.75 }}>— {useCase}</span>
    </div>
  </div>
);