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

// Protezione pagine in base al ruolo
async function requireRole(allowedRoles) {
  const session = await checkSession();

  if (!session || !session.user) {
    window.location.href = "login.html";
    return;
  }

  const userId = session.user.id;

  const { data: roleRow, error } = await supabaseClient
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (error || !roleRow) {
    window.location.href = "login.html";
    return;
  }

  const role = roleRow.role;

  if (!allowedRoles.includes(role)) {
    window.location.href = "login.html";
  }
}
