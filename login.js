<script type="module">
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabase = createClient(
  'https://mdaqzciffsgupzbfxzgf.supabase.co',
  'sb_publishable_5A4XlgwAjib2nde_qe5WQA_F9qCTghY'
);

document.getElementById("btnCadastrar").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  // 1️⃣ TENTA CRIAR O USUÁRIO
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: senha
  });

  // 2️⃣ SE O USUÁRIO JÁ EXISTE
  if (error && error.message.includes("User already registered")) {
    alert("Usuário já cadastrado!");
    return;
  }

  // 3️⃣ QUALQUER OUTRO ERRO
  if (error) {
    alert("Erro ao cadastrar: " + error.message);
    return;
  }

  // 4️⃣ TUDO CERTO → REDIRECIONA PARA cadastro.html
  window.location.href = "cadastro.html";
});
</script>

