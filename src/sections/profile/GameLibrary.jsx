import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { requestSecureDownload } from '../../services/downloadService';

// Material UI Icons
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';

import styles from './GameLibrary.module.css';

export const GameLibrary = ({ hasLicense }) => {
  const { user } = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState('windows');
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadClick = async () => {
    try {
      setDownloading(true);
      setDownloadSuccess(false);

      await requestSecureDownload(user, selectedPlatform);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      alert(err.message || 'Erro ao processar download seguro.');
    } finally {
      setDownloading(false);
    }
  };

  // Bloqueio de acesso e ocultação total na DOM caso não tenha licença
  if (!hasLicense) {
    return (
      <div className={styles.emptyState}>
        <HourglassEmptyOutlinedIcon style={{ fontSize: '3rem', color: 'var(--accent-terracotta)', marginBottom: '1rem' }} />
        <h3 className={styles.emptyTitle}>Acesso Restrito: Licença Necessária</h3>
        <p className={styles.emptyDescription}>
          Nenhum arquivo executável está disponível para este usuário. Resgate sua licença acadêmica gratuita na loja para habilitar o stream seguro da build.
        </p>
        <Link to="/loja" className={styles.btnStore}>
          Visitar Loja & Resgatar Licença →
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.libraryWrapper}>
      {/* Card do Game com Stream Protegido */}
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
              <span className={styles.statusBadge}>
                <CheckCircleOutlineIcon style={{ fontSize: '0.85rem', verticalAlign: 'middle', marginRight: '0.25rem' }} />
                Licença Ativa
              </span>
            </div>
            <p className={styles.gameMeta}>
              Ação e Plataforma 2D • Godot Engine 4.7.1 • Renderizador Vulkan / OpenGL
            </p>

            {/* Seletor de Plataforma */}
            <div className={styles.platformSelector}>
              <span className={styles.platformLabel}>Plataforma:</span>
              <button 
                type="button"
                className={`${styles.platformBtn} ${selectedPlatform === 'windows' ? styles.activePlatform : ''}`}
                onClick={() => setSelectedPlatform('windows')}
              >
                <WindowOutlinedIcon style={{ fontSize: '0.9rem', verticalAlign: 'text-bottom', marginRight: '0.35rem' }} />
                Windows (x64)
              </button>
              <button 
                type="button"
                className={`${styles.platformBtn} ${selectedPlatform === 'linux' ? styles.activePlatform : ''}`}
                onClick={() => setSelectedPlatform('linux')}
              >
                <TerminalOutlinedIcon style={{ fontSize: '0.9rem', verticalAlign: 'text-bottom', marginRight: '0.35rem' }} />
                Linux (x64)
              </button>
            </div>
          </div>

          <div className={styles.cardFooter}>
            <div className={styles.securityNote}>
              <span className={styles.buildInfo}>
                {selectedPlatform === 'windows' ? 'Eclipse_v1.0.4_Win64.zip' : 'Eclipse_v1.0.4_Linux64.zip'} (148 MB)
              </span>
              <span className={styles.shaInfo}>
                <SecurityOutlinedIcon style={{ fontSize: '0.8rem', verticalAlign: 'text-bottom', marginRight: '0.25rem' }} />
                SHA-256: 8f4e2...d91a • Verificado via Firestore Token
              </span>
            </div>

            <button 
              type="button"
              className={styles.btnDownload}
              onClick={handleDownloadClick}
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <HourglassEmptyOutlinedIcon style={{ fontSize: '1rem' }} />
                  <span>Verificando Licença...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircleOutlineIcon style={{ fontSize: '1rem' }} />
                  <span>Pacote Enviado</span>
                </>
              ) : (
                <>
                  <FileDownloadOutlinedIcon style={{ fontSize: '1.1rem' }} />
                  <span>Baixar Jogo (.zip)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Guia Rápido de Instalação */}
      <div className={styles.guideBox}>
        <h4 className={styles.guideTitle}>
          <MenuBookOutlinedIcon style={{ fontSize: '1.2rem', verticalAlign: 'text-bottom', marginRight: '0.5rem', color: 'var(--accent-terracotta)' }} />
          Instruções de Instalação e Execução
        </h4>
        <ul className={styles.guideSteps}>
          <li className={styles.stepItem}>
            <span className={styles.stepNumber}>1</span>
            <span>Baixe o arquivo comprimido <code>.zip</code> correspondente ao seu sistema operacional.</span>
          </li>
          <li className={styles.stepItem}>
            <span className={styles.stepNumber}>2</span>
            <span>Extraia todo o conteúdo do arquivo em uma pasta local de sua preferência.</span>
          </li>
          <li className={styles.stepItem}>
            <span className={styles.stepNumber}>3</span>
            <span>No Windows, execute o arquivo <code>Eclipse_Ecos_do_Abismo.exe</code>. No Linux, conceda permissão de execução via terminal (<code>chmod +x Eclipse_Ecos_do_Abismo.x86_64</code>) e inicialize o jogo.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GameLibrary;
