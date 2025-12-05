import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Substitua pelos seus dados do Supabase
const supabaseUrl = 'https://mdaqzciffsgupzbfxzgf.supabase.co';
const supabaseKey = 'sb_publishable_5A4XlgwAjib2nde_qe5WQA_F9qCTghY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para cadastrar usuário
async function cadastrar() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  if (!email || !senha) {
    alert('Preencha todos os campos!');
    return;
  }

  const { data, error } = await supabase.auth.signUp({ email, password: senha });

  if (error) {
    alert('Erro ao cadastrar: ' + error.message);
  } else {
    alert('Usuário cadastrado com sucesso! Verifique seu email.');
    window.location.href = 'perfil.html';
  }
}

// Função para login
async function logar() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  if (!email || !senha) {
    alert('Preencha todos os campos!');
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });

  if (error) {
    alert('Erro ao logar: ' + error.message);
  } else {
    alert('Login realizado com sucesso!');
    window.location.href = 'perfil.html';
  }
}

// Função de logout
async function sair() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert('Erro ao sair: ' + error.message);
  } else {
    window.location.href = 'index.html';
  }
}

// Torna as funções disponíveis para os botões no HTML
window.cadastrar = cadastrar;
window.logar = logar;
window.sair = sair;
