import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const clean = (val) => {
  if (!val) return '';
  return String(val)
    .trim()
    .replace(/^["']|["'],?$/g, '')
    .replace(/,$/, '')
    .trim();
};

const apiKey = clean(import.meta.env.VITE_FIREBASE_API_KEY);
const authDomain = clean(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
const projectId = clean(import.meta.env.VITE_FIREBASE_PROJECT_ID);
const storageBucket = clean(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
const messagingSenderId = clean(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID);
const appId = clean(import.meta.env.VITE_FIREBASE_APP_ID);

export const isFirebaseConfigured = Boolean(
  apiKey && 
  apiKey !== '' && 
  !apiKey.includes('Mock') && 
  !apiKey.includes('undefined')
);

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId
};

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn('Erro ao inicializar Firebase nativo:', error);
  }
}

export { auth, db };
