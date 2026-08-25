import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './Synopsis.module.css';

export const Synopsis = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.eyebrow}>O Horizonte Esquecido</div>
          <h2 className={styles.title}>Quando o sol se apagou, restaram apenas os Ecos.</h2>
          
          <p className={styles.lead}>
            Em uma era esquecida pelas estrelas, a anomalia do Eclipse engoliu a luz da superfície.
            As velhas cidades colapsaram em estruturas de ferro e névoa profunda, onde antigas
            máquinas de mineração e cultistas agora guardam o caminho para as profundezas.
          </p>

          <blockquote className={styles.quote}>
            "O abismo não devora apenas corpos de metal e carne. Ele apaga memórias e esperança."
          </blockquote>

          <Link to="/wiki" className={styles.ctaLink}>
            Conhecer toda a história na Wiki Oficial →
          </Link>
        </motion.div>

        <motion.div
          className={styles.imageFrame}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <img 
            src="/document/image.png" 
            alt="Cenário de Eclipse: Ecos do Abismo" 
            className={styles.image}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Synopsis;
