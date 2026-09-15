import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import styles from './ExternalGatewayModal.module.css';

export const ExternalGatewayModal = ({ isOpen, onClose, onSuccess, onComplete }) => {
  const { user, claimGameLicense } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [billingName, setBillingName] = useState(user?.displayName || '');
  const [cardNumber, setCardNumber] = useState('4111 •••• •••• 1234');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const pixKeyMock = '00020126580014br.gov.bcb.pix0136ecl-9482-pagbank-2026520400005303986540510.005802BR5925Eclipse Studio Ecos Abismo6009SAO PAULO62070503***6304ABCD';
  const boletoLineMock = '23793.38128 60083.010488 56006.333306 9 94820000001000';

  if (!isOpen) return null;

  const handleCopy = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleConfirmPayment = async (e) => {
    if (e) e.preventDefault();
    setIsProcessing(true);

    const methodLabels = {
      pix: 'PIX Instantâneo',
      card: 'Cartão de Crédito',
      boleto: 'Boleto Bancário'
    };

    try {
      const order = await claimGameLicense({
        grossAmount: 10.00,
        gatewayFee: 0.95,
        netAmount: 9.05,
        paymentMethod: methodLabels[paymentMethod] || 'PIX Instantâneo',
        billingName: billingName.trim() || user?.displayName || user?.email?.split('@')[0] || 'Sentinela Eclipse',
        gatewayProvider: 'PagBank Sandbox Enterprise'
      });

      setCompletedOrder(order);
    } catch (err) {
      console.error('Erro no processamento do gateway:', err);
      alert('Erro ao registrar transação no gateway. Verifique sua conexão.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    onClose();
    if (onSuccess) onSuccess(completedOrder);
    if (onComplete) onComplete(completedOrder);
  };

  return (
    <AnimatePresence>
      <div className={styles.gatewayOverlay} onClick={onClose}>
        <motion.div 
          className={styles.gatewayWindow}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header do Gateway Integrado */}
          <div className={styles.gatewayHeader}>
            <div className={styles.brandArea}>
              <span className={styles.gatewayBadge}>PagBank</span>
              <span className={styles.gatewayTitle}>Checkout Seguro</span>
            </div>
            <div className={styles.headerActions}>
              <div className={styles.environmentTag}>
                <LockOutlinedIcon style={{ fontSize: '0.8rem', verticalAlign: 'middle', marginRight: '3px' }} />
                Ambiente de Homologação
              </div>
              <button 
                type="button" 
                className={styles.closeBtn} 
                onClick={onClose} 
                title="Fechar checkout"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>
          </div>

          {!completedOrder ? (
            <>
              <div className={styles.gatewayBody}>
                {/* Detalhamento Contábil e Intermediação */}
                <div className={styles.financeBreakdown}>
                  <div className={styles.breakdownRow}>
                    <span>Produto: <strong>Eclipse: Ecos do Abismo (Edição de Lançamento)</strong></span>
                    <span>R$ 10,00</span>
                  </div>
                  <div className={styles.breakdownRow}>
                    <span>Taxa Intermediação Gateway (PagBank 4.5% + R$ 0,50):</span>
                    <span style={{ color: '#ef5350' }}>- R$ 0,95</span>
                  </div>
                  <div className={styles.breakdownTotal}>
                    <span>Repasse Líquido Estúdio:</span>
                    <span className={styles.netHighlight}>R$ 9,05</span>
                  </div>
                </div>

                {/* Seletor de Métodos de Pagamento */}
                <div className={styles.methodSelector}>
                  <button 
                    type="button" 
                    className={`${styles.methodBtn} ${paymentMethod === 'pix' ? styles.activeMethod : ''}`}
                    onClick={() => setPaymentMethod('pix')}
                  >
                    <QrCode2OutlinedIcon style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '4px' }} />
                    PIX Instantâneo
                  </button>
                  <button 
                    type="button" 
                    className={`${styles.methodBtn} ${paymentMethod === 'card' ? styles.activeMethod : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCardOutlinedIcon style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '4px' }} />
                    Cartão de Crédito
                  </button>
                  <button 
                    type="button" 
                    className={`${styles.methodBtn} ${paymentMethod === 'boleto' ? styles.activeMethod : ''}`}
                    onClick={() => setPaymentMethod('boleto')}
                  >
                    <ReceiptLongOutlinedIcon style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '4px' }} />
                    Boleto Bancário
                  </button>
                </div>

                {/* Conteúdo Dinâmico por Método */}
                <div className={styles.methodContent}>
                  {paymentMethod === 'pix' && (
                    <div className={styles.pixBox}>
                      <div className={styles.qrCodeMock}>
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
                      <div className={styles.copyRow}>
                        <input 
                          readOnly 
                          value={pixKeyMock} 
                          className={styles.copyCode}
                          title="Chave Pix Copia e Cola" 
                        />
                        <button 
                          type="button" 
                          className={styles.copyBtn}
                          onClick={() => handleCopy(pixKeyMock)}
                        >
                          <ContentCopyOutlinedIcon style={{ fontSize: '0.85rem', verticalAlign: 'middle', marginRight: '3px' }} />
                          {copiedCode ? 'Copiado!' : 'Copiar'}
                        </button>
                      </div>
                      <p className={styles.methodNotice}>
                        Aponte a câmera do aplicativo do seu banco para o QR Code ou copie a linha Pix. A confirmação é instantânea e libera a licença imediatamente na sua conta.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <form className={styles.cardForm} onSubmit={handleConfirmPayment}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Nome Completo do Titular (conforme no cartão)</label>
                        <input 
                          type="text" 
                          required
                          value={billingName} 
                          onChange={(e) => setBillingName(e.target.value)}
                          placeholder="Ex: Yuri Nascimento"
                          className={styles.input}
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Número do Cartão de Crédito</label>
                        <input 
                          type="text" 
                          value={cardNumber} 
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4111 2222 3333 4444"
                          className={styles.input}
                        />
                      </div>

                      <div className={styles.rowInputs}>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Validade (MM/AA)</label>
                          <input 
                            type="text" 
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/28" 
                            className={styles.input} 
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Código de Segurança (CVV)</label>
                          <input 
                            type="text" 
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="888" 
                            className={styles.input} 
                          />
                        </div>
                      </div>

                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Opção de Parcelamento</label>
                        <select className={styles.input} defaultValue="1">
                          <option value="1">1x de R$ 10,00 sem juros (À vista)</option>
                          <option value="2">2x de R$ 5,00 sem juros</option>
                        </select>
                      </div>
                    </form>
                  )}

                  {paymentMethod === 'boleto' && (
                    <div className={styles.boletoBox}>
                      <div className={styles.boletoLine}>
                        {boletoLineMock}
                      </div>
                      <div className={styles.copyRow}>
                        <button 
                          type="button" 
                          className={styles.copyBtn}
                          style={{ width: '100%' }}
                          onClick={() => handleCopy(boletoLineMock)}
                        >
                          <ContentCopyOutlinedIcon style={{ fontSize: '0.85rem', verticalAlign: 'middle', marginRight: '4px' }} />
                          {copiedCode ? 'Linha Digitável Copiada!' : 'Copiar Linha Digitável do Boleto'}
                        </button>
                      </div>
                      <p className={styles.methodNotice}>
                        Boleto registrado pelo PagBank. Compensação bancária simulada para homologação do projeto.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Rodapé de Ação */}
              <div className={styles.gatewayFooter}>
                <button 
                  type="button" 
                  className={styles.cancelBtn} 
                  onClick={onClose}
                  disabled={isProcessing}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className={styles.payBtn}
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processando no Gateway...' : 'Autorizar Pagamento (R$ 10,00)'}
                </button>
              </div>
            </>
          ) : (
            /* Tela de Confirmação e Sucesso */
            <div className={styles.successWrapper}>
              <div className={styles.successIconWrapper}>
                <CheckCircleOutlineIcon style={{ fontSize: '2.4rem' }} />
              </div>

              <h2 className={styles.successHeading}>Pagamento Aprovado pelo Gateway!</h2>
              
              <div className={styles.protocolBadge}>
                Protocolo: {completedOrder.orderProtocol}
              </div>

              <p className={styles.successDescription}>
                A licença digital do <strong>Eclipse: Ecos do Abismo</strong> foi autorizada e sincronizada com a sua conta no Cloud Firestore.
              </p>

              <div className={styles.successMetaBox}>
                <div className={styles.successMetaRow}>
                  <span>Adquirente / Gateway:</span>
                  <span className={styles.successMetaVal}>PagBank Enterprise Sandbox</span>
                </div>
                <div className={styles.successMetaRow}>
                  <span>Titular Faturado:</span>
                  <span className={styles.successMetaVal}>{completedOrder.billingName}</span>
                </div>
                <div className={styles.successMetaRow}>
                  <span>E-mail da Conta:</span>
                  <span className={styles.successMetaVal}>{completedOrder.userEmail}</span>
                </div>
                <div className={styles.successMetaRow}>
                  <span>Valor Bruto Autorizado:</span>
                  <span className={styles.successMetaVal}>{completedOrder.price}</span>
                </div>
                <div className={styles.successMetaRow}>
                  <span>Repasse Líquido Contábil:</span>
                  <span className={styles.successMetaVal} style={{ color: '#00e58d' }}>
                    R$ {completedOrder.netValue?.toFixed(2) || '9.05'}
                  </span>
                </div>
              </div>

              <button 
                type="button" 
                className={styles.btnGoLibrary}
                onClick={handleFinish}
              >
                Acessar Minha Biblioteca & Download →
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ExternalGatewayModal;
