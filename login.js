import { createClient } from "https://esm.sh/@supabase/supabase-js";

// ⛔ ALTERE AQUI PARA O SEU PROJETO
const supabaseUrl = "https://mdaqzciffsgupzbfxzgf.supabase.co";
const supabaseAnonKey = "sb_publishable_5A4XlgwAjib2nde_qe5WQA_F9qCTghY";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// LOGIN
document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert("Email ou senha incorretos!");
        return;
    }

    // LOGIN OK → vai para perfil.html
    window.location.href = "perfil.html";
});
