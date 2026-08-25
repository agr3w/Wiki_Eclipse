import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthModal.module.css';

export const AuthModal = () => {
  const { authModalState, closeAuthModal, login, register } = useAuth();
  const [mode, setMode] = useState(authModalState.mode || 'login');
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authModalState.isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!displayName.trim()) return setError('Informe seu nome de usuário.');
      if (password.length < 6) return setError('A senha deve ter no mínimo 6 caracteres.');
      if (password !== confirmPassword) return setError('As senhas não coincidem.');
    }

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(displayName, email, password);
      }
      closeAuthModal();
    } catch (err) {
      console.error('Auth error details:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está cadastrado.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('O provedor E-mail/Senha precisa ser ativado no Firebase Console (Authentication > Sign-in method).');
      } else if (err.code === 'auth/invalid-email') {
        setError('O endereço de e-mail informado é inválido.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter no mínimo 6 caracteres.');
      } else {
        setError(err.message || 'Ocorreu um erro na autenticação. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className={styles.backdrop} onClick={closeAuthModal}>
        <motion.div 
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <button className={styles.closeBtn} onClick={closeAuthModal}>✕</button>

          <div className={styles.header}>
            <span className={styles.brandBadge}>Autenticação do Abismo</span>
            <h2 className={styles.title}>
              {mode === 'login' ? 'Acessar Conta' : 'Criar Registro'}
            </h2>
          </div>

          <div className={styles.tabRow}>
            <button 
              type="button"
              className={`${styles.tabBtn} ${mode === 'login' ? styles.activeTab : ''}`}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Entrar
            </button>
            <button 
              type="button"
              className={`${styles.tabBtn} ${mode === 'register' ? styles.activeTab : ''}`}
              onClick={() => { setMode('register'); setError(''); }}
            >
              Cadastrar
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            {mode === 'register' && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Nome de Usuário</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Nyx_Sentinela"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={styles.input}
                />
              </div>
            )}

            <div className={styles.inputGroup}>
              <label className={styles.label}>E-mail</label>
              <input
                type="email"
                required
                placeholder="seu.email@dominio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Senha</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
            </div>

            {mode === 'register' && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Confirmar Senha</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.input}
                />
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting 
                ? 'Processando...' 
                : (mode === 'login' ? 'Entrar no Sistema' : 'Concluir Cadastro')}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
