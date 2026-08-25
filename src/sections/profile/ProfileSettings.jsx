import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './ProfileSettings.module.css';

export const ProfileSettings = () => {
  const { user, updateUserDisplayName, changeUserPassword } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [nameStatus, setNameStatus] = useState({ msg: '', type: '' });
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passStatus, setPassStatus] = useState({ msg: '', type: '' });
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setIsUpdatingName(true);
    setNameStatus({ msg: '', type: '' });

    try {
      await updateUserDisplayName(displayName);
      setNameStatus({ msg: 'Nome de usuário atualizado com sucesso!', type: 'success' });
    } catch {
      setNameStatus({ msg: 'Não foi possível atualizar o nome.', type: 'error' });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      return setPassStatus({ msg: 'A nova senha deve ter no mínimo 6 caracteres.', type: 'error' });
    }
    if (newPassword !== confirmPassword) {
      return setPassStatus({ msg: 'As senhas não coincidem.', type: 'error' });
    }

    setIsUpdatingPass(true);
    setPassStatus({ msg: '', type: '' });

    try {
      await changeUserPassword(newPassword);
      setPassStatus({ msg: 'Senha alterada com sucesso!', type: 'success' });
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPassStatus({ msg: 'Erro ao alterar senha. Reautenticação necessária.', type: 'error' });
    } finally {
      setIsUpdatingPass(false);
    }
  };

  return (
    <div className={styles.settingsWrapper}>
      {/* Dados Básicos */}
      <div className={styles.block}>
        <div className={styles.blockHeader}>
          <h3 className={styles.blockTitle}>Dados da Conta</h3>
        </div>
        <form className={styles.form} onSubmit={handleUpdateName}>
          {nameStatus.msg && (
            <div className={`${styles.feedbackMsg} ${nameStatus.type === 'success' ? styles.feedbackSuccess : styles.feedbackError}`}>
              {nameStatus.msg}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label}>E-mail Registrado</label>
            <input 
              type="text" 
              disabled 
              value={user?.email || ''} 
              className={`${styles.input} ${styles.inputDisabled}`} 
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Nome de Usuário</label>
            <input 
              type="text" 
              required
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              className={styles.input} 
            />
          </div>

          <button type="submit" className={styles.btnSubmit} disabled={isUpdatingName}>
            {isUpdatingName ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>

      {/* Alteração de Senha */}
      <div className={styles.block}>
        <div className={styles.blockHeader}>
          <h3 className={styles.blockTitle}>Segurança & Senha</h3>
        </div>
        <form className={styles.form} onSubmit={handleChangePassword}>
          {passStatus.msg && (
            <div className={`${styles.feedbackMsg} ${passStatus.type === 'success' ? styles.feedbackSuccess : styles.feedbackError}`}>
              {passStatus.msg}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label}>Nova Senha</label>
            <input 
              type="password" 
              required
              placeholder="Mínimo 6 caracteres"
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              className={styles.input} 
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirmar Nova Senha</label>
            <input 
              type="password" 
              required
              placeholder="Repita a nova senha"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className={styles.input} 
            />
          </div>

          <button type="submit" className={styles.btnSubmit} disabled={isUpdatingPass}>
            {isUpdatingPass ? 'Atualizando...' : 'Alterar Senha'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
