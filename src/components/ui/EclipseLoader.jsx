import React from 'react';
import { motion } from 'framer-motion';
import styles from './EclipseLoader.module.css';

export const EclipseLoader = ({ 
  label = 'Sincronizando com o Abismo...', 
  sublabel = 'Carregando recursos e dados de transmissão' 
}) => {
  return (
    <motion.div 
      className={styles.loaderWrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.eclipseContainer}>
        <div className={styles.coronaRing} />
        <div className={styles.sunCorona} />
        <div className={styles.moonDisc} />
      </div>

      <div className={styles.statusContainer}>
        <span className={styles.statusText}>{label}</span>
        <span className={styles.statusSubtitle}>{sublabel}</span>
      </div>
    </motion.div>
  );
};

export default EclipseLoader;
