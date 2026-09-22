import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  increment, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { GATEWAY_CONFIG, INVOICES_LEDGER } from '../data/adminFinancialData';

/**
 * Registra o acesso a uma página no Firestore de forma atômica
 */
export const recordPageView = async (pathname) => {
  if (!db) return;

  let pageKey = null;
  if (pathname === '/') pageKey = 'viewsHome';
  else if (pathname.startsWith('/wiki')) pageKey = 'viewsWiki';
  else if (pathname.startsWith('/loja')) pageKey = 'viewsStore';
  else if (pathname.startsWith('/biblioteca')) pageKey = 'viewsLibrary';
  else if (pathname.startsWith('/perfil')) pageKey = 'viewsProfile';
  else if (pathname.startsWith('/admin')) pageKey = 'viewsAdmin';

  if (!pageKey) pageKey = 'viewsOther';

  try {
    const trafficRef = doc(db, 'telemetry', 'traffic');
    await setDoc(trafficRef, {
      [pageKey]: increment(1)
    }, { merge: true });
  } catch (err) {
    console.warn('Erro ao registrar visualização de página:', err);
  }
};

/**
 * Registra a execução de um download real no Firestore
 */
export const recordDownload = async (user, platform) => {
  if (!db || !user) return;

  try {
    await addDoc(collection(db, 'downloads'), {
      userId: user.uid,
      userEmail: user.email,
      platform,
      downloadedAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('Erro ao registrar log de download no Firestore:', err);
  }
};

/**
 * Converte qualquer tipo de data do Firestore (Timestamp, string ISO ou Date) em objeto Date válido
 */
const parseFirestoreDate = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    const d = new Date(timestamp);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
};

/**
 * Busca todas as métricas consolidadas em tempo real do Cloud Firestore
 * Suporta filtro temporal por período de dias (de X até Y)
 */
export const fetchAdminMetrics = async (dateRange = null) => {
  // Valores padrão caso o banco esteja indisponível
  const defaultPageViews = { home: 0, store: 0, wiki: 0, library: 0, profile: 0, admin: 0, other: 0 };

  if (!db) {
    return {
      grossRevenue: 0,
      gatewayFeesTotal: 0,
      taxesTotal: 0,
      netRevenue: 0,
      totalOrders: 0,
      averageTicket: 0,
      totalDownloads: 0,
      downloadsWindows: 0,
      downloadsLinux: 0,
      totalUsers: 0,
      licensedUsers: 0,
      newUsersInPeriod: 0,
      conversionRate: '0.0%',
      pageViews: defaultPageViews,
      totalTraffic: 0,
      purchases: [],
      downloads: [],
      usersList: [],
      dailyTimeline: [],
      isRealData: false
    };
  }

  try {
    // 1. Buscar Acessos Reais de 'telemetry/traffic'
    const trafficDoc = await getDoc(doc(db, 'telemetry', 'traffic'));
    let pageViews = { ...defaultPageViews };
    let telemetryDownloads = 0;

    if (trafficDoc.exists()) {
      const tData = trafficDoc.data();
      pageViews = {
        home: tData.viewsHome || 0,
        store: tData.viewsStore || 0,
        wiki: tData.viewsWiki || 0,
        library: tData.viewsLibrary || 0,
        profile: tData.viewsProfile || 0,
        admin: tData.viewsAdmin || 0,
        other: tData.viewsOther || 0
      };
      telemetryDownloads = tData.downloadsCount || 0;
    }

    const totalTraffic = Object.values(pageViews).reduce((sum, val) => sum + val, 0);

    // 2. Buscar todas as transações reais da coleção 'purchases'
    const purchasesSnap = await getDocs(collection(db, 'purchases'));
    const allPurchases = [];
    purchasesSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const dateObj = parseFirestoreDate(data.acquiredAt) || new Date();
      const grossValue = typeof data.grossValue === 'number' ? data.grossValue : 10.00;
      const gatewayFee = typeof data.gatewayFee === 'number' ? data.gatewayFee : (grossValue * GATEWAY_CONFIG.percentageFee + GATEWAY_CONFIG.fixedFee);
      const taxWithheld = grossValue * GATEWAY_CONFIG.taxRate;
      const netValue = typeof data.netValue === 'number' ? data.netValue : (grossValue - gatewayFee - taxWithheld);

      allPurchases.push({
        id: data.orderProtocol || docSnap.id.slice(0, 8).toUpperCase(),
        dateObj,
        dateFormatted: dateObj.toLocaleString('pt-BR'),
        date: dateObj.toLocaleString('pt-BR'),
        customerName: data.billingName || data.customerName || data.userEmail?.split('@')[0] || 'Sentinela',
        customerEmail: data.userEmail || data.customerEmail || '—',
        paymentMethod: data.paymentMethod || 'PIX Instantâneo',
        grossValue,
        gatewayFee,
        taxWithheld,
        netValue,
        nfeStatus: 'Emitida',
        nfeNumber: data.nfeNumber ? `NF-e ${data.nfeNumber}` : `NFS-e ${data.orderProtocol || docSnap.id.slice(0, 6)}`,
        rawNfeNumber: data.nfeNumber || data.orderProtocol?.replace(/\D/g, '') || '142',
        accessKey: data.accessKey || '',
        sefazProtocol: data.sefazProtocol || '',
        xmlString: data.xmlString || ''
      });
    });

    // 3. Buscar todos os downloads reais da coleção 'downloads'
    const downloadsSnap = await getDocs(collection(db, 'downloads'));
    const allDownloads = [];
    downloadsSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const dateObj = parseFirestoreDate(data.downloadedAt) || new Date();
      allDownloads.push({
        id: docSnap.id,
        dateObj,
        dateFormatted: dateObj.toLocaleString('pt-BR'),
        userEmail: data.userEmail || 'Usuário Anônimo',
        userId: data.userId || '—',
        platform: data.platform || 'windows'
      });
    });

    // 4. Buscar todos os usuários cadastrados da coleção 'users'
    const usersSnap = await getDocs(collection(db, 'users'));
    const allUsers = [];
    usersSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const dateObj = parseFirestoreDate(data.createdAt) || new Date();
      allUsers.push({
        uid: docSnap.id,
        dateObj,
        dateFormatted: dateObj.toLocaleDateString('pt-BR'),
        displayName: data.displayName || data.email?.split('@')[0] || 'Sentinela',
        email: data.email || '—',
        role: data.role || (data.isAdmin ? 'admin' : 'user'),
        isAdmin: Boolean(data.isAdmin || data.role === 'admin'),
        hasLicense: Boolean(data.hasLicense)
      });
    });

    // 5. Aplicação do Filtro por Intervalo de Datas (De X até Y)
    let filteredPurchases = allPurchases;
    let filteredDownloads = allDownloads;
    let filteredUsers = allUsers;

    if (dateRange && (dateRange.startDate || dateRange.endDate)) {
      const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
      if (start) start.setHours(0, 0, 0, 0);

      const end = dateRange.endDate ? new Date(dateRange.endDate) : null;
      if (end) end.setHours(23, 59, 59, 999);

      if (start || end) {
        filteredPurchases = allPurchases.filter(p => {
          if (!p.dateObj) return true;
          if (start && p.dateObj < start) return false;
          if (end && p.dateObj > end) return false;
          return true;
        });

        filteredDownloads = allDownloads.filter(d => {
          if (!d.dateObj) return true;
          if (start && d.dateObj < start) return false;
          if (end && d.dateObj > end) return false;
          return true;
        });

        filteredUsers = allUsers.filter(u => {
          if (!u.dateObj) return true;
          if (start && u.dateObj < start) return false;
          if (end && u.dateObj > end) return false;
          return true;
        });
      }
    }

    // 6. Cálculo das Métricas Filtradas
    const realOrdersCount = filteredPurchases.length;
    let realGrossRevenue = 0;
    let realGatewayFees = 0;
    let realTaxes = 0;
    let realNetRevenue = 0;

    filteredPurchases.forEach((p) => {
      realGrossRevenue += p.grossValue;
      realGatewayFees += p.gatewayFee;
      realTaxes += p.taxWithheld;
      realNetRevenue += p.netValue;
    });

    const averageTicket = realOrdersCount > 0 ? (realGrossRevenue / realOrdersCount) : 0;
    
    // Contagem de downloads reais
    const downloadsWindows = filteredDownloads.filter(d => d.platform === 'windows').length;
    const downloadsLinux = filteredDownloads.filter(d => d.platform === 'linux').length;
    const totalDownloads = filteredDownloads.length > 0 ? filteredDownloads.length : telemetryDownloads;

    // Métricas de Usuários
    const totalUsers = allUsers.length;
    const licensedUsers = allUsers.filter(u => u.hasLicense).length;
    const newUsersInPeriod = filteredUsers.length;

    // Taxa de conversão da loja
    const conversionRate = pageViews.store > 0 
      ? ((realOrdersCount / pageViews.store) * 100).toFixed(1) + '%' 
      : '0.0%';

    // 7. Geração de Linha do Tempo Diária para a Curva SVG
    // Agrupa os últimos 7 dias do intervalo (ou dias relevantes) para a curva
    const daysMap = {};
    const today = new Date();
    
    // Inicializa os últimos 7 dias
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
      daysMap[key] = {
        dateLabel: key,
        gross: 0,
        net: 0,
        orders: 0,
        downloads: 0,
        newUsers: 0
      };
    }

    // Distribui compras nos dias
    filteredPurchases.forEach(p => {
      if (p.dateObj) {
        const key = `${String(p.dateObj.getDate()).padStart(2, '0')}/${String(p.dateObj.getMonth() + 1).padStart(2, '0')}`;
        if (daysMap[key]) {
          daysMap[key].gross += p.grossValue;
          daysMap[key].net += p.netValue;
          daysMap[key].orders += 1;
        }
      }
    });

    // Distribui downloads nos dias
    filteredDownloads.forEach(d => {
      if (d.dateObj) {
        const key = `${String(d.dateObj.getDate()).padStart(2, '0')}/${String(d.dateObj.getMonth() + 1).padStart(2, '0')}`;
        if (daysMap[key]) {
          daysMap[key].downloads += 1;
        }
      }
    });

    // Distribui novos usuários nos dias
    filteredUsers.forEach(u => {
      if (u.dateObj) {
        const key = `${String(u.dateObj.getDate()).padStart(2, '0')}/${String(u.dateObj.getMonth() + 1).padStart(2, '0')}`;
        if (daysMap[key]) {
          daysMap[key].newUsers += 1;
        }
      }
    });

    const dailyTimeline = Object.values(daysMap);

    return {
      grossRevenue: realGrossRevenue,
      gatewayFeesTotal: realGatewayFees,
      taxesTotal: realTaxes,
      netRevenue: realNetRevenue,
      totalOrders: realOrdersCount,
      averageTicket,
      totalDownloads,
      downloadsWindows,
      downloadsLinux,
      totalUsers,
      licensedUsers,
      newUsersInPeriod,
      conversionRate,
      pageViews,
      totalTraffic,
      purchases: filteredPurchases.sort((a, b) => (b.dateObj || 0) - (a.dateObj || 0)),
      downloads: filteredDownloads.sort((a, b) => (b.dateObj || 0) - (a.dateObj || 0)),
      usersList: filteredUsers.sort((a, b) => (b.dateObj || 0) - (a.dateObj || 0)),
      dailyTimeline,
      isRealData: true
    };
  } catch (err) {
    console.error('Erro ao buscar métricas reais do Firestore:', err);
    return {
      grossRevenue: 0,
      gatewayFeesTotal: 0,
      taxesTotal: 0,
      netRevenue: 0,
      totalOrders: 0,
      averageTicket: 0,
      totalDownloads: 0,
      downloadsWindows: 0,
      downloadsLinux: 0,
      totalUsers: 0,
      licensedUsers: 0,
      newUsersInPeriod: 0,
      conversionRate: '0.0%',
      pageViews: defaultPageViews,
      totalTraffic: 0,
      purchases: [],
      downloads: [],
      usersList: [],
      dailyTimeline: [],
      isRealData: false
    };
  }
};

/**
 * Busca as transações reais da coleção 'purchases'
 */
export const fetchRealTransactions = async (dateRange = null) => {
  const data = await fetchAdminMetrics(dateRange);
  return data.purchases;
};

/**
 * Gera as notas fiscais baseadas nas transações reais
 */
export const fetchRealInvoices = async (dateRange = null) => {
  const transactions = await fetchRealTransactions(dateRange);
  if (!transactions || transactions.length === 0) return INVOICES_LEDGER;

  return transactions.map((t) => ({
    nfeNumber: t.nfeNumber || `NF-e ${t.id}`,
    rawNfeNumber: t.rawNfeNumber || t.id,
    number: t.rawNfeNumber || t.id,
    issueDate: t.dateFormatted ? t.dateFormatted.split(' ')[0] : new Date().toLocaleDateString('pt-BR'),
    customer: t.customerName,
    customerName: t.customerName,
    customerEmail: t.customerEmail,
    cnpjCpf: '000.***.***-00',
    serviceDescription: 'Licenciamento de Software de Jogo Eletrônico 2D (Eclipse: Ecos do Abismo)',
    grossAmount: t.grossValue,
    grossValue: t.grossValue,
    gatewayFee: t.gatewayFee,
    netAmount: t.netValue,
    netValue: t.netValue,
    issRetention: t.taxWithheld / 2,
    simplesTax: t.taxWithheld / 2,
    status: 'Autorizada SEFAZ',
    accessKey: t.accessKey,
    sefazProtocol: t.sefazProtocol,
    xmlString: t.xmlString,
    paymentMethod: t.paymentMethod,
    orderProtocol: t.id
  }));
};
