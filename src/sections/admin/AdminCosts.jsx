import React, { useState, useEffect } from 'react';
import { COST_STRUCTURE } from '../../data/costManagementData';
import { fetchAdminMetrics } from '../../services/adminService';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';
import styles from './AdminCosts.module.css';

export const AdminCosts = () => {
  const [unitPrice, setUnitPrice] = useState(COST_STRUCTURE.pricing.unitGrossPrice);
  const [fixedOverhead, setFixedOverhead] = useState(
    COST_STRUCTURE.fixedCosts.reduce((acc, curr) => acc + curr.monthlyAmount, 0)
  );
  const [currentSalesCount, setCurrentSalesCount] = useState(0);

  const [inputPrice, setInputPrice] = useState('10.00');
  const [inputOverhead, setInputOverhead] = useState('415.00');
  const [validationError, setValidationError] = useState('');

  // Busca dados de vendas reais do Firestore para o progresso da meta
  useEffect(() => {
    const loadSales = async () => {
      try {
        const metrics = await fetchAdminMetrics();
        if (metrics && typeof metrics.totalOrders === 'number') {
          setCurrentSalesCount(metrics.totalOrders);
        }
      } catch {
        // Fallback gracioso
      }
    };
    loadSales();
  }, []);

  // Custos Variáveis Unitários
  const totalVariableCosts = COST_STRUCTURE.variableCosts.reduce(
    (acc, curr) => acc + curr.unitCost, 
    0
  );

  // Cálculos de Margem de Contribuição e Ponto de Equilíbrio
  const unitContributionMargin = Math.max(0, unitPrice - totalVariableCosts);
  const contributionMarginRatio = unitPrice > 0 
    ? ((unitContributionMargin / unitPrice) * 100).toFixed(1) 
    : '0.0';

  const breakEvenUnits = unitContributionMargin > 0 
    ? Math.ceil(fixedOverhead / unitContributionMargin) 
    : 0;
  const breakEvenRevenue = breakEvenUnits * unitPrice;

  const handleSimulate = (e) => {
    e.preventDefault();
    setValidationError('');

    const parsedPrice = parseFloat(inputPrice.replace(',', '.'));
    const parsedOverhead = parseFloat(inputOverhead.replace(',', '.'));

    if (isNaN(parsedPrice) || parsedPrice <= 0 || isNaN(parsedOverhead) || parsedOverhead < 0) {
      setValidationError('Insira um valor numérico positivo para prosseguir com a simulação contábil.');
      return;
    }

    setUnitPrice(parsedPrice);
    setFixedOverhead(parsedOverhead);
  };

  return (
    <div className={styles.costsWrapper}>
      {/* 3 PILARES VISUAIS ESTRATÉGICOS: CUSTOS vs MARGEM vs META DO MÊS */}
      <div className={styles.pillarsContainer}>
        
        {/* PILAR 1: ESTRUTURA DE CUSTOS (SAÍDAS) */}
        <div className={`${styles.pillarCard} ${styles.pillarCosts}`}>
          <div className={styles.pillarHeader}>
            <div className={styles.pillarTitleGroup}>
              <TrendingDownOutlinedIcon className={styles.iconCosts} />
              <div>
                <span className={styles.pillarBadgeCosts}>Deduções & Saídas</span>
                <h4 className={styles.pillarTitle}>1. Estrutura de Custos</h4>
              </div>
            </div>
          </div>

          <div className={styles.pillarContent}>
            {/* Custo Fixo Mensal */}
            <div className={styles.subCard}>
              <div className={styles.subCardTop}>
                <span className={styles.subCardLabel}>Custos Fixos Mensais (Overhead)</span>
                <span className={styles.tagFixed}>Recorrente</span>
              </div>
              <div className={styles.subCardValueRow}>
                <span className={`${styles.subCardValue} ${styles.valCosts}`}>
                  R$ {fixedOverhead.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className={styles.subCardUnit}>/ mês</span>
              </div>
              <p className={styles.subCardDesc}>
                Infraestrutura Firebase, banco Firestore, licenças de dev e governança.
              </p>
            </div>

            {/* Custo Variável por Cópia */}
            <div className={styles.subCard}>
              <div className={styles.subCardTop}>
                <span className={styles.subCardLabel}>Custo Variável por Cópia</span>
                <span className={styles.tagVariable}>Por Venda</span>
              </div>
              <div className={styles.subCardValueRow}>
                <span className={`${styles.subCardValue} ${styles.valCosts}`}>
                  - R$ {totalVariableCosts.toFixed(2)}
                </span>
                <span className={styles.subCardUnit}>/ unidade</span>
              </div>
              <p className={styles.subCardDesc}>
                PagBank (R$ 0,95) + Impostos 6% (R$ 0,60) + Banda CDN (R$ 0,10).
              </p>
            </div>
          </div>
        </div>

        {/* PILAR 2: MARGEM DE CONTRIBUIÇÃO POR UNIDADE */}
        <div className={`${styles.pillarCard} ${styles.pillarMargin}`}>
          <div className={styles.pillarHeader}>
            <div className={styles.pillarTitleGroup}>
              <MonetizationOnOutlinedIcon className={styles.iconMargin} />
              <div>
                <span className={styles.pillarBadgeMargin}>Rentabilidade Unitária</span>
                <h4 className={styles.pillarTitle}>2. Margem por Cópia</h4>
              </div>
            </div>
          </div>

          <div className={styles.pillarContent}>
            <div className={styles.marginHeroBox}>
              <div>
                <span className={styles.subCardLabel}>Margem de Contribuição (MCU)</span>
                <div className={styles.marginValueRow}>
                  <span className={styles.marginHeroValue}>
                    R$ {unitContributionMargin.toFixed(2)}
                  </span>
                  <span className={styles.marginRatioBadge}>{contributionMarginRatio}% de Margem</span>
                </div>
              </div>

              {/* Decomposição Visual do Preço de Venda */}
              <div className={styles.priceBreakdown}>
                <div className={styles.breakdownHeader}>
                  <span>Decomposição do Preço de Venda (R$ {unitPrice.toFixed(2)})</span>
                </div>
                <div className={styles.breakdownBar}>
                  <div 
                    className={styles.barCostPart} 
                    style={{ width: `${Math.min(100, (totalVariableCosts / unitPrice) * 100)}%` }} 
                    title={`Custos Variáveis: R$ ${totalVariableCosts.toFixed(2)}`}
                  />
                  <div 
                    className={styles.barMarginPart} 
                    style={{ width: `${Math.min(100, (unitContributionMargin / unitPrice) * 100)}%` }}
                    title={`Margem Limpa: R$ ${unitContributionMargin.toFixed(2)}`}
                  />
                </div>
                <div className={styles.breakdownLegend}>
                  <span className={styles.legendCost}>
                    ● Custos: R$ {totalVariableCosts.toFixed(2)} ({(100 - parseFloat(contributionMarginRatio)).toFixed(1)}%)
                  </span>
                  <span className={styles.legendMargin}>
                    ● Margem Limpa: R$ {unitContributionMargin.toFixed(2)} ({contributionMarginRatio}%)
                  </span>
                </div>
              </div>

              <p className={styles.subCardDesc}>
                De cada <strong>R$ {unitPrice.toFixed(2)}</strong> pagos pelo jogador, <strong>R$ {unitContributionMargin.toFixed(2)}</strong> sobram limpos no estúdio para amortizar o overhead e gerar lucro líquido.
              </p>
            </div>
          </div>
        </div>

        {/* PILAR 3: META DO MÊS & PONTO DE EQUILÍBRIO */}
        <div className={`${styles.pillarCard} ${styles.pillarBreakEven}`}>
          <div className={styles.pillarHeader}>
            <div className={styles.pillarTitleGroup}>
              <TrackChangesOutlinedIcon className={styles.iconBreakEven} />
              <div>
                <span className={styles.pillarBadgeBreakEven}>Meta de Sobrevivência</span>
                <h4 className={styles.pillarTitle}>3. Meta do Mês (Break-Even)</h4>
              </div>
            </div>
          </div>

          <div className={styles.pillarContent}>
            <div className={styles.breakEvenHeroBox}>
              <div>
                <span className={styles.subCardLabel}>Ponto de Equilíbrio Contábil (PEC)</span>
                <div className={styles.breakEvenValueRow}>
                  <span className={styles.breakEvenHeroValue}>
                    {breakEvenUnits} cópias
                  </span>
                  <span className={styles.targetRevenueBadge}>
                    Meta: R$ {breakEvenRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Status e Progresso das Vendas Reais */}
              <div className={styles.metaStatusBox}>
                <div className={styles.metaStatusRow}>
                  <span>Vendas Realizadas no Período:</span>
                  <strong>{currentSalesCount} / {breakEvenUnits} cópias</strong>
                </div>
                <div className={styles.metaProgressBar}>
                  <div 
                    className={styles.metaProgressFill} 
                    style={{ width: `${Math.min(100, Math.round((currentSalesCount / Math.max(breakEvenUnits, 1)) * 100))}%` }} 
                  />
                </div>
                <div className={styles.metaStatusSub}>
                  {currentSalesCount >= breakEvenUnits ? (
                    <span style={{ color: '#00d084', fontWeight: 600 }}>
                      🎉 Ponto de Equilíbrio superado! A partir da {breakEvenUnits + 1}ª cópia, 100% da margem (R$ {unitContributionMargin.toFixed(2)}) é Lucro Operacional Líquido.
                    </span>
                  ) : (
                    <span>
                      Faltam <strong>{Math.max(0, breakEvenUnits - currentSalesCount)} cópias</strong> para cobrir todos os R$ {fixedOverhead.toFixed(2)} de custos fixos do estúdio.
                    </span>
                  )}
                </div>
              </div>

              <p className={styles.subCardDesc}>
                Volume mínimo de faturamento (<strong>R$ {breakEvenRevenue.toFixed(2)}</strong>) necessário para o estúdio operar com zero prejuízo no mês.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Simulador Interativo de Sensibilidade de Preço e Custos */}
      <div className={styles.simulatorBlock}>
        <div className={styles.blockHeader}>
          <div>
            <h3 className={styles.blockTitle}>Simulador Interativo de Sensibilidade Contábil</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Altere o preço ou os custos fixos para recalcular instantaneamente a Margem e a Meta de Break-Even
            </div>
          </div>
          <span className={styles.formulaBadge}>MCU = Preço Venda - Custos Variáveis</span>
        </div>

        <form className={styles.simForm} onSubmit={handleSimulate}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Preço de Venda Unitário (R$)</label>
            <input
              type="text"
              value={inputPrice}
              onChange={(e) => setInputPrice(e.target.value)}
              className={styles.input}
              placeholder="10.00"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Total de Custos Fixos Mensais (R$)</label>
            <input
              type="text"
              value={inputOverhead}
              onChange={(e) => setInputOverhead(e.target.value)}
              className={styles.input}
              placeholder="415.00"
            />
          </div>

          <button type="submit" className={styles.input} style={{ 
            backgroundColor: 'var(--accent-terracotta)', 
            color: '#fff', 
            fontWeight: 600, 
            cursor: 'pointer',
            border: '1px solid var(--accent-terracotta)' 
          }}>
            Recalcular Margem & Meta
          </button>

          {validationError && (
            <div className={styles.errorMsg}>{validationError}</div>
          )}
        </form>
      </div>

      {/* Tabelas de Custos Detalhados */}
      <div className={styles.tablesGrid}>
        {/* Tabela de Custos Variáveis */}
        <div className={styles.tableSection}>
          <div className={styles.blockHeader}>
            <h4 className={styles.blockTitle} style={{ fontSize: '1.1rem' }}>Detalhamento: Custos Variáveis</h4>
          </div>

          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Item / Natureza</th>
                <th>Base de Cálculo</th>
                <th style={{ textAlign: 'right' }}>Custo/Unidade</th>
              </tr>
            </thead>
            <tbody>
              {COST_STRUCTURE.variableCosts.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.name}</strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.category}</div>
                  </td>
                  <td style={{ fontSize: '0.78rem' }}>{item.basis}</td>
                  <td className={styles.costNegative}>- R$ {item.unitCost.toFixed(2)}</td>
                </tr>
              ))}
              <tr className={styles.tableFooterRow}>
                <td colSpan="2">Total Variável por Cópia</td>
                <td className={styles.costNegative}>- R$ {totalVariableCosts.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tabela de Custos Fixos */}
        <div className={styles.tableSection}>
          <div className={styles.blockHeader}>
            <h4 className={styles.blockTitle} style={{ fontSize: '1.1rem' }}>Detalhamento: Custos Fixos Mensais</h4>
          </div>

          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Serviço / Infraestrutura</th>
                <th>Centro de Custo</th>
                <th style={{ textAlign: 'right' }}>Valor Mensal</th>
              </tr>
            </thead>
            <tbody>
              {COST_STRUCTURE.fixedCosts.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.name}</strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.period}</div>
                  </td>
                  <td style={{ fontSize: '0.78rem' }}>{item.category}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    R$ {item.monthlyAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className={styles.tableFooterRow}>
                <td colSpan="2">Total Fixo Mensal</td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--accent-terracotta)' }}>
                  R$ {COST_STRUCTURE.fixedCosts.reduce((acc, curr) => acc + curr.monthlyAmount, 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCosts;
