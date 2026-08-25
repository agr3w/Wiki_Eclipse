import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './Highlights.module.css';

const highlights = [
  {
    tag: 'Mecânicas de Ação',
    title: 'Combate e Movimento Fluido',
    description: 'Enfrente sentinelas armadas com a Lâmina Solar. Execute saltos precisos, esquivas dinâmicas e controle sua estamina contra inimigos terrestres e aéreos.',
    link: '/wiki/mecanicas',
    linkText: 'Ver Controles & HUD'
  },
  {
    tag: 'Level Design & Parallax',
    title: 'Metrópole Vertical 2D',
    description: 'Explore camadas industriais suspensas com cenários de múltiplos planos em parallax, projetados com precisão pixel a pixel no motor Godot.',
    link: '/wiki/cenarios',
    linkText: 'Explorar Cenários'
  },
  {
    tag: 'Ameaças do Abismo',
    title: 'Guardiões & Chefes Únicos',
    description: 'Estude o padrão de ataque do Guardião da Tocha, dos Espectros voadores e prepare-se para a batalha em fases contra o Arauto do Eclipse.',
    link: '/wiki/inimigos',
    linkText: 'Catálogo de Inimigos'
  }
];

export const Highlights = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.eyebrow}>Pilares da Experiência</div>
          <h2 className={styles.title}>O que espera por você nas profundezas</h2>
        </div>

        <div className={styles.grid}>
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div>
                <div className={styles.cardTag}>{item.tag}</div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDescription}>{item.description}</p>
              </div>
              <Link to={item.link} className={styles.cardLink}>
                {item.linkText} →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
