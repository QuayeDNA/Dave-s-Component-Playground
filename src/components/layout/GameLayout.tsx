import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Bare layout for game worlds. Renders nothing of its own — game pages own
 * their full viewport (backgrounds, chrome, min-height). A game-specific
 * header/footer can be added here later without inheriting the root design.
 */
export const GameLayout: React.FC = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Outlet />
  </div>
);
