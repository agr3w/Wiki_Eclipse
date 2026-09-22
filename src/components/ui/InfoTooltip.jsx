import React from 'react';
import styles from './InfoTooltip.module.css';

export const InfoTooltip = ({ title, concept, formula, source }) => {
  return (
    <span className={styles.tooltipWrapper}>
      <button 
        type="button" 
        className={styles.triggerBtn} 
        aria-label={`Informações sobre ${title}`}
      >
        ?
      </button>

      <div className={styles.popover} role="tooltip">
        <div className={styles.popoverTitle}>{title}</div>

        <div className={styles.section}>
          <span className={styles.sectionLabel}>Conceito</span>
          <span className={styles.sectionText}>{concept}</span>
        </div>

        {formula && (
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Cálculo / Regra</span>
            <div className={styles.formulaBox}>{formula}</div>
          </div>
        )}

        {source && (
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Origem dos Dados</span>
            <span className={styles.sourceBadge}>● {source}</span>
          </div>
        )}
      </div>
    </span>
  );
};

export default InfoTooltip;
