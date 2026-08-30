import React, { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db, isFirebaseConfigured } from '../../services/firebaseConfig';
import styles from './DiscussionSection.module.css';

const formatFirestoreDate = (value) => {
  if (!value || typeof value === 'object' && value._methodName === 'serverTimestamp') {
    return 'Agora mesmo';
  }

  if (typeof value?.toDate === 'function') {
    return value.toDate().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  if (value instanceof Date) {
    return value.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  if (typeof value === 'string') {
    return value;
  }

  return 'Agora mesmo';
};

const normalizeDiscussion = (item) => {
  const replies = Array.isArray(item.replies) ? item.replies.map((reply) => ({
    id: reply.id || reply.comment_id || `r-${Date.now()}-${Math.random()}`,
    author: reply.authorName || reply.author || 'Jogador',
    avatar: (reply.authorName || reply.author || 'J').charAt(0).toUpperCase(),
    date: formatFirestoreDate(reply.createdAt),
    message: reply.content || reply.message || ''
  })) : [];

  return {
    id: item.comment_id || item.id || `d-${Date.now()}-${Math.random()}`,
    author: item.authorName || item.author || 'Jogador_Convidado',
    avatar: (item.authorName || item.author || 'J').charAt(0).toUpperCase(),
    date: formatFirestoreDate(item.createdAt),
    title: item.title || 'Discussão',
    message: item.content || item.message || '',
    upvotes: Number(item.rating ?? item.upvotes ?? 0),
    userUpvoted: Boolean(item.userUpvoted),
    reported: Boolean(item.reported),
    replies
  };
};

export const DiscussionSection = ({ initialDiscussions }) => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState(Array.isArray(initialDiscussions) ? initialDiscussions : []);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setDiscussions(Array.isArray(initialDiscussions) ? initialDiscussions : []);
      return;
    }

    const loadDiscussions = async () => {
      try {
        const q = query(collection(db, 'discussions'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const loadedDiscussions = snapshot.docs.map((docItem) => normalizeDiscussion({
            ...docItem.data(),
            id: docItem.id,
            comment_id: docItem.data().comment_id || docItem.id
          }));
          setDiscussions(loadedDiscussions);
          return;
        }
      } catch (error) {
        console.warn('Erro ao carregar discussões do Firestore:', error);
      }

      setDiscussions(Array.isArray(initialDiscussions) ? initialDiscussions : []);
    };

    loadDiscussions();
  }, [initialDiscussions]);

  const handlePublishTopic = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const discussionId = `d-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    const newEntry = {
      comment_id: discussionId,
      user_id: user?.uid || 'guest',
      authorName: user?.displayName || 'Jogador_Convidado',
      title,
      content: message,
      rating: 1,
      userUpvoted: true,
      reported: false,
      createdAt: serverTimestamp(),
      replies: []
    };

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'discussions', discussionId), newEntry);
    }

    setDiscussions((prev) => [normalizeDiscussion(newEntry), ...prev]);
    setTitle('');
    setMessage('');
  };

  const handleToggleUpvote = async (discussionId) => {
    const discussion = discussions.find((item) => item.id === discussionId);
    if (!discussion) return;

    const nextValue = !discussion.userUpvoted;
    const nextRating = Math.max(0, discussion.upvotes + (nextValue ? 1 : -1));

    setDiscussions((prev) => prev.map((item) => item.id === discussionId ? { ...item, userUpvoted: nextValue, upvotes: nextRating } : item));

    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'discussions', discussionId);
        const docSnapshot = await getDoc(docRef);

        if (!docSnapshot.exists()) {
          await setDoc(docRef, {
            comment_id: discussionId,
            user_id: user?.uid || 'guest',
            authorName: discussion.author || 'Jogador_Convidado',
            title: discussion.title || 'Discussão',
            content: discussion.message || '',
            rating: nextRating,
            userUpvoted: nextValue,
            reported: Boolean(discussion.reported),
            createdAt: serverTimestamp(),
            replies: discussion.replies || []
          }, { merge: true });
          return;
        }

        await updateDoc(docRef, {
          rating: nextRating,
          userUpvoted: nextValue
        });
      } catch (error) {
        console.warn('Erro ao atualizar upvote no Firestore:', error);
      }
    }
  };

  const handleSendReply = async (discussionId) => {
    if (!replyMessage.trim()) return;

    const newReply = {
      id: `r-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      comment_id: `r-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      user_id: user?.uid || 'guest',
      authorName: user?.displayName || 'Jogador_Convidado',
      content: replyMessage,
      createdAt: serverTimestamp(),
      rating: 0
    };

    setDiscussions((prev) => prev.map((item) => {
      if (item.id !== discussionId) return item;
      return {
        ...item,
        replies: [...(item.replies || []), {
          id: newReply.id,
          author: newReply.authorName,
          avatar: newReply.authorName.charAt(0).toUpperCase(),
          date: 'Agora mesmo',
          message: newReply.content
        }]
      };
    }));

    if (isFirebaseConfigured && db) {
      try {
        const discussionRef = doc(db, 'discussions', discussionId);
        const discussionSnapshot = await getDoc(discussionRef);

        if (!discussionSnapshot.exists()) {
          await setDoc(discussionRef, {
            comment_id: discussionId,
            user_id: user?.uid || 'guest',
            authorName: 'Jogador_Convidado',
            title: 'Discussão',
            content: '',
            rating: 0,
            userUpvoted: false,
            reported: false,
            createdAt: serverTimestamp(),
            replies: [newReply]
          }, { merge: true });
        } else {
          const currentReplies = discussionSnapshot.data()?.replies || [];
          await updateDoc(discussionRef, {
            replies: [...currentReplies, newReply]
          });
        }
      } catch (error) {
        console.warn('Erro ao persistir resposta no Firestore:', error);
      }
    }

    setReplyMessage('');
    setReplyingToId(null);
  };

  const handleReport = async (discussionId) => {
    setDiscussions((prev) => prev.map((item) => item.id === discussionId ? { ...item, reported: true } : item));

    if (isFirebaseConfigured && db) {
      try {
        const discussionRef = doc(db, 'discussions', discussionId);
        const discussionSnapshot = await getDoc(discussionRef);

        if (!discussionSnapshot.exists()) {
          await setDoc(discussionRef, {
            comment_id: discussionId,
            user_id: user?.uid || 'guest',
            authorName: 'Jogador_Convidado',
            title: 'Discussão',
            content: '',
            rating: 0,
            userUpvoted: false,
            reported: true,
            createdAt: serverTimestamp(),
            replies: []
          }, { merge: true });
        } else {
          await updateDoc(discussionRef, { reported: true });
        }
      } catch (error) {
        console.warn('Erro ao registrar denúncia no Firestore:', error);
      }
    }
  };

  return (
    <div className={styles.discussionWrapper}>
      <form className={styles.formBox} onSubmit={handlePublishTopic}>
        <input
          type="text"
          placeholder="Título do tópico de discussão..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
        <textarea
          placeholder="Compartilhe uma dica, feedback de gameplay ou dúvida com a comunidade..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.textarea}
        />
        <button type="submit" className={styles.btnSubmit}>
          Publicar Tópico
        </button>
      </form>

      <div className={styles.commentList}>
        {discussions.map((item) => (
          <div key={item.id} className={styles.commentItem}>
            <div className={styles.avatar}>{item.avatar}</div>

            <div className={styles.commentBody}>
              <div className={styles.commentHeader}>
                <span className={styles.author}>{item.author}</span>
                <span className={styles.time}>{item.date}</span>
              </div>

              <div className={styles.topicTitle}>{item.title}</div>
              <p className={styles.message}>{item.message}</p>

              <div className={styles.actionsBar}>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${item.userUpvoted ? styles.upvoteActive : ''}`}
                  onClick={() => handleToggleUpvote(item.id)}
                  title={item.userUpvoted ? 'Remover Upvote' : 'Dar Upvote'}
                >
                  <span className={styles.upvoteIcon}>▲</span>
                  <span>{item.upvotes}</span>
                </button>

                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => {
                    if (replyingToId === item.id) {
                      setReplyingToId(null);
                    } else {
                      setReplyingToId(item.id);
                      setReplyMessage('');
                    }
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>
                    {item.replies && item.replies.length > 0
                      ? `${item.replies.length} ${item.replies.length === 1 ? 'Resposta' : 'Respostas'}`
                      : 'Responder'}
                  </span>
                </button>

                <button
                  type="button"
                  className={`${styles.actionBtn} ${item.reported ? styles.reportedActive : styles.reportBtn}`}
                  onClick={() => !item.reported && handleReport(item.id)}
                  disabled={item.reported}
                  title={item.reported ? 'Denúncia enviada' : 'Denunciar publicação'}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                    <line x1="4" y1="22" x2="4" y2="15"></line>
                  </svg>
                  <span>{item.reported ? 'Denunciado' : 'Denunciar'}</span>
                </button>
              </div>

              {replyingToId === item.id && (
                <div className={styles.replyFormBox}>
                  <textarea
                    placeholder={`Escreva uma resposta para ${item.author}...`}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className={styles.replyTextarea}
                    autoFocus
                  />
                  <div className={styles.replyFormActions}>
                    <button
                      type="button"
                      className={styles.btnCancelReply}
                      onClick={() => {
                        setReplyingToId(null);
                        setReplyMessage('');
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className={styles.btnSendReply}
                      onClick={() => handleSendReply(item.id)}
                    >
                      Responder
                    </button>
                  </div>
                </div>
              )}

              {item.replies && item.replies.length > 0 && (
                <div className={styles.repliesTree}>
                  {item.replies.map((reply) => (
                    <div key={reply.id} className={styles.replyItem}>
                      <div className={styles.replyAvatar}>{reply.avatar}</div>
                      <div className={styles.replyContent}>
                        <div className={styles.replyHeader}>
                          <span className={styles.replyAuthor}>{reply.author}</span>
                          <span className={styles.replyTime}>{reply.date}</span>
                        </div>
                        <p className={styles.replyMessage}>{reply.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscussionSection;
