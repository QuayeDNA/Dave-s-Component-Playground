// src/router/AppRouter.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import { Layout } from '../components/layout/Layout';

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
const Interactive = lazy(() => import('@/components/Animations/Interactive'));
const Morph = lazy(() => import('@/components/Animations/Morph'));
const Interactive3D = lazy(() => import('@/components/3DInteractive/Basics'));
const Interactive3DTorus = lazy(() => import('@/components/3DInteractive/Torus'));
const StickyNotes = lazy(() => import('@/components/stickyNotes/stickyNotes'));
const GamesIndex = lazy(() => import('@/components/games/GamesIndex'));
const IrregularPage = lazy(() => import('@/components/games/IrregularPage'));
const AbodePage = lazy(() => import('@/components/games/AbodePage'));
const GoldAndIronPage = lazy(() => import('@/components/games/GoldAndIronPage'));

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

const AppRouter: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
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
              <Route path="animations/interactive" element={<Suspense fallback={<PlaygroundFallback />}><Interactive /></Suspense>} />
              <Route path="animations/morph" element={<Suspense fallback={<PlaygroundFallback />}><Morph /></Suspense>} />

              <Route path="3d-interactive" element={<Suspense fallback={<PlaygroundFallback />}><Interactive3D /></Suspense>} />
              <Route path="3d-interactive/torus" element={<Suspense fallback={<PlaygroundFallback />}><Interactive3DTorus /></Suspense>} />

              <Route path="components/buttons" element={<Suspense fallback={<PlaygroundFallback />}><Buttons /></Suspense>} />
              <Route path="components/forms" element={<Suspense fallback={<PlaygroundFallback />}><Forms /></Suspense>} />
              <Route path="components/cards" element={<Suspense fallback={<PlaygroundFallback />}><Cards /></Suspense>} />
              <Route path="components/notification" element={<Suspense fallback={<PlaygroundFallback />}><Notifications /></Suspense>} />

              {/* Games — warm amber loader */}
              <Route path="games" element={<Suspense fallback={<GamesFallback />}><GamesIndex /></Suspense>} />
              <Route path="games/irregular" element={<Suspense fallback={<GamesFallback />}><IrregularPage /></Suspense>} />
              <Route path="games/abode" element={<Suspense fallback={<GamesFallback />}><AbodePage /></Suspense>} />
              <Route path="games/gold-and-iron" element={<Suspense fallback={<GamesFallback />}><GoldAndIronPage /></Suspense>} />

            </Route>

            <Route path="*" element={<Suspense fallback={<PlaygroundFallback />}><NotFound /></Suspense>} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default AppRouter;