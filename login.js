// login.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

// --- SUBSTITUA SE QUISER, SE JÁ NÃO FOR ESSA A URL/KEY ---
// (já usei os valores que você usou antes)
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
      // Mensagem amigável ao usuário
      showMessage('Email ou senha incorretos.', 'red');
      return;
    }

    // login ok -> redireciona ao perfil
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

    // Se houver erro, avalia se é "já cadastrado"
    if (error) {
      const m = (error.message || '').toLowerCase();
      // checagens comuns
      if (m.includes('already') || m.includes('registered') || m.includes('user already')) {
        showMessage('Usuário já cadastrado.', 'red');
        return;
      }

      // outro erro qualquer
      showMessage('Erro ao cadastrar: ' + error.message, 'red');
      return;
    }

    // signUp sem erro:
    // data.user existe quando a sessão é criada automaticamente (sem confirmação de email)
    if (data && data.user) {
      // usuário logado após signUp -> leva direto para perfil
      window.location.href = 'perfil.html';
      return;
    }

    // Caso o signUp exija confirmação por e-mail (data.user indefinido)
    showMessage('Cadastro feito! Verifique seu e-mail para confirmar a conta.', 'lime');
  } catch (err) {
    console.error('Erro no signUp:', err);
    showMessage('Erro ao cadastrar.', 'red');
  }
});
