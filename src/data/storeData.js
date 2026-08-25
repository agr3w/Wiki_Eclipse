export const GAME_DETAILS = {
  id: 'eclipse-ecos-do-abismo',
  title: 'Eclipse: Ecos do Abismo',
  tagline: 'Ação e Plataforma 2D em um mundo distópico pós-colapso solar.',
  price: 'R$ 0,00',
  priceLabel: 'Licença Aberta / Gratuita',
  releaseDate: '11 de Agosto de 2026',
  developer: 'X',
  publisher: 'Projeto Integrador VI (Univille)',
  engine: 'Godot Engine 4.7.1 (Vulkan)',
  size: '148 MB',
  platforms: ['Windows x64', 'Linux x64'],
  tags: ['Metroidvania', 'Plataforma 2D', 'Pixel Art', 'Dark / Cyberpunk', 'Ação'],
  synopsis: 'Após o colapso da coroa solar, as metrópoles da superfície foram devoradas pelo Abismo. Assuma o controle de uma sentinela reativada, empunhe a Lâmina Solar e desça às estruturas industriais para restaurar a centelha da humanidade frente ao Arauto do Eclipse.',
  
  gallery: [
    {
      id: 'screen-1',
      title: 'Plataformas Industriais & Parallax',
      url: '/document/image.png',
      caption: 'Navegação pelas passarelas suspensas com cenário em múltiplos planos de profundidade.'
    },
    {
      id: 'screen-2',
      title: 'Encontro com o Guardião',
      url: '/document/image.png',
      caption: 'Combate e esquiva contra sentinelas armadas com fogo nas ruínas subterrâneas.'
    },
    {
      id: 'screen-3',
      title: 'Menu de Configurações & Customização',
      url: '/document/image.png',
      caption: 'Ajuste de volume de trilha sonora, efeitos e controles.'
    }
  ],

  features: [
    'Movimentação responsiva 2D com física precisa de gravidade, inércia e dash aéreo.',
    'Sistema de recursos integrado (HUD) com barras de Vida e Energia (Fóton).',
    'Catálogo variado de inimigos com comportamentos terrestres e aéreos.',
    'Batalha de múltiplos estágios contra o chefe "Arauto do Eclipse".',
    'Trilha sonora dinâmica em loop e efeitos sonoros imersivos.'
  ],

  requirements: {
    minimum: {
      os: 'Windows 10 64-bit / Ubuntu 22.04 LTS',
      processor: 'Intel Core i3-4130 / AMD FX-6300',
      memory: '4 GB de RAM',
      graphics: 'Intel HD Graphics 4400 / AMD Radeon R7',
      directx: 'Compatível com OpenGL 3.3 / Vulkan',
      storage: '300 MB de espaço disponível'
    },
    recommended: {
      os: 'Windows 11 64-bit / Linux 64-bit',
      processor: 'Intel Core i5-8400 / AMD Ryzen 5 2600',
      memory: '8 GB de RAM',
      graphics: 'NVIDIA GTX 1050 / AMD RX 560 (Vulkan nativo)',
      directx: 'Suporte a Vulkan 1.2',
      storage: '500 MB de espaço disponível (SSD)'
    }
  },

  patchNotes: [
    {
      version: 'v1.0.4',
      date: '24/08/2026',
      type: 'Hotfix',
      title: 'Ajuste de Colisões nas Plataformas Elevadas',
      summary: 'Correção no cálculo de normal das plataformas industriais e balanceamento da velocidade de recuperação da barra de estamina.',
      changes: [
        'Ajustado o nó de CollisionShape2D das passarelas suspensas para evitar travamento em quinas.',
        'Reduzido o tempo de recarga do Dash de 1.2s para 0.9s.',
        'Corrigido bug visual onde o sprite do Guardião da Tocha não invertia a direção ao colidir com barreiras.'
      ]
    },
    {
      version: 'v1.0.0',
      date: '11/08/2026',
      type: 'Major Release',
      title: 'Lançamento do Protótipo Oficial',
      summary: 'Publicação da primeira versão jogável com o primeiro nível industrial completo e combate inicial.',
      changes: [
        'Implementado sistema de movimentação 2D do personagem principal.',
        'Adicionado menu principal com trilha sonora original.',
        'Inserido protótipo de inimigo terrestre e aéreo com lógica de patrulha.'
      ]
    }
  ],

  discussions: [
    {
      id: 'd-1',
      author: 'Marlon_Dev',
      avatar: 'M',
      date: 'Há 2 dias',
      title: 'Dica para passar pelo Guardião da Tocha no início',
      message: 'Usem o pulo duplo logo após o ataque dele para conseguir espaço nas plataformas estreitas. A estamina recupera rápido se não derem dash à toa!',
      upvotes: 6,
      userUpvoted: false,
      reported: false,
      replies: [
        {
          id: 'r-1-1',
          author: 'Lumina_Seeker',
          avatar: 'L',
          date: 'Há 1 dia',
          message: 'Boa dica! O tempo de recuperação da estamina no chão ficou muito melhor depois do hotfix v1.0.4.'
        }
      ]
    },
    {
      id: 'd-2',
      author: 'Arthur_QA',
      avatar: 'A',
      date: 'Há 4 dias',
      title: 'Performance no Linux com Vulkan',
      message: 'Testado no Ubuntu 24.04 com drivers Mesa: cravado em 60 FPS sem engasgos nas transições de parallax.',
      upvotes: 4,
      userUpvoted: false,
      reported: false,
      replies: []
    }
  ]
};
