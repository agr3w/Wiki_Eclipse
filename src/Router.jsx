import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { AuthModal } from './components/auth/AuthModal';
import { EclipseLoader } from './components/ui/EclipseLoader';

const Home = lazy(() => import('./pages/public/Home').then(m => ({ default: m.Home || m.default })));
const Wiki = lazy(() => import('./pages/public/Wiki').then(m => ({ default: m.Wiki || m.default })));
const Store = lazy(() => import('./pages/public/Store').then(m => ({ default: m.Store || m.default })));
const Profile = lazy(() => import('./pages/public/Profile').then(m => ({ default: m.Profile || m.default })));

export const AppRouter = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <AuthModal />
        <Suspense fallback={<EclipseLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wiki" element={<Wiki />} />
            <Route path="/wiki/:categoryId" element={<Wiki />} />
            <Route path="/wiki/:categoryId/:topicId" element={<Wiki />} />
            <Route path="/loja" element={<Store />} />
            <Route path="/biblioteca" element={<Profile />} />
            <Route path="/perfil" element={<Profile />} />
          </Routes>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppRouter;
