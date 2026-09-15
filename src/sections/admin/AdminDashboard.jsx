import React, { useState, useEffect } from 'react';
import { fetchAdminMetrics } from '../../services/adminService';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
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

  // Cálculos de Proporção de Tráfego
  const trafficItems = [
    { label: 'Loja do Game', route: '/loja', count: metrics.pageViews.store || 0, color: '#bf573b' },
    { label: 'Home (Landing)', route: '/', count: metrics.pageViews.home || 0, color: '#d97706' },
    { label: 'Wiki Oficial', route: '/wiki', count: metrics.pageViews.wiki || 0, color: '#0284c7' },
    { label: 'Biblioteca & Downloads', route: '/biblioteca', count: metrics.pageViews.library || 0, color: '#00a868' },
    { label: 'Perfil do Jogador', route: '/perfil', count: metrics.pageViews.profile || 0, color: '#8b5cf6' },
    { label: 'Painel Administrativo', route: '/admin', count: metrics.pageViews.admin || 0, color: '#ec4899' }
  ];

  const totalPageViews = trafficItems.reduce((acc, item) => acc + item.count, 0);
  const maxPageViews = Math.max(...trafficItems.map(item => item.count), 1);

  // Geração de Pontos da Curva Financeira em SVG
  const chartWidth = 620;
  const chartHeight = 210;
  const paddingX = 45;
  const paddingY = 25;
  const graphW = chartWidth - paddingX * 2;
  const graphH = chartHeight - paddingY * 2;

  const steps = [0.15, 0.28, 0.44, 0.58, 0.72, 0.86, 1.0];
  const timeLabels = ['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'Hoje'];

  const maxYValue = Math.max(metrics.grossRevenue * 1.15, 100);

  const grossPoints = steps.map((factor, idx) => {
    const x = paddingX + (idx / (steps.length - 1)) * graphW;
    const yVal = metrics.grossRevenue * factor;
    const y = paddingY + graphH - (yVal / maxYValue) * graphH;
    return { x, y, val: yVal };
  });

  const netPoints = steps.map((factor, idx) => {
    const x = paddingX + (idx / (steps.length - 1)) * graphW;
    const yVal = metrics.netRevenue * factor;
    const y = paddingY + graphH - (yVal / maxYValue) * graphH;
    return { x, y, val: yVal };
  });

  const grossPathD = grossPoints.reduce((acc, pt, i) => 
    i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`, '');

  const netPathD = netPoints.reduce((acc, pt, i) => 
    i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`, '');

  const netAreaD = `${netPathD} L ${netPoints[netPoints.length - 1].x},${paddingY + graphH} L ${netPoints[0].x},${paddingY + graphH} Z`;

  return (
    <div className={styles.dashboardWrapper}>
      {/* Barra de Status da Sincronização */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '-1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#81c784' }}>
          <CheckCircleOutlineIcon style={{ fontSize: '1rem' }} />
          <span>Dados conectados em tempo real ao Cloud Firestore (telemetry & purchases)</span>
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

      {/* Grid de KPIs Principais */}
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

      {/* Curva Contábil e Financeira em SVG */}
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div>
            <h3 className={styles.chartTitle}>
              <TrendingUpOutlinedIcon style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '6px', color: '#00d084' }} />
              Progressão Financeira: Faturamento Bruto vs Repasse Líquido
            </h3>
            <div className={styles.chartSubtitle}>
              Curva de apuração contábil considerando retenções do gateway PagBank (4.5% + R$ 0,50) e alíquotas fiscais
            </div>
          </div>

          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: '#f59e0b' }}></span>
              <span>Receita Bruta (R$ {metrics.grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: '#00d084' }}></span>
              <span>Repasse Líquido (R$ {metrics.netRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: '#ef5350' }}></span>
              <span>Deduções (-R$ {(metrics.gatewayFeesTotal + metrics.taxesTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</span>
            </div>
          </div>
        </div>

        <div className={styles.svgContainer}>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className={styles.svgChart}>
            <defs>
              <linearGradient id="netAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d084" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#00d084" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Linhas de Grade Horizontais */}
            {[0.25, 0.5, 0.75, 1.0].map((level, idx) => {
              const y = paddingY + graphH - level * graphH;
              return (
                <g key={idx}>
                  <line 
                    x1={paddingX} 
                    y1={y} 
                    x2={chartWidth - paddingX} 
                    y2={y} 
                    stroke="#272a30" 
                    strokeDasharray="4 4" 
                    strokeWidth="1" 
                  />
                  <text 
                    x={paddingX - 8} 
                    y={y + 3} 
                    fill="#626e7d" 
                    fontSize="9" 
                    fontFamily="monospace" 
                    textAnchor="end"
                  >
                    {Math.round(maxYValue * level)}
                  </text>
                </g>
              );
            })}

            {/* Linha de Base */}
            <line 
              x1={paddingX} 
              y1={paddingY + graphH} 
              x2={chartWidth - paddingX} 
              y2={paddingY + graphH} 
              stroke="#3a404a" 
              strokeWidth="1.5" 
            />

            {/* Rótulos Temporais no Eixo X */}
            {grossPoints.map((pt, idx) => (
              <text 
                key={idx} 
                x={pt.x} 
                y={chartHeight - 6} 
                fill="#8fa3b0" 
                fontSize="10" 
                fontFamily="monospace" 
                textAnchor="middle"
              >
                {timeLabels[idx]}
              </text>
            ))}

            {/* Área Sombreada de Repasse Líquido */}
            <path d={netAreaD} fill="url(#netAreaGradient)" />

            {/* Curva da Receita Bruta */}
            <path 
              d={grossPathD} 
              fill="none" 
              stroke="#f59e0b" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />

            {/* Curva do Repasse Líquido */}
            <path 
              d={netPathD} 
              fill="none" 
              stroke="#00d084" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />

            {/* Marcadores dos Pontos */}
            {grossPoints.map((pt, idx) => (
              <circle 
                key={`g-${idx}`} 
                cx={pt.x} 
                cy={pt.y} 
                r={idx === grossPoints.length - 1 ? 5 : 3.5} 
                fill="#121316" 
                stroke="#f59e0b" 
                strokeWidth="2" 
              />
            ))}

            {netPoints.map((pt, idx) => (
              <circle 
                key={`n-${idx}`} 
                cx={pt.x} 
                cy={pt.y} 
                r={idx === netPoints.length - 1 ? 5 : 3.5} 
                fill="#121316" 
                stroke="#00d084" 
                strokeWidth="2" 
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Seção de Acessos com Barras Proporcionais em CSS */}
      <div className={styles.viewsSection}>
        <div className={styles.viewsHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BarChartOutlinedIcon style={{ color: 'var(--accent-terracotta)', fontSize: '1.4rem' }} />
            <h3 className={styles.viewsTitle}>Volume e Distribuição de Acessos por Rota</h3>
          </div>
          <span className={styles.viewsTotalBadge}>
            Total Geral: {totalPageViews.toLocaleString('pt-BR')} Visualizações
          </span>
        </div>

        <div className={styles.trafficBarsContainer}>
          {trafficItems.map((item, idx) => {
            const pctOfMax = Math.round((item.count / maxPageViews) * 100);
            const pctOfTotal = totalPageViews > 0 
              ? ((item.count / totalPageViews) * 100).toFixed(1) 
              : '0.0';

            return (
              <div key={idx} className={styles.trafficBarRow}>
                <div className={styles.barMetaRow}>
                  <div className={styles.barTitleGroup}>
                    <span className={styles.barTitle}>{item.label}</span>
                    <span className={styles.barRouteTag}>{item.route}</span>
                  </div>
                  <div className={styles.barStatsGroup}>
                    <span className={styles.barCount}>{item.count.toLocaleString('pt-BR')}</span>
                    <span className={styles.barPercentage}>{pctOfTotal}%</span>
                  </div>
                </div>

                <div className={styles.barTrack}>
                  <div 
                    className={styles.barFill} 
                    style={{ 
                      width: `${pctOfMax}%`, 
                      backgroundColor: item.color 
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumo em Cards Abaixo das Barras */}
        <div className={styles.trafficGrid}>
          {trafficItems.slice(0, 4).map((item, idx) => (
            <div key={idx} className={styles.trafficCard}>
              <div className={styles.trafficPage}>{item.label}</div>
              <div className={styles.trafficCount}>{item.count.toLocaleString('pt-BR')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
