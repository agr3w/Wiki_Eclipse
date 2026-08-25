import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Material UI Icons
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';

import styles from './Navbar.module.css';

export const Navbar = () => {
  const { user, logout, openAuthModal } = useAuth();

  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : 'S';

  const userDisplayName = user?.displayName || user?.email?.split('@')[0] || 'Sentinela';

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Marca com Ícone de Eclipse Solar */}
        <NavLink to="/" className={styles.brand}>
          <div className={styles.eclipseOrb}>
            <div className={styles.eclipseDisc} />
          </div>
          <span className={styles.brandText}>
            ECLIPSE <span className={styles.brandSubtitle}>: ECOS DO ABISMO</span>
          </span>
        </NavLink>

        {/* Links Principais com Ícones MUI */}
        <nav>
          <ul className={styles.navLinks}>
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink}
              >
                <HomeOutlinedIcon />
                <span>Início</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/wiki" 
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink}
              >
                <AutoStoriesOutlinedIcon />
                <span>Wiki Oficial</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/loja" 
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink}
              >
                <StorefrontOutlinedIcon />
                <span>Loja</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/biblioteca" 
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink}
              >
                <SportsEsportsOutlinedIcon />
                <span>Biblioteca</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Ações / Perfil */}
        <div className={styles.actions}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {/* Badge de Perfil com Avatar de Eclipse Solar */}
              <NavLink to="/biblioteca" className={styles.userBadge} title="Abrir Biblioteca e Perfil">
                <div className={styles.avatarEclipse}>
                  <div className={styles.avatarInner}>
                    {userInitial}
                  </div>
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{userDisplayName}</span>
                  <span className={styles.userStatus}>
                    <span className={styles.statusDot} />
                    {user.hasLicense ? 'Licença Ativa' : 'Sentinela'}
                  </span>
                </div>
              </NavLink>

              {/* Botão de Sair Minimalista */}
              <button 
                className={styles.btnLogout} 
                onClick={logout} 
                title="Desconectar da conta"
              >
                <LogoutOutlinedIcon />
              </button>
            </div>
          ) : (
            <>
              <button className={styles.btnSecondary} onClick={() => openAuthModal('login')}>
                <LoginIcon />
                <span>Entrar</span>
              </button>
              <button className={styles.btnPrimary} onClick={() => openAuthModal('register')}>
                <PersonAddAltOutlinedIcon />
                <span>Criar Conta</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
