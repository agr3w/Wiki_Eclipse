import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WIKI_CATEGORIES } from '../../data/wikiData';
import styles from './Wiki.module.css';

export const Wiki = () => {
  const { categoryId, topicId } = useParams();
  const [searchParams] = useSearchParams();
  const tabQuery = searchParams.get('tab');

  const [selectedCategory, setSelectedCategory] = useState(WIKI_CATEGORIES[0].id);
  const [selectedTopic, setSelectedTopic] = useState(WIKI_CATEGORIES[0].subtopics[0].id);

  useEffect(() => {
    const targetCatId = categoryId || tabQuery;
    if (targetCatId) {
      const foundCategory = WIKI_CATEGORIES.find(c => c.id === targetCatId);
      if (foundCategory) {
        setSelectedCategory(foundCategory.id);
        if (topicId) {
          const foundTopic = foundCategory.subtopics.find(t => t.id === topicId);
          if (foundTopic) {
            setSelectedTopic(foundTopic.id);
            setTimeout(() => {
              const element = document.getElementById(foundTopic.id);
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
            return;
          }
        }
        setSelectedTopic(foundCategory.subtopics[0].id);
      }
    }
  }, [categoryId, topicId, tabQuery]);

  const currentCategory = WIKI_CATEGORIES.find(c => c.id === selectedCategory) || WIKI_CATEGORIES[0];

  const handleSelectTopic = (catId, tId) => {
    setSelectedCategory(catId);
    setSelectedTopic(tId);
    const element = document.getElementById(tId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Navegação Lateral Rápida */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Índice da Wiki</div>
          {WIKI_CATEGORIES.map(category => (
            <div key={category.id} className={styles.categoryGroup}>
              <div className={styles.categoryLabel}>{category.title}</div>
              {category.subtopics.map(topic => (
                <button
                  key={topic.id}
                  className={`${styles.topicLink} ${selectedTopic === topic.id ? styles.activeTopic : ''}`}
                  onClick={() => handleSelectTopic(category.id, topic.id)}
                >
                  {topic.title}
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* Área Principal de Leitura */}
        <main className={styles.contentArea}>
          <div className={styles.header}>
            <span className={styles.categoryBadge}>{currentCategory.tag}</span>
            <h1 className={styles.mainTitle}>{currentCategory.title}</h1>
            <p className={styles.mainDescription}>{currentCategory.description}</p>
          </div>

          {currentCategory.subtopics.map(topic => (
            <motion.article 
              key={topic.id} 
              id={topic.id}
              className={styles.articleCard}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.articleTag}>{topic.tag}</div>
              <h2 className={styles.articleTitle}>{topic.title}</h2>
              
              {topic.quote && (
                <blockquote className={styles.articleQuote}>{topic.quote}</blockquote>
              )}

              {topic.content && (
                <div className={styles.articleBody}>
                  {topic.content.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              )}

              {topic.controls && (
                <table className={styles.controlTable}>
                  <thead>
                    <tr>
                      <th>Comando / Tecla</th>
                      <th>Ação no Jogo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topic.controls.map((ctrl, idx) => (
                      <tr key={idx}>
                        <td><span className={styles.controlKey}>{ctrl.key}</span></td>
                        <td>{ctrl.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </motion.article>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Wiki;
