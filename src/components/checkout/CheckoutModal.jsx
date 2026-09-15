import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import styles from './CheckoutModal.module.css';

export const CheckoutModal = ({ isOpen, onClose, onProceedToGateway }) => {
  const { user } = useAuth();
  const gamePrice = 10.00;

  if (!isOpen) return null;

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

          <div className={styles.header}>
            <span className={styles.badge}>Passo 1 de 2 • Resumo da Compra</span>
            <h2 className={styles.title}>Confirmar Pedido</h2>
          </div>

          {/* Item Adquirido */}
          <div className={styles.itemCard}>
            <div>
              <div className={styles.itemName}>Eclipse: Ecos do Abismo</div>
              <div className={styles.itemSub}>Edição Oficial de Lançamento (Godot 4.7.1)</div>
            </div>
            <div className={styles.itemPrice}>R$ {gamePrice.toFixed(2)}</div>
          </div>

          {/* Destinatário da Licença */}
          <div className={styles.infoBox}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Titular da Conta:</span>
              <span className={styles.infoValue}>{user?.displayName || 'Jogador Registrado'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>E-mail de Vinculação:</span>
              <span className={styles.infoValue}>{user?.email}</span>
            </div>
            <p className={styles.noticeText}>
              A chave digital do jogo será ativada instantaneamente na sua Biblioteca e o comprovante de emissão fiscal será enviado para o e-mail cadastrado.
            </p>
          </div>

          {/* Total */}
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total do Pedido:</span>
            <span className={styles.totalValue}>R$ {gamePrice.toFixed(2)}</span>
          </div>

          <button className={styles.btnProceed} onClick={onProceedToGateway}>
            Prosseguir para Pagamento Seguro (PagBank) →
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;

