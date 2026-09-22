import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COMPANY_FISCAL_DATA } from '../../services/fiscalService';
import styles from './FinancialReportModal.module.css';

export const FinancialReportModal = ({ isOpen, onClose }) => {
  const [period, setPeriod] = useState('q3-2026');

  if (!isOpen) return null;

  // Multiplicadores contábeis simulados por período
  const periodMultipliers = {
    'q1-2026': { units: 120, overhead: 1245.00 },
    'q2-2026': { units: 180, overhead: 1245.00 },
    'q3-2026': { units: 249, overhead: 1245.00 },
    'q4-2026': { units: 310, overhead: 1245.00 },
    'anual-2026': { units: 859, overhead: 4980.00 }
  };

  const current = periodMultipliers[period] || periodMultipliers['q3-2026'];
  const gross = current.units * 10.00;
  const gateway = current.units * 0.95;
  const taxes = gross * 0.06;
  const cdn = current.units * 0.10;
  const totalVariable = gateway + taxes + cdn;
  const contributionMargin = gross - totalVariable;
  const netResult = contributionMargin - current.overhead;

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
              <button className={styles.btnPrintReport} onClick={() => window.print()}>
                🖨️ Exportar PDF / Imprimir
              </button>
              <button className={styles.closeBtn} onClick={onClose}>✕</button>
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
                  Sistema: Eclipse ERP Fiscal
                </div>
              </header>

              {/* Indicadores do Período */}
              <div className={styles.kpiSummary}>
                <div className={styles.summaryBox}>
                  <span className={styles.summaryLabel}>Cópias Vendidas</span>
                  <span className={styles.summaryValue}>{current.units} un</span>
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
                      <td>(=) RECEITA OPERACIONAL BRUTA ({current.units} licenças a R$ 10,00)</td>
                      <td className={styles.valueCol}>R$ {gross.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style={{ paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                        (-) Intermediação Financeira Adquirente PagBank (4.5% + R$ 0,50 fixo/un)
                      </td>
                      <td className={styles.negative}>- R$ {gateway.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style={{ paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                        (-) Tributos Municipais e Simples Nacional s/ Faturamento (6%)
                      </td>
                      <td className={styles.negative}>- R$ {taxes.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style={{ paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                        (-) Custos de Banda e Distribuição de Download Cloud (R$ 0,10/un)
                      </td>
                      <td className={styles.negative}>- R$ {cdn.toFixed(2)}</td>
                    </tr>
                    <tr className={styles.boldRow}>
                      <td>(=) MARGEM DE CONTRIBUIÇÃO TOTAL DO PERÍODO (83,5%)</td>
                      <td className={styles.positive}>R$ {contributionMargin.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style={{ paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                        (-) Custos Fixos Operacionais (Overhead: Firebase Blaze, Domínio, Banco e Ferramentas)
                      </td>
                      <td className={styles.negative}>- R$ {current.overhead.toFixed(2)}</td>
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
