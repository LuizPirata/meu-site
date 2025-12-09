// ===============================================
// 🔧 CONFIGURAÇÃO DO SUPABASE
// ===============================================

// ALTERE PARA SUA CONFIG
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
// 3. CARREGAR JOGOS
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
// 4. SALVAR RESULTADO DO GRUPO
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
    const base = g.toLowerCase();

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

    updateObj[`real_grupo_${base}_1`] = document.getElementById(`class-${g}-1`).value.trim() || null;
    updateObj[`real_grupo_${base}_2`] = document.getElementById(`class-${g}-2`).value.trim() || null;

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
// 7. ARTILHARIA — TIMES
// ===============================================

async function carregarTimesArtilharia() {
  const { data } = await sb
    .from("times")
    .select("id, nome, flag");

  const sel = document.getElementById("select-time-art");
  sel.innerHTML = "";

  data.forEach(t => {
    const opt = document.createElement("option");
    opt.value = JSON.stringify({id: t.id, flag: t.flag});
    opt.textContent = t.nome;
    sel.appendChild(opt);
  });
}


// ===============================================
// 8. ADICIONAR JOGADOR
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
  // pega gols atuais
  const { data } = await sb
    .from("artilharia_oficial")
    .select("gols")
    .eq("id", id)
    .maybeSingle();

  if (!data) return;

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
// 11. CARREGAR LISTA ORDENADA + MEDALHAS
// ===============================================

async function carregarListaArtilheiros() {
  const { data } = await sb
    .from("artilharia_oficial")
    .select("*")
    .order("gols", { ascending: false });

  const div = document.getElementById("lista-artilheiros");
  div.innerHTML = "";

  data.forEach((item, index) => {
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
// 12. SALVAR TOP 4
// ===============================================

async function salvarTop4() {
  const updateObj = {
    id: EXTRAS_ID,
    campeao: document.getElementById("top-campeao").value.trim() || null,
    vice: document.getElementById("top-vice").value.trim() || null,
    terceiro: document.getElementById("top-terceiro").value.trim() || null,
    quarto: document.getElementById("top-quarto").value.trim() || null,
    total_gols: Number(document.getElementById("top-total-gols").value) || 0
  };

  await sb.from("extras_oficiais").upsert(updateObj);
  alert("Top 4 salvo!");
}

document.getElementById("btn-salvar-top4")
  .addEventListener("click", salvarTop4);


// ===============================================
// 13. CARREGAR EXTRAS
// ===============================================

async function carregarExtrasExistentes() {
  const { data } = await sb
    .from("extras_oficiais")
    .select("*")
    .eq("id", EXTRAS_ID)
    .maybeSingle();

  if (!data) return;

  GRUPOS.forEach(g => {
    const base = g.toLowerCase();
    document.getElementById(`class-${g}-1`).value = data[`real_grupo_${base}_1`] || "";
    document.getElementById(`class-${g}-2`).value = data[`real_grupo_${base}_2`] || "";
    document.getElementById(`melhor3-${g}`).value = data[`melhor_3${base}`] ? "S" : "N";
  });

  if (data.campeao) document.getElementById("top-campeao").value = data.campeao;
  if (data.vice) document.getElementById("top-vice").value = data.vice;
  if (data.terceiro) document.getElementById("top-terceiro").value = data.terceiro;
  if (data.quarto) document.getElementById("top-quarto").value = data.quarto;

  if (typeof data.total_gols === "number")
    document.getElementById("top-total-gols").value = data.total_gols;
}


// ===============================================
// 14. INICIALIZAÇÃO
// ===============================================

(async function init() {
  await verificarAdmin();
  await carregarJogos();
  await carregarTimesArtilharia();
  await carregarListaArtilheiros();
  await carregarExtrasExistentes();
})();
