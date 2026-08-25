import React from 'react';
import { Link } from 'react-router-dom';
import styles from './GameLibrary.module.css';

export const GameLibrary = ({ hasLicense }) => {
  const handleDownload = () => {
    alert('Iniciando o download do pacote "Eclipse_Ecos_do_Abismo_v1.0.4.zip" (148 MB)...');
  };

  if (!hasLicense) {
    return (
      <div className={styles.emptyState}>
        <h3 className={styles.emptyTitle}>Sua biblioteca está vazia</h3>
        <p className={styles.emptyDescription}>
          Você ainda não possui jogos cadastrados na sua conta. Acesse a nossa loja e resgate sua licença acadêmica gratuita para liberar a build oficial.
        </p>
        <Link to="/loja" className={styles.btnStore}>
          Visitar Loja do Game →
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.libraryWrapper}>
      <div className={styles.gameCard}>
        <div className={styles.cardMedia}>
          <img 
            src="/document/image.png" 
            alt="Eclipse: Ecos do Abismo" 
            className={styles.cardImg} 
          />
        </div>

        <div className={styles.cardBody}>
          <div>
            <div className={styles.cardHeader}>
              <h3 className={styles.gameTitle}>Eclipse: Ecos do Abismo</h3>
              <span className={styles.statusBadge}>Licença Ativa</span>
            </div>
            <p className={styles.gameMeta}>
              Ação e Plataforma 2D • Godot Engine 4.7.1 • Compatível com Windows x64 e Linux
            </p>
          </div>

          <div className={styles.cardFooter}>
            <span className={styles.buildInfo}>Versão v1.0.4 • 148 MB (.zip)</span>
            <button className={styles.btnDownload} onClick={handleDownload}>
              Baixar Executável
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLibrary;
