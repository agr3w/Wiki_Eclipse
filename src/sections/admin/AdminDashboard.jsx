import React, { useState, useEffect } from 'react';
import { fetchAdminMetrics } from '../../services/adminService';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import styles from './AdminDashboard.module.css';

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setRefreshing(true);
    const data = await fetchAdminMetrics();
    setMetrics(data);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !metrics) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        SINCRONIZANDO COM O CLOUD FIRESTORE...
      </div>
    );
  }

  return (
    <div className={styles.dashboardWrapper}>
      {/* Barra de Status da Sincronização */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '-1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#81c784' }}>
          <CheckCircleOutlineIcon style={{ fontSize: '1rem' }} />
          <span>Dados conectados em tempo real ao Cloud Firestore</span>
        </div>
        <button 
          onClick={loadData}
          disabled={refreshing}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <RefreshOutlinedIcon style={{ fontSize: '1rem', animation: refreshing ? 'ringRotate 1s linear infinite' : 'none' }} />
          <span>{refreshing ? 'Atualizando...' : 'Atualizar Métricas'}</span>
        </button>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Receita Bruta Total</span>
          <span className={styles.kpiValue}>
            R$ {metrics.grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className={styles.kpiSub}>{metrics.totalOrders} transações de licença</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Receita Líquida Real</span>
          <span className={`${styles.kpiValue} ${styles.kpiPositive}`}>
            R$ {metrics.netRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className={styles.kpiSub}>Deduções: Gateway + Impostos aplicados</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Downloads Executados</span>
          <span className={`${styles.kpiValue} ${styles.kpiHighlight}`}>
            {metrics.totalDownloads}
          </span>
          <span className={styles.kpiSub}>Taxa de Conversão: {metrics.conversionRate}</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Ticket Médio por Licença</span>
          <span className={styles.kpiValue}>
            R$ {metrics.averageTicket.toFixed(2)}
          </span>
          <span className={styles.kpiSub}>Base calculada via checkout</span>
        </div>
      </div>

      <div className={styles.viewsSection}>
        <div className={styles.viewsHeader}>
          <h3 className={styles.viewsTitle}>Volume de Acessos por Seção da Plataforma</h3>
        </div>

        <div className={styles.trafficGrid}>
          <div className={styles.trafficCard}>
            <div className={styles.trafficPage}>Home (Landing)</div>
            <div className={styles.trafficCount}>{metrics.pageViews.home}</div>
          </div>
          <div className={styles.trafficCard}>
            <div className={styles.trafficPage}>Wiki Oficial</div>
            <div className={styles.trafficCount}>{metrics.pageViews.wiki}</div>
          </div>
          <div className={styles.trafficCard}>
            <div className={styles.trafficPage}>Loja do Game</div>
            <div className={styles.trafficCount}>{metrics.pageViews.store}</div>
          </div>
          <div className={styles.trafficCard}>
            <div className={styles.trafficPage}>Biblioteca & Download</div>
            <div className={styles.trafficCount}>{metrics.pageViews.library}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
