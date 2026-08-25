import React from 'react';
import styles from './ProductSummary.module.css';

export const ProductSummary = ({ game, onAcquire }) => {
  return (
    <div className={styles.summaryWrapper}>
      <div>
        <h1 className={styles.title}>{game.title}</h1>
        <p className={styles.synopsis}>{game.synopsis}</p>

        <div className={styles.tagList}>
          {game.tags.map((tag, idx) => (
            <span key={idx} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <div className={styles.metaGrid}>
          <span className={styles.metaLabel}>Lançamento:</span>
          <span className={styles.metaValue}>{game.releaseDate}</span>

          <span className={styles.metaLabel}>Desenvolvedor:</span>
          <span className={styles.metaValue}>{game.developer}</span>

          <span className={styles.metaLabel}>Motor Gráfico:</span>
          <span className={styles.metaValue}>{game.engine}</span>

          <span className={styles.metaLabel}>Tamanho:</span>
          <span className={styles.metaValue}>{game.size}</span>
        </div>
      </div>

      <div className={styles.buyBox}>
        <div className={styles.priceInfo}>
          <span className={styles.price}>{game.price}</span>
          <span className={styles.priceSub}>{game.priceLabel}</span>
        </div>
        <button className={styles.btnAcquire} onClick={onAcquire}>
          Adquirir Licença
        </button>
      </div>
    </div>
  );
};

export default ProductSummary;
