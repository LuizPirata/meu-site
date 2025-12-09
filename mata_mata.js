const supabase = createClient("https://mdaqzciffsgupzbfxzgf.supabase.co", "sb_publishable_5A4XlgwAjib2nde_qe5WQA_F9qCTghY");

const fases = [
  { fase: "segunda_fase", jogos: 16 }
];

async function carregarTimes() {
    const { data } = await supabase.from("times").select("*").order("nome");
    return data;
}

async function montarFormulario() {
    const container = document.getElementById("admin-mata-mata");
    const times = await carregarTimes();

    fases.forEach(f => {
        for (let i = 1; i <= f.jogos; i++) {
            const div = document.createElement("div");
            div.className = "jogo-block";
            div.dataset.fase = f.fase;
            div.dataset.jogo = i;

            div.innerHTML = `
                <h3>${f.fase.replace("_", " ").toUpperCase()} — Jogo ${i}</h3>

                <div class="linha">
                    <label>Time 1:</label>
                    <select class="sel-time1">
                        <option value="">-- selecione --</option>
                        ${times.map(t => `<option value="${t.id}">${t.nome}</option>`).join("")}
                    </select>
                </div>

                <div class="linha">
                    <label>Time 2:</label>
                    <select class="sel-time2">
                        <option value="">-- selecione --</option>
                        ${times.map(t => `<option value="${t.id}">${t.nome}</option>`).join("")}
                    </select>
                </div>

                <div class="linha">
                    <label>Data:</label>
                    <input type="date" class="inp-data">
                </div>

                <div class="linha">
                    <label>Horário:</label>
                    <input type="time" class="inp-horario">
                </div>

                <div class="linha">
                    <label>Local:</label>
                    <input type="text" class="inp-local" placeholder="Cidade / Estádio">
                </div>
            `;

            container.appendChild(div);
        }
    });
}

async function salvarChaveamento() {
    const blocos = document.querySelectorAll(".jogo-block");

    // limpa chaveamento anterior
    await supabase.from("mata_mata_oficial").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    for (let bloco of blocos) {
        const fase = bloco.dataset.fase;
        const jogo_no = Number(bloco.dataset.jogo);
        const sel1 = bloco.querySelector(".sel-time1").value;
        const sel2 = bloco.querySelector(".sel-time2").value;
        const data = bloco.querySelector(".inp-data").value;
        const horario = bloco.querySelector(".inp-horario").value;
        const local = bloco.querySelector(".inp-local").value;

        await supabase.from("mata_mata_oficial").insert({
            fase, jogo_no, time1: sel1, time2: sel2,
            data: data || null,
            horario: horario || null,
            local: local || null
        });
    }

    alert("Chaveamento salvo com sucesso!");
}

document.getElementById("salvar-mata-mata").addEventListener("click", salvarChaveamento);

montarFormulario();
