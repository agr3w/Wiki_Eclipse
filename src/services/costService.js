import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  getDocs 
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { COST_STRUCTURE } from '../data/costManagementData';

const getCostsCollection = () => {
  return db ? collection(db, 'operational_costs') : null;
};

// Semente inicial caso o banco de dados esteja vazio
export const seedInitialCostsIfEmpty = async () => {
  const costsCol = getCostsCollection();
  if (!costsCol) return;
  try {
    const snap = await getDocs(costsCol);
    if (snap.empty) {
      // Cadastra custos fixos iniciais
      for (const fix of COST_STRUCTURE.fixedCosts) {
        await addDoc(costsCol, {
          name: fix.name,
          category: fix.category,
          type: 'fixed',
          amount: Number(fix.monthlyAmount),
          period: fix.period || 'Mensal',
          createdAt: serverTimestamp()
        });
      }
      // Cadastra custos variáveis iniciais
      for (const variable of COST_STRUCTURE.variableCosts) {
        await addDoc(costsCol, {
          name: variable.name,
          category: variable.category,
          type: 'variable',
          amount: Number(variable.unitCost),
          basis: variable.basis || 'Por unidade vendida',
          createdAt: serverTimestamp()
        });
      }
    }
  } catch (err) {
    console.debug('Seeding de custos local:', err.message);
  }
};

// Escuta em tempo real as alterações da coleção
export const subscribeCosts = (callback) => {
  const costsCol = getCostsCollection();
  if (!costsCol) {
    callback([
      ...COST_STRUCTURE.fixedCosts.map(c => ({ ...c, type: 'fixed', amount: c.monthlyAmount })),
      ...COST_STRUCTURE.variableCosts.map(c => ({ ...c, type: 'variable', amount: c.unitCost }))
    ]);
    return () => {};
  }

  return onSnapshot(costsCol, (snapshot) => {
    if (snapshot.empty) {
      // Fallback para os dados do arquivo se Firestore vazio/sem dados cadastrados
      callback([
        ...COST_STRUCTURE.fixedCosts.map(c => ({ ...c, type: 'fixed', amount: c.monthlyAmount })),
        ...COST_STRUCTURE.variableCosts.map(c => ({ ...c, type: 'variable', amount: c.unitCost }))
      ]);
      return;
    }
    const costs = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    callback(costs);
  }, (error) => {
    console.warn('Erro ao escutar coleção de custos, usando fallback:', error);
    callback([
      ...COST_STRUCTURE.fixedCosts.map(c => ({ ...c, type: 'fixed', amount: c.monthlyAmount })),
      ...COST_STRUCTURE.variableCosts.map(c => ({ ...c, type: 'variable', amount: c.unitCost }))
    ]);
  });
};

export const addCostItem = async (costData) => {
  const costsCol = getCostsCollection();
  if (!costsCol) throw new Error('Banco de dados não configurado.');
  return await addDoc(costsCol, {
    ...costData,
    amount: parseFloat(costData.amount),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateCostItem = async (id, costData) => {
  if (!db) throw new Error('Banco de dados não configurado.');
  const ref = doc(db, 'operational_costs', id);
  return await updateDoc(ref, {
    ...costData,
    amount: parseFloat(costData.amount),
    updatedAt: serverTimestamp()
  });
};

export const deleteCostItem = async (id) => {
  if (!db) throw new Error('Banco de dados não configurado.');
  const ref = doc(db, 'operational_costs', id);
  return await deleteDoc(ref);
};
