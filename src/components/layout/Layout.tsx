import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';

export const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const isLanding = pathname === '/';

  return (
    <div
      className="min-h-screen bg-background text-foreground"
    >
      {!isLanding && <Header />}
      <main className={isLanding ? '' : 'pt-[60px] min-h-[calc(100vh-60px)]'}>
        <Outlet />
      </main>
    </div>
  );
};
