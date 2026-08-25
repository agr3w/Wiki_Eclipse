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
        content: [
          'A Ordem das Tochas reúne engenheiros e sentinelas dedicados a proteger os últimos Reatores de Fótons em funcionamento.',
          'Em contrapartida, os Cultistas do Vazio acreditam que o Eclipse é uma purificação necessária, desativando defesas e cultuando as aberrações que emergem do fundo.'
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
          { key: 'Shift', action: 'Dash rápido de esquiva' },
          { key: 'J / Clique Esquerdo', action: 'Golpe básico com a Lâmina Solar' },
          { key: 'K / Clique Direito', action: 'Habilidade de Fóton (Consome Energia)' }
        ]
      },
      {
        id: 'sistema-hud',
        title: 'II. Interface de Voo e Vituais (HUD)',
        tag: 'Recursos',
        summary: 'Entenda os medidores de sobrevivência do personagem.',
        content: [
          'Barra de Vida (Vermelha): Localizada no topo esquerdo. Representa a integridade estrutural do personagem. Ao chegar a zero, aciona o estado de Game Over.',
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
        content: [
          'Comportamento: Percorre plataformas em linha reta e inverte a direção ao tocar em paredes ou bordas com colisão.',
          'Padrão de Ataque: Golpe frontal com alcance médio e dano constante de queimadura.'
        ]
      },
      {
        id: 'espectro-abismo',
        title: 'Espectro do Abismo (Inimigo Aéreo)',
        tag: 'Aéreo',
        summary: 'Entidade voadora que se desloca em trajetórias sinusoidais.',
        content: [
          'Comportamento: Flutua acima das plataformas e mergulha em investida rápida quando o jogador entra no seu campo de visão.',
          'Ponto Fraco: Vulnerável a ataques verticais no momento do rasante.'
        ]
      },
      {
        id: 'arauto-eclipse',
        title: 'O Arauto do Eclipse (Chefe da Camada 1)',
        tag: 'Chefe',
        summary: 'A principal ameaça da primeira área industrial.',
        content: [
          'Fase 1: Ataques pesados de impacto no solo com ondas de choque que cobrem metade da arena.',
          'Fase 2 (HP < 50%): Disparo de projéteis verticais contínuos e névoa escura que reduz o campo de visão da arena.'
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
        content: [
          'Visual: Composição em parallax com prédios desativados ao fundo e iluminação difusa do eclipse.',
          'Elementos de Navegação: Estruturas elevadas de metal, vigas de sustentação e barreiras colidíveis sólidas.'
        ]
      }
    ]
  }
];
