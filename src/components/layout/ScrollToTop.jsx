import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { recordPageView } from '../../services/adminService';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });

    // Registra o tráfego da página no Firestore
    recordPageView(pathname);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
