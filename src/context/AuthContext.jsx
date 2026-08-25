import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  updatePassword
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../services/firebaseConfig';

const AuthContext = createContext({});

const STORAGE_USERS_KEY = 'eclipse_mock_users';
const STORAGE_SESSION_KEY = 'eclipse_mock_session';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalState, setAuthModalState] = useState({ isOpen: false, mode: 'login' });

  useEffect(() => {
    // 1. Modo Firebase Real (quando configurado)
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          try {
            if (db) {
              const userDocRef = doc(db, 'users', currentUser.uid);
              const userDoc = await getDoc(userDocRef);
              
              if (userDoc.exists()) {
                setUser({ ...currentUser, ...userDoc.data() });
              } else {
                setUser(currentUser);
              }
            } else {
              setUser(currentUser);
            }
          } catch {
            setUser(currentUser);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } 
    
    // 2. Modo Desenvolvimento Local / Mock
    try {
      const savedSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (savedSession) {
        setUser(JSON.parse(savedSession));
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const register = async (displayName, email, password) => {
    if (isFirebaseConfigured && auth) {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName });

      const initialData = {
        uid: res.user.uid,
        displayName,
        email,
        createdAt: new Date().toLocaleDateString('pt-BR'),
        hasLicense: false
      };

      try {
        if (db) {
          await setDoc(doc(db, 'users', res.user.uid), {
            ...initialData,
            createdAt: serverTimestamp()
          });
        }
      } catch (err) {
        console.warn('Firestore offline ou simulado:', err);
      }

      setUser({ ...res.user, ...initialData });
      return res.user;
    }

    // Fallback: Persistência Local
    const rawUsers = localStorage.getItem(STORAGE_USERS_KEY);
    const users = rawUsers ? JSON.parse(rawUsers) : [];

    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      const err = new Error('Este e-mail já está cadastrado.');
      err.code = 'auth/email-already-in-use';
      throw err;
    }

    const newUser = {
      uid: `usr_${Date.now()}`,
      displayName,
      email,
      password,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      hasLicense: false
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    
    const sessionData = {
      uid: newUser.uid,
      displayName: newUser.displayName,
      email: newUser.email,
      createdAt: newUser.createdAt,
      hasLicense: false
    };
    
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData));
    setUser(sessionData);
    return sessionData;
  };

  const login = async (email, password) => {
    if (isFirebaseConfigured && auth) {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return res.user;
    }

    // Fallback: Login Local
    const rawUsers = localStorage.getItem(STORAGE_USERS_KEY);
    const users = rawUsers ? JSON.parse(rawUsers) : [];

    const foundUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      const err = new Error('E-mail ou senha incorretos.');
      err.code = 'auth/invalid-credential';
      throw err;
    }

    const sessionData = {
      uid: foundUser.uid,
      displayName: foundUser.displayName,
      email: foundUser.email,
      createdAt: foundUser.createdAt || new Date().toLocaleDateString('pt-BR'),
      hasLicense: foundUser.hasLicense || false
    };

    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData));
    setUser(sessionData);
    return sessionData;
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    localStorage.removeItem(STORAGE_SESSION_KEY);
    setUser(null);
  };

  const updateUserDisplayName = async (newDisplayName) => {
    if (isFirebaseConfigured && auth?.currentUser) {
      await updateProfile(auth.currentUser, { displayName: newDisplayName });
      try {
        if (db) {
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            displayName: newDisplayName
          });
        }
      } catch (err) {
        console.warn('Firestore update:', err);
      }
    }

    // Atualização local / fallback
    const rawUsers = localStorage.getItem(STORAGE_USERS_KEY);
    if (rawUsers && user) {
      const users = JSON.parse(rawUsers);
      const updatedUsers = users.map(u => u.uid === user.uid ? { ...u, displayName: newDisplayName } : u);
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
    }
    const savedSession = localStorage.getItem(STORAGE_SESSION_KEY);
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify({ ...parsed, displayName: newDisplayName }));
    }

    setUser(prev => ({ ...prev, displayName: newDisplayName }));
  };

  const changeUserPassword = async (newPassword) => {
    if (isFirebaseConfigured && auth?.currentUser) {
      await updatePassword(auth.currentUser, newPassword);
      return;
    }

    // Fallback: Atualizar senha no mock
    const rawUsers = localStorage.getItem(STORAGE_USERS_KEY);
    if (rawUsers && user) {
      const users = JSON.parse(rawUsers);
      const updatedUsers = users.map(u => u.uid === user.uid ? { ...u, password: newPassword } : u);
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
    }
  };

  const claimGameLicense = async () => {
    if (!user) return false;
    
    if (isFirebaseConfigured && auth?.currentUser && db) {
      try {
        await addDoc(collection(db, 'purchases'), {
          userId: user.uid,
          gameId: 'eclipse-ecos-do-abismo',
          title: 'Eclipse: Ecos do Abismo',
          price: 'R$ 0,00',
          status: 'completed',
          acquiredAt: serverTimestamp()
        });
        await updateDoc(doc(db, 'users', user.uid), { hasLicense: true });
      } catch (err) {
        console.warn('Simulando licença localmente:', err);
      }
    }

    // Atualização mock/local
    const rawUsers = localStorage.getItem(STORAGE_USERS_KEY);
    if (rawUsers) {
      const users = JSON.parse(rawUsers);
      const updatedUsers = users.map(u => u.uid === user.uid ? { ...u, hasLicense: true } : u);
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
    }
    const savedSession = localStorage.getItem(STORAGE_SESSION_KEY);
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify({ ...parsed, hasLicense: true }));
    }

    setUser(prev => ({ ...prev, hasLicense: true }));
    return true;
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalState({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      register,
      login,
      logout,
      updateUserDisplayName,
      changeUserPassword,
      claimGameLicense,
      authModalState,
      openAuthModal,
      closeAuthModal
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
