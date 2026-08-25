import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { WikiHub } from '../../sections/wiki/WikiHub';
import { WikiDetail } from '../../sections/wiki/WikiDetail';
import styles from './Wiki.module.css';

export const Wiki = () => {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tabQuery = searchParams.get('tab');
  const activeCategoryId = categoryId || tabQuery;

  return (
    <div className={styles.pageWrapper}>
      {!activeCategoryId ? (
        <WikiHub onSelectCategory={(id) => navigate(`/wiki/${id}`)} />
      ) : (
        <WikiDetail 
          initialCategory={activeCategoryId} 
          onBackToHub={() => navigate('/wiki')} 
          onCategoryChange={(newCatId) => navigate(`/wiki/${newCatId}`, { replace: true })}
        />
      )}
    </div>
  );
};

export default Wiki;
