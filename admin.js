// ===============================================
// 1. CONTROLE DO MENU
// ===============================================

document.querySelectorAll(".admin-menu button").forEach(btn => {
    btn.addEventListener("click", () => {

        // Remove visible de todas
        document.querySelectorAll(".admin-section")
            .forEach(sec => sec.classList.remove("visible"));

        // Adiciona na seção clicada
        const target = btn.getAttribute("data-target");
        document.getElementById(target).classList.add("visible");
    });
});


// ===============================================
// 2. CARREGAR LISTA DE JOGOS (Fase de Grupos)
// ===============================================

// Simulação — depois ligamos ao Supabase
const jogosFaseGrupos = [
    { id: 1, nome: "Grupo A — Rodada 1 — MEX x USA" },
    { id: 2, nome: "Grupo A — Rodada 1 — BRA x ARG" },
    { id: 3, nome: "Grupo B — Rodada 1 — CHI x COL" },
    // ...
];

// Preenche o select
function carregarJogos() {
    const select = document.getElementById("select-jogo");
    select.innerHTML = "";

    jogosFaseGrupos.forEach(j => {
        const opt = document.createElement("option");
        opt.value = j.id;
        opt.textContent = j.nome;
        select.appendChild(opt);
    });
}

carregarJogos();


// ===============================================
// 3. SALVAR RESULTADOS OFICIAIS (Fase de Grupos)
// ===============================================

document.getElementById("btn-salvar-grupo").addEventListener("click", () => {
    const jogoId = document.getElementById("select-jogo").value;
    const golsCasa = document.getElementById("gols-casa").value;
    const golsFora = document.getElementById("gols-fora").value;

    if (golsCasa === "" || golsFora === "") {
        alert("Preencha todos os campos!");
        return;
    }

    const dados = {
        jogo_id: Number(jogoId),
        gols_casa: Number(golsCasa),
        gols_fora: Number(golsFora),
        atualizado_em: new Date().toISOString()
    };

    console.log("🔥 Resultado salvo:", dados);

    alert("Resultado atualizado com sucesso!");
});


// ===============================================
// 4. CLASSIFICADOS + MELHORES TERCEIROS
// ===============================================

// Exemplo de estrutura — depois substituímos pelos grupos reais
const grupos = ["A","B","C","D","E","F","G","H","I","J","K","L"];

// Gera inputs automaticamente
function gerarInputsClassificados() {
    const div = document.getElementById("inputs-classificados");
    div.innerHTML = "";

    grupos.forEach(g => {
        const bloco = document.createElement("div");
        bloco.classList.add("bloco-class");
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

// SALVAR CLASSIFICADOS
document.getElementById("btn-salvar-classificados").addEventListener("click", () => {

    const payload = {};

    grupos.forEach(g => {
        payload[g] = {
            primeiro: document.getElementById(`class-${g}-1`).value,
            segundo: document.getElementById(`class-${g}-2`).value,
            melhor_terceiro: document.getElementById(`melhor3-${g}`).value.toUpperCase()
        };
    });

    console.log("🔥 Classificados enviados:", payload);

    alert("Classificados salvos com sucesso!");
});


// ===============================================
// 5. ARTILHARIA
// ===============================================

document.getElementById("btn-salvar-artilharia").addEventListener("click", () => {

    const art1 = document.getElementById("art1").value;
    const art2 = document.getElementById("art2").value;

    if (!art1 || !art2) {
        alert("Preencha ambos os artilheiros!");
        return;
    }

    const dados = {
        artilheiro1: art1,
        artilheiro2: art2
    };

    console.log("🔥 Artilharia salva:", dados);

    alert("Artilharia salva com sucesso!");
});


// ===============================================
// 6. TOP 4 + TOTAL DE GOLS
// ===============================================

document.getElementById("btn-salvar-top4").addEventListener("click", () => {

    const dados = {
        campeao: document.getElementById("top-campeao").value,
        vice: document.getElementById("top-vice").value,
        terceiro: document.getElementById("top-terceiro").value,
        quarto: document.getElementById("top-quarto").value,
        total_gols: Number(document.getElementById("top-total-gols").value)
    };

    if (!dados.campeao || !dados.vice || !dados.terceiro || !dados.quarto) {
        alert("Preencha todos os campos do Top 4!");
        return;
    }

    console.log("🔥 Top 4 / Gols salvo:", dados);

    alert("Top 4 e Total de Gols salvos!");
});


// ===============================================
// 7. MATA-MATA (placeholder)
// ===============================================

console.log("⚙️ Sistema de admin carregado!");

