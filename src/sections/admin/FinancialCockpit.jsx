import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { DanfeVisualModal } from '../../components/fiscal/DanfeVisualModal';
import { FinancialReportModal } from '../../components/admin/FinancialReportModal';
import { downloadXmlBlob, generateNfeXmlString } from '../../services/fiscalService';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import styles from './FinancialCockpit.module.css';

const DEFAULT_TRANSACTIONS = [
  {
    id: 'TRX-9482',
    nfeNumber: '142',
    date: '15/09/2026 08:30',
    customerName: 'Yuri Nascimento',
    customerEmail: 'yuri.dev@univille.br',
    paymentMethod: 'PIX Instantâneo',
    grossAmount: 10.00,
    gatewayFee: 0.95,
    netAmount: 9.05,
    accessKey: '42260948120934000182550010000001421789456123',
    sefazProtocol: '142260089451234',
    serviceDescription: 'Eclipse: Ecos do Abismo - Licença de Uso Permanente (Build Godot 4.7.1 Vulkan)'
  },
  {
    id: 'TRX-9481',
    nfeNumber: '141',
    date: '14/09/2026 21:15',
    customerName: 'Arthur Dev',
    customerEmail: 'arthur.qa@univille.br',
    paymentMethod: 'Cartão de Crédito',
    grossAmount: 10.00,
    gatewayFee: 0.95,
    netAmount: 9.05,
    accessKey: '42260948120934000182550010000001411789456122',
    sefazProtocol: '142260089451233',
    serviceDescription: 'Eclipse: Ecos do Abismo - Licença de Uso Permanente (Build Godot 4.7.1 Vulkan)'
  }
];

export const FinancialCockpit = () => {
  const [period, setPeriod] = useState('q3-2026');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [transactions, setTransactions] = useState(DEFAULT_TRANSACTIONS);

  const [telemetry, setTelemetry] = useState({
    viewsHome: 342,
    viewsWiki: 215,
    viewsStore: 512,
    viewsLibrary: 184,
    downloadsCount: 142
  });

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        if (!db) return;

        // Telemetria do Firestore
        const snap = await getDoc(doc(db, 'telemetry', 'traffic'));
        if (snap.exists()) {
          setTelemetry(snap.data());
        }

        // Transações reais de purchases
        const purchasesSnap = await getDocs(collection(db, 'purchases'));
        if (!purchasesSnap.empty) {
          const loaded = [];
          purchasesSnap.forEach(d => {
            const data = d.data();
            const dateStr = data.acquiredAt 
              ? new Date(data.acquiredAt).toLocaleString('pt-BR') 
              : new Date().toLocaleString('pt-BR');
            loaded.push({
              id: data.orderProtocol || d.id.slice(0, 8).toUpperCase(),
              nfeNumber: data.nfeNumber || data.orderProtocol?.replace(/\D/g, '') || '142',
              date: dateStr,
              customerName: data.billingName || data.customerName || data.userEmail?.split('@')[0] || 'Sentinela',
              customerEmail: data.userEmail || data.customerEmail || '—',
              paymentMethod: data.paymentMethod || 'PIX Instantâneo',
              grossAmount: typeof data.grossAmount === 'number' ? data.grossAmount : (data.grossValue || 10.00),
              gatewayFee: typeof data.gatewayFee === 'number' ? data.gatewayFee : 0.95,
              netAmount: typeof data.netAmount === 'number' ? data.netAmount : (data.netValue || 9.05),
              accessKey: data.accessKey || '42260948120934000182550010000001421789456123',
              sefazProtocol: data.sefazProtocol || '142260089451234',
              xmlString: data.xmlString || '',
              serviceDescription: 'Eclipse: Ecos do Abismo - Licença de Uso Permanente (Build Godot 4.7.1 Vulkan)'
            });
          });
          setTransactions([...loaded, ...DEFAULT_TRANSACTIONS]);
        }
      } catch (err) {
        console.debug('Usando dados em cache local:', err.message);
      }
    };
    fetchLiveData();
  }, []);

  // Dados consolidados do período selecionado
  const periodData = {
    'q3-2026': { units: 249, overhead: 415.00 },
    'q2-2026': { units: 180, overhead: 415.00 },
    'q1-2026': { units: 120, overhead: 415.00 },
    'anual-2026': { units: 859, overhead: 1660.00 }
  }[period] || { units: 249, overhead: 415.00 };

  const unitGross = 10.00;
  const grossRevenue = periodData.units * unitGross;
  const pagbankFees = periodData.units * 0.95; // 4.5% + R$ 0,50
  const municipalTaxes = grossRevenue * 0.06;  // 6% Simples/ISS
  const cdnCosts = periodData.units * 0.10;
  const totalVariable = pagbankFees + municipalTaxes + cdnCosts;
  
  const contributionMargin = grossRevenue - totalVariable;
  const mcuUnit = unitGross - (totalVariable / periodData.units);
  const breakEvenUnits = Math.ceil(periodData.overhead / mcuUnit);
  const netProfit = contributionMargin - periodData.overhead;

  const totalViews = (telemetry.viewsHome || 0) + (telemetry.viewsWiki || 0) + (telemetry.viewsStore || 0) + (telemetry.viewsLibrary || 0);

  const handleOpenDanfe = (invoiceRecord) => {
    const xml = invoiceRecord.xmlString || generateNfeXmlString({
      nfeNumber: invoiceRecord.nfeNumber,
      grossAmount: invoiceRecord.grossAmount,
      customerName: invoiceRecord.customerName,
      customerEmail: invoiceRecord.customerEmail,
      accessKey: invoiceRecord.accessKey,
      sefazProtocol: invoiceRecord.sefazProtocol,
      paymentMethod: invoiceRecord.paymentMethod
    });

    setSelectedInvoice({
      ...invoiceRecord,
      xmlString: xml
    });
  };

  return (
    <div className={styles.cockpitWrapper}>
      {/* Barra de Filtro e Exportação Unificada */}
      <div className={styles.controlToolbar}>
        <div className={styles.periodFilter}>
          <span className={styles.filterLabel}>Período de Análise:</span>
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="q3-2026">3º Trimestre de 2026 (Atual)</option>
            <option value="q2-2026">2º Trimestre de 2026</option>
            <option value="q1-2026">1º Trimestre de 2026</option>
            <option value="anual-2026">Exercício Anual Consolidado 2026</option>
          </select>
        </div>

        <button className={styles.btnReport} onClick={() => setIsReportOpen(true)}>
          <PictureAsPdfOutlinedIcon style={{ fontSize: '1.1rem' }} />
          <span>Gerar Relatório Executivo (PDF)</span>
        </button>
      </div>

      {/* 4 KPIs de Alto Nível */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Receita Bruta Total</span>
          <span className={styles.kpiValue}>
            R$ {grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className={styles.kpiSub}>{periodData.units} licenças a R$ 10,00</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Margem de Contribuição (MCU)</span>
          <span className={`${styles.kpiValue} ${styles.greenText}`}>
            R$ {mcuUnit.toFixed(2)} (83,5%)
          </span>
          <span className={styles.kpiSub}>Total: R$ {contributionMargin.toFixed(2)}</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Ponto de Equilíbrio (PEC)</span>
          <span className={`${styles.kpiValue} ${styles.amberText}`}>
            {breakEvenUnits} cópias
          </span>
          <span className={styles.kpiSub}>R$ {(breakEvenUnits * 10).toFixed(2)} cobrem o overhead</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Lucro Líquido Real</span>
          <span className={`${styles.kpiValue} ${styles.greenText}`}>
            R$ {netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className={styles.kpiSub}>Pós PagBank, Impostos e Custos Fixos</span>
        </div>
      </div>

      {/* Grade Média: DRE x Telemetria & Gráfico */}
      <div className={styles.middleGrid}>
        {/* DRE Integrada */}
        <div className={styles.sectionBlock}>
          <div className={styles.blockHeader}>
            <h3 className={styles.blockTitle}>DRE Gerencial do Período</h3>
            <span className={styles.blockBadge}>Regime de Competência</span>
          </div>

          <table className={styles.dreTable}>
            <tbody>
              <tr>
                <td className={styles.dreLabel}>(+) Receita Operacional Bruta ({periodData.units} un)</td>
                <td className={styles.dreValue}>R$ {grossRevenue.toFixed(2)}</td>
              </tr>
              <tr>
                <td className={styles.dreLabel}>(-) Gateway PagBank (4.5% + R$ 0,50/un)</td>
                <td className={`${styles.dreValue} ${styles.negative}`}>- R$ {pagbankFees.toFixed(2)}</td>
              </tr>
              <tr>
                <td className={styles.dreLabel}>(-) Tributos Municipais e Simples (6.0%)</td>
                <td className={`${styles.dreValue} ${styles.negative}`}>- R$ {municipalTaxes.toFixed(2)}</td>
              </tr>
              <tr>
                <td className={styles.dreLabel}>(-) Custos de Banda & Cloud Storage</td>
                <td className={`${styles.dreValue} ${styles.negative}`}>- R$ {cdnCosts.toFixed(2)}</td>
              </tr>
              <tr className={styles.dreHighlightRow}>
                <td className={styles.dreLabel}>(=) Margem de Contribuição Total</td>
                <td className={`${styles.dreValue} ${styles.positive}`}>R$ {contributionMargin.toFixed(2)}</td>
              </tr>
              <tr>
                <td className={styles.dreLabel}>(-) Custos Fixos Operacionais (Firebase, Domínio, Banco)</td>
                <td className={`${styles.dreValue} ${styles.negative}`}>- R$ {periodData.overhead.toFixed(2)}</td>
              </tr>
              <tr className={styles.dreHighlightRow}>
                <td className={styles.dreLabel}>(=) Resultado Operacional Líquido</td>
                <td className={`${styles.dreValue} ${styles.positive}`}>R$ {netProfit.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Telemetria e Conversão da Plataforma */}
        <div className={styles.sectionBlock}>
          <div className={styles.blockHeader}>
            <h3 className={styles.blockTitle}>Telemetria e Conversão</h3>
            <span className={styles.blockBadge}>{totalViews} acessos totais</span>
          </div>

          <div className={styles.trafficStack}>
            <div>
              <div className={styles.trafficMetric}>
                <span>Loja do Jogo (/loja)</span>
                <span>{telemetry.viewsStore} views</span>
              </div>
              <div className={styles.barTrack}>
                <div 
                  className={styles.barFill} 
                  style={{ width: `${Math.round(((telemetry.viewsStore || 1) / (totalViews || 1)) * 100)}%`, backgroundColor: 'var(--accent-terracotta)' }} 
                />
              </div>
            </div>

            <div>
              <div className={styles.trafficMetric}>
                <span>Wiki Oficial (/wiki)</span>
                <span>{telemetry.viewsWiki} views</span>
              </div>
              <div className={styles.barTrack}>
                <div 
                  className={styles.barFill} 
                  style={{ width: `${Math.round(((telemetry.viewsWiki || 1) / (totalViews || 1)) * 100)}%`, backgroundColor: '#4a6fa5' }} 
                />
              </div>
            </div>

            <div>
              <div className={styles.trafficMetric}>
                <span>Downloads Efetivados vs. Licenças</span>
                <span>{telemetry.downloadsCount} downloads ({((telemetry.downloadsCount / periodData.units) * 100).toFixed(0)}% conversão)</span>
              </div>
              <div className={styles.barTrack}>
                <div 
                  className={styles.barFill} 
                  style={{ width: `${Math.min(100, Math.round((telemetry.downloadsCount / periodData.units) * 100))}%`, backgroundColor: '#81c784' }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Livro Fiscal e Conciliação de Transações */}
      <div className={styles.tableContainer}>
        <div className={styles.blockHeader}>
          <h3 className={styles.blockTitle}>Livro Fiscal Eletrônico & Conciliação PagBank</h3>
          <span className={styles.blockBadge}>SEFAZ / NF-e 4.00</span>
        </div>

        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>NF-e</th>
              <th>Data/Hora</th>
              <th>Cliente</th>
              <th>Método</th>
              <th>Valor Bruto</th>
              <th>Taxa PagBank</th>
              <th>Líquido</th>
              <th>Situação SEFAZ</th>
              <th>Ações Fiscais</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trx) => (
              <tr key={trx.id}>
                <td><strong>Nº {trx.nfeNumber}</strong></td>
                <td>{trx.date}</td>
                <td>{trx.customerName}</td>
                <td>{trx.paymentMethod}</td>
                <td>R$ {trx.grossAmount.toFixed(2)}</td>
                <td className={styles.negative}>- R$ {trx.gatewayFee.toFixed(2)}</td>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ {trx.netAmount.toFixed(2)}</td>
                <td><span className={styles.statusAuthorized}>Autorizada</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button 
                      className={styles.btnAction} 
                      onClick={() => handleOpenDanfe(trx)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <VisibilityOutlinedIcon style={{ fontSize: '0.85rem' }} />
                      <span>Visualizar DANFE</span>
                    </button>
                    <button 
                      className={styles.btnAction} 
                      onClick={() => downloadXmlBlob(trx.xmlString || generateNfeXmlString(trx), trx.nfeNumber)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <FileDownloadOutlinedIcon style={{ fontSize: '0.85rem' }} />
                      <span>XML</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modais Globais */}
      {selectedInvoice && (
        <DanfeVisualModal 
          invoice={selectedInvoice} 
          onClose={() => setSelectedInvoice(null)} 
        />
      )}

      <FinancialReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
      />
    </div>
  );
};

export default FinancialCockpit;
