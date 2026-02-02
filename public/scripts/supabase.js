// SUPABASE INIT

const SUPABASE_URL = "https://ysgebcbptgjlpbgnlcjt.supabase.co";
const SUPABASE_ANON_KEY = "INSERISCI_LA_TUA_ANON_KEY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Controllo sessione
async function checkSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
