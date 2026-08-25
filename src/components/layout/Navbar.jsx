import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

export const Navbar = ({ onOpenAuth }) => {
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
          <button className={styles.btnSecondary} onClick={() => onOpenAuth?.('login')}>
            Entrar
          </button>
          <button className={styles.btnPrimary} onClick={() => onOpenAuth?.('register')}>
            Criar Conta
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
