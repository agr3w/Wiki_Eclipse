import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { AuthModal } from './components/auth/AuthModal';

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
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <AuthModal />
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
    </AuthProvider>
  );
};

export default AppRouter;
