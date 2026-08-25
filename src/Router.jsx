import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/layout/ScrollToTop';

const Home = lazy(() => import('./pages/public/Home').then(m => ({ default: m.Home || m.default })));
const Wiki = lazy(() => import('./pages/public/Wiki').then(m => ({ default: m.Wiki || m.default })));
const Store = lazy(() => import('./pages/public/Store').then(m => ({ default: m.Store || m.default })));

const LoadingFallback = () => (
  <div style={{
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.85rem',
    letterSpacing: '0.1em'
  }}>
    CARREGANDO SETOR...
  </div>
);

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar onOpenAuth={(mode) => console.log('Auth modal:', mode)} />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wiki" element={<Wiki />} />
          <Route path="/wiki/:categoryId" element={<Wiki />} />
          <Route path="/wiki/:categoryId/:topicId" element={<Wiki />} />
          <Route path="/loja" element={<Store />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
};

export default AppRouter;
