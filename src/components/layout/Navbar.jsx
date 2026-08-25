import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const { user, logout, openAuthModal } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.brand}>
          <div className={styles.brandIcon} />
          <span className={styles.brandText}>
            ECLIPSE <span className={styles.brandSubtitle}>: ECOS DO ABISMO</span>
          </span>
        </NavLink>

        <nav>
          <ul className={styles.navLinks}>
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink}
              >
                Início
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/wiki" 
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink}
              >
                Wiki Oficial
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/loja" 
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink}
              >
                Loja
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/biblioteca" 
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink}
              >
                Biblioteca
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className={styles.actions}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <NavLink to="/biblioteca" className={styles.btnSecondary}>
                👤 {user.displayName || user.email?.split('@')[0] || 'Usuário'}
              </NavLink>
              <button className={styles.btnSecondary} onClick={logout}>
                Sair
              </button>
            </div>
          ) : (
            <>
              <button className={styles.btnSecondary} onClick={() => openAuthModal('login')}>
                Entrar
              </button>
              <button className={styles.btnPrimary} onClick={() => openAuthModal('register')}>
                Criar Conta
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
