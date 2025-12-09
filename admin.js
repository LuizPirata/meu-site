// ===============================================
// 🔧 CONFIGURAÇÃO DO SUPABASE
// ===============================================

const SUPABASE_URL = "https://mdaqzciffsgupzbfxzgf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_5A4XlgwAjib2nde_qe5WQA_F9qCTghY";

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Admins permitidos
const ADMIN_EMAILS = ["luizpiratafla@hotmail.com"];

// extras_oficiais usa PK booleana
const EXTRAS_ID = true;

// Lista de grupos
const GRUPOS = ["A","B","C","D","E","F","G","H","I","J","K","L"];


// ===============================================
// 1. CONTROLE DO MENU
// ===============================================

document.querySelectorAll(".admin-menu button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".admin-section")
      .forEach(sec => sec.classList.remove("visible"));

    const alvo = btn.getAttribute("data-target");
    document.getElementById(alvo).classList.add("visible");
  });
});


// ===============================================
// 2. VERIFICAÇÃO DE ADMIN
// ===============================================

async function verificarAdmin() {
  const { data, error } = await sb.auth.getUser();

  if (error || !data?.user) {
    alert("Faça login novamente.");
    window.location.href = "index.html";
    return;
  }

  const email = data.user.email.toLowerCase();
  const permitido = ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email);

  if (!permitido) {
    alert("Acesso negado. Você não é admin.");
    window.location.href = "perfil.html";
    return;
  }

  console.log("✔ Admin autenticado:", email);
}


// ===============================================
// 3. CARREGAR JOGOS (FASE DE GRUPOS)
// ===============================================

async function carregarJogos() {
  const select = document.getElementById("select-jogo");
  select.innerHTML = "<option>Carregando...</option>";

  const { data: jogos } = await sb
    .from("jogos_grupo")
    .select("id, grupo_id, rodada, time_casa, time_fora")
    .order("grupo_id")
    .order("rodada")
    .order("id");

  const { data: times } = await sb
    .from("times")
    .select("id, nome");

  const mapaTimes = {};
  (times || []).forEach(t => mapaTimes[t.id] = t.nome);

  select.innerHTML = "";

  jogos.forEach(j => {
    const opt = document.createElement("option");
    opt.value = j.id;
    const casa = mapaTimes[j.time_casa] || j.time_casa;
    const fora = mapaTimes[j.time_fora] || j.time_fora;
    opt.textContent = `Grupo ${j.grupo_id} • Rodada ${j.rodada} — ${casa} x ${fora}`;
    select.appendChild(opt);
  });
}


// ===============================================
// 4. SALVAR RESULTADO DA FASE DE GRUPOS
// ===============================================

async function salvarResultadoGrupo() {
  const jogoId = Number(document.getElementById("select-jogo").value);
  const golsCasa = document.getElementById("gols-casa").value;
  const golsFora = document.getElementById("gols-fora").value;

  if (Number.isNaN(jogoId) || golsCasa === "" || golsFora === "") {
    alert("Preencha todos os campos!");
    return;
  }

  const { error } = await sb
    .from("resultados_oficiais")
    .upsert({
      jogo_id: jogoId,
      gols_casa: Number(golsCasa),
      gols_fora: Number(golsFora),
      atualizado_em: new Date().toISOString()
    }, { onConflict: "jogo_id" });

  if (error) {
    console.error(error);
    alert("Erro ao salvar.");
    return;
  }

  alert("Resultado salvo com sucesso!");
}

document.getElementById("btn-salvar-grupo")
  .addEventListener("click", salvarResultadoGrupo);


// ===============================================
// 5. INPUTS CLASSIFICADOS
// ===============================================

function gerarInputsClassificados() {
  const div = document.getElementById("inputs-classificados");
  div.innerHTML = "";

  GRUPOS.forEach(g => {
    const bloco = document.createElement("div");
    bloco.style.marginBottom = "20px";

    bloco.innerHTML = `
      <h3 style="color:#ff7b00;">Grupo ${g}</h3>

      <label>1º Lugar:</label>
      <input type="text" id="class-${g}-1">

      <label>2º Lugar:</label>
      <input type="text" id="class-${g}-2">

      <label>Melhor 3º? (S/N):</label>
      <input type="text" id="melhor3-${g}">
    `;

    div.appendChild(bloco);
  });
}

gerarInputsClassificados();


// ===============================================
// 6. SALVAR CLASSIFICADOS
// ===============================================

async function salvarClassificados() {
  const updateObj = { id: EXTRAS_ID };

  GRUPOS.forEach(g => {
    const base = g.toLowerCase();

    updateObj[`real_grupo_${base}_1`] =
      document.getElementById(`class-${g}-1`).value.trim() || null;

    updateObj[`real_grupo_${base}_2`] =
      document.getElementById(`class-${g}-2`).value.trim() || null;

    const melhor3 = document.getElementById(`melhor3-${g}`).value.trim().toUpperCase();
    updateObj[`melhor_3${base}`] = melhor3 === "S";
  });

  const { error } = await sb
    .from("extras_oficiais")
    .upsert(updateObj);

  if (error) {
    console.error(error);
    alert("Erro ao salvar.");
    return;
  }

  alert("Classificados salvos!");
}

document.getElementById("btn-salvar-classificados")
  .addEventListener("click", salvarClassificados);

// ===============================================
// 7. ARTILHARIA — CARREGAR TIMES
// ===============================================

async function carregarTimesArtilharia() {
  const { data, error } = await sb
    .from("times")
    .select("id, nome, flag");

  if (error) {
    console.error("Erro ao carregar times:", error);
    return;
  }

  const sel = document.getElementById("select-time-art");
  sel.innerHTML = "";

  data.forEach(t => {
    const opt = document.createElement("option");
    opt.value = JSON.stringify({ id: t.id, flag: t.flag });
    opt.textContent = t.nome;
    sel.appendChild(opt);
  });
}


// ===============================================
// 8. ADICIONAR JOGADOR DE ARTILHARIA
// ===============================================

async function adicionarJogador() {
  const selectData = JSON.parse(document.getElementById("select-time-art").value);
  const jogador = document.getElementById("input-jogador").value.trim();

  if (!jogador) {
    alert("Digite o nome do jogador.");
    return;
  }

  const novo = {
    id: crypto.randomUUID(),
    time_id: selectData.id,
    jogador: jogador,
    gols: 0,
    flag: selectData.flag
  };

  const { error } = await sb
    .from("artilharia_oficial")
    .insert(novo);

  if (error) {
    console.error(error);
    alert("Erro ao adicionar jogador.");
    return;
  }

  document.getElementById("input-jogador").value = "";
  carregarListaArtilheiros();
}

document.getElementById("btn-add-jogador")
  .addEventListener("click", adicionarJogador);


// ===============================================
// 9. ALTERAR GOLS (+1 / -1)
// ===============================================

async function alterarGols(id, valor) {
  const { data, error } = await sb
    .from("artilharia_oficial")
    .select("gols")
    .eq("id", id)
    .maybeSingle();

  if (!data || error) return;

  let novoValor = data.gols + valor;
  if (novoValor < 0) novoValor = 0;

  await sb
    .from("artilharia_oficial")
    .update({ gols: novoValor })
    .eq("id", id);

  carregarListaArtilheiros();
}


// ===============================================
// 10. REMOVER JOGADOR
// ===============================================

async function removerJogador(id) {
  if (!confirm("Tem certeza que deseja remover este jogador?")) return;

  await sb
    .from("artilharia_oficial")
    .delete()
    .eq("id", id);

  carregarListaArtilheiros();
}


// ===============================================
// 11. LISTAGEM ORDENADA + MEDALHAS + BOTÕES
// ===============================================

async function carregarListaArtilheiros() {
  const { data, error } = await sb
    .from("artilharia_oficial")
    .select("*")
    .order("gols", { ascending: false });

  if (error) {
    console.error("Erro ao carregar artilharia:", error);
    return;
  }

  const div = document.getElementById("lista-artilheiros");
  div.innerHTML = "";

  data.forEach((item, index) => {
    // MEDALHAS E POSIÇÕES
    let medalha = "";
    if (index === 0) medalha = `<span class="pos-badge">🥇</span>`;
    else if (index === 1) medalha = `<span class="pos-badge">🥈</span>`;
    else if (index === 2) medalha = `<span class="pos-badge">🥉</span>`;
    else medalha = `<span class="pos-badge pos-num">${index + 1}º</span>`;

    const bloco = document.createElement("div");
    bloco.classList.add("artilheiro-item");

    bloco.innerHTML = `
      ${medalha}

      <img class="artilheiro-flag" src="${item.flag}" alt="flag">

      <div class="nome-container">${item.jogador}</div>

      <div class="artilheiro-gols">${item.gols} gols</div>

      <button class="btn-gol mais" onclick="alterarGols('${item.id}', 1)">+1</button>
      <button class="btn-gol menos" onclick="alterarGols('${item.id}', -1)">-1</button>

      <button class="btn-remove" onclick="removerJogador('${item.id}')">Remover</button>
    `;

    div.appendChild(bloco);
  });
}

// ===============================================
//  🔥 MATA-MATA — CONSTANTES
// ===============================================

const FASES_MATA = [
  "Segunda Fase",
  "Oitavas",
  "Quartas",
  "Semi",
  "Final",
  "Disputa de 3º e 4º"
];

const JOGOS_POR_FASE = {
  "Segunda Fase": 16,
  "Oitavas": 8,
  "Quartas": 4,
  "Semi": 2,
  "Final": 1,
  "Disputa de 3º e 4º": 1
};

// Cache em memória
let MAPA_TIMES = {};      
let JOGOS_MATA = [];      
let RESULTADOS_MATA = {};


// ===============================================
//  1. CARREGAR TIMES (COMPARTILHADO COM ARTILHARIA)
// ===============================================

async function carregarTimesArtilharia() {
  const { data, error } = await sb
    .from("times")
    .select("id, nome, flag");

  if (error) {
    console.error("Erro ao carregar times:", error);
    return;
  }

  // Armazena no mapa global (útil para MATA-MATA também)
  MAPA_TIMES = {};
  data.forEach(t => {
    MAPA_TIMES[t.id] = t;
  });

  const sel = document.getElementById("select-time-art");
  sel.innerHTML = "";

  data.forEach(t => {
    const opt = document.createElement("option");
    opt.value = JSON.stringify({ id: t.id, flag: t.flag });
    opt.textContent = t.nome;
    sel.appendChild(opt);
  });
}


// ===============================================
//  2. GARANTIR ESTRUTURA DO MATA-MATA
// ===============================================

async function carregarEstruturaMataMata() {
  // Buscar jogos existentes
  const { data, error } = await sb
    .from("mata_mata_oficial")
    .select("id, fase, jogo_no, time1, time2, data, horario, local");

  if (error) {
    console.error("Erro ao carregar mata_mata_oficial:", error);
    return;
  }

  const existentes = new Set();
  (data || []).forEach(j => {
    existentes.add(`${j.fase}#${j.jogo_no}`);
  });

  // Criar registros faltantes
  const inserir = [];
  FASES_MATA.forEach(fase => {
    const total = JOGOS_POR_FASE[fase];
    for (let j = 1; j <= total; j++) {
      const chave = `${fase}#${j}`;
      if (!existentes.has(chave)) {
        inserir.push({
          fase,
          jogo_no: j
        });
      }
    }
  });

  if (inserir.length > 0) {
    const { error: errIns } = await sb
      .from("mata_mata_oficial")
      .insert(inserir);

    if (errIns) {
      console.error("Erro ao inserir jogos faltantes:", errIns);
    }
  }

  // Recarregar tudo já com estrutura garantida
  const { data: todos } = await sb
    .from("mata_mata_oficial")
    .select("id, fase, jogo_no, time1, time2, data, horario, local")
    .order("fase", { ascending: true })
    .order("jogo_no", { ascending: true });

  JOGOS_MATA = todos || [];

  // Carregar resultados existentes
  await carregarResultadosMata();

  // Renderizar bracket
  renderizarMataMata();
}


// ===============================================
//  3. CARREGAR RESULTADOS DO MATA-MATA
// ===============================================

async function carregarResultadosMata() {
  const { data, error } = await sb
    .from("mata_mata_resultados")
    .select("id, jogo_id, gol_casa, gol_fora, vencedor");

  if (error) {
    console.error("Erro resultados:", error);
    return;
  }

  RESULTADOS_MATA = {};
  (data || []).forEach(r => {
    RESULTADOS_MATA[r.jogo_id] = r;
  });
}


// ===============================================
//  4. FUNÇÕES AUXILIARES
// ===============================================

function encontrarJogo(fase, jogoNo) {
  return JOGOS_MATA.find(j => j.fase === fase && j.jogo_no === jogoNo);
}

function encontrarJogoPorId(id) {
  return JOGOS_MATA.find(j => j.id === id);
}

function montarOptionsTimes(selecionadoId) {
  let html = `<option value="">Selecione...</option>`;
  Object.values(MAPA_TIMES).forEach(t => {
    const sel = (t.id === selecionadoId) ? "selected" : "";
    html += `<option value="${t.id}" ${sel}>${t.nome}</option>`;
  });
  return html;
}


// ===============================================
//  5. RENDERIZAÇÃO COMPLETA DO BRACKET
// ===============================================

function renderizarMataMata() {
  // Segunda Fase — 16 jogos: 1–8 esquerda, 9–16 direita
  renderColunaMata("mm-segunda-left",  "Segunda Fase", [1,2,3,4,5,6,7,8]);
  renderColunaMata("mm-segunda-right", "Segunda Fase", [9,10,11,12,13,14,15,16]);

  // Oitavas — 8 jogos
  renderColunaMata("mm-oitavas-left",  "Oitavas", [1,2,3,4]);
  renderColunaMata("mm-oitavas-right", "Oitavas", [5,6,7,8]);

  // Quartas — 4 jogos
  renderColunaMata("mm-quartas-left",  "Quartas", [1,2]);
  renderColunaMata("mm-quartas-right", "Quartas", [3,4]);

  // Semi — 2 jogos
  renderColunaMata("mm-semi-left",  "Semi", [1]);
  renderColunaMata("mm-semi-right", "Semi", [2]);

  // Final
  renderColunaMata("mm-final", "Final", [1]);

  // Disputa de 3º e 4º
  renderColunaMata("mm-terceiro", "Disputa de 3º e 4º", [1]);
}


// ===============================================
//  6. RENDERIZAR COLUNA INDIVIDUAL
// ===============================================

function renderColunaMata(containerId, fase, listaJogos) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  listaJogos.forEach(num => {
    const jogo = encontrarJogo(fase, num);
    if (!jogo) return;

    const bloco = document.createElement("div");
    bloco.classList.add("mm-match");

    const res = RESULTADOS_MATA[jogo.id] || {};

    const time1 = jogo.time1 ? MAPA_TIMES[jogo.time1] : null;
    const time2 = jogo.time2 ? MAPA_TIMES[jogo.time2] : null;

    const g1 = typeof res.gol_casa === "number" ? res.gol_casa : "";
    const g2 = typeof res.gol_fora === "number" ? res.gol_fora : "";

    const ehSegundaFase = (fase === "Segunda Fase");

    let htmlTime1 = "";
    let htmlTime2 = "";

    if (ehSegundaFase) {
      // selects
      htmlTime1 = `
        <select id="mm-t1-${jogo.id}" class="mm-time-select">
          ${montarOptionsTimes(jogo.time1)}
        </select>
      `;
      htmlTime2 = `
        <select id="mm-t2-${jogo.id}" class="mm-time-select">
          ${montarOptionsTimes(jogo.time2)}
        </select>
      `;
    } else {
      // exibir bandeiras + nomes
      htmlTime1 = `
        <div class="mm-team-info">
          ${time1 ? `<img class="mm-flag" src="${time1.flag}">
                     <span class="mm-team-name">${time1.nome}</span>`
                  : `<span class="mm-team-name">—</span>`}
        </div>
      `;
      htmlTime2 = `
        <div class="mm-team-info">
          ${time2 ? `<img class="mm-flag" src="${time2.flag}">
                     <span class="mm-team-name">${time2.nome}</span>`
                  : `<span class="mm-team-name">—</span>`}
        </div>
      `;
    }

    bloco.innerHTML = `
      <div class="mm-team-row">
        ${htmlTime1}
        <input type="number" id="mm-g1-${jogo.id}" class="mm-gol-input" value="${g1}">
      </div>

      <div class="mm-team-row">
        ${htmlTime2}
        <input type="number" id="mm-g2-${jogo.id}" class="mm-gol-input" value="${g2}">
      </div>

      <button class="btn-save mm-save-btn" onclick="salvarResultadoMata('${jogo.id}')">
        Salvar Jogo ${jogo.jogo_no}
      </button>
    `;

    container.appendChild(bloco);
  });
}


// ===============================================
//  7. SALVAR RESULTADO DO JOGO + AVANÇO AUTOMÁTICO
// ===============================================

async function salvarResultadoMata(jogoId) {
  const jogo = encontrarJogoPorId(jogoId);
  if (!jogo) return;

  // Se for Segunda Fase: salvar times escolhidos
  if (jogo.fase === "Segunda Fase") {
    const sel1 = document.getElementById(`mm-t1-${jogoId}`);
    const sel2 = document.getElementById(`mm-t2-${jogoId}`);

    const time1 = sel1.value || null;
    const time2 = sel2.value || null;

    if (!time1 || !time2) {
      alert("Selecione os dois times.");
      return;
    }

    const { error } = await sb
      .from("mata_mata_oficial")
      .update({ time1, time2 })
      .eq("id", jogoId);

    if (error) {
      console.error(error);
      alert("Erro ao salvar times.");
      return;
    }

    jogo.time1 = time1;
    jogo.time2 = time2;
  }

  const g1 = Number(document.getElementById(`mm-g1-${jogoId}`).value);
  const g2 = Number(document.getElementById(`mm-g2-${jogoId}`).value);

  if (Number.isNaN(g1) || Number.isNaN(g2)) {
    alert("Preencha gols.");
    return;
  }

  if (g1 === g2) {
    alert("Não pode empate. Mata-mata precisa de vencedor.");
    return;
  }

  if (!jogo.time1 || !jogo.time2) {
    alert("O jogo precisa ter duas equipes.");
    return;
  }

  const vencedor = g1 > g2 ? jogo.time1 : jogo.time2;
  const perdedor = g1 > g2 ? jogo.time2 : jogo.time1;

  // Salvar resultado
  const existente = RESULTADOS_MATA[jogoId];
  if (existente) {
    const { error } = await sb
      .from("mata_mata_resultados")
      .update({
        gol_casa: g1,
        gol_fora: g2,
        vencedor,
        updated_at: new Date().toISOString()
      })
      .eq("id", existente.id);

    if (error) {
      console.error(error);
      alert("Erro ao atualizar.");
      return;
    }

    existente.gol_casa = g1;
    existente.gol_fora = g2;
    existente.vencedor = vencedor;

  } else {
    const { data: novoRes, error } = await sb
      .from("mata_mata_resultados")
      .insert({
        jogo_id: jogoId,
        gol_casa: g1,
        gol_fora: g2,
        vencedor,
        updated_at: new Date().toISOString()
      })
      .select("id, gol_casa, gol_fora, vencedor")
      .maybeSingle();

    if (error) {
      console.error(error);
      alert("Erro ao salvar resultado.");
      return;
    }

    RESULTADOS_MATA[jogoId] = novoRes;
  }

  // Avançar vencedor para próxima fase
  await avancarVencedor(jogo, vencedor);

  // Atualizar disputa de 3º lugar
  if (jogo.fase === "Semi") {
    await atualizarTerceiroLugar();
  }

  alert("Resultado salvo!");
  renderizarMataMata();
}


// ===============================================
//  8. DEFINIR PARA ONDE O VENCEDOR VAI
// ===============================================

function obterDestinoProximaFase(fase, jogoNo) {
  if (fase === "Segunda Fase") {
    const idx = jogoNo - 1;
    const oit = Math.floor(idx / 2) + 1;
    const campo = (idx % 2 === 0) ? "time1" : "time2";
    return { fase: "Oitavas", jogo_no: oit, campo };
  }

  if (fase === "Oitavas") {
    const idx = jogoNo - 1;
    const quartas = Math.floor(idx / 2) + 1;
    const campo = (idx % 2 === 0) ? "time1" : "time2";
    return { fase: "Quartas", jogo_no: quartas, campo };
  }

  if (fase === "Quartas") {
    const idx = jogoNo - 1;
    const semi = Math.floor(idx / 2) + 1;
    const campo = (idx % 2 === 0) ? "time1" : "time2";
    return { fase: "Semi", jogo_no: semi, campo };
  }

  if (fase === "Semi") {
    const campo = jogoNo === 1 ? "time1" : "time2";
    return { fase: "Final", jogo_no: 1, campo };
  }

  return null;
}


// ===============================================
//  9. AVANÇAR VENCEDOR PARA A PRÓXIMA FASE
// ===============================================

async function avancarVencedor(jogoAtual, vencedorId) {
  const dest = obterDestinoProximaFase(jogoAtual.fase, jogoAtual.jogo_no);
  if (!dest) return;

  const destino = encontrarJogo(dest.fase, dest.jogo_no);
  if (!destino) return;

  const updatePayload = {};
  updatePayload[dest.campo] = vencedorId;

  const { error } = await sb
    .from("mata_mata_oficial")
    .update(updatePayload)
    .eq("id", destino.id);

  if (error) {
    console.error("Erro ao avançar vencedor:", error);
    return;
  }

  destino[dest.campo] = vencedorId;
}


// ===============================================
//  10. DISPUTA DE 3º E 4º
// ===============================================

async function atualizarTerceiroLugar() {
  const semi1 = encontrarJogo("Semi", 1);
  const semi2 = encontrarJogo("Semi", 2);

  if (!semi1 || !semi2) return;

  const r1 = RESULTADOS_MATA[semi1.id];
  const r2 = RESULTADOS_MATA[semi2.id];

  if (!r1 || !r2) return;

  const p1 = r1.gol_casa > r1.gol_fora ? semi1.time2 : semi1.time1;
  const p2 = r2.gol_casa > r2.gol_fora ? semi2.time2 : semi2.time1;

  const terceiro = encontrarJogo("Disputa de 3º e 4º", 1);
  if (!terceiro) return;

  const { error } = await sb
    .from("mata_mata_oficial")
    .update({ time1: p1, time2: p2 })
    .eq("id", terceiro.id);

  if (error) {
    console.error("Erro ao definir disputa de 3º:", error);
    return;
  }

  terceiro.time1 = p1;
  terceiro.time2 = p2;
}

// ===============================================
// 14. INICIALIZAÇÃO GERAL DO ADMIN
// ===============================================

(async function init() {
  console.log("🔄 Inicializando painel admin...");

  await verificarAdmin();            // confirmação do admin
  await carregarJogos();             // fase de grupos
  await carregarExtrasExistentes();  // extras oficiais

  await carregarTimesArtilharia();   // times para artilharia
  await carregarListaArtilheiros();  // ranking de artilheiros

  await carregarEstruturaMataMata(); // 🔥 carrega tudo do mata-mata e renderiza bracket

  console.log("✅ Painel admin carregado completamente!");
})();

