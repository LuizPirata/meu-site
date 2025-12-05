// login.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

// --- SUBSTITUA SE NECESSÁRIO ---
const SUPABASE_URL = 'https://mdaqzciffsgupzbfxzgf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_5A4XlgwAjib2nde_qe5WQA_F9qCTghY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Elementos
const btnLogin = document.getElementById('btn-login');
const btnCadastrar = document.getElementById('btn-cadastrar');
const msgBox = document.getElementById('msg');

// util: mostrar mensagem
function showMessage(text, color = 'white') {
  if (!msgBox) return;
  msgBox.textContent = text;
  msgBox.style.color = color;
}

// LOGIN
btnLogin.addEventListener('click', async (e) => {
  e.preventDefault();
  showMessage('', 'white');

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showMessage('Preencha email e senha.', 'orange');
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      showMessage('Email ou senha incorretos.', 'red');
      return;
    }

    // Login OK → vai para o perfil
    window.location.href = 'perfil.html';
  } catch (err) {
    console.error('Erro no login:', err);
    showMessage('Erro ao realizar login.', 'red');
  }
});

// CADASTRO
btnCadastrar.addEventListener('click', async (e) => {
  e.preventDefault();
  showMessage('', 'white');

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showMessage('Preencha email e senha para se cadastrar.', 'orange');
    return;
  }

  try {
    // Tenta criar o usuário via Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    // Se houver erro → provavelmente usuário já existe
    if (error) {
      const m = (error.message || '').toLowerCase();
      if (
        m.includes('already') ||
        m.includes('exist') ||
        m.includes('registered') ||
        m.includes('duplicate')
      ) {
        showMessage('Usuário já cadastrado.', 'red');
        return;
      }

      // erro inesperado
      showMessage('Erro ao cadastrar: ' + error.message, 'red');
      return;
    }

    // Cadastro OK — Supabase retorna data.user se login automático estiver habilitado
    if (data && data.user) {
      window.location.href = 'perfil.html';
      return;
    }

    // Caso precise verificar email
    showMessage('Cadastro realizado! Verifique seu email.', 'lime');

  } catch (err) {
    console.error('Erro no signUp:', err);
    showMessage('Erro ao cadastrar.', 'red');
  }
});

