import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { GAME_DETAILS } from '../../data/storeData';
import { MediaGallery } from '../../sections/store/MediaGallery';
import { ProductSummary } from '../../sections/store/ProductSummary';
import { PatchNoteModal } from '../../sections/store/PatchNoteModal';
import { DiscussionSection } from '../../sections/store/DiscussionSection';
import styles from './Store.module.css';

export const Store = () => {
  const { user, openAuthModal, claimGameLicense } = useAuth();
  const [selectedPatch, setSelectedPatch] = useState(null);
  const navigate = useNavigate();

  const handleAcquire = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (user.hasLicense) {
      navigate('/biblioteca');
      return;
    }

    await claimGameLicense();
    navigate('/biblioteca');
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Top Showcase: Galeria + Resumo de Compra */}
        <section className={styles.showcaseGrid}>
          <MediaGallery items={GAME_DETAILS.gallery} />
          <ProductSummary 
            game={GAME_DETAILS} 
            onAcquire={handleAcquire}
            hasLicense={user?.hasLicense}
          />
        </section>

        {/* Sobre o Jogo & Recursos */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>Visão Geral</div>
            <h2 className={styles.sectionTitle}>Sobre o Jogo</h2>
          </div>
          <div className={styles.prose}>
            <p>
              <strong>Eclipse: Ecos do Abismo</strong> combina a fluidez da ação em plataforma 2D com uma narrativa
              distópica focada na sobrevivência. Desenvolvido inteiramente na Godot Engine, o projeto coloca o jogador
              em um ecossistema hostil onde cada salto e golpe precisa ser dosado contra o consumo de energia da Lâmina Solar.
            </p>
            <ul className={styles.featureList}>
              {GAME_DETAILS.features.map((feat, idx) => (
                <li key={idx} className={styles.featureItem}>
                  <span className={styles.bullet}>•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Histórico de Atualizações & Hotfixes */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>Manutenção & Builds</div>
            <h2 className={styles.sectionTitle}>Histórico de Versões & Patches</h2>
          </div>
          <div className={styles.patchList}>
            {GAME_DETAILS.patchNotes.map((patch, idx) => (
              <div 
                key={idx} 
                className={styles.patchRow}
                onClick={() => setSelectedPatch(patch)}
              >
                <div className={styles.patchLeft}>
                  <span className={styles.patchBadge}>{patch.version}</span>
                  <span className={styles.patchName}>{patch.title}</span>
                </div>
                <span className={styles.patchAction}>{patch.date} • Ver notas →</span>
              </div>
            ))}
          </div>
        </section>

        {/* Requisitos de Sistema */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>Especificações Técnicas</div>
            <h2 className={styles.sectionTitle}>Requisitos de Sistema</h2>
          </div>
          <div className={styles.reqGrid}>
            <div className={styles.reqColumn}>
              <div className={styles.reqTitle}>MÍNIMOS</div>
              <div className={styles.reqRow}>
                <span className={styles.reqLabel}>Sistema Operacional</span>
                <span className={styles.reqValue}>{GAME_DETAILS.requirements.minimum.os}</span>
              </div>
              <div className={styles.reqRow}>
                <span className={styles.reqLabel}>Processador</span>
                <span className={styles.reqValue}>{GAME_DETAILS.requirements.minimum.processor}</span>
              </div>
              <div className={styles.reqRow}>
                <span className={styles.reqLabel}>Memória</span>
                <span className={styles.reqValue}>{GAME_DETAILS.requirements.minimum.memory}</span>
              </div>
              <div className={styles.reqRow}>
                <span className={styles.reqLabel}>Placa de Vídeo</span>
                <span className={styles.reqValue}>{GAME_DETAILS.requirements.minimum.graphics}</span>
              </div>
              <div className={styles.reqRow}>
                <span className={styles.reqLabel}>Armazenamento</span>
                <span className={styles.reqValue}>{GAME_DETAILS.requirements.minimum.storage}</span>
              </div>
            </div>

            <div className={styles.reqColumn}>
              <div className={styles.reqTitle}>RECOMENDADOS</div>
              <div className={styles.reqRow}>
                <span className={styles.reqLabel}>Sistema Operacional</span>
                <span className={styles.reqValue}>{GAME_DETAILS.requirements.recommended.os}</span>
              </div>
              <div className={styles.reqRow}>
                <span className={styles.reqLabel}>Processador</span>
                <span className={styles.reqValue}>{GAME_DETAILS.requirements.recommended.processor}</span>
              </div>
              <div className={styles.reqRow}>
                <span className={styles.reqLabel}>Memória</span>
                <span className={styles.reqValue}>{GAME_DETAILS.requirements.recommended.memory}</span>
              </div>
              <div className={styles.reqRow}>
                <span className={styles.reqLabel}>Placa de Vídeo</span>
                <span className={styles.reqValue}>{GAME_DETAILS.requirements.recommended.graphics}</span>
              </div>
              <div className={styles.reqRow}>
                <span className={styles.reqLabel}>Armazenamento</span>
                <span className={styles.reqValue}>{GAME_DETAILS.requirements.recommended.storage}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Central de Discussões */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>Comunidade</div>
            <h2 className={styles.sectionTitle}>Discussões & Feedback</h2>
          </div>
          <DiscussionSection initialDiscussions={GAME_DETAILS.discussions} />
        </section>
      </div>

      {/* Modal de Detalhes de Patch */}
      <AnimatePresence>
        {selectedPatch && (
          <PatchNoteModal 
            note={selectedPatch} 
            onClose={() => setSelectedPatch(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Store;
