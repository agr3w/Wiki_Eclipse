import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import styles from './ProductSummary.module.css';

export const ProductSummary = ({ game, onAcquire, hasLicense }) => {
  const navigate = useNavigate();

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
          <span className={styles.priceSub}>
            {hasLicense ? 'Licença Ativa na Conta' : game.priceLabel}
          </span>
        </div>

        {hasLicense ? (
          <button 
            className={styles.btnAcquire} 
            style={{ 
              backgroundColor: 'var(--bg-elevated)', 
              borderColor: 'var(--border-active)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem'
            }}
            onClick={() => navigate('/biblioteca')}
          >
            <CheckCircleOutlineIcon style={{ fontSize: '1.1rem', color: '#81c784' }} />
            <span>Você já possui este jogo • Acessar Download →</span>
          </button>
        ) : (
          <button 
            className={styles.btnAcquire} 
            onClick={onAcquire}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.45rem' 
            }}
          >
            <ShoppingCartOutlinedIcon style={{ fontSize: '1.1rem' }} />
            <span>Adquirir Licença</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductSummary;
