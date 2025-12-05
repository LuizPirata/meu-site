// login.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

// --- CONFIG SUPABASE ---
const SUPABASE_URL = 'https://mdaqzciffsgupzbfxzgf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_5A4XlgwAjib2nde_qe5WQA_F9qCTghY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Elementos da página
const btnLogin = document.getElementById('btn-login');
const btnCadastrar = document.getElementById('btn-cadastrar');
const msgBox = document.getElementById('msg');

// Função de mensagem
function showMessage(text, color = 'white') {
  msgBox.textContent = text;
  msgBox.style.color = color;
}

// -----------------------------------------
// LOGIN
// -----------------------------------------
btnLogin.addEventListener('click', async (e) => {
  e.preventDefault();
  showMessage('');

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showMessage('Preencha email e senha.', 'orange');
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    showMessage('Email ou senha incorretos.', 'red');
    return;
  }

  // login OK → pega o username já gravado na tabela
  const { data: userRow } = await supabase
    .from('usuarios')
    .select('username')
    .eq('user_id', data.user.id)
    .maybeSingle();

  const username = userRow?.username || 'perfil';

  window.location.href = `perfil.html?username=${encodeURIComponent(username)}`;
});


// -----------------------------------------
// CADASTRO
// -----------------------------------------
btnCadastrar.addEventListener('click', async (e) => {
  e.preventDefault();
  showMessage('');

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showMessage('Preencha email e senha para se cadastrar.', 'orange');
    return;
  }

  // --- Verificar se email já existe ---
  const { data: check, error: checkError } = await supabase.auth.signInWithPassword({
    email,
    password: "dummy-password-qualquer"
  });

  if (!checkError) {
    showMessage('Usuário já cadastrado.', 'red');
    return;
  }

  // --- Criar usuário no Auth ---
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    showMessage('Erro ao cadastrar: ' + error.message, 'red');
    return;
  }

  const user = data.user;
  if (!user) {
    showMessage('Verifique seu e-mail para confirmar a conta.', 'lime');
    return;
  }

  // --- Criar USERNAME automaticamente ---
  const username = email.split('@')[0];

  // --- Salvar na tabela usuarios ---
  await supabase.from('usuarios').insert({
    user_id: user.id,
    username: username
  });

  // --- Redirecionar para página personalizada ---
  window.location.href = `perfil.html?username=${encodeURIComponent(username)}`;
});


