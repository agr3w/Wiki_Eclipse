import React, { useState } from 'react';
import { COST_STRUCTURE } from '../../data/costManagementData';
import styles from './AdminCosts.module.css';

export const AdminCosts = () => {
  const [unitPrice, setUnitPrice] = useState(COST_STRUCTURE.pricing.unitGrossPrice);
  const [fixedOverhead, setFixedOverhead] = useState(
    COST_STRUCTURE.fixedCosts.reduce((acc, curr) => acc + curr.monthlyAmount, 0)
  );

  const [inputPrice, setInputPrice] = useState('10.00');
  const [inputOverhead, setInputOverhead] = useState('415.00');
  const [validationError, setValidationError] = useState('');

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
      {/* 4 Cards de Indicadores Estratégicos */}
      <div className={styles.indicatorGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Custos Fixos Mensais (Overhead)</span>
          <span className={styles.kpiValue}>
            R$ {fixedOverhead.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className={styles.kpiSub}>Estrutura cloud, banco e licenças de dev</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Custo Variável Unitário</span>
          <span className={styles.kpiValue}>
            R$ {totalVariableCosts.toFixed(2)}
          </span>
          <span className={styles.kpiSub}>Taxa PagBank (R$ 0,95) + Impostos (R$ 0,60) + CDN</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Margem de Contribuição (MCU)</span>
          <span className={`${styles.kpiValue} ${styles.highlightGreen}`}>
            R$ {unitContributionMargin.toFixed(2)} ({contributionMarginRatio}%)
          </span>
          <span className={styles.kpiSub}>Retenção líquida real de cada cópia vendida</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Ponto de Equilíbrio (Break-Even)</span>
          <span className={`${styles.kpiValue} ${styles.highlightAmber}`}>
            {breakEvenUnits} cópias
          </span>
          <span className={styles.kpiSub}>
            Faturamento mínimo: R$ {breakEvenRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Simulador Interativo de Precificação e Margem */}
      <div className={styles.simulatorBlock}>
        <div className={styles.blockHeader}>
          <h3 className={styles.blockTitle}>Simulador de Margem Real e Sensibilidade de Preço</h3>
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
            fontWeight: 500, 
            cursor: 'pointer',
            border: '1px solid var(--accent-terracotta)' 
          }}>
            Recalcular Margem Real
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
            <h4 className={styles.blockTitle} style={{ fontSize: '1.1rem' }}>Custos & Despesas Variáveis</h4>
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
            <h4 className={styles.blockTitle} style={{ fontSize: '1.1rem' }}>Custos Fixos Mensais (Overhead)</h4>
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
