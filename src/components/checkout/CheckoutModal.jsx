import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import styles from './CheckoutModal.module.css';

export const CheckoutModal = ({ isOpen, onClose, onComplete }) => {
  const { user, claimGameLicense } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [billingName, setBillingName] = useState(user?.displayName || '');
  const [cardNumber, setCardNumber] = useState('4111 •••• •••• 1234');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen) return null;

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const order = await claimGameLicense({
        paymentMethod,
        billingName
      });
      setCompletedOrder(order);
    } catch {
      alert('Erro ao processar transação.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    onClose();
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      <div className={styles.backdrop} onClick={onClose}>
        <motion.div 
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
        >
          <button className={styles.closeBtn} onClick={onClose}>✕</button>

          {!completedOrder ? (
            <>
              <div className={styles.header}>
                <div className={styles.securityBadge}>
                  🔒 Transação Segura • Licença Acadêmica
                </div>
                <h2 className={styles.title}>Checkout do Jogo</h2>
              </div>

              {/* Resumo do Pedido */}
              <div className={styles.orderSummary}>
                <div>
                  <div className={styles.gameName}>Eclipse: Ecos do Abismo</div>
                  <div className={styles.gameEdition}>Edição Oficial • Build Godot 4.7.1</div>
                </div>
                <div className={styles.priceTag}>R$ 0,00</div>
              </div>

              {/* Informação da Nota Fiscal Digital */}
              <div className={styles.nfNotice}>
                A chave de autenticação digital e o comprovante fiscal acadêmico serão vinculados à sua conta e encaminhados para: <br />
                <span className={styles.emailHighlight}>{user?.email}</span>
              </div>

              {/* Métodos de Pagamento Mockados */}
              <div className={styles.paymentTabs}>
                <button 
                  type="button"
                  className={`${styles.tabBtn} ${paymentMethod === 'pix' ? styles.activeTab : ''}`}
                  onClick={() => setPaymentMethod('pix')}
                >
                  PIX
                </button>
                <button 
                  type="button"
                  className={`${styles.tabBtn} ${paymentMethod === 'card' ? styles.activeTab : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  Cartão
                </button>
                <button 
                  type="button"
                  className={`${styles.tabBtn} ${paymentMethod === 'boleto' ? styles.activeTab : ''}`}
                  onClick={() => setPaymentMethod('boleto')}
                >
                  Boleto
                </button>
                <button 
                  type="button"
                  className={`${styles.tabBtn} ${paymentMethod === 'paypal' ? styles.activeTab : ''}`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  PayPal
                </button>
              </div>

              <form onSubmit={handleConfirmOrder}>
                <div className={styles.formBox}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Nome Completo / Titular</label>
                    <input 
                      type="text" 
                      required
                      value={billingName} 
                      onChange={(e) => setBillingName(e.target.value)}
                      placeholder="Nome do Titular"
                      className={styles.input}
                    />
                  </div>

                  {paymentMethod === 'card' && (
                    <>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Número do Cartão (Simulado)</label>
                        <input 
                          type="text" 
                          value={cardNumber} 
                          onChange={(e) => setCardNumber(e.target.value)}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Validade</label>
                          <input type="text" placeholder="12/28" className={styles.input} />
                        </div>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>CVV</label>
                          <input type="text" placeholder="888" className={styles.input} />
                        </div>
                      </div>
                    </>
                  )}

                  {paymentMethod === 'pix' && (
                    <div className={styles.mockNotice}>
                      ⚡ Chave de transação instantânea verificada pelo ambiente do Firebase.
                    </div>
                  )}

                  {paymentMethod === 'boleto' && (
                    <div className={styles.mockNotice}>
                      📄 Linha digitável acadêmica gerada sem custos adicionais.
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className={styles.mockNotice}>
                      🌐 Conexão de autorização direta expressa.
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className={styles.btnConfirm} 
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Gravando no Firestore...' : 'Confirmar e Resgatar Licença'}
                </button>
              </form>
            </>
          ) : (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.title}>Licença Resgatada!</h2>
              <div className={styles.protocol}>Protocolo: {completedOrder.orderProtocol}</div>
              <p className={styles.successDesc}>
                A licença digital do <strong>Eclipse: Ecos do Abismo</strong> foi vinculada com sucesso à sua conta. O comprovante foi despachado para <strong>{completedOrder.invoiceRecipientEmail}</strong>.
              </p>
              <button className={styles.btnGoLibrary} onClick={handleFinish}>
                Acessar Minha Biblioteca & Download →
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
