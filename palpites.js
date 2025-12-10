// ==========================================================
//  PALPITES.JS
//  Motor genérico de classificação para os GRUPOS (A, B, C...)
//  - Atualiza P, J, V, E, D, GF, GC, SG
//  - Aplica confronto direto completo (head-to-head) por grupo
// ==========================================================

// ---------- CONFIGURAÇÃO DOS GRUPOS ----------

// GRUPO A
const grupoA = {
  tableBodyId: "tabela-grupoA-body",
  teams: [
    { id: "mex",  name: "México",        flag: "Mexico.png" },
    { id: "afs",  name: "África do Sul", flag: "africa.png" },
    { id: "cor",  name: "Coreia do Sul", flag: "coreia.png" },
    { id: "eur",  name: "Europa D",      flag: "europad.png" }
  ],
  matches: [
    { id: "m1", home: "mex", away: "afs", homeSelector: "#m1_home", awaySelector: "#m1_away" },
    { id: "m2", home: "cor", away: "eur", homeSelector: "#m2_home", awaySelector: "#m2_away" },
    { id: "m3", home: "eur", away: "afs", homeSelector: "#m3_home", awaySelector: "#m3_away" },
    { id: "m4", home: "mex", away: "cor", homeSelector: "#m4_home", awaySelector: "#m4_away" },
    { id: "m5", home: "eur", away: "mex", homeSelector: "#m5_home", awaySelector: "#m5_away" },
    { id: "m6", home: "afs", away: "cor", homeSelector: "#m6_home", awaySelector: "#m6_away" }
  ]
};

// GRUPO B
const grupoB = {
  tableBodyId: "grupoB-body",
  teams: [
    { id: "canada",  name: "Canadá",   flag: "canada.png" },
    { id: "catar",   name: "Catar",    flag: "catar.png" },
    { id: "europaa", name: "Europa A", flag: "europad.png" },
    { id: "suica",   name: "Suíça",    flag: "suica.png" }
  ],
  matches: [
    // 1ª rodada
    {
      id: "B1",
      home: "canada",
      away: "europaa",
      homeSelector: 'input[data-jogo="B1"][data-time="canada"]',
      awaySelector: 'input[data-jogo="B1"][data-time="europaa"]'
    },
    {
      id: "B2",
      home: "catar",
      away: "suica",
      homeSelector: 'input[data-jogo="B2"][data-time="catar"]',
      awaySelector: 'input[data-jogo="B2"][data-time="suica"]'
    },

    // 2ª rodada
    {
      id: "B3",
      home: "suica",
      away: "europaa",
      homeSelector: 'input[data-jogo="B3"][data-time="suica"]',
      awaySelector: 'input[data-jogo="B3"][data-time="europaa"]'
    },
    {
      id: "B4",
      home: "canada",
      away: "catar",
      homeSelector: 'input[data-jogo="B4"][data-time="canada"]',
      awaySelector: 'input[data-jogo="B4"][data-time="catar"]'
    },

    // 3ª rodada
    {
      id: "B5",
      home: "suica",
      away: "canada",
      homeSelector: 'input[data-jogo="B5"][data-time="suica"]',
      awaySelector: 'input[data-jogo="B5"][data-time="canada"]'
    },
    {
      id: "B6",
      home: "europaa",
      away: "catar",
      homeSelector: 'input[data-jogo="B6"][data-time="europaa"]',
      awaySelector: 'input[data-jogo="B6"][data-time="catar"]'
    }
  ]
};

// GRUPO C
const grupoC = {
  tableBodyId: "grupoC-body",
  teams: [
    { id: "brasil",   name: "Brasil",   flag: "brasil.png" },
    { id: "marrocos", name: "Marrocos", flag: "marrocos.png" },
    { id: "haiti",    name: "Haiti",    flag: "haiti.png" },
    { id: "escocia",  name: "Escócia",  flag: "escocia.png" }
  ],
  matches: [
    // 1ª rodada
    {
      id: "C1",
      home: "brasil",
      away: "marrocos",
      homeSelector: 'input[data-jogo="C1"][data-time="brasil"]',
      awaySelector: 'input[data-jogo="C1"][data-time="marrocos"]'
    },
    {
      id: "C2",
      home: "haiti",
      away: "escocia",
      homeSelector: 'input[data-jogo="C2"][data-time="haiti"]',
      awaySelector: 'input[data-jogo="C2"][data-time="escocia"]'
    },

    // 2ª rodada
    {
      id: "C3",
      home: "escocia",
      away: "marrocos",
      homeSelector: 'input[data-jogo="C3"][data-time="escocia"]',
      awaySelector: 'input[data-jogo="C3"][data-time="marrocos"]'
    },
    {
      id: "C4",
      home: "brasil",
      away: "haiti",
      homeSelector: 'input[data-jogo="C4"][data-time="brasil"]',
      awaySelector: 'input[data-jogo="C4"][data-time="haiti"]'
    },

    // 3ª rodada
    {
      id: "C5",
      home: "escocia",
      away: "brasil",
      homeSelector: 'input[data-jogo="C5"][data-time="escocia"]',
      awaySelector: 'input[data-jogo="C5"][data-time="brasil"]'
    },
    {
      id: "C6",
      home: "marrocos",
      away: "haiti",
      homeSelector: 'input[data-jogo="C6"][data-time="marrocos"]',
      awaySelector: 'input[data-jogo="C6"][data-time="haiti"]'
    }
  ]
};

// ===============================
// GRUPO D
// ===============================
const grupoD = {
    tableBodyId: "grupoD-body",
    teams: [
        { id: "eua", name: "Estados Unidos", flag: "eua.png" },
        { id: "australia",       name: "Austrália", flag: "australia.png" },
        { id: "europac",   name: "Europa C", flag: "europad.png" },
        { id: "paraguai",  name: "Paraguai", flag: "paraguai.png" }
    ],
    matches: [
        // 1ª rodada
        { id: "D1", home: "eua",       away: "paraguai", homeSelector:'input[data-jogo="D1"][data-time="eua"]',       awaySelector:'input[data-jogo="D1"][data-time="paraguai"]' },
        { id: "D2", home: "australia", away: "europac",  homeSelector:'input[data-jogo="D2"][data-time="australia"]', awaySelector:'input[data-jogo="D2"][data-time="europac"]' },

        // 2ª rodada
        { id: "D3", home: "europac",   away: "paraguai", homeSelector:'input[data-jogo="D3"][data-time="europac"]',   awaySelector:'input[data-jogo="D3"][data-time="paraguai"]' },
        { id: "D4", home: "eua",       away: "australia",homeSelector:'input[data-jogo="D4"][data-time="eua"]',       awaySelector:'input[data-jogo="D4"][data-time="australia"]' },

        // 3ª rodada
        { id: "D5", home: "europac",   away: "eua",      homeSelector:'input[data-jogo="D5"][data-time="europac"]',   awaySelector:'input[data-jogo="D5"][data-time="eua"]' },
        { id: "D6", home: "paraguai",  away: "australia",homeSelector:'input[data-jogo="D6"][data-time="paraguai"]',  awaySelector:'input[data-jogo="D6"][data-time="australia"]' }
    ]
};
// ===============================
// GRUPO E
// ===============================
const grupoE = {
    tableBodyId: "grupoE-body",
    teams: [
        { id: "alemanha",     name: "Alemanha",        flag: "alemanha.png" },
        { id: "costadomarfim",name: "Costa do Marfim", flag: "costadomarfim.png" },
        { id: "curacao",      name: "Curaçao",         flag: "curacao.png" },
        { id: "equador",      name: "Equador",         flag: "equador.png" }
    ],
    matches: [
        // 1ª rodada
        { id: "E1", home: "alemanha", away: "curacao",
          homeSelector:'input[data-jogo="E1"][data-time="alemanha"]',
          awaySelector:'input[data-jogo="E1"][data-time="curacao"]'
        },
        { id: "E2", home: "costadomarfim", away: "equador",
          homeSelector:'input[data-jogo="E2"][data-time="costadomarfim"]',
          awaySelector:'input[data-jogo="E2"][data-time="equador"]'
        },

        // 2ª rodada
        { id: "E3", home: "alemanha", away: "costadomarfim",
          homeSelector:'input[data-jogo="E3"][data-time="alemanha"]',
          awaySelector:'input[data-jogo="E3"][data-time="costadomarfim"]'
        },
        { id: "E4", home: "equador", away: "curacao",
          homeSelector:'input[data-jogo="E4"][data-time="equador"]',
          awaySelector:'input[data-jogo="E4"][data-time="curacao"]'
        },

        // 3ª rodada
        { id: "E5", home: "equador", away: "alemanha",
          homeSelector:'input[data-jogo="E5"][data-time="equador"]',
          awaySelector:'input[data-jogo="E5"][data-time="alemanha"]'
        },
        { id: "E6", home: "curacao", away: "costadomarfim",
          homeSelector:'input[data-jogo="E6"][data-time="curacao"]',
          awaySelector:'input[data-jogo="E6"][data-time="costadomarfim"]'
        }
    ]
};
// ===============================
// GRUPO F
// ===============================
const grupoF = {
    tableBodyId: "grupoF-body",
    teams: [
        { id: "holanda", name: "Holanda", flag: "holanda.png" },
        { id: "japao", name: "Japão",  flag: "japao.png" },
        { id: "europab",   name: "Europa B",    flag: "europad.png" },
        { id: "tunisia", name: "Tunísia",  flag: "tunisia.png" }
    ],
    matches: [
        // 1ª rodada
        { id: "F1", home: "holanda", away: "japao",
          homeSelector:'input[data-jogo="F1"][data-time="holanda"]',
          awaySelector:'input[data-jogo="F1"][data-time="japao"]'
        },
        { id: "F2", home: "europab", away: "tunisia",
          homeSelector:'input[data-jogo="F2"][data-time="europab"]',
          awaySelector:'input[data-jogo="F2"][data-time="tunisia"]'
        },

        // 2ª rodada
        { id: "F3", home: "holanda", away: "europab",
          homeSelector:'input[data-jogo="F3"][data-time="holanda"]',
          awaySelector:'input[data-jogo="F3"][data-time="europab"]'
        },
        { id: "F4", home: "tunisia", away: "japao",
          homeSelector:'input[data-jogo="F4"][data-time="tunisia"]',
          awaySelector:'input[data-jogo="F4"][data-time="japao"]'
        },

        // 3ª rodada
        { id: "F5", home: "tunisia", away: "holanda",
          homeSelector:'input[data-jogo="F5"][data-time="tunisia"]',
          awaySelector:'input[data-jogo="F5"][data-time="holanda"]'
        },
        { id: "F6", home: "japao", away: "europab",
          homeSelector:'input[data-jogo="F6"][data-time="japao"]',
          awaySelector:'input[data-jogo="F6"][data-time="europab"]'
        }
    ]
};
// ===============================
// GRUPO G
// ===============================
const grupoG = {
    tableBodyId: "grupoG-body",
    teams: [
        { id: "belgica", name: "Bélgica", flag: "belgica.png" },
        { id: "egito",   name: "Egito",   flag: "egito.png" },
        { id: "ira",     name: "Irã",     flag: "ira.png" },
        { id: "nz",      name: "Nova Zelândia", flag: "novazelandia.png" }
    ],
    matches: [
        // 1ª rodada
        { id: "G1", home: "belgica", away: "egito",
          homeSelector:'input[data-jogo="G1"][data-time="belgica"]',
          awaySelector:'input[data-jogo="G1"][data-time="egito"]'
        },
        { id: "G2", home: "ira", away: "nz",
          homeSelector:'input[data-jogo="G2"][data-time="ira"]',
          awaySelector:'input[data-jogo="G2"][data-time="nz"]'
        },

        // 2ª rodada
        { id: "G3", home: "belgica", away: "ira",
          homeSelector:'input[data-jogo="G3"][data-time="belgica"]',
          awaySelector:'input[data-jogo="G3"][data-time="ira"]'
        },
        { id: "G4", home: "nz", away: "egito",
          homeSelector:'input[data-jogo="G4"][data-time="nz"]',
          awaySelector:'input[data-jogo="G4"][data-time="egito"]'
        },

        // 3ª rodada
        { id: "G5", home: "nz", away: "belgica",
          homeSelector:'input[data-jogo="G5"][data-time="nz"]',
          awaySelector:'input[data-jogo="G5"][data-time="belgica"]'
        },
        { id: "G6", home: "egito", away: "ira",
          homeSelector:'input[data-jogo="G6"][data-time="egito"]',
          awaySelector:'input[data-jogo="G6"][data-time="ira"]'
        }
    ]
};
// ===============================
// GRUPO H
// ===============================
const grupoH = {
    tableBodyId: "grupoH-body",
    teams: [
        { id: "espanha",   name: "Espanha", flag: "espanha.png" },
        { id: "arabia",    name: "Arábia Saudita", flag: "arabia.png" },
        { id: "caboverde", name: "Cabo Verde", flag: "caboverde.png" },
        { id: "uruguai",   name: "Uruguai", flag: "uruguai.png" }
    ],
    matches: [

        // 1ª rodada
        { id: "H1", home: "espanha", away: "caboverde",
          homeSelector:'input[data-jogo="H1"][data-time="espanha"]',
          awaySelector:'input[data-jogo="H1"][data-time="caboverde"]'
        },
        { id: "H2", home: "arabia", away: "uruguai",
          homeSelector:'input[data-jogo="H2"][data-time="arabia"]',
          awaySelector:'input[data-jogo="H2"][data-time="uruguai"]'
        },

        // 2ª rodada
        { id: "H3", home: "espanha", away: "arabia",
          homeSelector:'input[data-jogo="H3"][data-time="espanha"]',
          awaySelector:'input[data-jogo="H3"][data-time="arabia"]'
        },
        { id: "H4", home: "uruguai", away: "caboverde",
          homeSelector:'input[data-jogo="H4"][data-time="uruguai"]',
          awaySelector:'input[data-jogo="H4"][data-time="caboverde"]'
        },

        // 3ª rodada
        { id: "H5", home: "uruguai", away: "espanha",
          homeSelector:'input[data-jogo="H5"][data-time="uruguai"]',
          awaySelector:'input[data-jogo="H5"][data-time="espanha"]'
        },
        { id: "H6", home: "caboverde", away: "arabia",
          homeSelector:'input[data-jogo="H6"][data-time="caboverde"]',
          awaySelector:'input[data-jogo="H6"][data-time="arabia"]'
        }
    ]
};
// ===============================
// GRUPO I
// ===============================
const grupoI = {
    tableBodyId: "grupoI-body",
    teams: [
        { id: "franca",  name: "França", flag: "franca.png" },
        { id: "inter2",  name: "Intercontinental 2", flag: "europad.png" },
        { id: "noruega", name: "Noruega", flag: "noruega.png" },
        { id: "senegal", name: "Senegal", flag: "senegal.png" }
    ],
    matches: [

        // 1ª Rodada
        { id: "I1", home: "franca", away: "senegal",
          homeSelector:'input[data-jogo="I1"][data-time="franca"]',
          awaySelector:'input[data-jogo="I1"][data-time="senegal"]'
        },

        { id: "I2", home: "inter2", away: "noruega",
          homeSelector:'input[data-jogo="I2"][data-time="inter2"]',
          awaySelector:'input[data-jogo="I2"][data-time="noruega"]'
        },

        // 2ª Rodada
        { id: "I3", home: "franca", away: "inter2",
          homeSelector:'input[data-jogo="I3"][data-time="franca"]',
          awaySelector:'input[data-jogo="I3"][data-time="inter2"]'
        },

        { id: "I4", home: "noruega", away: "senegal",
          homeSelector:'input[data-jogo="I4"][data-time="noruega"]',
          awaySelector:'input[data-jogo="I4"][data-time="senegal"]'
        },

        // 3ª Rodada
        { id: "I5", home: "noruega", away: "franca",
          homeSelector:'input[data-jogo="I5"][data-time="noruega"]',
          awaySelector:'input[data-jogo="I5"][data-time="franca"]'
        },

        { id: "I6", home: "senegal", away: "inter2",
          homeSelector:'input[data-jogo="I6"][data-time="senegal"]',
          awaySelector:'input[data-jogo="I6"][data-time="inter2"]'
        }
    ]
};
// ===============================
// GRUPO J
// ===============================
const grupoJ = {
    tableBodyId: "grupoJ-body",
    teams: [
        { id: "argentina", name: "Argentina", flag: "argentina.png" },
        { id: "argelia",   name: "Argélia",   flag: "argelia.png" },
        { id: "jordania",  name: "Jordânia",  flag: "jordania.png" },
        { id: "austria",   name: "Áustria",   flag: "austria.png" }
    ],
    matches: [
        // 1ª Rodada
        { id: "J1", home: "argentina", away: "argelia",
          homeSelector:'input[data-jogo="J1"][data-time="argentina"]',
          awaySelector:'input[data-jogo="J1"][data-time="argelia"]'
        },

        { id: "J2", home: "austria", away: "jordania",
          homeSelector:'input[data-jogo="J2"][data-time="austria"]',
          awaySelector:'input[data-jogo="J2"][data-time="jordania"]'
        },

        // 2ª Rodada
        { id: "J3", home: "argentina", away: "austria",
          homeSelector:'input[data-jogo="J3"][data-time="argentina"]',
          awaySelector:'input[data-jogo="J3"][data-time="austria"]'
        },

        { id: "J4", home: "jordania", away: "argelia",
          homeSelector:'input[data-jogo="J4"][data-time="jordania"]',
          awaySelector:'input[data-jogo="J4"][data-time="argelia"]'
        },

        // 3ª Rodada
        { id: "J5", home: "jordania", away: "argentina",
          homeSelector:'input[data-jogo="J5"][data-time="jordania"]',
          awaySelector:'input[data-jogo="J5"][data-time="argentina"]'
        },

        { id: "J6", home: "argelia", away: "austria",
          homeSelector:'input[data-jogo="J6"][data-time="argelia"]',
          awaySelector:'input[data-jogo="J6"][data-time="austria"]'
        }
    ]
};
// ===============================
// GRUPO K
// ===============================
const grupoK = {
    tableBodyId: "grupoK-body",
    teams: [
        { id: "portugal",     name: "Portugal",          flag: "portugal.png" },
        { id: "colombia",     name: "Colômbia",          flag: "colombia.png" },
        { id: "inter1",       name: "Intercontinental 1", flag: "europad.png" },
        { id: "uzbequistao",  name: "Uzbequistão",       flag: "uzbequistao.png" }
    ],
    matches: [

        // 1ª Rodada
        { id: "K1", home: "portugal", away: "inter1",
          homeSelector:'input[data-jogo="K1"][data-time="portugal"]',
          awaySelector:'input[data-jogo="K1"][data-time="inter1"]'
        },

        { id: "K2", home: "uzbequistao", away: "colombia",
          homeSelector:'input[data-jogo="K2"][data-time="uzbequistao"]',
          awaySelector:'input[data-jogo="K2"][data-time="colombia"]'
        },

        // 2ª Rodada
        { id: "K3", home: "portugal", away: "uzbequistao",
          homeSelector:'input[data-jogo="K3"][data-time="portugal"]',
          awaySelector:'input[data-jogo="K3"][data-time="uzbequistao"]'
        },

        { id: "K4", home: "colombia", away: "inter1",
          homeSelector:'input[data-jogo="K4"][data-time="colombia"]',
          awaySelector:'input[data-jogo="K4"][data-time="inter1"]'
        },

        // 3ª Rodada
        { id: "K5", home: "colombia", away: "portugal",
          homeSelector:'input[data-jogo="K5"][data-time="colombia"]',
          awaySelector:'input[data-jogo="K5"][data-time="portugal"]'
        },

        { id: "K6", home: "inter1", away: "uzbequistao",
          homeSelector:'input[data-jogo="K6"][data-time="inter1"]',
          awaySelector:'input[data-jogo="K6"][data-time="uzbequistao"]'
        }
    ]
};
// ===============================
// GRUPO L
// ===============================
const grupoL = {
    tableBodyId: "grupoL-body",
    teams: [
        { id: "inglaterra", name: "Inglaterra", flag: "inglaterra.png" },
        { id: "croacia",    name: "Croácia",    flag: "croacia.png" },
        { id: "gana",       name: "Gana",       flag: "gana.png" },
        { id: "panama",     name: "Panamá",     flag: "panama.png" }
    ],
    matches: [
        // 1ª Rodada
        { id: "L1", home: "inglaterra", away: "croacia",
          homeSelector:'input[data-jogo="L1"][data-time="inglaterra"]',
          awaySelector:'input[data-jogo="L1"][data-time="croacia"]'
        },
        { id: "L2", home: "gana", away: "panama",
          homeSelector:'input[data-jogo="L2"][data-time="gana"]',
          awaySelector:'input[data-jogo="L2"][data-time="panama"]'
        },

        // 2ª Rodada
        { id: "L3", home: "inglaterra", away: "gana",
          homeSelector:'input[data-jogo="L3"][data-time="inglaterra"]',
          awaySelector:'input[data-jogo="L3"][data-time="gana"]'
        },
        { id: "L4", home: "panama", away: "croacia",
          homeSelector:'input[data-jogo="L4"][data-time="panama"]',
          awaySelector:'input[data-jogo="L4"][data-time="croacia"]'
        },

        // 3ª Rodada
        { id: "L5", home: "panama", away: "inglaterra",
          homeSelector:'input[data-jogo="L5"][data-time="panama"]',
          awaySelector:'input[data-jogo="L5"][data-time="inglaterra"]'
        },
        { id: "L6", home: "croacia", away: "gana",
          homeSelector:'input[data-jogo="L6"][data-time="croacia"]',
          awaySelector:'input[data-jogo="L6"][data-time="gana"]'
        }
    ]
};


// ---------- REGISTRO GLOBAL DE GRUPOS ----------
const grupos = {
  A: grupoA,
  B: grupoB,
  C: grupoC,
  D: grupoD,
  E: grupoE,
  F: grupoF,
  G: grupoG,
  H: grupoH,
  I: grupoI,
  J: grupoJ,
  K: grupoK,
  L: grupoL
};

// ==========================================================
//  MOTOR GENÉRICO
// ==========================================================

// Cria estrutura base de estatísticas para um grupo
function createEmptyStats(teams) {
  const stats = {};
  teams.forEach(t => {
    stats[t.id] = {
      id: t.id,
      name: t.name,
      flag: t.flag,
      pts: 0,
      j: 0,
      v: 0,
      e: 0,
      d: 0,
      gf: 0,
      gc: 0,
      sg: 0,
      h2h: {}
    };
  });
  return stats;
}

// Processa todos os jogos de um grupo
function processMatchesGroup(groupConfig, stats) {
  const { matches } = groupConfig;

  for (const match of matches) {
    const homeInput = document.querySelector(match.homeSelector);
    const awayInput = document.querySelector(match.awaySelector);
    if (!homeInput || !awayInput) continue;

    const homeVal = homeInput.value.trim();
    const awayVal = awayInput.value.trim();

    if (homeVal === "" || awayVal === "") continue;

    const gh = parseInt(homeVal, 10);
    const ga = parseInt(awayVal, 10);
    if (Number.isNaN(gh) || Number.isNaN(ga)) continue;

    const home = stats[match.home];
    const away = stats[match.away];

    if (!home || !away) continue;

    home.j++;
    away.j++;

    home.gf += gh;
    home.gc += ga;
    away.gf += ga;
    away.gc += gh;

    let homePts = 0;
    let awayPts = 0;

    if (gh > ga) {
      home.v++;
      away.d++;
      homePts = 3;
    } else if (gh < ga) {
      away.v++;
      home.d++;
      awayPts = 3;
    } else {
      home.e++;
      away.e++;
      homePts = 1;
      awayPts = 1;
    }

    home.pts += homePts;
    away.pts += awayPts;

    // Head-to-head
    if (!home.h2h[match.away]) home.h2h[match.away] = { gf: 0, ga: 0, pts: 0 };
    if (!away.h2h[match.home]) away.h2h[match.home] = { gf: 0, ga: 0, pts: 0 };

    home.h2h[match.away].gf += gh;
    home.h2h[match.away].ga += ga;
    home.h2h[match.away].pts += homePts;

    away.h2h[match.home].gf += ga;
    away.h2h[match.home].ga += gh;
    away.h2h[match.home].pts += awayPts;
  }

  // saldo de gols
  for (const t of Object.values(stats)) {
    t.sg = t.gf - t.gc;
  }
}

// Ordenação inicial
function ordenarGeral(teams, stats) {
  const order = teams.map(t => t.id);
  order.sort((aId, bId) => {
    const a = stats[aId];
    const b = stats[bId];

    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.sg !== a.sg) return b.sg - a.sg;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return 0;
  });
  return order;
}

// Confronto direto (mini-tabela)
function aplicarConfrontoDireto(order, stats) {
  const finalOrder = [];
  let i = 0;

  while (i < order.length) {
    let j = i + 1;

    while (j < order.length) {
      const a = stats[order[i]];
      const b = stats[order[j]];
      if (a.pts === b.pts && a.sg === b.sg && a.gf === b.gf) {
        j++;
      } else break;
    }

    const bloco = order.slice(i, j);

    if (bloco.length === 1) {
      finalOrder.push(bloco[0]);
    } else {
      const mini = bloco.map(id => {
        const st = stats[id];
        let pts = 0, sg = 0, gf = 0;

        for (const outro of bloco) {
          if (outro === id) continue;
          const h = st.h2h[outro];
          if (!h) continue;

          pts += h.pts;
          sg += h.gf - h.ga;
          gf += h.gf;
        }

        return { id, pts, sg, gf };
      });

      mini.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.sg !== a.sg) return b.sg - a.sg;
        if (b.gf !== a.gf) return b.gf - a.gf;
        return 0;
      });

      finalOrder.push(...mini.map(x => x.id));
    }

    i = j;
  }

  return finalOrder;
}

// Renderização da tabela
function renderTabelaGroup(groupConfig, stats, order) {
  const tbody = document.getElementById(groupConfig.tableBodyId);
  if (!tbody) return;

  tbody.innerHTML = "";

  order.forEach((teamId, index) => {
    const st = stats[teamId];
    const meta = groupConfig.teams.find(t => t.id === teamId);
    if (!meta) return;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="time-cell">
        <span class="posicao">${index + 1}º</span>
        <img src="${meta.flag}" class="flag">
        <span class="time-nome">${meta.name}</span>
      </td>
      <td>${st.pts}</td>
      <td>${st.j}</td>
      <td>${st.v}</td>
      <td>${st.e}</td>
      <td>${st.d}</td>
      <td>${st.gf}</td>
      <td>${st.gc}</td>
      <td>${st.sg}</td>
    `;

    tbody.appendChild(tr);
  });
}

// Recalcular grupo
function recalcularGrupo(groupKey) {
  const group = grupos[groupKey];
  if (!group) return;

    const stats = createEmptyStats(group.teams);
  processMatchesGroup(group, stats);
  let order = ordenarGeral(group.teams, stats);
  order = aplicarConfrontoDireto(order, stats);

  // 🔹 salva para uso pela Simulação
  classificacoes[groupKey] = { stats, order };

  renderTabelaGroup(group, stats, order);
}

function getColocado(groupKey, posicao) {
  const info = classificacoes[groupKey];
  if (!info) return null;

  const { stats, order } = info;
  if (order.length < posicao) return null;

  const teamId = order[posicao - 1];
  const st = stats[teamId];

  return {
    id: teamId,
    name: st.name,
    flag: st.flag,
    pts: st.pts,
    sg: st.sg,
    gf: st.gf,
    group: groupKey
  };
}

function getMelhoresTerceiros() {
  const terceiros = [];

  "ABCDEFGHIJKL".split("").forEach(g => {
    const t3 = getColocado(g, 3);
    if (!t3) return;
    terceiros.push(t3);
  });

  // ordena: Pts > SG > GF > Nome (A-Z)
  terceiros.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.sg  !== a.sg)  return b.sg  - a.sg;
    if (b.gf  !== a.gf)  return b.gf  - a.gf;
    return a.name.localeCompare(b.name, "pt-BR");
  });

  return terceiros.slice(0, 8);
}

function pickThirdFromPools(listaGrupos, melhoresTerceiros, usadosGrupos) {
  for (const g of listaGrupos) {
    const t = melhoresTerceiros.find(t => t.group === g);
    if (t && !usadosGrupos.has(g)) {
      usadosGrupos.add(g);
      return t;
    }
  }
  return null; // em teoria não devia acontecer
}

function montarSegundaFase() {
  const melhores3 = getMelhoresTerceiros();
  const usados3 = new Set();

  const jogo = [];

  // Jogo 1 - 1º E x 3º ABCDF
  jogo[1] = {
    id: 1,
    home: getColocado("E", 1),
    away: pickThirdFromPools(["A","B","C","D","F"], melhores3, usados3)
  };

  // Jogo 2 - 1º I x 3° CDFGH
  jogo[2] = {
    id: 2,
    home: getColocado("I", 1),
    away: pickThirdFromPools(["C","D","F","G","H"], melhores3, usados3)
  };

  // Jogo 3 - 2º A x 2º B
  jogo[3] = {
    id: 3,
    home: getColocado("A", 2),
    away: getColocado("B", 2)
  };

  // Jogo 4 - 1° F x 2° C
  jogo[4] = {
    id: 4,
    home: getColocado("F", 1),
    away: getColocado("C", 2)
  };

  // Jogo 5 - 2° K x 2° L
  jogo[5] = {
    id: 5,
    home: getColocado("K", 2),
    away: getColocado("L", 2)
  };

  // Jogo 6 - 1º H x 2° J
  jogo[6] = {
    id: 6,
    home: getColocado("H", 1),
    away: getColocado("J", 2)
  };

  // Jogo 7 - 1° D x 3° BEFIJ
  jogo[7] = {
    id: 7,
    home: getColocado("D", 1),
    away: pickThirdFromPools(["B","E","F","I","J"], melhores3, usados3)
  };

  // Jogo 8 - 1° G x 3° AEHIJ
  jogo[8] = {
    id: 8,
    home: getColocado("G", 1),
    away: pickThirdFromPools(["A","E","H","I","J"], melhores3, usados3)
  };

  // Jogo 9 - 1º C x 2° F
  jogo[9] = {
    id: 9,
    home: getColocado("C", 1),
    away: getColocado("F", 2)
  };

  // Jogo 10 -  2º E x 2º I
  jogo[10] = {
    id: 10,
    home: getColocado("E", 2),
    away: getColocado("I", 2)
  };

  // Jogo 11 - 1º A x 3º CEFHI
  jogo[11] = {
    id: 11,
    home: getColocado("A", 1),
    away: pickThirdFromPools(["C","E","F","H","I"], melhores3, usados3)
  };

  // Jogo 12 - 1º L x 3° EHIJK
  jogo[12] = {
    id: 12,
    home: getColocado("L", 1),
    away: pickThirdFromPools(["E","H","I","J","K"], melhores3, usados3)
  };

  // Jogo 13 - 1º J x 2º H
  jogo[13] = {
    id: 13,
    home: getColocado("J", 1),
    away: getColocado("H", 2)
  };

  // Jogo 14 - 2° D x 2° G
  jogo[14] = {
    id: 14,
    home: getColocado("D", 2),
    away: getColocado("G", 2)
  };

  // Jogo 15 - 1° B x 3° EFGIJ
  jogo[15] = {
    id: 15,
    home: getColocado("B", 1),
    away: pickThirdFromPools(["E","F","G","I","J"], melhores3, usados3)
  };

  // Jogo 16 - 1º K x 3° DEIJL
  jogo[16] = {
    id: 16,
    home: getColocado("K", 1),
    away: pickThirdFromPools(["D","E","I","J","L"], melhores3, usados3)
  };

  return jogo;
}


}

// Inicializar listeners de todos os inputs do grupo
function initGrupo(groupKey) {
  const config = grupos[groupKey];
  if (!config) return;

  config.matches.forEach(match => {
    const homeInput = document.querySelector(match.homeSelector);
    const awayInput = document.querySelector(match.awaySelector);

    if (!homeInput || !awayInput) return;

    const handler = () => recalcularGrupo(groupKey);

    homeInput.addEventListener("input", handler);
    awayInput.addEventListener("input", handler);
  });

  recalcularGrupo(groupKey);
}

// Inicializar todos os grupos registrados
Object.keys(grupos).forEach(initGrupo);

// ==============================
//  CARREGA TODAS AS SELEÇÕES
// ==============================
async function loadAllTeams() {
    const { data, error } = await supabase
        .from("times")
        .select("*")
        .order("nome", { ascending: true });

    if (error) {
        console.error("Erro ao carregar seleções:", error);
        return [];
    }

    return data;
}

function fillFlagDropdown(selectId, teams) {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.innerHTML = `<option value="">Selecione...</option>`;

    teams.forEach(t => {
        select.innerHTML += `
            <option value="${t.id}" data-flag="${t.flag}">
                ${t.nome}
            </option>
        `;
    });
}

function fillGroupDropdowns(teams) {
    const grupos = "ABCDEFGHIJKL".split("");

    grupos.forEach(g => {
        const timesGrupo = teams.filter(t => t.grupo_id === g);

        const s1 = document.getElementById(`extra-grupo-${g}-1`);
        const s2 = document.getElementById(`extra-grupo-${g}-2`);

        if (s1) fillFlagDropdown(`extra-grupo-${g}-1`, timesGrupo);
        if (s2) fillFlagDropdown(`extra-grupo-${g}-2`, timesGrupo);
    });
}

async function initPalpitesExtras() {
    const teams = await loadAllTeams();

    // Preenche os grupos
    fillGroupDropdowns(teams);

    // Artilheiros
    fillFlagDropdown("extra-art1-time", teams);
    fillFlagDropdown("extra-art2-time", teams);

    // Top 4
    fillFlagDropdown("extra-top-campeao", teams);
    fillFlagDropdown("extra-top-vice", teams);
    fillFlagDropdown("extra-top-terceiro", teams);
    fillFlagDropdown("extra-top-quarto", teams);

    // Mais gols / Mais sofridos
    fillFlagDropdown("extra-mais-gols", teams);
    fillFlagDropdown("extra-mais-sofridos", teams);
}







