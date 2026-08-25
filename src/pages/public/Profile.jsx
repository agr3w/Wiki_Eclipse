import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GameLibrary } from '../../sections/profile/GameLibrary';
import { ProfileSettings } from '../../sections/profile/ProfileSettings';

// Material UI Icons
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import styles from './Profile.module.css';

export const Profile = () => {
  const { user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('library');

  if (!user) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.authGate}>
            <LockOutlinedIcon style={{ fontSize: '2.5rem', color: 'var(--accent-terracotta)', marginBottom: '1rem' }} />
            <h2 className={styles.gateTitle}>Acesso Restrito</h2>
            <p className={styles.gateDesc}>
              Você precisa estar conectado à sua conta para visualizar sua biblioteca de jogos e gerenciar seus dados de perfil.
            </p>
            <button className={styles.btnAuth} onClick={() => openAuthModal('login')}>
              Entrar ou Criar Conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : 'S';

  const userDisplayName = user?.displayName || user?.email?.split('@')[0] || 'Sentinela';

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Header Card com Avatar Solar do Eclipse */}
        <header className={styles.headerCard}>
          <div className={styles.profileInfoLeft}>
            <div className={styles.eclipseAvatarLarge}>
              <div className={styles.avatarInnerLarge}>
                {userInitial}
              </div>
            </div>
            <div>
              <div className={styles.eyebrow}>Sentinela Registrada</div>
              <h1 className={styles.title}>{userDisplayName}</h1>
              <div className={styles.userEmailSub}>{user.email}</div>
            </div>
          </div>

          <div>
            {user.hasLicense ? (
              <div className={`${styles.licensePill} ${styles.licenseActive}`}>
                <VerifiedUserOutlinedIcon style={{ fontSize: '1rem' }} />
                <span>Licença Ativa</span>
              </div>
            ) : (
              <div className={`${styles.licensePill} ${styles.licensePending}`}>
                <HourglassEmptyOutlinedIcon style={{ fontSize: '1rem' }} />
                <span>Sem Licença</span>
              </div>
            )}
          </div>
        </header>

        {/* Abas com Ícones MUI */}
        <div className={styles.tabRow}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'library' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('library')}
          >
            <SportsEsportsOutlinedIcon />
            <span>Meus Jogos & Licenças</span>
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'settings' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <ManageAccountsOutlinedIcon />
            <span>Configurações da Conta</span>
          </button>
        </div>

        {activeTab === 'library' ? (
          <GameLibrary hasLicense={user.hasLicense} />
        ) : (
          <ProfileSettings />
        )}
      </div>
    </div>
  );
};

export default Profile;
