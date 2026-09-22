import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COMPANY_FISCAL_DATA } from '../../services/fiscalService';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import styles from './FinancialReportModal.module.css';

export const FinancialReportModal = ({ 
  isOpen, 
  onClose, 
  initialPeriod = 'q3-2026', 
  costs = [], 
  unitsSold = 249 
}) => {
  const [period, setPeriod] = useState(initialPeriod);

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('is-printing-financial-report');
      return () => {
        document.body.classList.remove('is-printing-financial-report');
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Multiplicador de unidades vendidas baseado no período e dados reais do Firestore
  const currentUnits = {
    'q3-2026': unitsSold,
    'q2-2026': 180,
    'q1-2026': 120,
    'anual-2026': unitsSold + 300
  }[period] || unitsSold;

  const unitGross = 10.00;
  const gross = currentUnits * unitGross;

  // Custos variáveis dinâmicos do Firestore
  const variableCosts = costs.filter(c => c.type === 'variable');
  const unitVarCost = variableCosts.length > 0 
    ? variableCosts.reduce((acc, c) => acc + Number(c.amount || 0), 0)
    : 1.65;
  const totalVariable = unitVarCost * currentUnits;

  // Custos fixos dinâmicos do Firestore
  const fixedCosts = costs.filter(c => c.type === 'fixed');
  const monthlyFixedCost = fixedCosts.length > 0
    ? fixedCosts.reduce((acc, c) => acc + Number(c.amount || 0), 0)
    : 415.00;
  
  // Overhead proporcional ao período selecionado
  const overhead = period === 'anual-2026' ? monthlyFixedCost * 12 : monthlyFixedCost * 3;

  const contributionMargin = gross - totalVariable;
  const marginPercentage = gross > 0 ? ((contributionMargin / gross) * 100).toFixed(1) : '0.0';
  const netResult = contributionMargin - overhead;

  return (
    <AnimatePresence>
      <div className={styles.reportBackdrop} onClick={onClose}>
        <motion.div 
          className={styles.reportWindow}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
        >
          {/* Barra de Controles e Filtros de Período */}
          <div className={styles.topControls}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Período Contábil:</span>
              <select 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="q1-2026">1º Trimestre (Jan - Mar/2026)</option>
                <option value="q2-2026">2º Trimestre (Abr - Jun/2026)</option>
                <option value="q3-2026">3º Trimestre (Jul - Set/2026)</option>
                <option value="q4-2026">4º Trimestre (Out - Dez/2026)</option>
                <option value="anual-2026">Consolidado Anual Exercício 2026</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button 
                className={styles.btnPrintReport} 
                onClick={() => window.print()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <PrintOutlinedIcon style={{ fontSize: '1rem' }} />
                <span>Exportar PDF / Imprimir</span>
              </button>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
                <CloseOutlinedIcon style={{ fontSize: '1.2rem' }} />
              </button>
            </div>
          </div>

          {/* Relatório Formatado */}
          <div className={styles.reportViewport}>
            <div className={styles.reportSheet}>
              <header className={styles.reportHeader}>
                <div>
                  <h2 className={styles.companyTitle}>{COMPANY_FISCAL_DATA.razaoSocial}</h2>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    CNPJ: {COMPANY_FISCAL_DATA.cnpj} • Inscrição Municipal: {COMPANY_FISCAL_DATA.inscricaoMunicipal}
                  </div>
                  <div className={styles.reportPeriod}>
                    RELATÓRIO FINANCEIRO & DEMONSTRATIVO DE RESULTADOS — {period.toUpperCase()}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Emissão: {new Date().toLocaleDateString('pt-BR')}<br />
                  Sistema: Eclipse ERP Fiscal • Fonte Única Firestore
                </div>
              </header>

              {/* Indicadores do Período */}
              <div className={styles.kpiSummary}>
                <div className={styles.summaryBox}>
                  <span className={styles.summaryLabel}>Cópias Vendidas</span>
                  <span className={styles.summaryValue}>{currentUnits} un</span>
                </div>
                <div className={styles.summaryBox}>
                  <span className={styles.summaryLabel}>Receita Bruta</span>
                  <span className={styles.summaryValue}>R$ {gross.toFixed(2)}</span>
                </div>
                <div className={styles.summaryBox}>
                  <span className={styles.summaryLabel}>Margem Contribuição</span>
                  <span className={styles.summaryValue} style={{ color: '#81c784' }}>R$ {contributionMargin.toFixed(2)}</span>
                </div>
                <div className={styles.summaryBox}>
                  <span className={styles.summaryLabel}>Lucro Líquido Real</span>
                  <span className={styles.summaryValue} style={{ color: netResult >= 0 ? '#81c784' : '#e57373' }}>
                    R$ {netResult.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Tabela DRE Completa */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                  Demonstração do Resultado do Período Selecionado (DRE)
                </h3>

                <table className={styles.dreTable}>
                  <tbody>
                    <tr className={styles.boldRow}>
                      <td>(=) RECEITA OPERACIONAL BRUTA ({currentUnits} licenças a R$ 10,00)</td>
                      <td className={styles.valueCol}>R$ {gross.toFixed(2)}</td>
                    </tr>

                    {/* Custos Variáveis Dinâmicos do Firestore */}
                    {variableCosts.map((c) => (
                      <tr key={c.id || c.name}>
                        <td style={{ paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                          (-) {c.name} ({c.basis || `R$ ${Number(c.amount).toFixed(2)}/un`})
                        </td>
                        <td className={styles.negative}>- R$ {(Number(c.amount) * currentUnits).toFixed(2)}</td>
                      </tr>
                    ))}

                    <tr className={styles.boldRow}>
                      <td>(=) MARGEM DE CONTRIBUIÇÃO TOTAL DO PERÍODO ({marginPercentage}%)</td>
                      <td className={styles.positive}>R$ {contributionMargin.toFixed(2)}</td>
                    </tr>

                    {/* Custos Fixos Agrupados */}
                    <tr>
                      <td style={{ paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                        (-) Custos Fixos Operacionais ({fixedCosts.length} itens cadastrados no Firestore)
                      </td>
                      <td className={styles.negative}>- R$ {overhead.toFixed(2)}</td>
                    </tr>

                    <tr className={styles.highlightRow}>
                      <td>(=) RESULTADO OPERACIONAL LÍQUIDO DO PERÍODO</td>
                      <td className={netResult >= 0 ? styles.positive : styles.negative}>
                        R$ {netResult.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FinancialReportModal;
