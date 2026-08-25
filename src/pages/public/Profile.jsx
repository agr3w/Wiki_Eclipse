import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GameLibrary } from '../../sections/profile/GameLibrary';
import { ProfileSettings } from '../../sections/profile/ProfileSettings';
import styles from './Profile.module.css';

export const Profile = () => {
  const { user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('library');

  if (!user) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.authGate}>
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

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.eyebrow}>Painel do Jogador</div>
          <h1 className={styles.title}>
            Olá, {user.displayName || user.email?.split('@')[0] || 'Jogador'}
          </h1>
        </header>

        <div className={styles.tabRow}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'library' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('library')}
          >
            Meus Jogos & Licenças
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'settings' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Configurações da Conta
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
