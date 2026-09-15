import { doc, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const ANALYTICS_DOC_REF = db ? doc(db, 'telemetry', 'traffic') : null;

export const trackPageView = async (pageName) => {
  if (!db || !ANALYTICS_DOC_REF) return;

  let targetField = 'viewsOther';
  if (pageName === '/') targetField = 'viewsHome';
  else if (pageName.startsWith('/wiki')) targetField = 'viewsWiki';
  else if (pageName.startsWith('/loja')) targetField = 'viewsStore';
  else if (pageName.startsWith('/biblioteca')) targetField = 'viewsLibrary';
  else if (pageName.startsWith('/perfil')) targetField = 'viewsProfile';
  else if (pageName.startsWith('/admin')) targetField = 'viewsAdmin';

  try {
    await setDoc(ANALYTICS_DOC_REF, {
      [targetField]: increment(1)
    }, { merge: true });
  } catch (err) {
    console.debug('Telemetria local:', pageName, err.message);
  }
};

export const trackDownloadMetric = async () => {
  if (!db || !ANALYTICS_DOC_REF) return;

  try {
    await setDoc(ANALYTICS_DOC_REF, {
      downloadsCount: increment(1)
    }, { merge: true });
  } catch (err) {
    console.debug('Métrica de download:', err.message);
  }
};
