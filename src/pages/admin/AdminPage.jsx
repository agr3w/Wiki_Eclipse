import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminDashboard } from '../../sections/admin/AdminDashboard';
import { AdminAccounting } from '../../sections/admin/AdminAccounting';
import { AdminCosts } from '../../sections/admin/AdminCosts';
import { AdminEditor } from '../../sections/admin/AdminEditor';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import styles from './AdminPage.module.css';

export const AdminPage = () => {
  const { user, isAdmin, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Proteção de rota para administradores
  if (!user || !isAdmin) {
    return (
      <div className={styles.adminWrapper}>
        <div className={styles.container}>
          <div className={styles.accessDeniedBox}>
            <SecurityOutlinedIcon className={styles.deniedIcon} />
            <h2 className={styles.deniedTitle}>Acesso Negado: Área Restrita</h2>
            <p className={styles.deniedDesc}>
              Este setor é exclusivo para contas de administradores credenciadas no banco de dados corporativo do Eclipse.
            </p>
            <div className={styles.deniedActions}>
              <Link to="/" className={styles.btnSecondary}>
                Voltar ao Início
              </Link>
              {!user && (
                <button 
                  className={styles.btnPrimary} 
                  onClick={() => openAuthModal('login')}
                >
                  Entrar como Admin
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminWrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <div className={styles.eyebrow}>Governança Corporativa & TI</div>
            <h1 className={styles.title}>Painel de Controle Administrativo</h1>
          </div>
          <div className={styles.systemBadge}>
            Módulo Integrado: Financeiro, Contábil, Custos & CMS
          </div>
        </header>

        <div className={styles.tabRow}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'dashboard' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard de Métricas & Tráfego
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'costs' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('costs')}
          >
            Gestão de Custos & Margem Real
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'accounting' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('accounting')}
          >
            Módulo Fiscal (NFS-e & Gateway)
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'editor' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            Editor de Conteúdo
          </button>
        </div>

        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'costs' && <AdminCosts />}
        {activeTab === 'accounting' && <AdminAccounting />}
        {activeTab === 'editor' && <AdminEditor />}
      </div>
    </div>
  );
};

export default AdminPage;
