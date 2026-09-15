export const GATEWAY_CONFIG = {
  name: 'EclipsePay Gateway (Adquirente Digital)',
  percentageFee: 0.045, // 4.5% por transação
  fixedFee: 0.50,       // R$ 0,50 taxa fixa por pedido
  taxRate: 0.06         // 6% Alíquota Simples Nacional / ISS Software
};

export const FINANCIAL_METRICS = {
  grossRevenue: 12450.00,
  gatewayFeesTotal: 685.25,
  taxesTotal: 747.00,
  netRevenue: 11017.75,
  totalOrders: 249,
  averageTicket: 50.00,
  conversionRate: '4.8%',
  totalDownloads: 238,
  pageViews: {
    home: 3420,
    wiki: 2850,
    store: 5190,
    library: 1120
  }
};

export const RECENT_TRANSACTIONS = [
  {
    id: 'TRX-9482',
    date: '15/09/2026 08:30',
    customerName: 'Yuri Nascimento',
    customerEmail: 'yuri.dev@univille.br',
    paymentMethod: 'Cartão de Crédito',
    grossValue: 50.00,
    gatewayFee: 2.75, // 4.5% + 0.50
    taxWithheld: 3.00, // 6%
    netValue: 44.25,
    nfeStatus: 'Emitida',
    nfeNumber: 'NFS-e 2026/00142'
  },
  {
    id: 'TRX-9481',
    date: '14/09/2026 21:15',
    customerName: 'Arthur Dev',
    customerEmail: 'arthur.qa@univille.br',
    paymentMethod: 'PIX Instantâneo',
    grossValue: 50.00,
    gatewayFee: 1.50, // Taxa reduzida PIX
    taxWithheld: 3.00,
    netValue: 45.50,
    nfeStatus: 'Emitida',
    nfeNumber: 'NFS-e 2026/00141'
  },
  {
    id: 'TRX-9480',
    date: '14/09/2026 18:40',
    customerName: 'Marlon Ramos',
    customerEmail: 'marlon.dev@univille.br',
    paymentMethod: 'Boleto Bancário',
    grossValue: 50.00,
    gatewayFee: 3.20,
    taxWithheld: 3.00,
    netValue: 43.80,
    nfeStatus: 'Pendente',
    nfeNumber: 'Aguardando Lote'
  }
];

export const INVOICES_LEDGER = [
  {
    nfeNumber: 'NFS-e 2026/00142',
    issueDate: '15/09/2026',
    customer: 'Yuri Nascimento',
    cnpjCpf: '000.***.***-01',
    serviceDescription: 'Licenciamento de Software de Jogo Eletrônico 2D (Eclipse: Ecos do Abismo)',
    grossAmount: 50.00,
    issRetention: 1.50, // 3% municipal
    simplesTax: 1.50,
    status: 'Autorizada SEFAZ'
  },
  {
    nfeNumber: 'NFS-e 2026/00141',
    issueDate: '14/09/2026',
    customer: 'Arthur Dev',
    cnpjCpf: '000.***.***-02',
    serviceDescription: 'Licenciamento de Software de Jogo Eletrônico 2D (Eclipse: Ecos do Abismo)',
    grossAmount: 50.00,
    issRetention: 1.50,
    simplesTax: 1.50,
    status: 'Autorizada SEFAZ'
  }
];
