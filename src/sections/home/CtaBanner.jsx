import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './CtaBanner.module.css';

export const CtaBanner = () => {
  return (
    <section className={styles.section}>
      <motion.div 
        className={styles.box}
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.title}>Pronto para descer ao Abismo?</h2>
        <p className={styles.description}>
          O projeto está disponível para download imediato em sua build acadêmica funcional.
          Crie sua conta, resgate a licença gratuita e teste o protótipo.
        </p>

        <div className={styles.buttonGroup}>
          <Link to="/loja" className={styles.ctaPrimary}>
            Resgatar Jogo Grátis na Loja
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default CtaBanner;
