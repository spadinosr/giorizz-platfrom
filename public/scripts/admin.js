// HQ ADMIN — LOGICA BASE

console.log("HQ Admin script caricato correttamente");

// Controllo sessione (in futuro potremo aggiungere login admin)
checkSession().then(session => {
  if (!session) {
    console.log("Nessuna sessione attiva per HQ");
  } else {
    console.log("Sessione HQ attiva:", session);
  }
});

// Funzione iniziale della pagina HQ Admin
function initAdminPage() {
  console.log("Inizializzazione HQ Admin...");

  // Qui aggiungeremo:
  // - dashboard operazioni
  // - conteggio driver disponibili
  // - conteggio corse attive
  // - CRM
  // - Marketplace
  // - World
  // - AI Brain
  // - Sicurezza
}

initAdminPage();
