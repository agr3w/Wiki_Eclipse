import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

export const Hero = () => {
  return (
    <section className={styles.heroWrapper}>
      <div className={styles.backgroundOverlay} />
      <div className={styles.backgroundGradient} />

      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          PROJETO ACADÊMICO • GODOT 4.7 • LICENÇA ABERTA
        </div>

        <h1 className={styles.title}>
          Eclipse: Ecos do Abismo
        </h1>

        <div className={styles.subtitle}>
          Ação e Plataforma 2D
        </div>

        <p className={styles.description}>
          Após o colapso da luz solar, desça às ruínas subterrâneas e empunhe a
          Lâmina Solar para restaurar a centelha da humanidade frente ao Arauto do Eclipse.
        </p>

        <div className={styles.buttonGroup}>
          <Link to="/loja" className={styles.ctaPrimary}>
            Adquirir Licença (Grátis)
          </Link>
          <Link to="/wiki" className={styles.ctaSecondary}>
            Explorar Wiki Oficial
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
