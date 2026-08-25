import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MediaGallery.module.css';

export const MediaGallery = ({ items }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const currentItem = items?.[activeIdx] || items?.[0];

  if (!currentItem) return null;

  return (
    <div className={styles.galleryWrapper}>
      <div className={styles.mainDisplay}>
        <AnimatePresence mode="wait">
          <motion.img
            key={currentItem.id}
            src={currentItem.url}
            alt={currentItem.title}
            className={styles.mainImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>
        <div className={styles.captionOverlay}>
          <strong>{currentItem.title}</strong> — {currentItem.caption}
        </div>
      </div>

      <div className={styles.thumbnailRow}>
        {items.map((item, idx) => (
          <button
            key={item.id}
            className={`${styles.thumbnailBtn} ${activeIdx === idx ? styles.activeThumbnail : ''}`}
            onClick={() => setActiveIdx(idx)}
          >
            <img src={item.url} alt={item.title} className={styles.thumbnailImg} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default MediaGallery;
