// Inizializza Supabase
const supabaseClient = supabase.createClient(
  "https://YOUR-PROJECT-URL.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzZ2ViY2JwdGdqbHBiZ25sY2p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5OTMzNTUsImV4cCI6MjA4NTU2OTM1NX0.R-M89T_wNR-JvY2wtFRl4BDau63kl5Ko_8yYLSngB2M"
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
