import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { WIKI_CATEGORIES } from '../../data/wikiData';
import styles from './WikiDetail.module.css';

export const WikiDetail = ({ initialCategory, onBackToHub, onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || WIKI_CATEGORIES[0].id);
  const currentCategory = WIKI_CATEGORIES.find(c => c.id === selectedCategory) || WIKI_CATEGORIES[0];
  const [selectedTopic, setSelectedTopic] = useState(currentCategory.subtopics[0]?.id);

  const sidebarRef = useRef(null);
  const isManualScrolling = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Lista global linear de todos os tópicos da Wiki
  const allTopics = WIKI_CATEGORIES.flatMap(category => 
    category.subtopics.map(subtopic => ({
      ...subtopic,
      categoryId: category.id,
      categoryTitle: category.title
    }))
  );

  const currentGlobalIndex = allTopics.findIndex(t => t.id === selectedTopic);
  const prevTopic = currentGlobalIndex > 0 ? allTopics[currentGlobalIndex - 1] : null;
  const nextTopic = currentGlobalIndex >= 0 && currentGlobalIndex < allTopics.length - 1 
    ? allTopics[currentGlobalIndex + 1] 
    : null;

  // Sincronizar caso a rota/prop inicial mude
  useEffect(() => {
    if (initialCategory && initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Ao trocar de categoria, inicializar o primeiro tópico
  useEffect(() => {
    if (currentCategory.subtopics.length > 0) {
      setSelectedTopic(currentCategory.subtopics[0].id);
    }
  }, [selectedCategory]);

  // Auto-scroll da barra lateral para manter o tópico ativo sempre visível e centralizado no menu
  useEffect(() => {
    if (sidebarRef.current && selectedTopic) {
      const activeBtn = sidebarRef.current.querySelector(`.${styles.activeTopic}`);
      if (activeBtn) {
        const sidebar = sidebarRef.current;
        const elemTop = activeBtn.offsetTop;
        const elemHeight = activeBtn.offsetHeight;
        const sidebarHeight = sidebar.clientHeight;
        const currentScroll = sidebar.scrollTop;

        // Se o elemento estiver fora ou próximo das bordas do viewport da sidebar
        if (elemTop < currentScroll + 50 || elemTop + elemHeight > currentScroll + sidebarHeight - 50) {
          sidebar.scrollTo({
            top: elemTop - sidebarHeight / 2 + elemHeight / 2,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [selectedTopic, selectedCategory]);

  // ScrollSpy: Rastreamento automático e natural da posição do leitor no documento
  useEffect(() => {
    const handleScrollSpy = () => {
      if (isManualScrolling.current) return;

      const subtopics = currentCategory.subtopics;
      const readingLineOffset = window.scrollY + 160; // Ponto focal abaixo da navbar fixa

      for (let i = subtopics.length - 1; i >= 0; i--) {
        const element = document.getElementById(subtopics[i].id);
        if (element) {
          const elementTop = element.getBoundingClientRect().top + window.scrollY;

          if (readingLineOffset >= elementTop) {
            setSelectedTopic(subtopics[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy(); // Verificação inicial

    return () => {
      window.removeEventListener('scroll', handleScrollSpy);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [currentCategory, selectedCategory]);

  const handleSelectTopic = (catId, topicId) => {
    isManualScrolling.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    if (catId !== selectedCategory) {
      setSelectedCategory(catId);
      setSelectedTopic(topicId);
      if (onCategoryChange) {
        onCategoryChange(catId);
      }

      // Aguarda renderização do novo tomo para realizar o scroll
      setTimeout(() => {
        const element = document.getElementById(topicId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        scrollTimeoutRef.current = setTimeout(() => {
          isManualScrolling.current = false;
        }, 800);
      }, 100);
    } else {
      setSelectedTopic(topicId);
      const element = document.getElementById(topicId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isManualScrolling.current = false;
      }, 800);
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar de Navegação Rápida com Auto-Scroll e Rastreamento ScrollSpy */}
      <aside className={styles.sidebar} ref={sidebarRef}>
        <button className={styles.backButton} onClick={onBackToHub}>
          ← Voltar ao Índice da Wiki
        </button>

        <div className={styles.sidebarTitle}>Navegação dos Tomos</div>
        {WIKI_CATEGORIES.map(cat => {
          const isCurrentCat = cat.id === selectedCategory;

          return (
            <div key={cat.id} className={styles.categoryGroup}>
              <div className={`${styles.categoryLabel} ${isCurrentCat ? styles.activeCategoryLabel : ''}`}>
                <span>{cat.title}</span>
                {isCurrentCat && <span className={styles.currentCategoryBadge} />}
              </div>
              {cat.subtopics.map(sub => {
                const isActive = isCurrentCat && selectedTopic === sub.id;

                return (
                  <button
                    key={sub.id}
                    className={`${styles.topicLink} ${isActive ? styles.activeTopic : ''}`}
                    onClick={() => handleSelectTopic(cat.id, sub.id)}
                  >
                    {sub.title}
                  </button>
                );
              })}
            </div>
          );
        })}
      </aside>

      {/* Conteúdo Detalhado Integrado em Formato de Compêndio */}
      <main className={styles.contentArea}>
        <div>
          <div className={styles.breadcrumbs}>
            <span>Wiki</span>
            <span>/</span>
            <span className={styles.breadcrumbActive}>{currentCategory.title}</span>
          </div>

          <div className={styles.header}>
            <span className={styles.categoryBadge}>{currentCategory.tag}</span>
            <h1 className={styles.mainTitle}>{currentCategory.title}</h1>
            <p className={styles.mainDescription}>{currentCategory.description}</p>
          </div>
        </div>

        {currentCategory.subtopics.map((topic, index) => (
          <motion.section 
            key={topic.id} 
            id={topic.id}
            className={styles.articleSection}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
          >
            <div className={styles.articleHeader}>
              <div className={styles.articleTag}>{topic.tag}</div>
              <h2 className={styles.articleTitle}>{topic.title}</h2>
              {topic.summary && (
                <p className={styles.articleSummary}>{topic.summary}</p>
              )}
            </div>

            {/* Imagem Contextual Ilustrativa */}
            {topic.image && (
              <div className={styles.mediaFrame}>
                <img 
                  src={topic.image} 
                  alt={topic.title} 
                  className={styles.mediaImage}
                />
                {topic.imageCaption && (
                  <div className={styles.mediaCaption}>
                    <span className={styles.mediaCaptionDot} />
                    <span>{topic.imageCaption}</span>
                  </div>
                )}
              </div>
            )}

            {/* Grid de Atributos Estruturados (Stats / Comportamentos) */}
            {topic.attributes && (
              <div className={styles.attributesGrid}>
                {topic.attributes.map((attr, idx) => (
                  <div key={idx} className={styles.attributeCard}>
                    <span className={styles.attributeLabel}>{attr.label}</span>
                    <span className={styles.attributeValue}>{attr.value}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Citação Temática */}
            {topic.quote && (
              <blockquote className={styles.articleQuote}>{topic.quote}</blockquote>
            )}

            {/* Parágrafos de Conteúdo */}
            {topic.content && (
              <div className={styles.articleBody}>
                {topic.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            )}

            {/* Tabela de Controles e Mapeamento */}
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
          </motion.section>
        ))}

        {/* Navegação Sequencial de Rodapé: Anterior & Próximo */}
        <div className={styles.paginationNav}>
          {prevTopic ? (
            <button 
              type="button"
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={() => handleSelectTopic(prevTopic.categoryId, prevTopic.id)}
            >
              <span className={styles.navDirection}>← Tópico Anterior</span>
              <span className={styles.navTitle}>{prevTopic.title}</span>
              <span className={styles.navCategory}>{prevTopic.categoryTitle}</span>
            </button>
          ) : (
            <div className={styles.navPlaceholder} />
          )}

          {nextTopic ? (
            <button 
              type="button"
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={() => handleSelectTopic(nextTopic.categoryId, nextTopic.id)}
            >
              <span className={styles.navDirection}>Próximo Tópico →</span>
              <span className={styles.navTitle}>{nextTopic.title}</span>
              <span className={styles.navCategory}>{nextTopic.categoryTitle}</span>
            </button>
          ) : (
            <div className={styles.navPlaceholder} />
          )}
        </div>
      </main>
    </div>
  );
};

export default WikiDetail;
