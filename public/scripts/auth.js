// scripts/auth.js

async function checkSession() {
  const { data, error } = await supabaseClient.auth.getSession();
  if (error || !data.session) {
    window.location.href = "login.html";
    throw new Error("No session");
  }
  return data.session;
}

async function requireRole(allowedRoles) {
  const session = await checkSession();
  const userId = session.user.id;

  const { data: roleRow, error } = await supabaseClient
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (error || !roleRow || !allowedRoles.includes(roleRow.role)) {
    window.location.href = "login.html";
    throw new Error("Unauthorized");
  }
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "login.html";
}
