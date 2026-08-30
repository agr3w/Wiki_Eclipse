import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  updatePassword
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../services/firebaseConfig';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalState, setAuthModalState] = useState({ isOpen: false, mode: 'login' });

  useEffect(() => {
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
                // Se o documento no Firestore ainda não existe, cria-o automaticamente
                const initialData = {
                  uid: currentUser.uid,
                  displayName: currentUser.displayName || currentUser.email?.split('@')[0] || '',
                  email: currentUser.email || '',
                  createdAt: serverTimestamp(),
                  hasLicense: false
                };
                await setDoc(userDocRef, initialData, { merge: true });
                setUser({ ...currentUser, ...initialData });
              }
            } else {
              setUser(currentUser);
            }
          } catch (err) {
            console.warn('Erro ao carregar/sincronizar perfil do Firestore:', err);
            setUser(currentUser);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } 

    setLoading(false);
  }, []);

  const register = async (displayName, email, password) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase não está configurado.');
    }

    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName });

    const initialData = {
      uid: res.user.uid,
      displayName,
      email,
      createdAt: serverTimestamp(),
      hasLicense: false
    };

    if (db) {
      await setDoc(doc(db, 'users', res.user.uid), initialData, { merge: true });
    }

    setUser({ ...res.user, displayName, hasLicense: false });
    return res.user;
  };

  const login = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase não está configurado.');
    }
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    setUser(null);
  };

  const updateUserDisplayName = async (newDisplayName) => {
    if (!auth?.currentUser) return;
    await updateProfile(auth.currentUser, { displayName: newDisplayName });
    
    if (db) {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        displayName: newDisplayName
      }, { merge: true });
    }

    setUser(prev => ({ ...prev, displayName: newDisplayName }));
  };

  const changeUserPassword = async (newPassword) => {
    if (!auth?.currentUser) return;
    await updatePassword(auth.currentUser, newPassword);
  };

  const claimGameLicense = async (checkoutData = {}) => {
    if (!user) return null;

    const orderId = `ECL-${Date.now().toString().slice(-6)}`;
    const orderRecord = {
      order_id: orderId,
      user_id: user.uid,
      gameId: 'eclipse-ecos-do-abismo',
      status: 'completed',
      amount: 0,
      purchasedAt: serverTimestamp(),
      paymentMethod: checkoutData.paymentMethod || 'pix',
      billingName: checkoutData.billingName || user.displayName || user.email?.split('@')[0],
      userEmail: user.email,
      gameTitle: 'Eclipse: Ecos do Abismo'
    };

    if (db) {
      await setDoc(doc(db, 'orders', orderId), orderRecord, { merge: true });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || checkoutData.billingName || '',
        hasLicense: true,
        updatedAt: serverTimestamp()
      }, { merge: true });

      await addDoc(collection(db, 'purchases'), {
        ...orderRecord,
        acquiredAt: serverTimestamp(),
        legacy: true
      }).catch(() => undefined);
    }

    setUser(prev => ({ ...prev, hasLicense: true }));
    return {
      orderProtocol: orderId,
      userId: user.uid,
      userEmail: user.email,
      gameId: 'eclipse-ecos-do-abismo',
      gameTitle: 'Eclipse: Ecos do Abismo',
      price: 'R$ 0,00',
      paymentMethod: checkoutData.paymentMethod || 'pix',
      billingName: checkoutData.billingName || user.displayName || user.email?.split('@')[0],
      invoiceRecipientEmail: user.email,
      status: 'completed',
      acquiredAt: new Date().toISOString()
    };
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
