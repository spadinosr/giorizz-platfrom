// CLIENT VIP — LOGICA BASE

console.log("Client VIP script caricato correttamente");
checkSession().then(session => {
    if (!session) {
        console.log("Nessuna sessione attiva");
        // In futuro potremo reindirizzare al login
    } else {
        console.log("Sessione attiva:", session);
    }
});

// Controllo sessione utente (se in futuro aggiungiamo login)
checkSession().then(session => {
  if (!session) {
    console.log("Nessuna sessione attiva");
    // In futuro potremo reindirizzare al login
  } else {
    console.log("Sessione attiva:", session);
  }
});

// Funzione placeholder per future integrazioni
function initClientPage() {
  console.log("Inizializzazione pagina Client VIP...");
  // Qui aggiungeremo:
  // - caricamento preferenze
  // - caricamento membership
  // - caricamento esperienze marketplace
  // - caricamento Signature 2.0
}

initClientPage();
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="scripts/supabase.js"></script>
<script src="scripts/auth.js"></script>
<script src="scripts/client.js"></script>

<script>
  requireRole(["client"]);
</script>
