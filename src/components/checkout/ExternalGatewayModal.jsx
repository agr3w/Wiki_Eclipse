import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import styles from './ExternalGatewayModal.module.css';

export const ExternalGatewayModal = ({ isOpen, onClose, onPaymentSuccess }) => {
  const { user, claimGameLicense } = useAuth();
  const [method, setMethod] = useState('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [transactionProtocol, setTransactionProtocol] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Valores reais operacionais
  const nominalPrice = 10.00;
  const gatewayFee = 0.95; // 4.5% + R$ 0,50 fixo
  const netReceived = nominalPrice - gatewayFee;
  const pixMockString = '00020126580014br.gov.bcb.pix0136pagbank-ecl-9482-transacao-aprovada-2026';

  if (!isOpen) return null;

  const handleCopyPix = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pixMockString);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleAuthorizePayment = async () => {
    setIsProcessing(true);

    try {
      const order = await claimGameLicense({
        paymentMethod: method === 'pix' ? 'PIX Instantâneo' : method === 'card' ? 'Cartão de Crédito' : 'Boleto Bancário',
        grossAmount: nominalPrice,
        gatewayFee: gatewayFee,
        netAmount: netReceived,
        gatewayProvider: 'PagBank Sandbox Enterprise',
        billingName: user?.displayName || user?.email?.split('@')[0] || 'Jogador Registrado'
      });

      setTransactionProtocol(order?.orderProtocol || `PAG-${Date.now().toString().slice(-6)}`);
      setIsProcessing(false);
      setIsApproved(true);
    } catch {
      alert('Erro ao autorizar a transação no PagBank.');
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    setIsApproved(false);
    onClose();
    if (onPaymentSuccess) onPaymentSuccess();
  };

  return (
    <AnimatePresence>
      <div className={styles.gatewayOverlay} onClick={onClose}>
        <motion.div 
          className={styles.gatewayWindow}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header PagBank */}
          <div className={styles.gatewayHeader}>
            <div className={styles.brandArea}>
              <span className={styles.pagbankLogo}>PagBank</span>
              <span className={styles.gatewayTitle}>Checkout Seguro</span>
            </div>
            <div className={styles.headerActions}>
              <span className={styles.securityPill}>
                <LockOutlinedIcon style={{ fontSize: '0.85rem' }} />
                <span>Criptografia TLS 256-bit</span>
              </span>
              <button 
                type="button" 
                className={styles.closeBtn} 
                onClick={onClose} 
                title="Fechar"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>
          </div>

          {!isApproved ? (
            <>
              <div className={styles.gatewayBody}>
                {/* Resumo da Cobrança */}
                <div className={styles.amountCard}>
                  <div>
                    <div className={styles.merchantName}>Estabelecimento: Collective</div>
                    <div className={styles.orderProduct}>Eclipse: Ecos do Abismo</div>
                  </div>
                  <div className={styles.totalCharge}>
                    <div className={styles.chargeLabel}>Valor a Pagar</div>
                    <div className={styles.chargeValue}>R$ {nominalPrice.toFixed(2)}</div>
                  </div>
                </div>

                {/* Seleção do Método */}
                <div className={styles.methodSelector}>
                  <button 
                    type="button"
                    className={`${styles.methodBtn} ${method === 'pix' ? styles.activeMethod : ''}`}
                    onClick={() => setMethod('pix')}
                  >
                    PIX Instantâneo
                  </button>
                  <button 
                    type="button"
                    className={`${styles.methodBtn} ${method === 'card' ? styles.activeMethod : ''}`}
                    onClick={() => setMethod('card')}
                  >
                    Cartão de Crédito
                  </button>
                  <button 
                    type="button"
                    className={`${styles.methodBtn} ${method === 'boleto' ? styles.activeMethod : ''}`}
                    onClick={() => setMethod('boleto')}
                  >
                    Boleto Bancário
                  </button>
                </div>

                {/* Detalhes do Pagamento */}
                <div className={styles.methodDetails}>
                  {method === 'pix' && (
                    <div className={styles.pixBox}>
                      <div className={styles.qrCodeCard}>
                        <svg width="86" height="86" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="120" height="120" fill="white" rx="4"/>
                          <rect x="12" y="12" width="28" height="28" rx="3" stroke="#000" strokeWidth="4" fill="none"/>
                          <rect x="20" y="20" width="12" height="12" fill="#000"/>
                          <rect x="80" y="12" width="28" height="28" rx="3" stroke="#000" strokeWidth="4" fill="none"/>
                          <rect x="88" y="20" width="12" height="12" fill="#000"/>
                          <rect x="12" y="80" width="28" height="28" rx="3" stroke="#000" strokeWidth="4" fill="none"/>
                          <rect x="20" y="88" width="12" height="12" fill="#000"/>
                          <rect x="48" y="16" width="6" height="6" fill="#000"/>
                          <rect x="60" y="16" width="6" height="14" fill="#000"/>
                          <rect x="48" y="28" width="8" height="6" fill="#000"/>
                          <rect x="16" y="48" width="12" height="6" fill="#000"/>
                          <rect x="34" y="48" width="6" height="12" fill="#000"/>
                          <rect x="46" y="44" width="14" height="14" rx="2" fill="#00a868"/>
                          <circle cx="53" cy="51" r="3" fill="#fff"/>
                          <rect x="66" y="48" width="12" height="6" fill="#000"/>
                          <rect x="84" y="48" width="6" height="14" fill="#000"/>
                          <rect x="96" y="48" width="8" height="6" fill="#000"/>
                          <rect x="48" y="66" width="8" height="10" fill="#000"/>
                          <rect x="62" y="64" width="12" height="6" fill="#000"/>
                          <rect x="80" y="66" width="6" height="12" fill="#000"/>
                          <rect x="48" y="82" width="14" height="6" fill="#000"/>
                          <rect x="68" y="78" width="6" height="16" fill="#000"/>
                          <rect x="80" y="86" width="14" height="6" fill="#000"/>
                          <rect x="98" y="80" width="8" height="14" fill="#000"/>
                          <rect x="48" y="96" width="6" height="12" fill="#000"/>
                          <rect x="60" y="100" width="16" height="6" fill="#000"/>
                          <rect x="84" y="100" width="10" height="8" fill="#000"/>
                        </svg>
                      </div>
                      <div className={styles.pixCodeRow}>
                        <input 
                          readOnly 
                          value={pixMockString} 
                          className={styles.pixCode} 
                          title="Chave Pix"
                        />
                        <button 
                          type="button" 
                          className={styles.copyBtn}
                          onClick={handleCopyPix}
                        >
                          <ContentCopyOutlinedIcon style={{ fontSize: '0.8rem', verticalAlign: 'middle', marginRight: '3px' }} />
                          {copiedCode ? 'Copiado!' : 'Copiar'}
                        </button>
                      </div>
                      <span style={{ fontSize: '0.76rem', color: '#8b95a2' }}>
                        Escaneie pelo aplicativo de qualquer instituição para aprovação imediata.
                      </span>
                    </div>
                  )}

                  {method === 'card' && (
                    <div className={styles.cardForm}>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Número do Cartão</label>
                        <input type="text" defaultValue="5502 •••• •••• 9842" className={styles.inputField} />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Nome Impresso no Cartão</label>
                        <input type="text" defaultValue={user?.displayName?.toUpperCase() || 'TITULAR DO CARTAO'} className={styles.inputField} />
                      </div>
                      <div className={styles.rowInputs}>
                        <div className={styles.inputGroup}>
                          <label className={styles.inputLabel}>Validade</label>
                          <input type="text" defaultValue="09/29" className={styles.inputField} />
                        </div>
                        <div className={styles.inputGroup}>
                          <label className={styles.inputLabel}>CVV</label>
                          <input type="text" defaultValue="412" className={styles.inputField} />
                        </div>
                      </div>
                    </div>
                  )}

                  {method === 'boleto' && (
                    <div style={{ textAlign: 'center', padding: '1.25rem 0.5rem', color: '#8b95a2', fontSize: '0.82rem', lineHeight: 1.5 }}>
                      A representação gráfica do código de barras será gerada pelo PagBank e despachada para <strong>{user?.email}</strong>.
                    </div>
                  )}
                </div>
              </div>

              {/* Rodapé PagBank */}
              <div className={styles.gatewayFooter}>
                <button type="button" className={styles.btnCancel} onClick={onClose}>
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className={styles.btnPay}
                  onClick={handleAuthorizePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processando no PagBank...' : `Pagar R$ ${nominalPrice.toFixed(2)}`}
                </button>
              </div>
            </>
          ) : (
            <div className={styles.successArea}>
              <div className={styles.checkIcon}>✓</div>
              <h2 style={{ fontSize: '1.35rem', color: '#ffffff', fontWeight: 600 }}>Pagamento Aprovado</h2>
              <div className={styles.protocolBadge}>Protocolo PagBank: {transactionProtocol}</div>
              <p style={{ fontSize: '0.88rem', color: '#8b95a2', maxWidth: '420px', lineHeight: 1.6 }}>
                A transação de <strong>R$ {nominalPrice.toFixed(2)}</strong> foi compensada com sucesso pelo PagBank. Sua licença de <strong>Eclipse: Ecos do Abismo</strong> já está ativa.
              </p>
              <button className={styles.btnPay} onClick={handleFinish} style={{ marginTop: '0.5rem' }}>
                Acessar Minha Biblioteca →
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ExternalGatewayModal;
