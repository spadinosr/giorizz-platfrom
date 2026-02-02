// Controllo sessione utente
async function checkSession() {
  const { data } = await supabaseClient.auth.getSession();
  return data.session;
}

// Logout
async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}
