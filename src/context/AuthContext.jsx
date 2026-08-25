import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../services/firebaseConfig';

const AuthContext = createContext({});

const STORAGE_USERS_KEY = 'eclipse_mock_users';
const STORAGE_SESSION_KEY = 'eclipse_mock_session';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalState, setAuthModalState] = useState({ isOpen: false, mode: 'login' });

  useEffect(() => {
    // 1. Modo Firebase Real (quando chaves .env estiverem configuradas)
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
    
    // 2. Modo Desenvolvimento Local / Mock (para testes imediatos sem travas de API)
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
    // Se Firebase estiver configurado com credenciais reais
    if (isFirebaseConfigured && auth) {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName });

      try {
        if (db) {
          await setDoc(doc(db, 'users', res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            createdAt: serverTimestamp(),
            hasLicense: false
          });
        }
      } catch (err) {
        console.warn('Firestore offline ou regras pendentes:', err);
      }

      setUser({ ...res.user, displayName });
      return res.user;
    }

    // Fallback: Persistência Local para Validação Imediata
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
      createdAt: new Date().toISOString(),
      hasLicense: false
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    
    const sessionData = {
      uid: newUser.uid,
      displayName: newUser.displayName,
      email: newUser.email,
      hasLicense: false
    };
    
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData));
    setUser(sessionData);
    return sessionData;
  };

  const login = async (email, password) => {
    // Se Firebase estiver configurado com credenciais reais
    if (isFirebaseConfigured && auth) {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return res.user;
    }

    // Fallback: Login com persistência local
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
      isFirebaseLive: isFirebaseConfigured,
      register,
      login,
      logout,
      authModalState,
      openAuthModal,
      closeAuthModal
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
