import React, { useState } from 'react';
import { GAME_DETAILS } from '../../data/storeData';
import { WIKI_CATEGORIES } from '../../data/wikiData';
import styles from './AdminEditor.module.css';

export const AdminEditor = () => {
  const [gamePrice, setGamePrice] = useState(GAME_DETAILS.price);
  const [priceLabel, setPriceLabel] = useState(GAME_DETAILS.priceLabel);
  const [gameSynopsis, setGameSynopsis] = useState(GAME_DETAILS.synopsis);

  const [wikiCategories, setWikiCategories] = useState(WIKI_CATEGORIES);
  const [selectedCatId, setSelectedCatId] = useState(WIKI_CATEGORIES[0].id);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicSummary, setNewTopicSummary] = useState('');

  const handleSaveStoreData = (e) => {
    e.preventDefault();
    GAME_DETAILS.price = gamePrice;
    GAME_DETAILS.priceLabel = priceLabel;
    GAME_DETAILS.synopsis = gameSynopsis;
    alert('Informações do jogo e precificação atualizadas na Loja com sucesso!');
  };

  const handleAddWikiTopic = (e) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;

    const updated = wikiCategories.map(cat => {
      if (cat.id === selectedCatId) {
        return {
          ...cat,
          subtopics: [
            ...cat.subtopics,
            {
              id: `topic-${Date.now()}`,
              title: newTopicTitle,
              tag: 'Novo Registro',
              summary: newTopicSummary,
              content: [newTopicSummary]
            }
          ]
        };
      }
      return cat;
    });

    setWikiCategories(updated);
    setNewTopicTitle('');
    setNewTopicSummary('');
    alert('Novo tópico cadastrado na Wiki Oficial!');
  };

  return (
    <div className={styles.editorWrapper}>
      {/* Edição da Loja e Precificação */}
      <div className={styles.editBlock}>
        <div className={styles.blockHeader}>
          <h3 className={styles.blockTitle}>Gestão Comercial & Precificação do Jogo</h3>
        </div>

        <form className={styles.formGrid} onSubmit={handleSaveStoreData}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Valor do Jogo na Loja</label>
            <input 
              type="text" 
              value={gamePrice} 
              onChange={(e) => setGamePrice(e.target.value)}
              className={styles.input} 
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Rótulo / Descritor de Licença</label>
            <input 
              type="text" 
              value={priceLabel} 
              onChange={(e) => setPriceLabel(e.target.value)}
              className={styles.input} 
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Sinopse Comercial</label>
            <textarea 
              value={gameSynopsis} 
              onChange={(e) => setGameSynopsis(e.target.value)}
              className={styles.textarea} 
            />
          </div>

          <button type="submit" className={styles.btnSave}>
            Salvar Dados Comerciais
          </button>
        </form>
      </div>

      {/* Editor da Wiki */}
      <div className={styles.editBlock}>
        <div className={styles.blockHeader}>
          <h3 className={styles.blockTitle}>Criar Novo Tópico na Wiki Oficial</h3>
        </div>

        <form className={styles.formGrid} onSubmit={handleAddWikiTopic}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Categoria de Destino</label>
            <select 
              value={selectedCatId} 
              onChange={(e) => setSelectedCatId(e.target.value)}
              className={styles.input}
            >
              {wikiCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Título do Tópico</label>
            <input 
              type="text" 
              required
              placeholder="Ex: III. Os Artefatos Perdidos"
              value={newTopicTitle} 
              onChange={(e) => setNewTopicTitle(e.target.value)}
              className={styles.input} 
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Resumo e Conteúdo</label>
            <textarea 
              required
              placeholder="Escreva os detalhes que constarão na documentação..."
              value={newTopicSummary} 
              onChange={(e) => setNewTopicSummary(e.target.value)}
              className={styles.textarea} 
            />
          </div>

          <button type="submit" className={styles.btnSave}>
            Publicar na Wiki
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditor;
