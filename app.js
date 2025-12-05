// Importa o cliente do Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Coloque aqui sua URL e sua public anon key do Supabase (do seu projeto)
const supabaseUrl = 'https://mdaqzciffsgupzbfxzgf.supabase.co';
const supabaseKey = 'sb_publishable_5A4XlgwAjib2nde_qe5WQA_F9qCTghY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para cadastrar usuário
export async function cadastrar() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  const { user, error } = await supabase.auth.signUp({
    email: email,
    password: senha
  });

  if (error) {
    alert('Erro ao cadastrar: ' + error.message);
  } else {
    alert('Cadastro realizado! Por favor, verifique seu email.');
  }
}

// Função para logar usuário
export async function logar() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  const { user, error } = await supabase.auth.signIn({
    email: email,
    password: senha
  });

  if (error) {
    alert('Erro ao logar: ' + error.message);
  } else {
    alert('Login realizado com sucesso!');
  }
}

// Função para logout
export async function sair() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert('Erro ao sair: ' + error.message);
  } else {
    alert('Logout realizado com sucesso!');
  }
}

