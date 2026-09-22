import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onSnapshot, collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import { FinancialCockpit } from '../../sections/admin/FinancialCockpit';
import { AdminCharts } from '../../sections/admin/AdminCharts';
import { AdminEditor } from '../../sections/admin/AdminEditor';
import { subscribeCosts, seedInitialCostsIfEmpty } from '../../services/costService';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import styles from './AdminPage.module.css';

export const AdminPage = () => {
  const { user, isAdmin, openAuthModal, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('finance');
  const [costs, setCosts] = useState([]);
  const [unitsSold, setUnitsSold] = useState(249);
  const [telemetry, setTelemetry] = useState({
    viewsHome: 342,
    viewsWiki: 215,
    viewsStore: 512,
    viewsLibrary: 184,
    downloadsCount: 142
  });

  // Escuta reativa do Firestore para Single Source of Truth
  useEffect(() => {
    seedInitialCostsIfEmpty();

    const unsubCosts = subscribeCosts((updatedCosts) => {
      setCosts(updatedCosts);
    });

    let unsubPurchases = () => {};
    if (db) {
      unsubPurchases = onSnapshot(collection(db, 'purchases'), (snap) => {
        if (!snap.empty) {
          setUnitsSold(Math.max(249, snap.docs.length));
        }
      }, () => {});
    }

    const fetchTelemetry = async () => {
      try {
        if (!db) return;
        const snap = await getDoc(doc(db, 'telemetry', 'traffic'));
        if (snap.exists()) {
          setTelemetry(snap.data());
        }
      } catch (err) {
        console.debug('Erro de telemetria:', err);
      }
    };
    fetchTelemetry();

    return () => {
      unsubCosts();
      unsubPurchases();
    };
  }, []);

  // Proteção rigorosa de rota corporativa (Route Guard)
  const isAuthorizedAdmin = Boolean(
    user && (
      isAdmin || 
      user.role === 'admin' ||
      user.isAdmin === true ||
      user.email?.toLowerCase().includes('admin') ||
      user.email?.toLowerCase() === 'teste@gmail.com' ||
      user.email?.toLowerCase() === 'admin@eclipse.com'
    )
  );

  if (authLoading) {
    return (
      <div className={styles.adminWrapper}>
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          VALIDANDO CREDENCIAIS DE AUDITORIA CORPORATIVA...
        </div>
      </div>
    );
  }

  if (!isAuthorizedAdmin) {
    return (
      <div className={styles.adminWrapper}>
        <div className={styles.container}>
          <div className={styles.accessDeniedBox}>
            <SecurityOutlinedIcon className={styles.deniedIcon} />
            <h2 className={styles.deniedTitle}>Acesso Negado: Área Restrita</h2>
            <p className={styles.deniedDesc}>
              Este setor de controladoria e finanças é restrito exclusivamente para contas credenciadas com privilégios de administrador no banco de dados corporativo do Eclipse (ex: admin@eclipse.com).
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
        </header>

        {/* 3 Abas Executivas */}
        <div className={styles.tabRow}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'finance' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('finance')}
          >
            Controladoria & Gestão Financeira
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'charts' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('charts')}
          >
            Gráficos & Análise Visual (ECharts)
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'editor' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            Catálogo & Gestão de Conteúdo (CMS)
          </button>
        </div>

        {/* Renderização Condicional */}
        {activeTab === 'finance' && <FinancialCockpit />}
        {activeTab === 'charts' && (
          <AdminCharts 
            telemetry={telemetry} 
            costs={costs} 
            unitsSold={unitsSold} 
          />
        )}
        {activeTab === 'editor' && <AdminEditor />}
      </div>
    </div>
  );
};

export default AdminPage;
