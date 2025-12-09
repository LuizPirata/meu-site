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

// Sua tabela usa PK = boolean true
const EXTRAS_ID = true;

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
// 3. CARREGAR JOGOS DA FASE DE GRUPOS
// ===============================================

async function carregarJogos() {
  const select = document.getElementById("select-jogo");
  select.innerHTML = "<option>Carregando...</option>";

  const { data: jogos, error } = await sb
    .from("jogos_grupo")
    .select("id, grupo_id, rodada, time_casa, time_fora")
    .order("grupo_id", { ascending: true })
    .order("rodada", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("Erro ao carregar jogos:", error);
    select.innerHTML = "<option>Erro</option>";
    return;
  }

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
// 4. SALVAR RESULTADO OFICIAL DO JOGO
// ===============================================

async function salvarResultadoGrupo() {
  const jogoId = Number(document.getElementById("select-jogo").value);
  const golsCasa = document.getElementById("gols-casa").value;
  const golsFora = document.getElementById("gols-fora").value;

  if (Number.isNaN(jogoId) || golsCasa === "" || golsFora === "") {
    alert("Preencha todos os campos do resultado.");
    return;
  }

  const payload = {
    jogo_id: jogoId,
    gols_casa: Number(golsCasa),
    gols_fora: Number(golsFora),
    atualizado_em: new Date().toISOString()
  };

  const { error } = await sb
    .from("resultados_oficiais")
    .upsert(payload, { onConflict: "jogo_id" });

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
// 5. GERAR INPUTS DE CLASSIFICADOS
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
// 6. SALVAR CLASSIFICADOS + MELHORES TERCEIROS
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
    updateObj[`melhor_3${base}`] = melhor3 === "S" ? true : false;
  });

  const { error } = await sb
    .from("extras_oficiais")
    .upsert(updateObj);

  if (error) {
    console.error(error);
    alert("Erro ao salvar classificados.");
    return;
  }

  alert("Classificados salvos!");
}

document.getElementById("btn-salvar-classificados")
  .addEventListener("click", salvarClassificados);


// ===============================================
// 7. ARTILHARIA — TIMES, ADICIONAR JOGADOR, ALTERAR GOLS
// ===============================================

// Carregar seleções no dropdown
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
    opt.value = JSON.stringify({id: t.id, flag: t.flag});
    opt.textContent = t.nome;
    sel.appendChild(opt);
  });
}


// Adicionar jogador novo
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


// Atualizar lista de artilheiros na tela
async function carregarListaArtilheiros() {
  const { data, error } = await sb
    .from("artilharia_oficial")
    .select("*")
    .order("gols", { ascending: false });

  if (error) {
    console.error("Erro lista artilheiros:", error);
    return;
  }

  const div = document.getElementById("lista-artilheiros");
  div.innerHTML = "";

  data.forEach((item, index) => {
    const bloco = document.createElement("div");
    bloco.classList.add("artilheiro-item");

    // Medalhas e posição
    let posicaoHTML = "";
    if (index === 0) posicaoHTML = `<span class="medal medal-ouro">🥇</span>`;
    else if (index === 1) posicaoHTML = `<span class="medal medal-prata">🥈</span>`;
    else if (index === 2) posicaoHTML = `<span class="medal medal-bronze">🥉</span>`;
    else posicaoHTML = `<span class="posicao-num">${index + 1}º</span>`;

    bloco.innerHTML = `
  <img class="artilheiro-flag" src="${item.flag}" alt="flag">

  <div class="artilheiro-nome">${item.jogador}</div>

  <div class="artilheiro-gols">${item.gols} gols</div>

  <button class="btn-gol mais" onclick="alterarGols('${item.id}', 1)">+1</button>
  <button class="btn-gol menos" onclick="alterarGols('${item.id}', -1)">-1</button>

  <button class="btn-remove" onclick="removerJogador('${item.id}')">Remover</button>
`;


    div.appendChild(bloco);
});

}


// Função que soma ou subtrai gols
async function alterarGols(id, valor) {
  const { data, error: erroBusca } = await sb
    .from("artilharia_oficial")
    .select("gols")
    .eq("id", id)
    .single();

  if (erroBusca) {
    console.error(erroBusca);
    alert("Erro ao buscar gols.");
    return;
  }

  let golsAtuais = Number(data.gols);
  let novoTotal = golsAtuais + valor;

  if (novoTotal < 0) novoTotal = 0;

  const { error } = await sb
    .from("artilharia_oficial")
    .update({ gols: novoTotal })
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Erro ao atualizar gols.");
    return;
  }

 async function removerJogador(id) {
  if (!confirm("Tem certeza que deseja remover este jogador?")) return;

  const { error } = await sb
    .from("artilharia_oficial")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Erro ao remover jogador.");
    return;
  }

  carregarListaArtilheiros();
}



// Inicialização da artilharia
(async function initArtilharia() {
  await carregarTimesArtilharia();
  await carregarListaArtilheiros();
})();


// ===============================================
// 8. SALVAR TOP 4 + TOTAL DE GOLS
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

  const { error } = await sb
    .from("extras_oficiais")
    .upsert(updateObj);

  if (error) {
    console.error(error);
    alert("Erro ao salvar Top 4.");
    return;
  }

  alert("Top 4 salvo!");
}

document.getElementById("btn-salvar-top4")
  .addEventListener("click", salvarTop4);


// ===============================================
// 9. CARREGAR EXTRAS EXISTENTES
// ===============================================

async function carregarExtrasExistentes() {
  const { data, error } = await sb
    .from("extras_oficiais")
    .select("*")
    .eq("id", EXTRAS_ID)
    .maybeSingle();

  if (error || !data) return;

  GRUPOS.forEach(g => {
    const base = g.toLowerCase();

    document.getElementById(`class-${g}-1`).value =
      data[`real_grupo_${base}_1`] || "";

    document.getElementById(`class-${g}-2`).value =
      data[`real_grupo_${base}_2`] || "";

    document.getElementById(`melhor3-${g}`).value =
      data[`melhor_3${base}`] ? "S" : "N";
  });

  if (data.campeao) document.getElementById("top-campeao").value = data.campeao;
  if (data.vice) document.getElementById("top-vice").value = data.vice;
  if (data.terceiro) document.getElementById("top-terceiro").value = data.terceiro;
  if (data.quarto) document.getElementById("top-quarto").value = data.quarto;

  if (typeof data.total_gols === "number")
    document.getElementById("top-total-gols").value = data.total_gols;
}


// ===============================================
// 10. INICIALIZAÇÃO GERAL
// ===============================================

(async function init() {
  await verificarAdmin();
  await carregarJogos();
  await carregarExtrasExistentes();
})();
