export const WIKI_CATEGORIES = [
  {
    id: 'lore',
    title: 'História & Lore',
    tag: 'Universo',
    description: 'A origem do Eclipse eterno, o colapso da luz solar e a descida às usinas geotérmicas.',
    subtopics: [
      {
        id: 'origem-do-eclipse',
        title: 'I. O Colapso da Luz Solar',
        tag: 'Gênese',
        summary: 'Como o hemisfério mergulhou em escuridão perpétua após a anomalia gravitacional.',
        image: '/document/image.png',
        imageCaption: 'Arquivo Histórico: O Crepúsculo Solar e o Colapso das Cidades de Superfície',
        quote: 'Quando o horizonte se apagou, as velhas leis da física cederam lugar ao silêncio.',
        content: [
          'No ano 2187 do Calendário Solar, o núcleo de fusão atmosférica colapsou sob a influência de uma fenda extradimensional conhecida apenas como "O Abismo".',
          'Em menos de 72 horas, as metrópoles da superfície congelaram, forçando os sobreviventes a migrarem para as fundações geotérmicas das cidades subterrâneas.',
          'Hoje, os poucos que resistem empunham tecnologias alimentadas por células de fótons residuais para não sucumbir às sombras.'
        ]
      },
      {
        id: 'faccoes-e-ordens',
        title: 'II. A Ordem das Tochas vs. Cultistas do Vazio',
        tag: 'Facções',
        summary: 'O conflito ideológico entre os guardiões dos reatores e aqueles que abraçaram o esquecimento.',
        quote: 'O abismo não devora apenas corpos de metal e carne. Ele apaga memórias e esperança.',
        content: [
          'A Ordem das Tochas reúne engenheiros e sentinelas dedicados a proteger os últimos Reatores de Fótons em funcionamento nas camadas profundas.',
          'Em contrapartida, os Cultistas do Vazio acreditam que o Eclipse é uma purificação necessária, desativando defesas e cultuando as aberrações que emergem do fundo.',
          'Entre os dois lados, mercenários e andarilhos solitários buscam fragmentos de tecnologia ancestral nas ruínas abandonadas.'
        ]
      }
    ]
  },
  {
    id: 'mecanicas',
    title: 'Mecânicas & Controles',
    tag: 'Sistemas',
    description: 'Guia completo de comandos de movimentação, física 2D e gerenciamento de recursos da HUD.',
    subtopics: [
      {
        id: 'controles-basicos',
        title: 'I. Mapeamento de Movimento e Ações',
        tag: 'Gameplay',
        summary: 'Comandos principais no teclado para navegação precisa nas plataformas.',
        controls: [
          { key: 'A / D ou ← / →', action: 'Movimentação Horizontal 2D' },
          { key: 'Espaço', action: 'Salto com física de gravidade ajustada' },
          { key: 'Shift', action: 'Dash rápido de esquiva (Consome Estamina)' },
          { key: 'J / Clique Esquerdo', action: 'Golpe básico com a Lâmina Solar' },
          { key: 'K / Clique Direito', action: 'Habilidade de Fóton (Consome Energia)' }
        ]
      },
      {
        id: 'sistema-hud',
        title: 'II. Interface e Recursos de Sobrevivência (HUD)',
        tag: 'Recursos',
        summary: 'Entenda os medidores vitais do personagem em combate.',
        image: '/document/image.png',
        imageCaption: 'Calibração dos Sensores Vitais e Níveis de Fótons Residuais',
        attributes: [
          { label: 'Barra de Integridade (Vida)', value: 'Monitoramento em tempo real no canto superior esquerdo' },
          { label: 'Célula de Fóton (Estamina)', value: 'Regeneração contínua quando o jogador toca o solo' }
        ],
        content: [
          'Barra de Vida (Vermelha): Localizada no topo esquerdo. Representa a integridade estrutural do personagem. Ao chegar a zero, aciona o estado de colapso crítico (Game Over).',
          'Barra de Energia / Estamina (Azul): Consumida durante esquivas rápidas (Dash) e golpes especiais. Recarrega progressivamente enquanto o jogador está no chão.'
        ]
      }
    ]
  },
  {
    id: 'inimigos',
    title: 'Inimigos & Ameaças',
    tag: 'Bestiário',
    description: 'Catálogo de sentinelas, espectros voadores e chefes corrompidos pelo Abismo.',
    subtopics: [
      {
        id: 'guardiao-tocha',
        title: 'Guardião da Tocha (Inimigo Terrestre)',
        tag: 'Terrestre',
        summary: 'Patrulheiro de plataformas que utiliza fogo e combate corpo a corpo.',
        image: '/document/image.png',
        imageCaption: 'Registro de Sentinela: Autômato minerador corrompido empunhando tocha térmica',
        attributes: [
          { label: 'Padrão de Movimento', value: 'Patrulha Linear e Inversão em Bordas' },
          { label: 'Tipo de Ameaça', value: 'Golpe Frontal de Queimadura Contínua' },
          { label: 'Ponto Fraco', value: 'Ataques Aéreos Descendentes' }
        ],
        content: [
          'Comportamento: Percorre plataformas em linha reta e inverte a direção ao tocar em paredes ou bordas com colisão.',
          'Padrão de Ataque: Golpe frontal com alcance médio e dano constante de queimadura. Recomenda-se saltar por cima do inimigo para contra-atacar.'
        ]
      },
      {
        id: 'espectro-abismo',
        title: 'Espectro do Abismo (Inimigo Aéreo)',
        tag: 'Aéreo',
        summary: 'Entidade voadora que se desloca em trajetórias sinusoidais.',
        attributes: [
          { label: 'Padrão de Voo', value: 'Trajetória Senoidal Flutuante' },
          { label: 'Comportamento', value: 'Mergulho Ofensivo em Linha de Visão' },
          { label: 'Vulnerabilidade', value: 'Golpes com a Lâmina Solar durante o rasante' }
        ],
        content: [
          'Comportamento: Flutua acima das plataformas e mergulha em investida rápida quando o jogador entra no seu campo de visão.',
          'Ponto Fraco: Fica temporariamente imóvel e vulnerável a ataques verticais imediatamente após errar um ataque de rasante.'
        ]
      },
      {
        id: 'arauto-eclipse',
        title: 'O Arauto do Eclipse (Chefe da Camada 1)',
        tag: 'Chefe de Setor',
        summary: 'A principal ameaça da primeira área industrial e guardião do elevador geotérmico.',
        image: '/document/image.png',
        imageCaption: 'Registro da Batalha: A arena da caldeira industrial central',
        attributes: [
          { label: 'Classificação', value: 'Guardião Primordial (Nível 1)' },
          { label: 'Estágios', value: '2 Fases Dinâmicas de Combate' },
          { label: 'Recompensa', value: 'Célula de Fóton Primordial & Acesso à Camada II' }
        ],
        content: [
          'Fase 1: Ataques pesados de impacto no solo com ondas de choque que cobrem metade da arena. Exige saltos precisos para desviar das ondas.',
          'Fase 2 (HP < 50%): Disparo de projéteis verticais contínuos e névoa escura que reduz o campo de visão da arena, exigindo esquivas rápidas com o Dash.'
        ]
      }
    ]
  },
  {
    id: 'cenarios',
    title: 'Cenários & Ambientes',
    tag: 'Level Design',
    description: 'Camadas do mundo, fundos em parallax e estruturas de plataformas metálicas.',
    subtopics: [
      {
        id: 'plataformas-industriais',
        title: 'Camada I: As Estruturas Industriais',
        tag: 'Nível 1',
        summary: 'Passarelas suspensas sobre a silhueta da metrópole abandonada.',
        image: '/document/image.png',
        imageCaption: 'Levantamento Arquitetônico: Parallax multicamadas com vigas de aço e atmosfera de névoa',
        attributes: [
          { label: 'Camadas de Fundo', value: '3 Planos em Parallax Dinâmico' },
          { label: 'Obstáculos', value: 'Plataformas Móveis e Quedas Abissais' },
          { label: 'Iluminação', value: 'Luz Difusa do Eclipse & Brilho Geotérmico' }
        ],
        content: [
          'Visual: Composição em parallax com prédios desativados ao fundo e iluminação difusa do eclipse.',
          'Elementos de Navegação: Estruturas elevadas de metal, vigas de sustentação e barreiras colidíveis sólidas.',
          'Segredos: Tubulações secundárias escondidas que levam a fragmentos de lore e recargas extras de energia.'
        ]
      }
    ]
  }
];
