// ==========================================================
//  PALPITES.JS
//  Motor genérico de classificação para os GRUPOS (A, B ...)
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
  tableBodyId: "grupoB-body",   // tbody já existe no seu HTML com esse id
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



// Aqui você pode ir adicionando futuramente:
// const grupoC = { ... }, grupoD, etc.

const grupos = {
  A: grupoA,
  B: grupoB
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
      h2h: {} // head-to-head
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
    if (!home.h2h[match.away]) {
      home.h2h[match.away] = { gf: 0, ga: 0, pts: 0 };
    }
    if (!away.h2h[match.home]) {
      away.h2h[match.home] = { gf: 0, ga: 0, pts: 0 };
    }

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

// Ordenação geral inicial (pontos, SG, GF)
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

// Aplica confronto direto dentro de blocos empatados
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
      } else {
        break;
      }
    }

    const grupoEmpatado = order.slice(i, j);

    if (grupoEmpatado.length === 1) {
      finalOrder.push(grupoEmpatado[0]);
    } else {
      const mini = grupoEmpatado.map(id => {
        const st = stats[id];
        let pts = 0;
        let sg = 0;
        let gf = 0;

        for (const outroId of grupoEmpatado) {
          if (outroId === id) continue;
          const h = st.h2h[outroId];
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
        return grupoEmpatado.indexOf(a.id) - grupoEmpatado.indexOf(b.id);
      });

      finalOrder.push(...mini.map(m => m.id));
    }

    i = j;
  }

  return finalOrder;
}

// Renderiza a tabela de um grupo específico
function renderTabelaGroup(groupConfig, stats, order) {
  const tbody = document.getElementById(groupConfig.tableBodyId);
  if (!tbody) return;

  tbody.innerHTML = "";

  order.forEach((teamId, index) => {
    const st = stats[teamId];
    const meta = groupConfig.teams.find(t => t.id === teamId);
    if (!meta) return;

    const pos = index + 1;

    const tr = document.createElement("tr");

    const tdTeam = document.createElement("td");
    tdTeam.className = "time-cell";
    tdTeam.innerHTML = `
      <span class="posicao">${pos}º</span>
      <img src="${meta.flag}" class="flag" alt="${meta.name}">
      <span class="time-nome">${meta.name}</span>
    `;

    const tdP  = document.createElement("td");
    const tdJ  = document.createElement("td");
    const tdV  = document.createElement("td");
    const tdE  = document.createElement("td");
    const tdD  = document.createElement("td");
    const tdGF = document.createElement("td");
    const tdGC = document.createElement("td");
    const tdSG = document.createElement("td");

    tdP.textContent  = st.pts;
    tdJ.textContent  = st.j;
    tdV.textContent  = st.v;
    tdE.textContent  = st.e;
    tdD.textContent  = st.d;
    tdGF.textContent = st.gf;
    tdGC.textContent = st.gc;
    tdSG.textContent = st.sg;

    tr.appendChild(tdTeam);
    tr.appendChild(tdP);
    tr.appendChild(tdJ);
    tr.appendChild(tdV);
    tr.appendChild(tdE);
    tr.appendChild(tdD);
    tr.appendChild(tdGF);
    tr.appendChild(tdGC);
    tr.appendChild(tdSG);

    tbody.appendChild(tr);
  });
}

// Recalcula completamente um grupo
function recalcularGrupo(groupKey) {
  const groupConfig = grupos[groupKey];
  if (!groupConfig) return;

  const stats = createEmptyStats(groupConfig.teams);
  processMatchesGroup(groupConfig, stats);

  let order = ordenarGeral(groupConfig.teams, stats);
  order = aplicarConfrontoDireto(order, stats);

  renderTabelaGroup(groupConfig, stats, order);
}

// Inicializa listeners de um grupo
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

  // recalcular inicial
  recalcularGrupo(groupKey);
}

// Inicializar todos os grupos configurados (A, B, ...)
Object.keys(grupos).forEach(initGrupo);
