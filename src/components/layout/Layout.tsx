import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';

export const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const isLanding = pathname === '/';

  return (
    <div
      className="min-h-screen"
      style={{ background: '#06080f', color: '#e4eaf0' }}
    >
      {!isLanding && <Header />}
      <main className={isLanding ? '' : 'pt-[60px] min-h-[calc(100vh-60px)]'}>
        <Outlet />
      </main>
    </div>
  );
};
