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

  // Recupera il ruolo dalla tabella user_roles
  const { data: roles } = await supabaseClient
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id)
    .single();

  if (!roles) {
    alert("Nessun ruolo assegnato");
    return;
  }

  const role = roles.role;

  // Redirect in base al ruolo
  if (role === "client") window.location.href = "client.html";
  if (role === "driver") window.location.href = "driver.html";
  if (role === "admin") window.location.href = "admin.html";
});
