import React from 'react';
import { motion } from 'framer-motion';
import { COMPANY_FISCAL_DATA, downloadXmlFile } from '../../services/fiscalService';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import styles from './DanfseModal.module.css';

export const DanfseModal = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadXml = () => {
    downloadXmlFile(invoice);
  };

  const gross = typeof invoice.grossAmount === 'number' ? invoice.grossAmount : 10.00;
  const taxIss = (gross * 0.03).toFixed(2);
  const invoiceNumber = invoice.number || invoice.nfeNumber || 'NFS-1001';
  const vCode = invoice.verificationCode || 'A9F3-481B-902C-71ED';
  const customerName = invoice.customerName || invoice.customer || 'Consumidor Final';
  const customerEmail = invoice.customerEmail || 'cliente.adquirente@gmail.com';
  const issueDate = invoice.issueDate || '15/09/2026';

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <motion.div 
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
      >
        {/* Barra de Ações Administrativas */}
        <div className={styles.actionBar}>
          <div className={styles.actionLeft}>
            <button className={styles.btnAction} onClick={handlePrint} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <PrintOutlinedIcon style={{ fontSize: '1rem' }} />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button className={styles.btnAction} onClick={handleDownloadXml} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileDownloadOutlinedIcon style={{ fontSize: '1rem' }} />
              <span>Baixar XML ABRASF</span>
            </button>
          </div>
          <button className={styles.btnClose} onClick={onClose} aria-label="Fechar">
            <CloseOutlinedIcon style={{ fontSize: '1.2rem' }} />
          </button>
        </div>

        {/* Espelho da NFS-e */}
        <div className={styles.scrollContainer}>
          <div className={styles.danfsePaper}>
            {/* Cabeçalho Municipal */}
            <div className={styles.govHeader}>
              <div className={styles.govSeal}>
                <AccountBalanceOutlinedIcon style={{ fontSize: '1.8rem', color: '#555' }} />
              </div>
              <div className={styles.govTitles}>
                <h4>Prefeitura Municipal de {COMPANY_FISCAL_DATA.municipio}</h4>
                <p>Secretaria da Fazenda • Divisão de Fiscalização Tributária</p>
                <p><strong>NFS-e - NOTA FISCAL DE SERVIÇOS ELETRÔNICA</strong></p>
              </div>
              <div className={styles.nfNumberBox}>
                <div>Número: <strong>{invoiceNumber}</strong></div>
                <div>Emissão: <strong>{issueDate}</strong></div>
                <div>Código: <strong>{vCode}</strong></div>
              </div>
            </div>

            {/* Dados do Prestador */}
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeading}>1. Prestador de Serviços</div>
              <div className={styles.fieldItem}>
                Razão Social: <strong>{COMPANY_FISCAL_DATA.razaoSocial}</strong>
              </div>
              <div className={styles.grid2Col}>
                <div className={styles.fieldItem}>CNPJ: <strong>{COMPANY_FISCAL_DATA.cnpj}</strong></div>
                <div className={styles.fieldItem}>Inscrição Municipal: <strong>{COMPANY_FISCAL_DATA.inscricaoMunicipal}</strong></div>
                <div className={styles.fieldItem}>Município: <strong>{COMPANY_FISCAL_DATA.municipio} - {COMPANY_FISCAL_DATA.uf}</strong></div>
                <div className={styles.fieldItem}>Regime: <strong>{COMPANY_FISCAL_DATA.regimeTributario}</strong></div>
              </div>
            </div>

            {/* Dados do Tomador */}
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeading}>2. Tomador de Serviços (Consumidor Final)</div>
              <div className={styles.grid2Col}>
                <div className={styles.fieldItem}>Nome/Razão: <strong>{customerName}</strong></div>
                <div className={styles.fieldItem}>E-mail: <strong>{customerEmail}</strong></div>
                <div className={styles.fieldItem}>CPF: <strong>000.***.***-99</strong></div>
                <div className={styles.fieldItem}>Meio Pagto: <strong>{invoice.paymentMethod || 'PagBank Gateway'}</strong></div>
              </div>
            </div>

            {/* Discriminação dos Serviços */}
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeading}>3. Discriminação dos Serviços</div>
              <div className={styles.descriptionBox}>
                {invoice.serviceDescription || 'Licenciamento de Software de Jogo Eletrônico 2D (Eclipse: Ecos do Abismo)'}
                {'\n'}• Protocolo Transação Gateway: {invoice.orderProtocol || 'PAG-9482-B26'}
                {'\n'}• Plataforma: Godot Engine 4.7.1 Vulkan (Build Oficial de Lançamento)
                {'\n'}• Licença de uso pessoal, intransferível e permanente vinculada ao e-mail {customerEmail}.
              </div>
            </div>

            {/* Detalhamento dos Tributos */}
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeading}>4. Enquadramento e Valores Tributários (LC 116/03 - Item 1.05)</div>
              <div className={styles.fieldItem}>
                Atividade CNAE: <strong>{COMPANY_FISCAL_DATA.cnae}</strong>
              </div>
              <div className={styles.fieldItem}>
                Item da Lista de Serviços: <strong>{COMPANY_FISCAL_DATA.itemLc116}</strong>
              </div>

              <div className={styles.taxGrid}>
                <div className={styles.taxItem}>
                  <small>Valor dos Serviços</small>
                  <strong>R$ {gross.toFixed(2)}</strong>
                </div>
                <div className={styles.taxItem}>
                  <small>Deduções Legais</small>
                  <strong>R$ 0,00</strong>
                </div>
                <div className={styles.taxItem}>
                  <small>Base de Cálculo</small>
                  <strong>R$ {gross.toFixed(2)}</strong>
                </div>
                <div className={styles.taxItem}>
                  <small>Alíquota ISS</small>
                  <strong>3,00%</strong>
                </div>
                <div className={styles.taxItem}>
                  <small>Valor do ISS</small>
                  <strong>R$ {taxIss}</strong>
                </div>
                <div className={styles.taxItem}>
                  <small>Valor Líquido</small>
                  <strong style={{ color: '#006600' }}>R$ {gross.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            {/* Autenticação Digital */}
            <div className={styles.authFooter}>
              <div>
                NFS-e emitida com amparo no Simples Nacional. Documento assinado digitalmente pelo Sistema Eletrônico de Gestão Fiscal Tributária.
              </div>
              <div>
                Autenticidade: <strong>{vCode}</strong>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DanfseModal;
