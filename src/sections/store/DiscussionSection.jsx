import React, { useState } from 'react';
import styles from './DiscussionSection.module.css';

export const DiscussionSection = ({ initialDiscussions }) => {
  const [discussions, setDiscussions] = useState(initialDiscussions || []);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  // Estado para controlar qual discussão está sendo respondida
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Publicar novo tópico principal
  const handlePublishTopic = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newEntry = {
      id: `d-${Date.now()}`,
      author: 'Jogador_Convidado',
      avatar: 'J',
      date: 'Agora mesmo',
      title,
      message,
      upvotes: 1,
      userUpvoted: true,
      reported: false,
      replies: []
    };

    setDiscussions([newEntry, ...discussions]);
    setTitle('');
    setMessage('');
  };

  // Curtir / Upvote estilo Reddit
  const handleToggleUpvote = (discussionId) => {
    setDiscussions(prev =>
      prev.map(item => {
        if (item.id === discussionId) {
          const alreadyUpvoted = item.userUpvoted;
          return {
            ...item,
            userUpvoted: !alreadyUpvoted,
            upvotes: alreadyUpvoted ? item.upvotes - 1 : item.upvotes + 1
          };
        }
        return item;
      })
    );
  };

  // Enviar Resposta para um tópico específico
  const handleSendReply = (discussionId) => {
    if (!replyMessage.trim()) return;

    const newReply = {
      id: `r-${Date.now()}`,
      author: 'Jogador_Convidado',
      avatar: 'J',
      date: 'Agora mesmo',
      message: replyMessage
    };

    setDiscussions(prev =>
      prev.map(item => {
        if (item.id === discussionId) {
          return {
            ...item,
            replies: [...(item.replies || []), newReply]
          };
        }
        return item;
      })
    );

    setReplyMessage('');
    setReplyingToId(null);
  };

  // Denunciar Tópico
  const handleReport = (discussionId) => {
    setDiscussions(prev =>
      prev.map(item => {
        if (item.id === discussionId) {
          return { ...item, reported: true };
        }
        return item;
      })
    );
  };

  return (
    <div className={styles.discussionWrapper}>
      {/* Formulário para Iniciar Nova Discussão */}
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

      {/* Lista de Discussões com Interações */}
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

              {/* Barra de Ações: Curtir, Comentar, Denunciar */}
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

              {/* Caixa de Resposta Inline */}
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

              {/* Lista de Respostas Aninhadas */}
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
