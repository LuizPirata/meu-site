import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'SUA_URL_SUPABASE';
const supabaseKey = 'SUA_CHAVE_ANON';
const supabase = createClient(supabaseUrl, supabaseKey);

async function cadastrar() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  const { data, error } = await supabase.auth.signUp({ email, password: senha });

  if (error) {
    alert('Erro ao cadastrar: ' + error.message);
  } else {
    alert('Usuário cadastrado com sucesso! Verifique seu email.');
    window.location.href = 'perfil.html';
  }
}

async function logar() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });

  if (error) {
    alert('Erro ao logar: ' + error.message);
  } else {
    alert('Login realizado com sucesso!');
    window.location.href = 'perfil.html';
  }
}

async function sair() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert('Erro ao sair: ' + error.message);
  } else {
    window.location.href = 'index.html';
  }
}
