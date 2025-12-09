// ===============================================
// CONFIGURAÇÃO DO SUPABASE
// ===============================================

// TODO: troque pelos dados do seu projeto
const SUPABASE_URL = "https://mdaqzciffsgupzbfxzgf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_5A4XlgwAjib2nde_qe5WQA_F9qCTghY";

// eslint-disable-next-line no-undef
const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// se você tiver uma coluna específica de admin no banco, pode mudar isso depois
const ADMIN_EMAILS = [
  "luizpiratafla@hotmail.com" // coloque aqui o(s) e-mail(s) de admin
];

const GRUPOS = ["A","B","C","D","E","F","G","H","I","J","K","L"];
const EXTRAS_ROW_ID = 1; // 1 único registro em extras_oficiais


// ===============================================
// 1. CONTROLE DO MENU
// ===============================================

document.querySelectorAll(".admin-menu button").forEach(btn => {
  btn.addEventListener("click", () => {

    document
      .querySelectorAll(".admin-section")
      .forEach(sec => sec.classList.remove("visible"));

    const target = btn.getAttribute("data-target");
    document.getElementById(target).classList.add("visible");
  });
});


// ===============================================
// 2. CHECK DE AUTENTICAÇÃO / ADMIN
// ===============================================

async function verificarAdmin() {
  try {
    const { data, error } = await sb.auth.getUser();

    if (error) {
      console.error("Erro ao obter usuário:", error);
      alert("Erro ao verificar login. Faça login novamente.");
      window.location.href = "index.html";
      return;
    }

    const user = data?.user;
    if (!user) {
      alert("Você precisa estar logado para acessar o admin.");
      window.location.href = "index.html";
      return;
    }

    const email = user.email?.toLowerCase() || "";

    const isAdmin = ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email);

    // Se você tiver uma tabela de usuarios com campo is_admin,
    // poderia fazer aqui um select para verificar isso em vez do array ADMIN_EMAILS.

    if (!isAdmin) {
      alert("Você não tem permissão para acessar a área de administração.");
      window.location.href = "perfil.html";
      return;
    }

    console.log("✅ Usuário admin autenticado:", email);

  } catch (err) {
    console.error("Erro inesperado em verificarAdmin:", err);
    alert("Erro inesperado. Tente novamente mais tarde.");
    window.location.href = "index.html";
  }
}


// ===============================================
// 3. CARREGAR LISTA DE JOGOS (FASE DE GRUPOS)
//    Tabelas: jogos_grupo + times
// ===============================================

async function carregarJogos() {
  const select = document.getElementById("select-jogo");
  select.innerHTML = "<option>Carregando jogos...</option>";

  try {
    // Busca jogos
    const { data: jogos, error: errJogos } = await sb
      .from("jogos_grupo")
      .select("id, grupo_id, rodada, time_casa, time_fora")
      .order("grupo_id", { ascending: true })
      .order("rodada", { ascending: true })
      .order("id", { ascending: true });

    if (errJogos) {
      console.error("Erro ao carregar jogos_grupo:", errJogos);
      select.innerHTML = "<option>Erro ao carregar jogos</option>";
      return;
    }

    // Busca nomes dos times
    const { data: times, error: errTimes } = await sb
      .from("times")
      .select("id, nome");

    const mapaTimes = {};
    if (!errTimes && times) {
      times.forEach(t => {
        mapaTimes[t.id] = t.nome;
      });
    }

    select.innerHTML = "";

    jogos.forEach(j => {
      const nomeCasa = mapaTimes[j.time_casa] || j.time_casa;
      const nomeFora = mapaTimes[j.time_fora] || j.time_fora;

      const opt = document.createElement("option");
      opt.value = j.id;
      opt.textContent = `Grupo ${j.grupo_id} • Rodada ${j.rodada} — ${nomeCasa} x ${nomeFora}`;
      select.appendChild(opt);
    });

  } catch (err) {
    console.error("Erro inesperado em carregarJogos:", err);
    select.innerHTML = "<option>Erro inesperado ao carregar jogos</option>";
  }
}


// ===============================================
// 4. SALVAR RESULTADOS OFICIAIS (resultados_oficiais)
// ===============================================

async function salvarResultadoGrupo() {
  const jogoId = Number(document.getElementById("select-jogo").value);
  const golsCasa = document.getElementById("gols-casa").value;
  const golsFora = document.getElementById("gols-fora").value;

  if (Number.isNaN(jogoId) || golsCasa === "" || golsFora === "") {
    alert("Selecione um jogo e preencha todos os gols.");
    return;
  }

  const payload = {
    jogo_id: jogoId,
    gols_casa: Number(golsCasa),
    gols_fora: Number(golsFora),
    atualizado_em: new Date().toISOString()
  };

  try {
    const { error } = await sb
      .from("resultados_oficiais")
      .upsert(payload, { onConflict: "jogo_id" });

    if (error) {
      console.error("Erro ao salvar resultado:", error);
      alert("Erro ao salvar resultado. Veja o console para detalhes.");
      return;
    }

    alert("Resultado salvo/atualizado com sucesso!");

  } catch (err) {
    console.error("Erro inesperado em salvarResultadoGrupo:", err);
    alert("Erro inesperado ao salvar resultado.");
  }
}

document
  .getElementById("btn-salvar-grupo")
  .addEventListener("click", salvarResultadoGrupo);


// ===============================================
// 5. CLASSIFICADOS / MELHORES TERCEIROS
//    Tabela: extras_oficiais (1 linha, id = EXTRAS_ROW_ID)
//    Exemplo de nomes de colunas que você pode usar:
//    grupo_a_1, grupo_a_2, grupo_a_melhor3, etc.
// ===============================================

// Gerar inputs visualmente (já estava na sua estrutura, só garantindo)
function gerarInputsClassificados() {
  const container = document.getElementById("inputs-classificados");
  container.innerHTML = "";

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

    container.appendChild(bloco);
  });
}

gerarInputsClassificados();

async function salvarClassificados() {
  const updateObj = { id: EXTRAS_ROW_ID };

  GRUPOS.forEach(g => {
    const base = g.toLowerCase(); // a, b, c...
    const primeiro = document.getElementById(`class-${g}-1`).value.trim();
    const segundo = document.getElementById(`class-${g}-2`).value.trim();
    const melhor3 = document.getElementById(`melhor3-${g}`).value.trim().toUpperCase();

    // Ex: grupo_a_1, grupo_a_2, grupo_a_melhor3
    updateObj[`grupo_${base}_1`] = primeiro || null;
    updateObj[`grupo_${base}_2`] = segundo || null;
    updateObj[`grupo_${base}_melhor3`] = melhor3 || null;
  });

  try {
    const { error } = await sb
      .from("extras_oficiais")
      .upsert(updateObj, { onConflict: "id" });

    if (error) {
      console.error("Erro ao salvar classificados:", error);
      alert("Erro ao salvar classificados. Veja o console.");
      return;
    }

    alert("Classificados salvos com sucesso!");

  } catch (err) {
    console.error("Erro inesperado em salvarClassificados:", err);
    alert("Erro inesperado ao salvar classificados.");
  }
}

document
  .getElementById("btn-salvar-classificados")
  .addEventListener("click", salvarClassificados);


// ===============================================
// 6. ARTILHARIA OFICIAL (extras_oficiais)
//    Colunas sugeridas: artilheiro1, artilheiro2
// ===============================================

async function salvarArtilharia() {
  const art1 = document.getElementById("art1").value.trim();
  const art2 = document.getElementById("art2").value.trim();

  if (!art1 || !art2) {
    alert("Preencha os dois artilheiros.");
    return;
  }

  const updateObj = {
    id: EXTRAS_ROW_ID,
    artilheiro1: art1,
    artilheiro2: art2
  };

  try {
    const { error } = await sb
      .from("extras_oficiais")
      .upsert(updateObj, { onConflict: "id" });

    if (error) {
      console.error("Erro ao salvar artilharia:", error);
      alert("Erro ao salvar artilharia. Veja o console.");
      return;
    }

    alert("Artilharia salva com sucesso!");

  } catch (err) {
    console.error("Erro inesperado em salvarArtilharia:", err);
    alert("Erro inesperado ao salvar artilharia.");
  }
}

document
  .getElementById("btn-salvar-artilharia")
  .addEventListener("click", salvarArtilharia);


// ===============================================
// 7. TOP 4 + TOTAL DE GOLS (extras_oficiais)
//    Colunas sugeridas:
//      top4_campeao, top4_vice, top4_terceiro, top4_quarto, total_gols
// ===============================================

async function salvarTop4() {
  const campeao = document.getElementById("top-campeao").value.trim();
  const vice = document.getElementById("top-vice").value.trim();
  const terceiro = document.getElementById("top-terceiro").value.trim();
  const quarto = document.getElementById("top-quarto").value.trim();
  const totalGolsStr = document.getElementById("top-total-gols").value;

  if (!campeao || !vice || !terceiro || !quarto || totalGolsStr === "") {
    alert("Preencha todos os campos de Top 4 e Total de Gols.");
    return;
  }

  const totalGols = Number(totalGolsStr);

  const updateObj = {
    id: EXTRAS_ROW_ID,
    top4_campeao: campeao,
    top4_vice: vice,
    top4_terceiro: terceiro,
    top4_quarto: quarto,
    total_gols: totalGols
  };

  try {
    const { error } = await sb
      .from("extras_oficiais")
      .upsert(updateObj, { onConflict: "id" });

    if (error) {
      console.error("Erro ao salvar Top 4:", error);
      alert("Erro ao salvar Top 4 / Gols. Veja o console.");
      return;
    }

    alert("Top 4 e Total de Gols salvos com sucesso!");

  } catch (err) {
    console.error("Erro inesperado em salvarTop4:", err);
    alert("Erro inesperado ao salvar Top 4 / Gols.");
  }
}

document
  .getElementById("btn-salvar-top4")
  .addEventListener("click", salvarTop4);


// ===============================================
// 8. CARREGAR EXTRAS EXISTENTES AO ABRIR
//    (Opcional mas útil)
// ===============================================

async function carregarExtrasExistentes() {
  try {
    const { data, error } = await sb
      .from("extras_oficiais")
      .select("*")
      .eq("id", EXTRAS_ROW_ID)
      .maybeSingle();

    if (error) {
      console.warn("Ainda não há extras_oficiais (ok na primeira vez):", error.message);
      return;
    }

    if (!data) return;

    // Preenche artilharia se existir
    if (data.artilheiro1) document.getElementById("art1").value = data.artilheiro1;
    if (data.artilheiro2) document.getElementById("art2").value = data.artilheiro2;

    // Preenche Top4 + gols, se existir
    if (data.top4_campeao) document.getElementById("top-campeao").value = data.top4_campeao;
    if (data.top4_vice) document.getElementById("top-vice").value = data.top4_vice;
    if (data.top4_terceiro) document.getElementById("top-terceiro").value = data.top4_terceiro;
    if (data.top4_quarto) document.getElementById("top-quarto").value = data.top4_quarto;
    if (typeof data.total_gols === "number") {
      document.getElementById("top-total-gols").value = data.total_gols;
    }

    // Preenche classificados
    GRUPOS.forEach(g => {
      const base = g.toLowerCase();
      const v1 = data[`grupo_${base}_1`];
      const v2 = data[`grupo_${base}_2`];
      const v3 = data[`grupo_${base}_melhor3`];

      if (v1) document.getElementById(`class-${g}-1`).value = v1;
      if (v2) document.getElementById(`class-${g}-2`).value = v2;
      if (v3) document.getElementById(`melhor3-${g}`).value = v3;
    });

  } catch (err) {
    console.error("Erro inesperado ao carregar extras existentes:", err);
  }
}


// ===============================================
// 9. MATA-MATA (placeholder para depois)
// ===============================================

console.log("⚙️ admin.js carregado. Conectando Supabase...");


// ===============================================
// 10. INICIALIZAÇÃO GERAL
// ===============================================

(async function initAdmin() {
  await verificarAdmin();
  await carregarJogos();
  await carregarExtrasExistentes();
})();
