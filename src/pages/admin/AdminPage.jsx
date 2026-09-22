import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FinancialCockpit } from '../../sections/admin/FinancialCockpit';
import { AdminEditor } from '../../sections/admin/AdminEditor';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import styles from './AdminPage.module.css';

export const AdminPage = () => {
  const { user, isAdmin, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('finance');

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
            <div className={styles.eyebrow}>Governança & Consultoria de TI</div>
            <h1 className={styles.title}>Painel de Controle Administrativo</h1>
          </div>
          <div className={styles.systemBadge}>
            Contabilidade Integrada • NF-e 4.00 • CMS
          </div>
        </header>

        {/* Apenas 2 Abas Direcionadas */}
        <div className={styles.tabRow}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'finance' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('finance')}
          >
            Controladoria & Gestão Financeira
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'editor' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            Catálogo & Gestão de Conteúdo (CMS)
          </button>
        </div>

        {/* Renderização Condicional Limpa */}
        {activeTab === 'finance' ? (
          <FinancialCockpit />
        ) : (
          <AdminEditor />
        )}
      </div>
    </div>
  );
};

export default AdminPage;
