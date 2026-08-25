import React from 'react';
import { motion } from 'framer-motion';
import styles from './PatchNoteModal.module.css';

export const PatchNoteModal = ({ note, onClose }) => {
  if (!note) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <motion.div 
        className={styles.modal} 
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className={styles.modalHeader}>
          <div>
            <div>
              <span className={styles.versionBadge}>{note.version}</span>
              <span className={styles.date}>{note.date} • {note.type}</span>
            </div>
            <h2 className={styles.title}>{note.title}</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <p className={styles.summary}>{note.summary}</p>

        <div className={styles.changesTitle}>Registro Detalhado de Alterações</div>
        <ul className={styles.changeList}>
          {note.changes.map((change, idx) => (
            <li key={idx} className={styles.changeItem}>
              <span className={styles.bullet}>•</span>
              <span>{change}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default PatchNoteModal;
