import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addCostItem, updateCostItem, deleteCostItem } from '../../services/costService';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import styles from './CostManagerModal.module.css';

export const CostManagerModal = ({ isOpen, onClose, costs = [] }) => {
  const [activeTab, setActiveTab] = useState('fixed'); // 'fixed' | 'variable'
  const [editingId, setEditingId] = useState(null);

  // Campos do formulário
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [detail, setDetail] = useState(''); // period ou basis
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const currentList = costs.filter(c => c.type === activeTab);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setCategory('');
    setAmount('');
    setDetail('');
    setError('');
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setName(item.name || '');
    setCategory(item.category || '');
    setAmount(String(item.amount || ''));
    setDetail(activeTab === 'fixed' ? (item.period || 'Mensal') : (item.basis || 'Por unidade'));
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(String(amount).replace(',', '.'));
    if (!name.trim()) return setError('Informe o nome da despesa/custo.');
    if (isNaN(parsedAmount) || parsedAmount < 0) return setError('Insira um valor numérico positivo.');

    const payload = {
      name: name.trim(),
      category: category.trim() || 'Geral',
      type: activeTab,
      amount: parsedAmount,
      ...(activeTab === 'fixed' ? { period: detail.trim() || 'Mensal' } : { basis: detail.trim() || 'Por unidade vendida' })
    };

    setIsSaving(true);
    try {
      if (editingId) {
        await updateCostItem(editingId, payload);
      } else {
        await addCostItem(payload);
      }
      resetForm();
    } catch {
      setError('Erro ao salvar no banco de dados Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente remover este custo do banco de dados?')) {
      try {
        await deleteCostItem(id);
      } catch {
        alert('Erro ao excluir do banco de dados.');
      }
    }
  };

  return (
    <AnimatePresence>
      <div className={styles.modalBackdrop} onClick={onClose}>
        <motion.div 
          className={styles.modalWindow}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
        >
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.titleGroup}>
              <h3>Gestão de Custos & Estrutura Contábil</h3>
              <span className={styles.subtitle}>Sincronização em tempo real com o Cloud Firestore</span>
            </div>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
              <CloseOutlinedIcon style={{ fontSize: '1.25rem' }} />
            </button>
          </div>

          <div className={styles.body}>
            {/* Seletor de Tipo de Custo */}
            <div className={styles.tabNav}>
              <button 
                type="button"
                className={`${styles.tabBtn} ${activeTab === 'fixed' ? styles.activeTab : ''}`}
                onClick={() => { setActiveTab('fixed'); resetForm(); }}
              >
                Custos Fixos (Overhead Mensal)
              </button>
              <button 
                type="button"
                className={`${styles.tabBtn} ${activeTab === 'variable' ? styles.activeTab : ''}`}
                onClick={() => { setActiveTab('variable'); resetForm(); }}
              >
                Custos & Despesas Variáveis (Unitário)
              </button>
            </div>

            {/* Formulário de Cadastro/Edição */}
            <form className={styles.formBox} onSubmit={handleSave}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {editingId ? 'Editar Item Selecionado' : `Adicionar Novo Custo ${activeTab === 'fixed' ? 'Fixo' : 'Variável'}`}
              </div>

              {error && <div style={{ color: '#e57373', fontSize: '0.78rem' }}>{error}</div>}

              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nome do Item / Serviço</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ex: Firebase Blaze / Taxa de Download"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input} 
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Categoria / Centro</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Infraestrutura Cloud"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={styles.input} 
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    {activeTab === 'fixed' ? 'Valor Mensal (R$)' : 'Valor Unit. (R$)'}
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={styles.input} 
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                {editingId && (
                  <button type="button" className={styles.btnCancel} onClick={resetForm}>
                    Cancelar Edição
                  </button>
                )}
                <button type="submit" className={styles.btnSave} disabled={isSaving}>
                  {editingId ? (
                    <>
                      <SaveOutlinedIcon style={{ fontSize: '1rem' }} />
                      <span>{isSaving ? 'Salvando...' : 'Atualizar no Firestore'}</span>
                    </>
                  ) : (
                    <>
                      <AddCircleOutlineOutlinedIcon style={{ fontSize: '1rem' }} />
                      <span>{isSaving ? 'Salvando...' : 'Salvar no Firestore'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Lista dos Custos Atuais */}
            <div className={styles.costList}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Itens Ativos no Cálculo da DRE ({currentList.length})
              </div>

              {currentList.map((item) => (
                <div key={item.id} className={styles.costRow}>
                  <div className={styles.costInfo}>
                    <span className={styles.costName}>{item.name}</span>
                    <span className={styles.costCategory}>{item.category} • {item.period || item.basis || 'Padrão'}</span>
                  </div>

                  <div className={styles.costValueArea}>
                    <span className={styles.costAmount}>- R$ {Number(item.amount).toFixed(2)}</span>
                    <div className={styles.actionBtns}>
                      <button 
                        className={styles.btnMini} 
                        onClick={() => handleStartEdit(item)}
                        type="button"
                      >
                        <EditOutlinedIcon style={{ fontSize: '0.85rem' }} />
                        <span>Editar</span>
                      </button>
                      <button 
                        className={`${styles.btnMini} ${styles.btnDelete}`} 
                        onClick={() => handleDelete(item.id)}
                        type="button"
                      >
                        <DeleteOutlineOutlinedIcon style={{ fontSize: '0.85rem' }} />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CostManagerModal;
