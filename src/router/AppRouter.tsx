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
const TwoDAnimation = lazy(() => import('@/components/Animations/TwoDAnimations'));
const ThreeDAnimation = lazy(() => import('@/components/Animations/ThreeDAnimations'));
const Physics = lazy(() => import('@/components/Animations/Physics'));
const Tween = lazy(() => import('@/components/Animations/Tween'));
const Interactive = lazy(() => import('@/components/Animations/Interactive'));
const Morph = lazy(() => import('@/components/Animations/Morph'));
const Interactive3D = lazy(() => import('@/components/3DInteractive/Basics'));
const Interactive3DTorus = lazy(() => import('@/components/3DInteractive/Torus'));
const StickyNotes = lazy(() => import('@/components/stickyNotes/stickyNotes'));

// Placeholder components for routes that don't exist yet
const Buttons = lazy(() => import('@/components/placeholders/Button'));
const Forms = lazy(() => import('@/components/placeholders/Forms'));
const Cards = lazy(() => import('@/components/placeholders/Cards'));
const Notifications = lazy(() => import('@/components/placeholders/NotificationUI'))


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
              <Route path="/animations/2d" element={<TwoDAnimation />} />
              <Route path="/animations/3d" element={<ThreeDAnimation />} />
              <Route path="/animations/physics" element={<Physics />} />
              <Route path="/animations/tween" element={<Tween />} />
              <Route path="/animations/interactive" element={<Interactive />} />

              <Route path="/sticky-notes" element={<StickyNotes />} />
              
              <Route path="/3d-interactive" element={<Interactive3D />} />
              <Route path="/3d-interactive/torus" element={<Interactive3DTorus />} />
              <Route path="/animations/morph" element={<Morph />} />
              <Route path="/components/buttons" element={<Buttons />} />
              <Route path="/components/forms" element={<Forms />} />
              <Route path="/components/cards" element={<Cards />} />
              <Route path="/components/notification" element={<Notifications />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default AppRouter;