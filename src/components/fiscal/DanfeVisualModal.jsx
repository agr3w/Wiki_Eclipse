import React from 'react';
import { motion } from 'framer-motion';
import { 
  COMPANY_FISCAL_DATA, 
  formatAccessKey, 
  downloadXmlBlob 
} from '../../services/fiscalService';
import styles from './DanfeVisualModal.module.css';

export const DanfeVisualModal = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadXml = () => {
    downloadXmlBlob(invoice.xmlString, invoice.nfeNumber || invoice.number || '142');
  };

  const formattedKey = formatAccessKey(invoice.accessKey || '42260948120934000182550010000001421789456123');
  const nfeNum = invoice.nfeNumber || invoice.number || '142';
  const sefazProt = invoice.sefazProtocol || '142260089451234';
  const gross = Number(invoice.grossAmount || invoice.grossValue || 10).toFixed(2);
  const custName = invoice.customerName || invoice.customer || 'Consumidor Final';
  const custEmail = invoice.customerEmail || 'cliente@dominio.com';
  const issueDate = invoice.issueDate || new Date().toLocaleDateString('pt-BR');

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <motion.div 
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
      >
        {/* Barra de Ações Rápidas */}
        <div className={styles.actionBar}>
          <div className={styles.actionButtons}>
            <button className={styles.btnAction} onClick={handlePrint}>
              🖨️ Imprimir / Salvar PDF
            </button>
            <button className={styles.btnAction} onClick={handleDownloadXml}>
              📥 Baixar XML NF-e 4.00
            </button>
          </div>
          <button className={styles.btnClose} onClick={onClose}>✕</button>
        </div>

        {/* Viewport do Documento Fiscal */}
        <div className={styles.scrollViewport}>
          <div className={styles.danfeSheet}>
            {/* Canhoto Fiscal */}
            <div className={styles.canhoto}>
              <div>
                RECEBEMOS DE {COMPANY_FISCAL_DATA.razaoSocial} OS PRODUTOS/SERVIÇOS CONSTANTES DA NOTA FISCAL INDICADA AO LADO
                <div className={styles.canhotoAssinatura}>DATA DE RECEBIMENTO E IDENTIFICAÇÃO/ASSINATURA DO RECEBEDOR</div>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid #000', paddingLeft: '4px' }}>
                <strong>NF-e</strong><br />
                Nº {nfeNum}<br />
                SÉRIE 1
              </div>
            </div>

            {/* Cabeçalho da DANFE */}
            <div className={styles.headerGrid}>
              <div className={styles.emitterBox}>
                <div className={styles.emitterTitle}>{COMPANY_FISCAL_DATA.razaoSocial}</div>
                <div className={styles.emitterSub}>
                  {COMPANY_FISCAL_DATA.logradouro}<br />
                  {COMPANY_FISCAL_DATA.municipio} - {COMPANY_FISCAL_DATA.uf} • CEP: {COMPANY_FISCAL_DATA.cep}<br />
                  CNAE: {COMPANY_FISCAL_DATA.cnae}
                </div>
              </div>

              <div className={styles.danfeIdent}>
                <h3>DANFE</h3>
                <div style={{ fontSize: '7.5px' }}>Documento Auxiliar da Nota Fiscal Eletrônica</div>
                <div className={styles.typeBadge}>1 - SAÍDA</div>
                <div style={{ fontSize: '8px', fontWeight: 'bold' }}>
                  Nº {nfeNum}<br />
                  SÉRIE 1<br />
                  FOLHA 1/1
                </div>
              </div>

              <div className={styles.barcodeArea}>
                <div className={styles.barcodeSimulated} />
                <div>
                  <span className={styles.keyLabel}>CHAVE DE ACESSO SEFAZ</span>
                  <div className={styles.keyValue}>{formattedKey}</div>
                </div>
                <div style={{ fontSize: '7.5px', color: '#444' }}>
                  Consulta de autenticidade no portal nacional da NF-e ou SEFAZ autorizadora.
                </div>
              </div>
            </div>

            {/* Natureza da Operação e Protocolo */}
            <div className={styles.block}>
              <div className={styles.grid3}>
                <div>
                  <span className={styles.fieldLabel}>Natureza da Operação</span>
                  <span className={styles.fieldValue}>VENDA DE LICENÇA DE SOFTWARE 2D</span>
                </div>
                <div>
                  <span className={styles.fieldLabel}>Protocolo de Autorização de Uso</span>
                  <span className={styles.fieldValue}>{sefazProt} - {issueDate} 14:32</span>
                </div>
                <div>
                  <span className={styles.fieldLabel}>CNPJ</span>
                  <span className={styles.fieldValue}>{COMPANY_FISCAL_DATA.cnpj}</span>
                </div>
              </div>
            </div>

            {/* Destinatário / Tomador */}
            <div className={styles.block}>
              <div className={styles.blockTitle}>Destinatário / Remetente</div>
              <div className={styles.grid3}>
                <div>
                  <span className={styles.fieldLabel}>Nome / Razão Social</span>
                  <span className={styles.fieldValue}>{custName}</span>
                </div>
                <div>
                  <span className={styles.fieldLabel}>CNPJ / CPF</span>
                  <span className={styles.fieldValue}>000.***.***-99</span>
                </div>
                <div>
                  <span className={styles.fieldLabel}>Data de Emissão</span>
                  <span className={styles.fieldValue}>{issueDate}</span>
                </div>
              </div>
              <div className={styles.grid3} style={{ marginTop: '4px' }}>
                <div>
                  <span className={styles.fieldLabel}>E-mail de Notificação Fiscal</span>
                  <span className={styles.fieldValue}>{custEmail}</span>
                </div>
                <div>
                  <span className={styles.fieldLabel}>Inscrição Estadual</span>
                  <span className={styles.fieldValue}>ISENTO</span>
                </div>
                <div>
                  <span className={styles.fieldLabel}>Hora da Emissão</span>
                  <span className={styles.fieldValue}>14:32:00</span>
                </div>
              </div>
            </div>

            {/* Cálculo do Imposto */}
            <div className={styles.block}>
              <div className={styles.blockTitle}>Cálculo do Imposto (Regime Simples Nacional)</div>
              <div className={styles.grid5}>
                <div>
                  <span className={styles.fieldLabel}>Base Cálc. ICMS</span>
                  <span className={styles.fieldValue}>R$ 0,00</span>
                </div>
                <div>
                  <span className={styles.fieldLabel}>Valor do ICMS</span>
                  <span className={styles.fieldValue}>R$ 0,00</span>
                </div>
                <div>
                  <span className={styles.fieldLabel}>Tributos Aprox. (6%)</span>
                  <span className={styles.fieldValue}>R$ {(Number(gross) * 0.06).toFixed(2)}</span>
                </div>
                <div>
                  <span className={styles.fieldLabel}>Total Produtos</span>
                  <span className={styles.fieldValue}>R$ {gross}</span>
                </div>
                <div>
                  <span className={styles.fieldLabel}>Total da Nota</span>
                  <span className={styles.fieldValue} style={{ fontSize: '11px', color: '#006600' }}>
                    R$ {gross}
                  </span>
                </div>
              </div>
            </div>

            {/* Dados do Produto / Serviço */}
            <div className={styles.block}>
              <div className={styles.blockTitle}>Dados dos Produtos / Serviços</div>
              <table className={styles.itemsTable}>
                <thead>
                  <tr>
                    <th>Cód.</th>
                    <th>Descrição do Produto / Serviço</th>
                    <th>NCM</th>
                    <th>CFOP</th>
                    <th>UN</th>
                    <th>Qtd.</th>
                    <th>V. Unit.</th>
                    <th>V. Total</th>
                    <th>BC ICMS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'center' }}>ECL-01</td>
                    <td>Eclipse: Ecos do Abismo - Licença de Uso Permanente (Build Godot 4.7.1 Vulkan)</td>
                    <td style={{ textAlign: 'center' }}>85234990</td>
                    <td style={{ textAlign: 'center' }}>5102</td>
                    <td style={{ textAlign: 'center' }}>UN</td>
                    <td style={{ textAlign: 'right' }}>1,00</td>
                    <td style={{ textAlign: 'right' }}>{gross}</td>
                    <td style={{ textAlign: 'right' }}>{gross}</td>
                    <td style={{ textAlign: 'right' }}>0,00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Informações Complementares / Dados de Gateway */}
            <div className={styles.block}>
              <div className={styles.blockTitle}>Dados Adicionais</div>
              <div className={styles.infAdicText}>
                I - DOCUMENTO EMITIDO POR ME OU EPP OPTANTE PELO SIMPLES NACIONAL. NÃO GERA DIREITO A CRÉDITO FISCAL DE IPI OU ICMS.
                {'\n'}• FORMA DE PAGAMENTO: {invoice.paymentMethod || 'PIX Instantâneo'} (Gateway: PagBank Adquirente Digital).
                {'\n'}• CONCILIAÇÃO FINANCEIRA: Valor Bruto R$ {gross} | Tarifa Gateway R$ {Number(invoice.gatewayFee || 0.95).toFixed(2)} | Repasse Líquido R$ {Number(invoice.netAmount || invoice.netValue || 9.05).toFixed(2)}.
                {'\n'}• XML 4.00 homologado e armazenado na base NoSQL Firestore (Coleção: purchases).
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DanfeVisualModal;
