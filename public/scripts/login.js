// Inizializza Supabase
const supabaseClient = supabase.createClient(
  "https://YOUR-PROJECT-URL.supabase.co",
  "YOUR-ANON-KEY"
);

// Login
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("Errore: " + error.message);
    return;
  }

  const user = data.user;
  if (!user) {
    alert("Nessun utente trovato dopo il login");
    return;
  }

  const { data: roleRow, error: roleError } = await supabaseClient
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (roleError || !roleRow) {
    alert("Nessun ruolo assegnato a questo utente");
    return;
  }

  const role = roleRow.role;

  if (role === "client") window.location.href = "client.html";
  else if (role === "driver") window.location.href = "driver.html";
  else if (role === "admin") window.location.href = "admin.html";
  else alert("Ruolo non riconosciuto: " + role);
});
;
