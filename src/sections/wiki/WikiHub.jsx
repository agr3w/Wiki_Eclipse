import React from 'react';
import { motion } from 'framer-motion';
import { WIKI_CATEGORIES } from '../../data/wikiData';
import styles from './WikiHub.module.css';

/* Ícones Customizados Vetoriais para cada Tomo da Wiki */
const LoreIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Halo do Eclipse com pontilhado */}
    <circle cx="24" cy="20" r="16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
    <circle cx="24" cy="20" r="11" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="28" cy="17" r="9" fill="var(--bg-main)" />
    {/* Tomo / Livro Antigo da Gênese */}
    <path d="M10 36C14 33.5 20 33.5 24 36.5C28 33.5 34 33.5 38 36V18C34 15.5 28 15.5 24 18.5C20 15.5 14 15.5 10 18V36Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 18.5V36.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Runas de Fótons */}
    <path d="M24 8V4M24 40V44M4 20H8M40 20H44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const MechanicsIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Corpo do Controle de Gameplay */}
    <rect x="7" y="14" width="34" height="20" rx="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
    {/* D-Pad de Movimentação */}
    <path d="M16 19V29M11 24H21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    {/* Botões de Ação / Combate */}
    <circle cx="32" cy="19" r="1.8" fill="currentColor" />
    <circle cx="36" cy="24" r="1.8" fill="currentColor" />
    <circle cx="28" cy="24" r="1.8" fill="currentColor" />
    <circle cx="32" cy="29" r="1.8" fill="currentColor" />
    {/* Retícula de Precisão Central */}
    <circle cx="24" cy="24" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.8" />
    <path d="M24 6V10M24 38V42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
  </svg>
);

const EnemiesIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Chifres e Coroa do Abismo */}
    <path d="M11 11C11 11 9 19 15 24M37 11C37 11 39 19 33 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    {/* Máscara Espectral / Bestiário */}
    <path d="M15 22C15 16 19 13 24 13C29 13 33 16 33 22C33 27 30 30 30 35H18C18 30 15 27 15 22Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" strokeLinejoin="round" />
    {/* Olhos Incandescentes */}
    <circle cx="19.5" cy="23.5" r="2" fill="currentColor" />
    <circle cx="28.5" cy="23.5" r="2" fill="currentColor" />
    {/* Mandíbula da Aberração */}
    <path d="M21 31V35M24 30V35M27 31V35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Garras / Aura Noturna */}
    <path d="M7 27C5 31 7 37 11 39M41 27C43 31 41 37 37 39" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
  </svg>
);

const EnvironmentsIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Torres Industriais em Parallax ao fundo */}
    <path d="M9 27V15H15V27M17 27V9H25V27M27 27V17H33V27M35 27V20H39V27" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
    {/* Passarelas e Vigas Metálicas 2D */}
    <path d="M5 33H43" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M9 33L13 41M21 33L21 41M27 33L27 41M39 33L35 41" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
    <path d="M5 41H43" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    {/* Eclipse Solar Flutuante */}
    <circle cx="34" cy="11" r="5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="35.5" cy="10" r="4" fill="var(--bg-main)" />
  </svg>
);

const CATEGORY_ICONS = {
  lore: LoreIcon,
  mecanicas: MechanicsIcon,
  inimigos: EnemiesIcon,
  cenarios: EnvironmentsIcon,
};

export const WikiHub = ({ onSelectCategory }) => {
  return (
    <div className={styles.hubWrapper}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>Compêndio de Registros</div>
        <h1 className={styles.title}>Arquivo Central do Abismo</h1>
        <p className={styles.description}>
          Explore os registros históricos, manuais de combate, catálogo de entidades
          e levantamentos arquitetônicos das profundezas.
        </p>
      </header>

      <div className={styles.grid}>
        {WIKI_CATEGORIES.map((cat, index) => {
          const IconComponent = CATEGORY_ICONS[cat.id] || LoreIcon;

          return (
            <motion.div
              key={cat.id}
              className={styles.categoryCard}
              onClick={() => onSelectCategory(cat.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <div>
                <div className={styles.cardTop}>
                  <span className={styles.cardBadge}>{cat.tag}</span>

                  {/* Ícone Centralizado e de Grande Destaque */}
                  <div className={styles.iconWrapper}>
                    <div className={styles.iconBox}>
                      <IconComponent />
                    </div>
                  </div>

                  <h2 className={styles.cardTitle}>{cat.title}</h2>
                  <p className={styles.cardDescription}>{cat.description}</p>
                </div>

                <div className={styles.subtopicsList}>
                  {cat.subtopics.map(sub => (
                    <div key={sub.id} className={styles.subtopicItem}>
                      <span className={styles.subtopicBullet} />
                      <span>{sub.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.cardFooter}>
                Acessar tomo completo →
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WikiHub;
