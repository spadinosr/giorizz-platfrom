// Login
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Inserisci email e password");
    return;
  }

  // Login con Supabase
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
    alert("Errore: utente non trovato");
    return;
  }

  // Recupero ruolo
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

  // Redirect in base al ruolo
  if (role === "client") {
    window.location.href = "client.html";
  } else if (role === "driver") {
    window.location.href = "driver.html";
  } else if (role === "admin") {
    window.location.href = "admin.html";
  } else {
    alert("Ruolo non riconosciuto: " + role);
  }
});
