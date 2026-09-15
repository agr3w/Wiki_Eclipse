export const COST_STRUCTURE = {
  pricing: {
    unitGrossPrice: 10.00
  },
  
  // Custos e Despesas Variáveis (por unidade vendida)
  variableCosts: [
    {
      id: 'var-gateway',
      name: 'Taxa Adquirente PagBank (Intermediação)',
      type: 'Despesa Variável',
      category: 'Financeiro',
      basis: '4.5% + R$ 0,50 fixo',
      unitCost: 0.95
    },
    {
      id: 'var-taxes',
      name: 'Provisão Tributária (ISS / Simples Nacional)',
      type: 'Tributo sobre Venda',
      category: 'Fiscal',
      basis: 'Alíquota nominal de 6.0%',
      unitCost: 0.60
    },
    {
      id: 'var-cdn',
      name: 'Tráfego e Saída de Dados (Cloud CDN)',
      type: 'Custo Direto',
      category: 'Infraestrutura',
      basis: '148 MB por download',
      unitCost: 0.10
    }
  ],

  // Custos Fixos Operacionais (Mensais / Overhead)
  fixedCosts: [
    {
      id: 'fix-firebase',
      name: 'Hospedagem & Instância Firebase Blaze',
      category: 'Infraestrutura Cloud',
      period: 'Mensal',
      monthlyAmount: 80.00
    },
    {
      id: 'fix-db',
      name: 'Manutenção de Banco NoSQL & Firestore Tokens',
      category: 'Banco de Dados',
      period: 'Mensal',
      monthlyAmount: 100.00
    },
    {
      id: 'fix-tools',
      name: 'Licenças de Software & Governança (Jira/Design Tools)',
      category: 'Softwares & Ferramentas',
      period: 'Mensal',
      monthlyAmount: 115.00
    },
    {
      id: 'fix-domain',
      name: 'Domínio, Certificados SSL e DNS Corporativo',
      category: 'Infraestrutura Web',
      period: 'Mensal',
      monthlyAmount: 20.00
    },
    {
      id: 'fix-reserve',
      name: 'Provisão para Manutenções Emergenciais',
      category: 'Operacional',
      period: 'Mensal',
      monthlyAmount: 100.00
    }
  ]
};
