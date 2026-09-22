import React, { useState, useEffect } from 'react';
import { 
  GATEWAY_CONFIG, 
  FINANCIAL_METRICS,
  RECENT_TRANSACTIONS,
  INVOICES_LEDGER 
} from '../../data/adminFinancialData';
import { fetchAdminMetrics, fetchRealTransactions, fetchRealInvoices } from '../../services/adminService';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { DanfeVisualModal } from '../../components/fiscal/DanfeVisualModal';
import { FinancialReportModal } from '../../components/admin/FinancialReportModal';
import { downloadXmlBlob, generateNfeXmlString } from '../../services/fiscalService';
import styles from './AdminAccounting.module.css';

export const AdminAccounting = () => {
  const [metrics, setMetrics] = useState(FINANCIAL_METRICS);
  const [transactions, setTransactions] = useState(RECENT_TRANSACTIONS);
  const [invoices, setInvoices] = useState(INVOICES_LEDGER);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setRefreshing(true);
    const [m, t, inv] = await Promise.all([
      fetchAdminMetrics(),
      fetchRealTransactions(),
      fetchRealInvoices()
    ]);
    if (m) setMetrics(m);
    if (t) setTransactions(t);
    if (inv) setInvoices(inv);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDanfe = (nfeData) => {
    setSelectedInvoice({
      ...nfeData,
      nfeNumber: nfeData.rawNfeNumber || nfeData.nfeNumber || '142',
      number: nfeData.rawNfeNumber || nfeData.nfeNumber || '142',
      issueDate: nfeData.issueDate || new Date().toLocaleDateString('pt-BR'),
      accessKey: nfeData.accessKey,
      sefazProtocol: nfeData.sefazProtocol,
      customerName: nfeData.customer || nfeData.customerName || 'Consumidor Final',
      customerEmail: nfeData.customerEmail || 'cliente.adquirente@gmail.com',
      serviceDescription: nfeData.serviceDescription || 'Licenciamento de Software de Jogo Eletrônico 2D (Eclipse: Ecos do Abismo)',
      grossAmount: typeof nfeData.grossAmount === 'number' ? nfeData.grossAmount : 10.00,
      paymentMethod: nfeData.paymentMethod || 'PagBank Sandbox (Cartão/PIX)',
      orderProtocol: nfeData.orderProtocol || 'ECL-9482',
      xmlString: nfeData.xmlString
    });
  };

  const handleDownloadXml = (nfe) => {
    if (nfe.xmlString) {
      downloadXmlBlob(nfe.xmlString, nfe.rawNfeNumber || nfe.nfeNumber || '142');
    } else {
      const generated = generateNfeXmlString(nfe);
      downloadXmlBlob(generated, nfe.rawNfeNumber || nfe.nfeNumber || '142');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        SINCRONIZANDO LIVROS FISCAIS COM O FIRESTORE...
      </div>
    );
  }

  return (
    <div className={styles.accountingWrapper}>
      {/* Barra de Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '-1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#81c784' }}>
          <CheckCircleOutlineIcon style={{ fontSize: '1rem' }} />
          <span>Apuração Contábil & Fiscal baseada no Cloud Firestore</span>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <button 
            onClick={() => setIsReportOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #1b5e20, #2e7d32)',
              border: '1px solid #4caf50',
              color: '#ffffff',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)'
            }}
          >
            <span>📊 Relatório Executivo (PDF / DRE)</span>
          </button>
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
            <span>{refreshing ? 'Atualizando...' : 'Atualizar Livros'}</span>
          </button>
        </div>
      </div>

      {/* Demonstrativo Contábil Simplificado (DRE) */}
      <div className={styles.dreBox}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Demonstração do Resultado do Exercício (DRE Operacional)</h3>
        </div>

        <table className={styles.dreTable}>
          <tbody>
            <tr>
              <td className={styles.dreLabel}>(+) Receita Operacional Bruta (Venda de Licenças)</td>
              <td className={styles.dreValue}>
                R$ {metrics.grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td className={styles.dreLabel}>(-) Deduções: Taxa de Processamento {GATEWAY_CONFIG.name} (4.5% + R$ 0,50)</td>
              <td className={`${styles.dreValue} ${styles.dreDeduction}`}>
                - R$ {metrics.gatewayFeesTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td className={styles.dreLabel}>(-) Provisão Tributária (ISS / Simples Nacional - 6%)</td>
              <td className={`${styles.dreValue} ${styles.dreDeduction}`}>
                - R$ {metrics.taxesTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr className={styles.dreTotalRow}>
              <td className={styles.dreLabel}>(=) Receita Operacional Líquida Real</td>
              <td className={`${styles.dreValue} ${styles.dreTotalValue}`}>
                R$ {metrics.netRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Conciliação Financeira por Transação */}
      <div className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Conciliação de Transações & Gateway de Pagamento</h3>
        </div>

        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Protocolo</th>
              <th>Data/Hora</th>
              <th>Cliente</th>
              <th>Método</th>
              <th>Valor Bruto</th>
              <th>Taxa Gateway</th>
              <th>Impostos</th>
              <th>Valor Líquido</th>
              <th>Status NF-e</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trx, idx) => (
              <tr key={trx.id || idx}>
                <td><code>{trx.id}</code></td>
                <td>{trx.date}</td>
                <td>{trx.customerName}</td>
                <td>{trx.paymentMethod}</td>
                <td>R$ {trx.grossValue.toFixed(2)}</td>
                <td className={styles.dreDeduction}>- R$ {trx.gatewayFee.toFixed(2)}</td>
                <td className={styles.dreDeduction}>- R$ {trx.taxWithheld.toFixed(2)}</td>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>R$ {trx.netValue.toFixed(2)}</td>
                <td>
                  <span className={trx.nfeStatus === 'Emitida' ? styles.statusAuthorized : styles.statusPending}>
                    {trx.nfeStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Livro de Registro de Notas Fiscais (NFS-e) */}
      <div className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Livro Fiscal Eletrônico (Emissão de NFS-e)</h3>
        </div>

        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Número da Nota</th>
              <th>Data Emissão</th>
              <th>Tomador</th>
              <th>Discriminação do Serviço</th>
              <th>Valor Bruto</th>
              <th>Status</th>
              <th>Ações Fiscais</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((nfe, idx) => (
              <tr key={nfe.nfeNumber || idx}>
                <td><strong>{nfe.nfeNumber}</strong></td>
                <td>{nfe.issueDate}</td>
                <td>{nfe.customer}</td>
                <td>{nfe.serviceDescription}</td>
                <td>R$ {nfe.grossAmount.toFixed(2)}</td>
                <td>
                  <span className={styles.statusAuthorized}>{nfe.status}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button className={styles.btnAction} onClick={() => handleOpenDanfe(nfe)}>
                      Visualizar DANFE
                    </button>
                    <button 
                      className={styles.btnAction} 
                      onClick={() => handleDownloadXml(nfe)}
                    >
                      XML
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Visual Fidedigno da DANFE (Padrão SEFAZ NF-e 4.00) */}
      {selectedInvoice && (
        <DanfeVisualModal 
          invoice={selectedInvoice} 
          onClose={() => setSelectedInvoice(null)} 
        />
      )}

      {/* Modal Executivo de Relatório Financeiro (DRE Trimestral/Anual & PDF) */}
      <FinancialReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
      />
    </div>
  );
};

export default AdminAccounting;
