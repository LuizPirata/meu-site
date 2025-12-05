import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://mdaqzciffsgupzbfxzgf.supabase.co',
  'sb_publishable_5A4XlgwAjib2nde_qe5WQA_F9qCTghY'
);

// CADASTRO
async function cadastrar() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  if (!email || !senha) {
    alert('Preencha todos os campos!');
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha
  });

  if (error) {
    alert("Erro ao cadastrar: " + error.message);
    return;
  }

  // Se a confirmação de email estiver DESATIVADA → redireciona
  if (data.user) {
    window.location.href = "perfil.html";
  }

  // Senão, pede verificação
  alert("Cadastro realizado! Verifique seu e-mail para confirmar.");
}

// LOGIN
async function logar() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  if (!email || !senha) {
    alert('Preencha todos os campos!');
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha
  });

  if (error) {
    alert("Erro ao logar: " + error.message);
    return;
  }

  window.location.href = "perfil.html";
}

document.getElementById('btn-cadastrar').addEventListener('click', cadastrar);
document.getElementById('btn-login').addEventListener('click', logar);

