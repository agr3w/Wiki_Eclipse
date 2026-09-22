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
import { generateNfeAccessKey, generateNfeXmlString } from '../services/fiscalService';

const AuthContext = createContext({});

const checkIsAdminEmail = (email) => {
  if (!email) return false;
  const lower = email.toLowerCase();
  return lower === 'teste@gmail.com' || lower === 'admin@eclipse.com' || lower.includes('admin');
};

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
                const data = userDoc.data();
                const isAdmin = Boolean(
                  data?.role === 'admin' || 
                  data?.isAdmin === true || 
                  checkIsAdminEmail(currentUser.email)
                );

                setUser({
                  ...currentUser,
                  ...data,
                  isAdmin,
                  role: data?.role || (isAdmin ? 'admin' : 'user')
                });
              } else {
                // Se o documento no Firestore ainda não existe, cria-o automaticamente
                const isAdmin = checkIsAdminEmail(currentUser.email);
                const initialData = {
                  uid: currentUser.uid,
                  displayName: currentUser.displayName || currentUser.email?.split('@')[0] || '',
                  email: currentUser.email || '',
                  createdAt: serverTimestamp(),
                  hasLicense: false,
                  role: isAdmin ? 'admin' : 'user',
                  isAdmin
                };
                await setDoc(userDocRef, initialData, { merge: true });
                setUser({ ...currentUser, ...initialData });
              }
            } else {
              const isAdmin = checkIsAdminEmail(currentUser.email);
              setUser({ ...currentUser, isAdmin, role: isAdmin ? 'admin' : 'user' });
            }
          } catch (err) {
            console.warn('Erro ao carregar/sincronizar perfil do Firestore:', err);
            const isAdmin = checkIsAdminEmail(currentUser.email);
            setUser({ ...currentUser, isAdmin, role: isAdmin ? 'admin' : 'user' });
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

    const isAdmin = checkIsAdminEmail(email);
    const initialData = {
      uid: res.user.uid,
      displayName,
      email,
      createdAt: serverTimestamp(),
      hasLicense: false,
      role: isAdmin ? 'admin' : 'user',
      isAdmin
    };

    if (db) {
      await setDoc(doc(db, 'users', res.user.uid), initialData, { merge: true });
    }

    setUser({ ...res.user, displayName, hasLicense: false, role: initialData.role, isAdmin });
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
    
    const orderProtocol = `ECL-${Date.now().toString().slice(-6)}`;
    const grossAmount = checkoutData.grossAmount || 10.00;
    const gatewayFee = checkoutData.gatewayFee || 0.95;
    const netAmount = checkoutData.netAmount || (grossAmount - gatewayFee);

    const nfeNumber = Math.floor(100 + Math.random() * 900).toString();
    const accessKey = generateNfeAccessKey('42', '26', '09', '48120934000182', '55', '001', nfeNumber);
    const sefazProtocol = `1422600${Math.floor(10000000 + Math.random() * 90000000)}`;

    const invoicePayload = {
      nfeNumber,
      accessKey,
      sefazProtocol,
      grossAmount,
      grossValue: grossAmount,
      gatewayFee,
      netAmount,
      netValue: netAmount,
      customerName: checkoutData.billingName || user.displayName || user.email?.split('@')[0],
      customerEmail: user.email,
      paymentMethod: checkoutData.paymentMethod || 'PIX Instantâneo'
    };

    const xmlString = generateNfeXmlString(invoicePayload);

    const purchaseRecord = {
      orderProtocol,
      userId: user.uid,
      userEmail: user.email,
      gameId: 'eclipse-ecos-do-abismo',
      gameTitle: 'Eclipse: Ecos do Abismo',
      price: `R$ ${grossAmount.toFixed(2)}`,
      status: 'completed',
      acquiredAt: new Date().toISOString(),
      invoiceRecipientEmail: user.email,
      gatewayProvider: checkoutData.gatewayProvider || 'PagBank Sandbox Enterprise',
      ...invoicePayload,
      xmlString // XML 4.00 persistido como texto no Firestore
    };

    if (db) {
      // 1. Gravar registro permanente da transação na coleção 'purchases'
      await addDoc(collection(db, 'purchases'), {
        ...purchaseRecord,
        acquiredAtServer: serverTimestamp()
      });

      // 2. Atualizar ou criar status hasLicense: true no documento 'users/{uid}' com merge: true
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || checkoutData.billingName || '',
        hasLicense: true
      }, { merge: true });
    }

    setUser(prev => ({ ...prev, hasLicense: true }));
    return purchaseRecord;
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalState({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModalState(prev => ({ ...prev, isOpen: false }));
  };

  const isAdmin = Boolean(
    user?.isAdmin || 
    user?.role === 'admin' || 
    user?.email?.toLowerCase() === 'teste@gmail.com'
  );

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
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
