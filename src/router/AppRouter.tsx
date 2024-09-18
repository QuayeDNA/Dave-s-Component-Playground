// src/router/AppRouter.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import { Layout } from '../components/layout/Layout';

// Lazy load components
const Home = lazy(() => import('../pages/Home'));
const Overview = lazy(() => import('../pages/Overview'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Zones = lazy(() => import('@/components/Zone/ZoneManagementSystem'));

// Placeholder components for routes that don't exist yet
const Buttons = lazy(() => import('@/components/placeholders/Button'));
const Forms = lazy(() => import('@/components/placeholders/Forms'));
const Cards = lazy(() => import('@/components/placeholders/Cards'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-gray-900">
    <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
  </div>
);

const AppRouter: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<Layout />}>
              <Route path="/overview" element={<Overview />} />
              <Route path="/zones" element={<Zones />} />
              <Route path="/components/buttons" element={<Buttons />} />
              <Route path="/components/forms" element={<Forms />} />
              <Route path="/components/cards" element={<Cards />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default AppRouter;