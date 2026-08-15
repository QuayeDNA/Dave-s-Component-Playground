// src/router/AppRouter.tsx
import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import { Layout } from '../components/layout/Layout';
import { GameLayout } from '../components/layout/GameLayout';

const ChatGPTModelSelector = lazy(() => import('@/components/GPTModelRedesign/GptModel'));

// Lazy load components
const Home = lazy(() => import('../pages/Home'));
const Overview = lazy(() => import('../pages/Overview'));
const Apps = lazy(() => import('../pages/Apps'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Zones = lazy(() => import('@/components/Zone/ZoneManagementSystem'));
const TwoDAnimation = lazy(() => import('@/components/Animations/TwoDAnimations'));
const ThreeDAnimation = lazy(() => import('@/components/Animations/ThreeDAnimations'));
const Physics = lazy(() => import('@/components/Animations/Physics'));
const Tween = lazy(() => import('@/components/Animations/Tween'));
const Interactive3D = lazy(() => import('@/components/3DInteractive/Basics'));
const Interactive3DTorus = lazy(() => import('@/components/3DInteractive/Torus'));
const StickyNotes = lazy(() => import('@/components/stickyNotes/stickyNotes'));
const GamesIndex = lazy(() => import('@/components/games/GamesIndex'));
const IrregularPage = lazy(() => import('@/components/games/IrregularPage'));
const AbodePage = lazy(() => import('@/components/games/AbodePage'));
const AbodeTrackerPage = lazy(() => import('@/components/games/abode/AbodeTrackerPage'));
const GoldAndIronPage = lazy(() => import('@/components/games/GoldAndIronPage'));
const GameUIPage = lazy(() => import('@/components/games/GameUI/GameUIPage'));

const Buttons = lazy(() => import('@/components/placeholders/Button'));
const Forms = lazy(() => import('@/components/placeholders/Forms'));
const Cards = lazy(() => import('@/components/placeholders/Cards'));
const Notifications = lazy(() => import('@/components/placeholders/NotificationUI'));

// ── Route-aware loading screens ───────────────────────────────────

/** Playground: dark navy + blue spinner + monospace label */
const PlaygroundFallback = () => (
  <div
    className="flex flex-col items-center justify-center gap-4"
    style={{ height: '100vh', background: '#06080f' }}
  >
    <div className="relative">
      <Loader2
        className="w-9 h-9 animate-spin"
        style={{ color: '#4d8fc8' }}
      />
      <div
        className="absolute inset-0 rounded-full animate-ping"
        style={{ background: 'rgba(77,143,200,0.15)', animationDuration: '1.5s' }}
      />
    </div>
    <span
      className="text-[10px] tracking-[0.3em] uppercase"
      style={{ color: 'rgba(77,143,200,0.45)', fontFamily: 'monospace' }}
    >
      Loading…
    </span>
  </div>
);

/** Games: warm near-black + amber spinner + game-flavoured label */
const GamesFallback = () => (
  <div
    className="flex flex-col items-center justify-center gap-4"
    style={{ height: '100vh', background: '#0a0800' }}
  >
    <div className="relative">
      <Loader2
        className="w-9 h-9 animate-spin"
        style={{ color: '#c99142' }}
      />
      <div
        className="absolute inset-0 rounded-full animate-ping"
        style={{ background: 'rgba(201,145,66,0.15)', animationDuration: '1.8s' }}
      />
    </div>
    <span
      className="text-[10px] tracking-[0.3em] uppercase"
      style={{ color: 'rgba(201,145,66,0.45)', fontFamily: '"Bebas Neue", monospace', letterSpacing: '0.25em' }}
    >
      Entering the World…
    </span>
  </div>
);

// ── Router ────────────────────────────────────────────────────────

/**
 * Scroll manager. The browser's default scroll restoration (history.scrollRestoration
 * = 'auto') fires after the page content mounts and overrides any scrollTo(0,0),
 * which is why game pages used to land on their first section instead of the hero.
 *
 * We take over restoration manually:
 *  - new navigations (PUSH/REPLACE) start at the top → hero/landing
 *  - back/forward (POP) restores the exact position that route was scrolled to
 */
const ScrollManager: React.FC = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef<Map<string, number>>(new Map());

  // Register on every render so the map key below is always the location.key.
  const locationKey = useLocation().key;

  useEffect(() => {
    if (navigationType === 'POP') {
      const saved = scrollPositions.current.get(locationKey);
      window.scrollTo(0, saved ?? 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType, locationKey]);

  useEffect(() => {
    const onScroll = () => {
      const key = locationKey;
      if (window.scrollY > 0) scrollPositions.current.set(key, window.scrollY);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [locationKey]);

  useEffect(() => {
    history.scrollRestoration = 'manual';
  }, []);

  return null;
};

const AppRouter: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <ScrollManager />
        {/* Outer Suspense catches Layout itself and the Home landing page */}
        <Suspense fallback={<PlaygroundFallback />}>
          <Routes>
            <Route element={<Layout />}>

              {/* Landing */}
              <Route index element={<Home />} />

              {/* Playground — blue loader */}
              <Route path="apps" element={<Suspense fallback={<PlaygroundFallback />}><Apps /></Suspense>} />
              <Route path="overview" element={<Suspense fallback={<PlaygroundFallback />}><Overview /></Suspense>} />
              <Route path="zones" element={<Suspense fallback={<PlaygroundFallback />}><Zones /></Suspense>} />
              <Route path="sticky-notes" element={<Suspense fallback={<PlaygroundFallback />}><StickyNotes /></Suspense>} />
              <Route path="model-redesign" element={<Suspense fallback={<PlaygroundFallback />}><ChatGPTModelSelector /></Suspense>} />

              <Route path="animations/2d" element={<Suspense fallback={<PlaygroundFallback />}><TwoDAnimation /></Suspense>} />
              <Route path="animations/3d" element={<Suspense fallback={<PlaygroundFallback />}><ThreeDAnimation /></Suspense>} />
              <Route path="animations/physics" element={<Suspense fallback={<PlaygroundFallback />}><Physics /></Suspense>} />
              <Route path="animations/tween" element={<Suspense fallback={<PlaygroundFallback />}><Tween /></Suspense>} />

              <Route path="3d-interactive" element={<Suspense fallback={<PlaygroundFallback />}><Interactive3D /></Suspense>} />
              <Route path="3d-interactive/torus" element={<Suspense fallback={<PlaygroundFallback />}><Interactive3DTorus /></Suspense>} />

              <Route path="components/buttons" element={<Suspense fallback={<PlaygroundFallback />}><Buttons /></Suspense>} />
              <Route path="components/forms" element={<Suspense fallback={<PlaygroundFallback />}><Forms /></Suspense>} />
              <Route path="components/cards" element={<Suspense fallback={<PlaygroundFallback />}><Cards /></Suspense>} />
              <Route path="components/notification" element={<Suspense fallback={<PlaygroundFallback />}><Notifications /></Suspense>} />

            </Route>

            {/* Games — bare layout, each game owns its full viewport (no root header) */}
            <Route element={<GameLayout />}>

              {/* Games — warm amber loader */}
              <Route path="games" element={<Suspense fallback={<GamesFallback />}><GamesIndex /></Suspense>} />
              <Route path="games/irregular" element={<Suspense fallback={<GamesFallback />}><IrregularPage /></Suspense>} />
              <Route path="games/abode" element={<Suspense fallback={<GamesFallback />}><AbodePage /></Suspense>} />
              <Route path="games/abode/dev-tracker" element={<Suspense fallback={<GamesFallback />}><AbodeTrackerPage /></Suspense>} />
              <Route path="games/gold-and-iron" element={<Suspense fallback={<GamesFallback />}><GoldAndIronPage /></Suspense>} />
              <Route path="games/ui" element={<Suspense fallback={<GamesFallback />}><GameUIPage /></Suspense>} />

            </Route>

            <Route path="*" element={<Suspense fallback={<PlaygroundFallback />}><NotFound /></Suspense>} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default AppRouter;